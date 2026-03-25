export function toExportJson(record: any) {
  return {
    id: record.id,
    rawInput: record.rawInput,
    queryType: record.queryType,
    location: {
      name: record.locationName,
      country: record.country,
      latitude: record.latitude,
      longitude: record.longitude,
    },
    current: {
      temperature: record.currentTemp,
      feelsLike: record.feelsLike,
      minTemp: record.tempMin,
      maxTemp: record.tempMax,
      main: record.weatherMain,
      description: record.weatherDescription,
      humidity: record.humidity,
      windSpeed: record.windSpeed,
      visibility: record.visibility,
      sunrise: record.sunrise,
      sunset: record.sunset,
    },
    advice: record.advice,
    forecast: record.forecast,
    note: record.note,
    tag: record.tag,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toExportMarkdown(record: any) {
  const adviceLines = (record.advice || [])
    .map((item: string) => `- ${item}`)
    .join("\n");

  const forecastLines = (record.forecast || [])
    .map(
      (item: any) =>
        `- ${item.date}: ${item.minTemp}°C ~ ${item.maxTemp}°C, ${item.description} (rain chance: ${item.rainChance}%)`
    )
    .join("\n");

  return `# Weather Record

**Record ID:** ${record.id}  
**Location:** ${record.locationName}${record.country ? `, ${record.country}` : ""}  
**Coordinates:** ${record.latitude}, ${record.longitude}  
**Original Input:** ${record.rawInput}  
**Query Type:** ${record.queryType}  
**Created At:** ${record.createdAt}  

## Current Weather
- Temperature: ${record.currentTemp ?? "N/A"}°C
- Feels Like: ${record.feelsLike ?? "N/A"}°C
- Min Temperature: ${record.tempMin ?? "N/A"}°C
- Max Temperature: ${record.tempMax ?? "N/A"}°C
- Main: ${record.weatherMain ?? "N/A"}
- Description: ${record.weatherDescription ?? "N/A"}
- Humidity: ${record.humidity ?? "N/A"}%
- Wind Speed: ${record.windSpeed ?? "N/A"} m/s
- Visibility: ${record.visibility ?? "N/A"}

## Advice
${adviceLines || "- No advice available"}

## Forecast
${forecastLines || "- No forecast available"}

## Notes
- Note: ${record.note ?? "N/A"}
- Tag: ${record.tag ?? "N/A"}
`;
}