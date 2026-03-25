import axios from "axios";
import { AppError } from "../utils/AppError";

const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  throw new Error("Missing OPENWEATHER_API_KEY in .env");
}

export async function geocodeLocation(query: string) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`;

  const res = await axios.get(url);

  if (!res.data || res.data.length === 0) {
    throw new AppError(404, "LOCATION_NOT_FOUND", "Location not found");
  }

  const location = res.data[0];

  return {
    name: location.name,
    country: location.country,
    lat: location.lat,
    lon: location.lon,
  };
}

export async function reverseGeocodeLocation(lat: number, lon: number) {
  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

  const res = await axios.get(url);

  if (!res.data || res.data.length === 0) {
    throw new AppError(404, "LOCATION_NOT_FOUND", "Location not found");
  }

  const location = res.data[0];

  return {
    name: location.name,
    country: location.country,
    lat: location.lat,
    lon: location.lon,
  };
}

export async function geocodePostalCode(postalCode: string) {
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(postalCode)}&appid=${API_KEY}`;

  try {
    const res = await axios.get(url);

    return {
      name: res.data.name,
      country: res.data.country,
      lat: res.data.lat,
      lon: res.data.lon,
    };
  } catch {
    throw new AppError(404, "POSTAL_CODE_NOT_FOUND", "Postal code not found");
  }
}

export async function getCurrentWeather(lat: number, lon: number) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const res = await axios.get(url);
    return res.data;
  } catch {
    throw new AppError(
      502,
      "WEATHER_API_ERROR",
      "Failed to fetch current weather data"
    );
  }
}

export async function getForecast(lat: number, lon: number) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const res = await axios.get(url);
    return res.data;
  } catch {
    throw new AppError(
      502,
      "FORECAST_API_ERROR",
      "Failed to fetch forecast data"
    );
  }
}