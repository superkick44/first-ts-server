import { response, type Request, type Response } from "express";

import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp,getChirps, getChirpsById } from "../db/queries/chirps.js";
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

export async function handlerGetChirp(_:Request, res:Response){
  const dbResponse = await getChirps();
  
  return respondWithJSON(res, 200, dbResponse);
}

export async function handlerGetChirpById(req:Request, res:Response){
  const param = req.params.chirpId;
  if(typeof param !== "string"){
    return respondWithError(res,400,"chirpId is invalid");
  }
  if (!param){
    return respondWithError(res,400,"no id provided");
  }
  const dbResponse = await getChirpsById(param);

  if(dbResponse.length === 0){
    return respondWithError(res,404,"Chirp now found.");
  }
  return respondWithJSON(res, 200, dbResponse[0]);
}
