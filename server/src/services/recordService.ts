import prisma from "../config/prisma";

type SaveWeatherRecordInput = {
  rawInput: string;
  queryType: string;
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
  forecast: any[];
  advice: string[];
  startDate?: string;
  endDate?: string;
  startDate?: string;
  endDate?: string;
};

export async function saveWeatherRecord(data: SaveWeatherRecordInput) {
  return prisma.weatherRecord.create({
    data: {
      rawInput: data.rawInput,
      queryType: data.queryType,
      locationName: data.location.name,
      country: data.location.country,
      latitude: data.location.lat,
      longitude: data.location.lon,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      currentTemp: data.current.temperature,
      feelsLike: data.current.feelsLike,
      tempMin: data.current.minTemp,
      tempMax: data.current.maxTemp,
      weatherMain: data.current.main,
      weatherDescription: data.current.description,
      humidity: data.current.humidity,
      windSpeed: data.current.windSpeed,
      visibility: data.current.visibility,
      sunrise: data.current.sunrise ? new Date(data.current.sunrise) : null,
      sunset: data.current.sunset ? new Date(data.current.sunset) : null,
      adviceJson: JSON.stringify(data.advice),
      forecastJson: JSON.stringify(data.forecast),
    },
  });
}

export async function getAllWeatherRecords() {
  return prisma.weatherRecord.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getWeatherRecordById(id: number) {
  return prisma.weatherRecord.findUnique({
    where: { id },
  });
}


export async function updateWeatherRecord(
  id: number,
  data: {
    note?: string;
    tag?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  return prisma.weatherRecord.update({
    where: { id },
    data: {
      note: data.note,
      tag: data.tag,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
}

export async function deleteWeatherRecord(id: number) {
  return prisma.weatherRecord.delete({
    where: { id },
  });
}

export async function getParsedWeatherRecordById(id: number) {
  const record = await prisma.weatherRecord.findUnique({
    where: { id },
  });

  if (!record) {
    return null;
  }

  return {
    ...record,
    advice: record.adviceJson ? JSON.parse(record.adviceJson) : [],
    forecast: record.forecastJson ? JSON.parse(record.forecastJson) : [],
  };
}