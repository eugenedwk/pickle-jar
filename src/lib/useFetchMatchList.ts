import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import type Error from "next/error";
import { type ApiServiceErr } from "./utils";

interface Score {
  round: number;
  home: number;
  away: number;
}

interface Participant {
  playerId: string;
  playerName: string;
  team: "home" | "away";
}

export type MatchRes = {
  id: number;
  gameType: string;
  date: Date;
  time: string;
  location: string;
  outcome: string;
  scores: Score[];
  participants: Participant[];
  verified: boolean;
};

const fetchMatches = async (): Promise<MatchRes[]> =>
  await axios.get<MatchRes[]>("/api/matches").then((res) => res.data);

export const useFetchMatchList = () => {
  return useQuery<MatchRes[]>({
    queryKey: ["matches"],
    queryFn: async () => await fetchMatches(),
  });
};

// export const fetchPlayerMatches = async (
//   playerId: string,
// ): Promise<MatchRes[]> => {
//   const response = await axios.get<MatchRes[]>(`/api/matches/${playerId}`);
//   return response.data;
// };

export async function fetchMatchListById(
  playerId: string,
): Promise<MatchRes[]> {
  try {
    const userMatches = await db
      .select()
      .from(matches)
      .where(sql`${matches.participants}::text LIKE ${"%" + playerId + "%"}`)
      .execute();

    const matchesRes: MatchRes[] = userMatches.map((match) => ({
      id: Number(match.id),
      gameType: match.gameType,
      date: new Date(match.date),
      time: match.time,
      location: match.location,
      outcome: match.outcome,
      scores: match.scores as Score[],
      participants: match.participants as Participant[],
      verified: match.verified,
    }));

    return matchesRes;
  } catch (error) {
    console.error("Error fetching user matches:", error);
    throw error;
  }
}

export const useFetchMatchListById = (playerId: string) => {
  return useQuery<MatchRes[], Error>({
    queryKey: ["matches", playerId],
    queryFn: () => fetchMatchListById(playerId),
  });
};
