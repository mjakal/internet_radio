import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const resolveSrv = promisify(dns.resolveSrv);

interface RadioBrowserStation {
  name: string;
  url: string;
  favicon: string;
  tags: string;
  stationuuid: string;
  url_resolved?: string;
  codec?: string;
  votes?: number;
  clickcount?: number;
}

// Cache the server list for 1 hour
let cachedServers: string[] = [];
let lastServerFetch: number = 0;

async function getRadioBrowserServers(): Promise<string[]> {
  const ONE_HOUR = 3600000;
  
  // Return cached servers if available and not expired
  if (cachedServers.length > 0 && (Date.now() - lastServerFetch) < ONE_HOUR) {
    return cachedServers;
  }

  try {
    // Get list of radio browser servers using DNS SRV lookup
    const servers = await resolveSrv('_api._tcp.radio-browser.info');
    cachedServers = servers.map(server => server.name);
    lastServerFetch = Date.now();
    return cachedServers;
  } catch (error) {
    console.error('Failed to fetch radio browser servers:', error);
    // Fallback servers if DNS lookup fails
    return ['de1.api.radio-browser.info', 'nl1.api.radio-browser.info', 'at1.api.radio-browser.info'];
  }
}

async function fetchRadioBrowserStations(searchParams?: { 
  query?: string, 
  tag?: string, 
  country?: string, 
  limit?: number,
  offset?: number 
}) {
  try {
    const servers = await getRadioBrowserServers();
    const server = servers[Math.floor(Math.random() * servers.length)];

    // Normalize country name if provided
    let normalizedCountry = searchParams?.country;
    if (normalizedCountry) {
      normalizedCountry = normalizedCountry
        .trim()
        .toLowerCase()
        .replace(/^switzerland$/i, 'Switzerland')
        .replace(/^swiss$/i, 'Switzerland');
    }
    
    let endpoint = 'stations';
    const params = new URLSearchParams({
      limit: (searchParams?.limit || '100').toString(),
      offset: (searchParams?.offset || '0').toString(),
      hidebroken: 'true',
      order: 'clickcount',
      reverse: 'true'
    });

    if (normalizedCountry) {
      endpoint = 'stations/bycountry/' + encodeURIComponent(normalizedCountry);
    } else if (searchParams?.query) {
      endpoint = 'stations/byname/' + encodeURIComponent(searchParams.query);
    } else if (searchParams?.tag) {
      endpoint = 'stations/bytag/' + encodeURIComponent(searchParams.tag);
    }

    const response = await fetch(`https://${server}/json/${endpoint}?${params}`, {
      headers: {
        'User-Agent': 'InternetRadioApp/1.0',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((station: RadioBrowserStation) => ({
      id: station.stationuuid,
      name: station.name,
      url: station.url_resolved || station.url,
      favicon: station.favicon,
      tags: station.tags,
      codec: station.codec,
      votes: station.votes,
      clickcount: station.clickcount
    }));
  } catch (error) {
    console.error('Error fetching radio stations:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const country = searchParams.get('country') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const stations = await fetchRadioBrowserStations({
      query,
      tag,
      country,
      limit,
      offset
    });

    return NextResponse.json(stations);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch radio stations' },
      { status: 500 }
    );
  }
}