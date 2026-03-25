import { useState } from "react";
import SearchBar from "../components/SearchBar";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import ForecastGrid from "../components/ForecastGrid";
import AdvicePanel from "../components/AdvicePanel";
import { searchWeather } from "../api/weatherApi";
import type { WeatherResponse } from "../types/weather";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import WeatherMap from "../components/WeatherMap";


export default function HomePage() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRange, setSelectedRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  async function handleSearch(input: string, startDate?: string, endDate?: string) {
    try {
      setLoading(true);
      setErrorMessage("");

      const result = await searchWeather(input, startDate, endDate);
      setWeather(result.data);
      setSelectedRange({ startDate, endDate });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch weather."
        );
      } else {
        setErrorMessage("Something went wrong.");
      }
      setWeather(null);
      setSelectedRange({});

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
     <Navbar />
      <main>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                Full-Stack Weather Intelligence App
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Search weather with smart, structured results
              </h1>

              <p className="mt-4 max-w-3xl text-lg text-slate-600">
                Get current weather, date-range forecast results, practical travel advice,
                and location visualization from one clean interface.
              </p>
            </div>

            <Link
                to="/history"
                className="rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              View History
            </Link>
          </header>

          <SearchBar onSearch={handleSearch} loading={loading}/>

          {errorMessage ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                {errorMessage}
              </div>
          ) : null}

          {weather ? (
              <div className="mt-6 space-y-6">
                <section className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold">Query Summary</h2>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Matched location</p>
                      <p className="mt-1 font-semibold">
                        {weather.location.name}
                        {weather.location.country ? `, ${weather.location.country}` : ""}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Selected date range</p>
                      <p className="mt-1 font-semibold">
                        {selectedRange.startDate && selectedRange.endDate
                            ? `${selectedRange.startDate} → ${selectedRange.endDate}`
                            : "Current + next available forecast"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Data source</p>
                      <p className="mt-1 font-semibold">{weather.meta.source}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Last fetched</p>
                      <p className="mt-1 font-semibold">
                        {new Date(weather.meta.fetchedAt).toLocaleString("en-GB")}
                      </p>
                    </div>
                  </div>
                </section>

                <CurrentWeatherCard data={weather}/>
                <ForecastGrid forecast={weather.forecast}/>
                <AdvicePanel advice={weather.advice}/>
                <WeatherMap data={weather}/>
              </div>
          ) : (
              <div className="mt-6 rounded-2xl border bg-white p-12 text-center shadow-sm">
                <p className="text-lg font-medium text-slate-700">
                  Search for a location to see weather results
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  You can enter a city, postal code, or coordinates, and optionally select a
                  supported forecast date range.
                </p>
              </div>
          )}
        </div>
        <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Project Information</h3>

          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Created by</p>
              <p className="mt-1 text-lg font-semibold">Qing Qin</p>
              <p className="mt-2 text-sm text-slate-600">Female</p>
              <p className="mt-2 text-sm text-slate-600">
                Contact: 1450349258@qq.com
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">About PM Accelerator</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                PM Accelerator is a career-focused platform designed to help
                aspiring product managers and builders gain practical experience,
                strengthen their portfolios, and accelerate their professional
                growth through applied projects and mentorship.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}