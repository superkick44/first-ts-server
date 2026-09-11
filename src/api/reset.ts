
import type { Request, Response } from "express";
import { config } from "../config.js";
import { BadRequestError } from "./errors.js";
import { resetUsers } from "../db/queries/users.js";

export async function handlerReset(_: Request, res: Response) {
  if(config.api.platform != "dev"){
    throw new BadRequestError("Forbidden");
  }
  await resetUsers();
  config.api.fileServerHits = 0;
  res.write("Hits reset to 0");
  res.end();
}

