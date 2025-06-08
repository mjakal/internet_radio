export interface RadioBrowserStation {
  stationuuid: string;
  name: string;
  url_resolved?: string;
  url: string;
  favicon: string;
  tags: string;
  codec?: string;
  bitrate?: number;
}

export interface RadioStation {
  station_id: string;
  name: string;
  url: string;
  favicon: string;
  tags?: string;
  codec?: string;
  bitrate?: number;
}

export interface FilterQuery {
  station: string;
  tag: string;
  country: string;
}
