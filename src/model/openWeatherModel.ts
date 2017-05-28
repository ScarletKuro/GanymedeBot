export interface WeatherDatum {
  date: Date;
  weather: string; // coarse description
  weatherDetailed: string; // detailed description
  weatherIcon: string; // iconID for weather icon
  temperature: number;
  pressure: number;
  humidity: number;
  cloudCoverage: number; // percent
  windSpeed: number; // meter per second
  windDirection: number; // degrees (meterological)
  rain: number; // volume last 3h in mm
  snow: number; // volume last 3h
}