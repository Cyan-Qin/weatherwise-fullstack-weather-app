import { useState } from "react";
import DatePicker from "react-datepicker";


type SearchBarProps = {
  onSearch: (input: string, startDate?: string, endDate?: string) => void;
  loading: boolean;
};

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [input, setInput] = useState("");
  const [locating, setLocating] = useState(false);
  function formatLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
}
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const today = new Date();
const todayString = formatLocalDate(today);

const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 5);
const maxDateString = formatLocalDate(maxDate);
today.setHours(0, 0, 0, 0);
maxDate.setHours(23, 59, 59, 999);
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!input.trim()) return;

  if ((startDate && !endDate) || (!startDate && endDate)) {
    alert("Please select both start and end dates.");
    return;
  }

  if (startDate && endDate) {
    if (startDate > endDate) {
      alert("Start date cannot be later than end date.");
      return;
    }
  }

  onSearch(
    input.trim(),
    startDate ? formatLocalDate(startDate) : undefined,
    endDate ? formatLocalDate(endDate) : undefined
  );
}

  function handleUseLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const input = `${lat},${lon}`;
        onSearch(input, startDate ? formatLocalDate(startDate) : undefined,
  endDate ? formatLocalDate(endDate) : undefined
);

        setLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Failed to get your location.");
        setLocating(false);
      }
    );
  }

  return (
      <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <input
              type="text"
              placeholder="Enter a city, postal code, or coordinates"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
          />

          <button
              type="button"
              onClick={handleUseLocation}
              disabled={locating || loading}
              className="rounded-xl border px-4 py-3 text-slate-700 disabled:opacity-50"
          >
            {locating ? "Locating..." : "Use My Location"}
          </button>

          <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);

            if (date && endDate && endDate < date) {
              setEndDate(date);
            }
          }}
          minDate={today}
          maxDate={maxDate}
          placeholderText="Start date"
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom-start"
          portalId="root"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
        />

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          minDate={startDate || today}
          maxDate={maxDate}
          placeholderText="End date"
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom-start"
          portalId="root"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
        />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Examples: Tokyo / 10001 / 35.6762,139.6503
        </p>
      </form>
  );
}