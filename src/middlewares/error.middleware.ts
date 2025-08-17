import { ValidateError } from "tsoa";
import { Request, Response, NextFunction } from "express";

export const errorHandle = (err: unknown,req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      status: "error",
      message: "Validation Failed",
      errors: Object.values(err.fields).map((f) => f.message), // 👈 make it cleaner
    });
  }

  // our HttpError
  const anyErr = err as any;
  if (anyErr && typeof anyErr.status === "number") {
    return res.status(anyErr.status).json({
      status: anyErr.status,
      message: anyErr.message || "Error",
      code: anyErr.code,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }

  next();
}