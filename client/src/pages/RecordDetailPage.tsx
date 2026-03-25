import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  exportWeatherRecord,
  getWeatherRecordById,
} from "../api/weatherApi";
import type { WeatherRecordDetail } from "../types/weather";
import Navbar from "../components/Navbar";


export default function RecordDetailPage() {
  const { id } = useParams();
  const [record, setRecord] = useState<WeatherRecordDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchRecord() {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await getWeatherRecordById(Number(id));
        setRecord(result.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Failed to fetch record details."
          );
        } else {
          setErrorMessage("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRecord();
    }
  }, [id]);

  const advice = useMemo(() => {
    if (!record?.adviceJson) return [];
    try {
      return JSON.parse(record.adviceJson);
    } catch {
      return [];
    }
  }, [record]);

  const forecast = useMemo(() => {
    if (!record?.forecastJson) return [];
    try {
      return JSON.parse(record.forecastJson);
    } catch {
      return [];
    }
  }, [record]);

  async function handleExport(format: "json" | "csv" | "markdown") {
    if (!record) return;

    try {
      setErrorMessage("");

      const blob = await exportWeatherRecord(record.id, format);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const extension = format === "markdown" ? "md" : format;
      link.download = `weather-record-${record.id}.${extension}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to export record."
        );
      } else {
        setErrorMessage("Something went wrong during export.");
      }
    }
  }

  return (
   <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Saved record details</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Record Details
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
                type="button"
              onClick={() => handleExport("json")}
              className="rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Export JSON
            </button>

            <button
              type="button"
              onClick={() => handleExport("csv")}
              className="rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => handleExport("markdown")}
              className="rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Export Markdown
            </button>

            <Link
              to="/history"
              className="rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Back to History
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border bg-white p-8 text-slate-500 shadow-sm">
            Loading record...
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {errorMessage}
          </div>
        ) : !record ? (
          <div className="rounded-2xl border bg-white p-8 text-slate-500 shadow-sm">
            Record not found.
          </div>
        ) : (
          <div className="space-y-6">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">
                {record.locationName}
                {record.country ? `, ${record.country}` : ""}
              </h2>
              <p className="mt-2 text-slate-500">
                Input: {record.rawInput} · Type: {record.queryType}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-slate-500">Temperature</p>
                  <p className="mt-1 text-xl font-semibold">
                    {record.currentTemp !== null &&
                    record.currentTemp !== undefined
                      ? `${Math.round(record.currentTemp)}°C`
                      : "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-slate-500">Weather</p>
                  <p className="mt-1 text-xl font-semibold capitalize">
                    {record.weatherDescription || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-slate-500">Humidity</p>
                  <p className="mt-1 text-xl font-semibold">
                    {record.humidity ?? "N/A"}%
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-slate-500">Wind</p>
                  <p className="mt-1 text-xl font-semibold">
                    {record.windSpeed ?? "N/A"} m/s
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Advice</h3>
              <ul className="mt-4 space-y-3">
                {advice.length > 0 ? (
                  advice.map((item: string, index: number) => (
                    <li
                      key={`${item}-${index}`}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="rounded-xl bg-slate-50 p-4 text-slate-500">
                    No advice available.
                  </li>
                )}
              </ul>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Forecast Snapshot</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {forecast.length > 0 ? (
                  forecast.map(
                    (item: {
                      date: string;
                      minTemp: number;
                      maxTemp: number;
                      description: string;
                      rainChance: number;
                    }) => (
                    <div key={item.date} className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-medium">{item.date}</p>
                      <p className="mt-2 capitalize text-slate-600">
                        {item.description}
                      </p>
                      <p className="mt-3 font-semibold">
                        {Math.round(item.minTemp)}°C ~{" "}
                        {Math.round(item.maxTemp)}°C
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Rain chance: {item.rainChance}%
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-slate-500">
                    No forecast available.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
   </div>
  );
}