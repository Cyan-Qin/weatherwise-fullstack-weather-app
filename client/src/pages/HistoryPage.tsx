import { useEffect, useState } from "react";
import axios from "axios";
import { getWeatherRecords } from "../api/weatherApi";
import type { WeatherRecord } from "../types/weather";
import { Link } from "react-router-dom";
import {
  deleteWeatherRecord,
  updateWeatherRecord,
  exportWeatherRecord,
} from "../api/weatherApi";
import Navbar from "../components/Navbar";


export default function HistoryPage() {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    async function fetchRecords() {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await getWeatherRecords();
        setRecords(result.data || []);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Failed to fetch history records."
          );
        } else {
          setErrorMessage("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteWeatherRecord(id);
      setRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to delete record."
        );
      } else {
        setErrorMessage("Something went wrong.");
      }
    }
  }

  async function handleSaveEdit(id: number) {
    try {
      const result = await updateWeatherRecord(id, {
        note: noteInput,
        tag: tagInput,
      });

      setRecords((prev) =>
        prev.map((record) =>
          record.id === id
            ? {
                ...record,
                note: result.data.note,
                tag: result.data.tag,
              }
            : record
        )
      );

      setEditingId(null);
      setNoteInput("");
      setTagInput("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to update record."
        );
      } else {
        setErrorMessage("Something went wrong.");
      }
    }
  }

  async function handleExport(
    id: number,
    format: "json" | "csv" | "markdown"
  ) {
    try {
      setErrorMessage("");

      const blob = await exportWeatherRecord(id, format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const extension = format === "markdown" ? "md" : format;
      link.download = `weather-record-${id}.${extension}`;

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
        <header className="mb-8">
          <p className="text-sm font-medium text-slate-500">Saved weather queries</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Search History
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Review previously saved weather queries from the database.
          </p>
        </header>

        {loading ? (
          <div className="rounded-2xl border bg-white p-8 text-slate-500 shadow-sm">
            Loading history...
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {errorMessage}
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-slate-500 shadow-sm">
            No records found yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map((record) => (
                <div
                    key={record.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {record.locationName}
                        {record.country ? `, ${record.country}` : ""}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Input: {record.rawInput} · Type: {record.queryType}
                      </p>
                    </div>

                    <div className="text-sm text-slate-500">
                      {new Date(record.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Temperature</p>
                      <p className="mt-1 font-semibold">
                        {record.currentTemp !== null && record.currentTemp !== undefined
                            ? `${Math.round(record.currentTemp)}°C`
                            : "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Weather</p>
                      <p className="mt-1 font-semibold capitalize">
                        {record.weatherDescription || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Humidity</p>
                      <p className="mt-1 font-semibold">
                        {record.humidity ?? "N/A"}%
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Wind</p>
                      <p className="mt-1 font-semibold">
                        {record.windSpeed ?? "N/A"} m/s
                      </p>
                    </div>
                  </div>

                  {(record.note || record.tag) ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {record.tag ? (
                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
                        {record.tag}
                      </span>
                        ) : null}
                        {record.note ? (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                        {record.note}
                      </span>
                        ) : null}
                      </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        to={`/history/${record.id}`}
                        className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View Details
                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                          setEditingId(record.id);
                          setNoteInput(record.note || "");
                          setTagInput(record.tag || "");
                        }}
                        className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm(
                              "Are you sure you want to delete this record?"
                          );
                          if (confirmed) {
                            handleDelete(record.id);
                          }
                        }}
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>

                    <button
                        type="button"
                        onClick={() => handleExport(record.id, "json")}
                        className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      JSON
                    </button>

                    <button
                        type="button"
                        onClick={() => handleExport(record.id, "csv")}
                        className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      CSV
                    </button>

                    <button
                        type="button"
                        onClick={() => handleExport(record.id, "markdown")}
                        className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Markdown
                    </button>
                  </div>

                  {editingId === record.id ? (
                      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Edit note"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                        />
                        <input
                            type="text"
                            placeholder="Edit tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                        />

                        <div className="md:col-span-2 flex gap-3">
                          <button
                              type="button"
                              onClick={() => handleSaveEdit(record.id)}
                              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                          >
                            Save
                          </button>
                          <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setNoteInput("");
                                setTagInput("");
                              }}
                              className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                  ) : null}
                </div>
            ))}
          </div>
        )}
      </div>
     </main>
    </div>
  );
}