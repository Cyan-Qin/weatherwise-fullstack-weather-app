import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }

  if (error?.code === "P2025") {
    return res.status(404).json({
      success: false,
      code: "RECORD_NOT_FOUND",
      message: "Record not found",
    });
  }

  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong on the server.",
  });
}