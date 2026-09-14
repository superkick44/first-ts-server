import type { Request, Response } from "express";
import type { NewUser } from "../db/schema.js";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "../auth.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;
  if(!params.email){
    throw new BadRequestError("Email was not provided");
  }
  if(!params.password){
    throw new BadRequestError("Password was not provided");
  }
  const hashedPassword = await hashPassword(params.password);
  const newUser:NewUser ={
    email: params.email,
    hashedPassword: hashedPassword
  }
  
  const createdUser = await createUser(newUser);

  const returnedResponse: Omit<NewUser,"hashedPassword"> = {
    email: createdUser.email,
    id: createdUser.id,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt
  }

  respondWithJSON(res, 201, returnedResponse);
}

