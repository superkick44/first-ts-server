import type { Request, Response } from "express";

import { createUser,updateUser, upgradeUser } from "../db/queries/users.js";
import { BadRequestError, UserForbiddenError } from "./errors.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { NewUser } from "../db/schema.js";
import { hashPassword,getBearerToken,validateJWT, getAPIKey } from "../auth.js";
import {config} from "../config.js"

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerUsersCreate(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };
  const params: parameters = req.body;

  if (!params.password || !params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const user = await createUser({
    email: params.email,
    hashedPassword,
  } satisfies NewUser);

  if (!user) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed
  } satisfies UserResponse);
}

export async function handlerUsersUpdate(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };
  const params: parameters = req.body;

  if (!params.password || !params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  const hashedPassword = await hashPassword(params.password);

  const user = await updateUser(userId,params.email,hashedPassword);

  if (!user) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed
  } satisfies UserResponse);
}

export async function handlerUsersUpgrade(req: Request, res: Response) {
  type parameters = {
    event: string;
    data: {
      userId: string
    };
  };
  const apiKey = getAPIKey(req);
  if(apiKey !== config.polka){
    throw new UserForbiddenError("Bad Polka API Key")
  }
  const params: parameters = req.body;

  if (!params.event || !params.data || !params.data.userId) {
    throw new BadRequestError("Missing required fields");
  }
  
  if(params.event !== "user.upgraded"){
    respondWithJSON(res,204,{});
    return
  }
  try{
     await upgradeUser(params.data.userId);
  } catch(err){
    console.log(err);
    respondWithError(res,404,"user was not found")
  }


  respondWithJSON(res, 204, {});
}
