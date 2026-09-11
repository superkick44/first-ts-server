import { db } from "../index.js";
import {eq} from "drizzle-orm"
import { chirps, NewChirp  } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps() {
  const result = await db
    .select()
    .from(chirps)
    .orderBy(chirps.createdAt)
  return result;
}

export async function getChirpsById(chirpId: string) {
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id,chirpId))
    .orderBy(chirps.createdAt)
  return result;
}
