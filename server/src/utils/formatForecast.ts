export function formatForecast(forecast: any, customList?: any[]) {
  const list = customList || forecast?.list || [];
  const dailyMap = new Map<string, any>();

  for (const item of list) {
    const date = item.dt_txt.split(" ")[0];

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        main: item.weather?.[0]?.main || "",
        description: item.weather?.[0]?.description || "",
        icon: item.weather?.[0]?.icon || "",
        rainChance: Math.round((item.pop ?? 0) * 100),
      });
    } else {
      const existing = dailyMap.get(date);
      existing.minTemp = Math.min(existing.minTemp, item.main.temp_min);
      existing.maxTemp = Math.max(existing.maxTemp, item.main.temp_max);
    }
  }

  return Array.from(dailyMap.values()).slice(0, 5);
}