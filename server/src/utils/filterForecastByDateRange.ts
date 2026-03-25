import { AppError } from "./AppError";

export function filterForecastByDateRange(
  forecast: any,
  startDate?: string,
  endDate?: string
) {
  const list = forecast?.list || [];

  if (!startDate && !endDate) {
    return list;
  }

  if (!startDate || !endDate) {
    throw new AppError(
      400,
      "INVALID_DATE_RANGE",
      "Both startDate and endDate are required together"
    );
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError(
      400,
      "INVALID_DATE_RANGE",
      "Dates must be valid YYYY-MM-DD values"
    );
  }

  if (start > end) {
    throw new AppError(
      400,
      "INVALID_DATE_RANGE",
      "Start date cannot be later than end date"
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxSupported = new Date(today);
  maxSupported.setDate(today.getDate() + 5);
  maxSupported.setHours(23, 59, 59, 999);

  if (end > maxSupported) {
    throw new AppError(
      400,
      "DATE_RANGE_UNSUPPORTED",
      "Please select a date range within today and the next 5 days"
    );
  }

  const filtered = list.filter((item: any) => {
    const itemDate = new Date(item.dt_txt);
    return itemDate >= start && itemDate <= end;
  });

  if (filtered.length === 0) {
    throw new AppError(
      404,
      "NO_FORECAST_IN_RANGE",
      "No forecast data found within the selected date range"
    );
  }

  return filtered;
}