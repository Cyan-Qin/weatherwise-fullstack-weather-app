import { resolveLocationInput } from "./locationResolver";
import { getCurrentWeather, getForecast } from "./weatherService";
import { formatWeatherResponse } from "../utils/formatWeatherResponse";
import { saveWeatherRecord } from "./recordService";

export async function queryWeatherAndSave(
  input: string,
  startDate?: string,
  endDate?: string
) {

  const resolved = await resolveLocationInput(input);


  const current = await getCurrentWeather(
    resolved.location.lat,
    resolved.location.lon
  );

  const forecast = await getForecast(
    resolved.location.lat,
    resolved.location.lon
  );


  const formatted = formatWeatherResponse(
    resolved.location,
    current,
    forecast,
    startDate,
    endDate
  );

  const savedRecord = await saveWeatherRecord({
    rawInput: input,
    queryType: resolved.queryType,
    location: formatted.location,
    current: formatted.current,
    forecast: formatted.forecast,
    advice: formatted.advice,
    startDate,
    endDate,
  });

  return {
    formatted,
    recordId: savedRecord.id,
  };
}