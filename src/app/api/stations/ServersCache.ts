import dns from 'dns';
import { promisify } from 'util';

// Refresh server dns list every hour
const REFRESH_INTERVAL: number = 3600000;
const FALLBACK_SERVERS: string[] = [
  'de1.api.radio-browser.info',
  'nl1.api.radio-browser.info',
  'at1.api.radio-browser.info',
];
const RESOLVE_SRV = promisify(dns.resolveSrv);

class ServersCache {
  private servers: string[];
  private generatedAt: number;

  constructor() {
    this.servers = [];
    this.generatedAt = Date.now();
  }

  // Retrieve stored servers
  async getServers(): Promise<string[]> {
    const { servers, generatedAt } = this;
    const currentTimestamp = Date.now();
    const hasExpired = currentTimestamp > generatedAt + REFRESH_INTERVAL;
    const hasCachedServers = servers.length > 0;

    // Return cached servers if available and not expired
    if (hasCachedServers && !hasExpired) return servers;

    try {
      // Get list of radio browser servers using DNS SRV lookup
      const serverList = await RESOLVE_SRV('_api._tcp.radio-browser.info');

      this.servers = serverList.map((server) => server.name);
      this.generatedAt = Date.now();

      return this.servers;
    } catch (error) {
      console.error('Failed to fetch radio browser servers:', error);

      // Fallback servers if DNS lookup fails
      return FALLBACK_SERVERS;
    }
  }

  // Retrieve random server address
  async getRandomServer(): Promise<string> {
    const servers = await this.getServers();

    return servers[Math.floor(Math.random() * servers.length)];
  }
}

export default ServersCache;
