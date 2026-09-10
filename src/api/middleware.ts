import type { Request, Response, NextFunction } from "express";
import {config} from "../config.js";

export async function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish",() =>{
    res.statusCode >= 300 ? console.log(`[NON-OK] ${req.method} ${req.url} - status: ${res.statusCode}`): ""
    if(res.statusCode >= 300){
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  })
  next();
}

export function middlewareMetricsInc(_:Request, __:Response, next: NextFunction){
  config.fileserverHits += 1;
  next();
}
