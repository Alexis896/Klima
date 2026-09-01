export interface StationReadings {
  temperature_c: number;
  humidity_pct?: number;
  wind_speed_ms?: number;
  pressure_hpa?: number;
}

export interface Station {
  id: string;
  name: string;
  lat: number;
  lon: number;
  elevation_m: number | null;
  readings: StationReadings;
  observed_at: string;
}

export interface StationDataset {
  source: string;
  region: string;
  snapshot_date: string;
  pulled_on: string;
  station_count: number;
  stations: Station[];
}
