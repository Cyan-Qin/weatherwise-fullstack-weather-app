export function generateAdvice(current: any, forecast: any): string[] {
  const advice: string[] = [];

  const temp = current.main?.temp;
  const weatherMain = current.weather?.[0]?.main?.toLowerCase() || "";
  const description = current.weather?.[0]?.description?.toLowerCase() || "";
  const windSpeed = current.wind?.speed ?? 0;
  const humidity = current.main?.humidity ?? 0;
  const visibility = current.visibility ?? 10000;

  if (temp !== undefined) {
    if (temp < 10) {
      advice.push("It’s cold outside, so bring a warm coat.");
    } else if (temp < 20) {
      advice.push("A light jacket may be useful today.");
    } else if (temp > 28) {
      advice.push("It’s quite warm, so wear breathable clothes and stay hydrated.");
    }
  }

  if (weatherMain.includes("rain") || description.includes("rain")) {
    advice.push("Carry an umbrella because rain is expected.");
  }

  if (weatherMain.includes("snow") || description.includes("snow")) {
    advice.push("Roads may be slippery, so travel carefully.");
  }

  if (windSpeed > 10) {
    advice.push("It’s windy outside, so secure loose items.");
  }

  if (humidity > 80) {
    advice.push("Humidity is high today, so it may feel muggy.");
  }

  if (visibility < 3000) {
    advice.push("Visibility is reduced, so be careful when traveling.");
  }

  const forecastList = forecast?.list || [];
  const hasRainSoon = forecastList.slice(0, 3).some((item: any) =>
    item.weather?.[0]?.main?.toLowerCase().includes("rain")
  );

  if (hasRainSoon && !advice.some((item) => item.includes("umbrella"))) {
    advice.push("There may be rain in the next few hours, so bringing an umbrella is a good idea.");
  }

  if (advice.length === 0) {
    advice.push("Weather conditions look fairly comfortable today.");
  }

  return advice;
}