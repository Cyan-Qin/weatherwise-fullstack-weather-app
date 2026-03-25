import type { WeatherResponse } from "../types/weather";

type Props = {
  data: WeatherResponse;
};

export default function CurrentWeatherCard({ data }: Props) {
  const current = data.current;
  const location = data.location;

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {location.name}
            {location.country ? `, ${location.country}` : ""}
          </h2>
          <p className="mt-1 text-slate-500 capitalize">
            {current.description || "No description"}
          </p>
        </div>
        {current.icon ? (
          <img
            src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
            alt={current.main || "weather icon"}
            className="h-16 w-16"
          />
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Temperature</p>
          <p className="text-4xl font-bold">
            {current.temperature !== undefined
              ? `${Math.round(current.temperature)}°C`
              : "N/A"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Feels like{" "}
            {current.feelsLike !== undefined
              ? `${Math.round(current.feelsLike)}°C`
              : "N/A"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-500">Humidity</p>
            <p className="mt-1 font-semibold">
              {current.humidity ?? "N/A"}%
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-500">Wind</p>
            <p className="mt-1 font-semibold">
              {current.windSpeed ?? "N/A"} m/s
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-500">Min</p>
            <p className="mt-1 font-semibold">
              {current.minTemp !== undefined
                ? `${Math.round(current.minTemp)}°C`
                : "N/A"}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-500">Max</p>
            <p className="mt-1 font-semibold">
              {current.maxTemp !== undefined
                ? `${Math.round(current.maxTemp)}°C`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}