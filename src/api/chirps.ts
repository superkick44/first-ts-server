import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";


export async function handlerCreateChirp(req:Request, res:Response){
  type Parameters = {
    body: string;
    userId: string;
  }
  const params: Parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`,
    );
  }

  const words = params.body.split(" ");
  const badWords = ["kerfuffle", "sharbert", "fornax"];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  const cleanedBody = words.join(" ");

  const cleanedChirp: NewChirp = {
    userId: params.userId,
    body: cleanedBody
  }

  const dbResponse = await createChirp(cleanedChirp);
  
  return respondWithJSON(res, 201, dbResponse);
}
