// Stations api docs
// https://api.radio-browser.info/

import { NextResponse } from 'next/server';
import validator from 'validator';
import { RadioBrowserStation, RadioStation } from '../../types';
import ServersCache from './ServersCache';
import StationsCache from './StationsCache';

const RETRY_STATIONS_API: { retryLimit: number; retryAttempt: number } = {
  retryLimit: 3, // Set the number of retry attempts
  retryAttempt: 0, // Retry counter
};

const SERVERS_CACHE = new ServersCache();
const STATIONS_CACHE = new StationsCache();

async function fetchRadioBrowserStations(
  query: string,
  tag: string,
  country: string,
  limit: number,
  offset: number,
) {
  try {
    const compositeQueryKey = `${query}:${tag}:${country}:${limit}:${offset}`;
    const queryKey = Buffer.from(compositeQueryKey).toString('base64');
    const cachedStations = STATIONS_CACHE.getStations(queryKey);

    // Early Exit - return cached stations to the client
    if (cachedStations) return cachedStations;

    const server = await SERVERS_CACHE.getRandomServer();
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
      'User-Agent': 'SiliconRadio/1.0',
      'Content-Type': 'application/json',
    };
    const requestURL = `https://${server}/json/${endpoint}?${params}`;
    const response = await fetch(requestURL, { headers: headers });

    if (!response.ok) {
      const { retryLimit, retryAttempt } = RETRY_STATIONS_API;

      if (retryAttempt >= retryLimit) return null;

      RETRY_STATIONS_API['retryAttempt'] += 1;

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

    // Store stations to cache
    if (stationData.length) STATIONS_CACHE.setStations(queryKey, stationData);

    // Reset retry counter
    RETRY_STATIONS_API['retryAttempt'] = 0;

    return stationData;
  } catch (error) {
    // Reset retry counter
    RETRY_STATIONS_API['retryAttempt'] = 0;

    console.error('Error fetching radio stations:', error);

    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Sanitize strings
    const query = validator.escape(searchParams.get('query') || '');
    const tag = validator.escape(searchParams.get('tag') || '');
    const country = validator.escape(searchParams.get('country') || '');

    // Validate numeric params
    const limitRaw = searchParams.get('limit') || '100';
    const offsetRaw = searchParams.get('offset') || '0';

    const limit = validator.isInt(limitRaw, { min: 1, max: 500 }) ? parseInt(limitRaw) : 100;
    const offset = validator.isInt(offsetRaw, { min: 0 }) ? parseInt(offsetRaw) : 0;

    const stations = await fetchRadioBrowserStations(query, tag, country, limit, offset);

    if (!stations) {
      return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
    }

    return NextResponse.json(stations);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse JSON body
    const dirty_station_id = data?.station_id || '';

    if (typeof dirty_station_id !== 'string') {
      return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
    }

    const station_id = validator.escape(dirty_station_id);

    if (!station_id) {
      return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
    }

    const server = await SERVERS_CACHE.getRandomServer();

    // api throws an error something is wrong, station id is parsed correctly, please check the docs
    const response = await fetch(`https://${server}/json/url/${station_id}`);

    if (!response.ok) return NextResponse.json({ error: 'API request failed.' }, { status: 500 });

    return NextResponse.json({ station_id });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}
