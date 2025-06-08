// Stations api docs
// https://api.radio-browser.info/

import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';
import { RadioBrowserStation, RadioStation } from '../../types';

// Refresh server dns list every hour
const REFRESH_INTERVAL: number = 3600000;
// Refresh stations cache every 24 hours
const REFRESH_INTERVAL_STATIONS: number = 3600000 * 24;
const RETRY_LIMIT: number = 3;
const FALLBACK_SERVERS: string[] = [
  'de1.api.radio-browser.info',
  'nl1.api.radio-browser.info',
  'at1.api.radio-browser.info',
];
const CACHED_SERVERS: { servers: string[]; lastUpdate: number; retryFetch: number } = {
  servers: [],
  lastUpdate: 0,
  retryFetch: 0,
};
const CACHED_STATIONS: { data: { [key: string]: RadioStation[] }; cacheGeneratedAt: number } = {
  data: {},
  cacheGeneratedAt: 0,
};

const resolveSrv = promisify(dns.resolveSrv);

async function getRadioBrowserServers(): Promise<string[]> {
  const { servers, lastUpdate } = CACHED_SERVERS;

  // Return cached servers if available and not expired
  if (servers.length > 0 && Date.now() - lastUpdate < REFRESH_INTERVAL) {
    return servers;
  }

  try {
    // Get list of radio browser servers using DNS SRV lookup
    const serverList = await resolveSrv('_api._tcp.radio-browser.info');

    CACHED_SERVERS['servers'] = serverList.map((server) => server.name);
    CACHED_SERVERS['lastUpdate'] = Date.now();

    return CACHED_SERVERS['servers'];
  } catch (error) {
    console.error('Failed to fetch radio browser servers:', error);

    // Fallback servers if DNS lookup fails
    return FALLBACK_SERVERS;
  }
}

function getCachedStations(queryKey: string) {
  const { data, cacheGeneratedAt } = CACHED_STATIONS;
  const currentTimestamp = Date.now();
  const hasExpired = currentTimestamp > cacheGeneratedAt + REFRESH_INTERVAL_STATIONS;

  if (hasExpired) {
    CACHED_STATIONS['data'] = {};
    CACHED_STATIONS['cacheGeneratedAt'] = currentTimestamp;

    return null;
  }

  const cachedStations = data[queryKey] || null;

  return cachedStations;
}

async function fetchRadioBrowserStations(
  query: string,
  tag: string,
  country: string,
  limit: number,
  offset: number,
) {
  try {
    const queryKey = Buffer.from(`${query}:${tag}:${country}:${limit}:${offset}`).toString(
      'base64',
    );
    const cachedStations = getCachedStations(queryKey);

    // Early Exit - return cached stations to the client
    if (cachedStations) return cachedStations;

    const servers = await getRadioBrowserServers();
    const server = servers[Math.floor(Math.random() * servers.length)];

    const endpoint = 'stations/search';

    const params = new URLSearchParams({
      name: query.toLowerCase(),
      tag: tag.toLowerCase(),
      country: country,
      limit: (limit || 24).toString(),
      offset: (offset || 0).toString(),
      hidebroken: 'true',
      order: 'clickcount',
      reverse: 'true',
    });
    const headers = {
      'User-Agent': 'InternetRadioApp/1.0',
      'Content-Type': 'application/json',
    };
    const requestURL = `https://${server}/json/${endpoint}?${params}`;
    const response = await fetch(requestURL, { headers: headers });

    if (!response.ok) {
      const { retryFetch } = CACHED_SERVERS;

      if (retryFetch >= RETRY_LIMIT) throw new Error(`HTTP error! status: ${response.status}`);

      CACHED_SERVERS['retryFetch'] = retryFetch + 1;

      // Retry fetch - recursive function call
      return fetchRadioBrowserStations(query, tag, country, limit, offset);
    }

    const data = await response.json();
    const stationData: RadioStation[] = [];

    data.forEach(
      ({
        stationuuid,
        name,
        url_resolved,
        url,
        favicon,
        tags,
        codec,
        bitrate,
      }: RadioBrowserStation) => {
        stationData.push({
          station_id: stationuuid,
          name,
          url: url_resolved || url,
          favicon: favicon || '',
          tags,
          codec,
          bitrate,
        });
      },
    );

    CACHED_SERVERS['retryFetch'] = 0;
    CACHED_STATIONS['data'][queryKey] = stationData;

    return stationData;
  } catch (error) {
    CACHED_SERVERS['retryFetch'] = 0;

    console.error('Error fetching radio stations:', error);

    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const tag = searchParams.get('tag') || '';
    const country = searchParams.get('country') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const stations = await fetchRadioBrowserStations(query, tag, country, limit, offset);

    return NextResponse.json(stations);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Failed to fetch radio stations' }, { status: 500 });
  }
}
