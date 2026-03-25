import { formatForecast } from "./formatForecast";
import { generateAdvice } from "./generateAdvice";
import { filterForecastByDateRange } from "./filterForecastByDateRange";


export function formatWeatherResponse(location: any, current: any, forecast: any, startDate?: string, endDate?: string
) {
  const filteredForecastList = filterForecastByDateRange(
    forecast,
    startDate,
    endDate
  );
  return {
    location: {
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    },
    current: {
      temperature: current.main?.temp,
      feelsLike: current.main?.feels_like,
      minTemp: current.main?.temp_min,
      maxTemp: current.main?.temp_max,
      main: current.weather?.[0]?.main,
      description: current.weather?.[0]?.description,
      humidity: current.main?.humidity,
      windSpeed: current.wind?.speed,
      visibility: current.visibility,
      sunrise: current.sys?.sunrise
        ? new Date(current.sys.sunrise * 1000).toISOString()
        : null,
      sunset: current.sys?.sunset
        ? new Date(current.sys.sunset * 1000).toISOString()
        : null,
      icon: current.weather?.[0]?.icon,
    },
    forecast: formatForecast(forecast, filteredForecastList),
    advice: generateAdvice(current, forecast),
    meta: {
      source: "OpenWeather",
      fetchedAt: new Date().toISOString(),
    },
  };
}