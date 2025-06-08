import { RadioStation } from '../../types';

// Refresh stations cache every 24 hours
const REFRESH_INTERVAL: number = 3600000 * 24;

class StationsCache {
  private data: { [key: string]: RadioStation[] };
  private generatedAt: number;

  constructor() {
    this.data = {};
    this.generatedAt = Date.now();
  }

  // Retrieve stored stations by queryKey
  getStations(queryKey: string): RadioStation[] | null {
    const { data, generatedAt } = this;
    const currentTimestamp = Date.now();
    const hasExpired = currentTimestamp > generatedAt + REFRESH_INTERVAL;

    if (hasExpired) {
      this.data = {};
      this.generatedAt = currentTimestamp;

      return null;
    }

    const cachedStations = data[queryKey] || null;

    return cachedStations;
  }

  // Set stations to a specific key
  setStations(queryKey: string, stations: RadioStation[]): void {
    this.data[queryKey] = stations;
  }
}

export default StationsCache;
