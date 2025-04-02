export interface RadioStation {
  id: string;
  name: string;
  url: string;
  favicon?: string;
  tags?: string;
  codec?: string;
  votes?: number;
  clickcount?: number;
}