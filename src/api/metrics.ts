import type { NextFunction, Request, Response } from "express";
import fs from "fs";
import {config} from "../config.js";

export async function handlerGetMetrics(_: Request, res: Response, next: NextFunction) {
  res.set("Content-Type", "text/html; charset=utf-8");
  let page = fs.readFileSync("src/app/admin.html", "utf-8");
  page = page.replace("NUM",String(config.fileserverHits));
  res.send(page);
  next();
}


