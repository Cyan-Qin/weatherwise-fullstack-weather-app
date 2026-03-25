import axios from "axios";
import type { WeatherApiResult } from "../types/weather";

const API_BASE_URL = "http://localhost:5000";

export async function searchWeather(
  input: string,
  startDate?: string,
  endDate?: string
): Promise<WeatherApiResult> {
  const response = await axios.post(`${API_BASE_URL}/api/weather/search`, {
    input,
    startDate,
    endDate,
  });

  return response.data;
}

export async function getWeatherRecords() {
  const response = await axios.get(`${API_BASE_URL}/api/records`);
  return response.data;
}

export async function getWeatherRecordById(id: number) {
  const response = await axios.get(`${API_BASE_URL}/api/records/${id}`);
  return response.data;
}

export async function deleteWeatherRecord(id: number) {
  const response = await axios.delete(`${API_BASE_URL}/api/records/${id}`);
  return response.data;
}

export async function updateWeatherRecord(
  id: number,
  payload: {
    note?: string;
    tag?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  const response = await axios.patch(`${API_BASE_URL}/api/records/${id}`, payload);
  return response.data;
}

export async function exportWeatherRecord(
  id: number,
  format: "json" | "csv" | "markdown"
) {
  const response = await axios.get(
    `${API_BASE_URL}/api/records/${id}/export/${format}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
}