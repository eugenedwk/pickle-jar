import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { players } from "~/server/db/schema";

export type PlayerProfile = {
  hasProfile: boolean;
  playerData?: PlayerProfileRes;
};

export const PlayerProfileResSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  screenName: z.string(),
  realName: z.string().optional(),
  hideRealName: z.boolean().default(true),
  skillLevel: z.string().optional(),
  paddleBrand: z.string().optional(),
  paddlePreference: z.string().optional(),
  plays: z.string().optional(),
  homeCourt: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type inference from the Zod schema
export type PlayerProfileRes = z.infer<typeof PlayerProfileResSchema>;

export async function fetchPlayerProfile(
  playerId: string,
): Promise<PlayerProfileRes | null> {
  try {
    const player = await db.query.players.findFirst({
      where: eq(players.id, playerId),
    });

    if (!player) {
      return null; // Return null instead of throwing an error
    }

    return player as PlayerProfileRes;
  } catch (error) {
    console.error("Error fetching player profile:", error);
    throw error;
  }
}

import axios from "axios";

export async function fetchPlayerProfileClientSide(
  playerId: string,
): Promise<PlayerProfileRes> {
  const response = await axios.get<PlayerProfileRes>(
    `/api/players/${playerId}`,
  );

  if (response.status === 200 && response.data) {
    return PlayerProfileResSchema.parse(response.data);
  }

  throw new Error("Failed to fetch player profile");
}
