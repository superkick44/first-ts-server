import type { Request, Response } from "express";
import * as z from "zod";

const requestBody = z.object({
  body: z.string()
})

type RequestBody = z.infer<typeof requestBody>;

class TooLongError extends Error {
  constructor(
    message: string
  ){
    super(message);
  }
}

const badWords = new Set(["kerfuffle","sharbert","fornax"])

export async function handlerValidateChirp(req: Request, res: Response) {
    try{
      const reqBody = req.body;
      const data = requestBody.parse(reqBody);

      if(data.body.length > 140){
        throw new TooLongError("Chirp is too long");
      }
      
      const filteredMessage = censor(data.body);

      const resBody = {cleanedBody:filteredMessage};
      res.header("Content-Type","application/json");
      res.status(200).send(JSON.stringify(resBody));

    } catch(err){
      if(err instanceof TooLongError){
        console.log(err.message);
        res.status(400).send({error:err.message})
      } else if (err instanceof Error) {
        console.log(err.message);
        res.status(400).send({error:"Something went wrong"})
      }
    }
}

function censor(message:string){
  const words = message.split(" ")
  const censoredMessage = words.map((word)=>badWords.has(word.toLowerCase()) ? "****": word);
  return censoredMessage.join(" ");
}
