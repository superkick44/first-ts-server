import type { Request, Response, NextFunction } from "express";
import {config} from "../config.js";
import { AuthenticationError, AuthorizationError, BadRequestError, NotFoundError } from "./errors.js";

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

export function middlewareError(
  err:Error,
  req:Request,
  res:Response,
  next:NextFunction
){
  console.log(err.message);
  const returnError = {error:err.message};

  if(err instanceof BadRequestError){
    res.status(400).json(returnError)
  } else if (err instanceof AuthenticationError){
    res.status(401).json(returnError)
  } else if (err instanceof AuthorizationError){
    res.status(403).json(returnError)
  } else if (err instanceof NotFoundError){
    res.status(404).json(returnError)
  } else {
    res.status(500).json({error:"Something went wrong on our end"});
  }
  
}
