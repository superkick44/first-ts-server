import type { NextFunction, Request, Response } from "express";
import {config} from "../config.js";

export async function handlerGetMetrics(_: Request, res: Response, next: NextFunction) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`Hits: ${config.fileserverHits}`);
  next();
}


