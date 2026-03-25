import { NextFunction, Request, Response } from "express";
import { Parser } from "json2csv";
import {
  getAllWeatherRecords,
  getWeatherRecordById,
  getParsedWeatherRecordById,
  updateWeatherRecord,
  deleteWeatherRecord,
} from "../services/recordService";
import { toExportJson, toExportMarkdown } from "../utils/exportRecord";
import { AppError } from "../utils/AppError";

export async function fetchAllRecords(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const records = await getAllWeatherRecords();

    return res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    next(error);
  }
}

export async function fetchRecordById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError(400, "INVALID_RECORD_ID", "Invalid record id");
    }

    const record = await getWeatherRecordById(id);

    if (!record) {
      throw new AppError(404, "RECORD_NOT_FOUND", "Record not found");
    }

    return res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

export async function patchRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError(400, "INVALID_RECORD_ID", "Invalid record id");
    }

    const { note, tag, startDate, endDate } = req.body;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new AppError(
        400,
        "INVALID_DATE_RANGE",
        "Start date cannot be later than end date"
      );
    }

    const updated = await updateWeatherRecord(id, {
      note,
      tag,
      startDate,
      endDate,
    });

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError(400, "INVALID_RECORD_ID", "Invalid record id");
    }

    await deleteWeatherRecord(id);

    return res.json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function exportRecordAsJson(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError(400, "INVALID_RECORD_ID", "Invalid record id");
    }

    const record = await getParsedWeatherRecordById(id);

    if (!record) {
      throw new AppError(404, "RECORD_NOT_FOUND", "Record not found");
    }

    const exported = toExportJson(record);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=weather-record-${id}.json`);

    return res.status(200).send(JSON.stringify(exported, null, 2));
  } catch (error) {
    next(error);
  }
}

export async function exportRecordAsCsv(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError(400, "INVALID_RECORD_ID", "Invalid record id");
    }

    const record = await getParsedWeatherRecordById(id);

    if (!record) {
      throw new AppError(404, "RECORD_NOT_FOUND", "Record not found");
    }

    const flatRecord = {
      id: record.id,
      rawInput: record.rawInput,
      queryType: record.queryType,
      locationName: record.locationName,
      country: record.country,
      latitude: record.latitude,
      longitude: record.longitude,
      currentTemp: record.currentTemp,
      feelsLike: record.feelsLike,
      tempMin: record.tempMin,
      tempMax: record.tempMax,
      weatherMain: record.weatherMain,
      weatherDescription: record.weatherDescription,
      humidity: record.humidity,
      windSpeed: record.windSpeed,
      visibility: record.visibility,
      sunrise: record.sunrise,
      sunset: record.sunset,
      advice: (record.advice || []).join(" | "),
      forecast: JSON.stringify(record.forecast || []),
      note: record.note,
      tag: record.tag,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };

    const parser = new Parser();
    const csv = parser.parse([flatRecord]);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=weather-record-${id}.csv`);

    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
}

export async function exportRecordAsMarkdown(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError(400, "INVALID_RECORD_ID", "Invalid record id");
    }

    const record = await getParsedWeatherRecordById(id);

    if (!record) {
      throw new AppError(404, "RECORD_NOT_FOUND", "Record not found");
    }

    const markdown = toExportMarkdown(record);

    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=weather-record-${id}.md`);

    return res.status(200).send(markdown);
  } catch (error) {
    next(error);
  }
}