import type { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import type { NewUser } from "../db/schema.js";
import { respondWithJSON } from "./json.js";
import {config} from "../config.js";

type LoginResponse = Omit<NewUser,"hashedPassword"> & {
  token: string
}

export async function handlerLogin(req:Request, res:Response){  
  type Parameters = {
    password: string;
    email: string;
    expiresInSeconds?: number;
  }
  
  const params: Parameters = req.body;
  if(!params.email){
    throw new BadRequestError("Email was not provided");
  }
  if(!params.password){
    throw new BadRequestError("Password was not provided");
  }

  let queryResults = await getUserByEmail(params.email);

  if(queryResults.length != 1){
    throw new UserNotAuthenticatedError("incorrect email or password");
  }
  const searchecdUser = queryResults[0];
  if(!await checkPasswordHash(params.password, searchecdUser.hashedPassword)){
    throw new UserNotAuthenticatedError("incorrect email or password");
  }

  let tokenExpiration = params.expiresInSeconds;
  if(!tokenExpiration || tokenExpiration > 3600){
    tokenExpiration = 36000
  }
  const token = makeJWT(searchecdUser.id,tokenExpiration,config.jwt);
  
  const returnResponse: LoginResponse = {
    email: searchecdUser.email,
    id: searchecdUser.id,
    createdAt: searchecdUser.createdAt,
    updatedAt: searchecdUser.updatedAt,
    token: token
  }

  return respondWithJSON(res,200,returnResponse);


}
