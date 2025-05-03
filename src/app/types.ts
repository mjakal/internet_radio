export interface RadioStation {
  station_id: string;
  name: string;
  url: string;
  favicon?: string;
  tags?: string;
  codec?: string;
  bitrate?: number;
  isFavorite?: boolean;
}

export interface FilterQuery {
  station: string;
  tag: string;
  country: string;
}
