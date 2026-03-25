import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { queryWeatherAndSave } from "../services/weatherQueryService";

export async function searchWeather(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { input, startDate, endDate } = req.body;

    if (!input || typeof input !== "string") {
      throw new AppError(400, "INPUT_REQUIRED", "Input is required");
    }

    const result = await queryWeatherAndSave(input, startDate, endDate);

    return res.json({
      success: true,
      data: result.formatted,
      recordId: result.recordId,
    });
  } catch (error) {
    next(error);
  }
}