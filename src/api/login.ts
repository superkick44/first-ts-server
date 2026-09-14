import type { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash } from "../auth.js";
import type { NewUser } from "../db/schema.js";
import { respondWithJSON } from "./json.js";

export async function handlerLogin(req:Request, res:Response){  
  type Parameters = {
    password: string;
    email: string;
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
  
  const returnResponse: Omit<NewUser,"hashedPassword"> = {
    email: searchecdUser.email,
    id: searchecdUser.id,
    createdAt: searchecdUser.createdAt,
    updatedAt: searchecdUser.updatedAt
  }

  return respondWithJSON(res,200,returnResponse);


}
