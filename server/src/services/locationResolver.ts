import {
  geocodeLocation,
  geocodePostalCode,
  reverseGeocodeLocation,
} from "./weatherService";
import { AppError } from "../utils/AppError";

function isCoordinates(input: string) {
  const regex =
    /^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/;
  return regex.test(input);
}

function parseCoordinates(input: string) {
  const parts = input.split(",");
  const lat = Number(parts[0].trim());
  const lon = Number(parts[1].trim());

  if (
    Number.isNaN(lat) ||
    Number.isNaN(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    throw new AppError(
      400,
      "INVALID_COORDINATES",
      "Coordinates must be valid latitude and longitude values"
    );
  }

  return { lat, lon };
}

function isPostalCode(input: string) {
  return /^[A-Za-z0-9\-\s]{3,10}$/.test(input.trim()) && /\d/.test(input);
}

export async function resolveLocationInput(input: string) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    throw new AppError(400, "INPUT_REQUIRED", "Input is required");
  }

  if (isCoordinates(trimmedInput)) {
    const { lat, lon } = parseCoordinates(trimmedInput);
    const location = await reverseGeocodeLocation(lat, lon);

    return {
      queryType: "coordinates",
      location,
    };
  }

  if (isPostalCode(trimmedInput)) {
    const location = await geocodePostalCode(trimmedInput);

    return {
      queryType: "postal_code",
      location,
    };
  }

  const location = await geocodeLocation(trimmedInput);

  return {
    queryType: "text",
    location,
  };
}