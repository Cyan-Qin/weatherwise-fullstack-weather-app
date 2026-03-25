import type { WeatherResponse } from "../types/weather";

type Props = {
  forecast: WeatherResponse["forecast"];
};

export default function ForecastGrid({ forecast }: Props) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold">5-Day Forecast</h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {forecast.map((item) => (
          <div key={item.date} className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium">{item.date}</p>
            <div className="mt-2 flex items-center justify-between">
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt={item.main}
                className="h-12 w-12"
              />
              <p className="text-sm text-slate-500 capitalize">
                {item.description}
              </p>
            </div>
            <p className="mt-3 font-semibold">
              {Math.round(item.minTemp)}°C ~ {Math.round(item.maxTemp)}°C
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Rain chance: {item.rainChance}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}