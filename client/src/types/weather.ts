export type WeatherResponse = {
  location: {
    name: string;
    country?: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature?: number;
    feelsLike?: number;
    minTemp?: number;
    maxTemp?: number;
    main?: string;
    description?: string;
    humidity?: number;
    windSpeed?: number;
    visibility?: number;
    sunrise?: string | null;
    sunset?: string | null;
    icon?: string;
  };
  forecast: Array<{
    date: string;
    minTemp: number;
    maxTemp: number;
    main: string;
    description: string;
    icon: string;
    rainChance: number;
  }>;
  advice: string[];
  meta: {
    source: string;
    fetchedAt: string;
  };
};

export type WeatherApiResult = {
  success: boolean;
  data: WeatherResponse;
  recordId: number;
};

export type WeatherRecord = {
  id: number;
  rawInput: string;
  queryType: string;
  locationName: string;
  country?: string | null;
  latitude: number;
  longitude: number;
  currentTemp?: number | null;
  feelsLike?: number | null;
  tempMin?: number | null;
  tempMax?: number | null;
  weatherMain?: string | null;
  weatherDescription?: string | null;
  humidity?: number | null;
  windSpeed?: number | null;
  visibility?: number | null;
  note?: string | null;
  tag?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WeatherRecordDetail = WeatherRecord & {
  adviceJson?: string | null;
  forecastJson?: string | null;
  sunrise?: string | null;
  sunset?: string | null;
};