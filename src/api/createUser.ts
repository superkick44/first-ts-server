import type { Request, Response } from "express";
import type { NewUser } from "../db/schema.js";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
  };

  const params: parameters = req.body;
  if(!params.email){
    throw new BadRequestError("Email is not provided");
  }
  const newUser:NewUser ={
    email: params.email
  }
  
  const createdUser = await createUser(newUser);

  respondWithJSON(res, 201, createdUser);
}

