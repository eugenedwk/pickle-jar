import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { type ParticipantType } from "~/components/PickleballMatchForm";
import { matches } from "~/server/db/schema";

export async function getPlayerStats(playerId: string) {
  const playerMatches = await db
    .select()
    .from(matches)
    .where(sql`${matches.participants}::text LIKE ${"%" + playerId + "%"}`);

  const { wins, losses } = playerMatches.reduce(
    (acc, match) => {
      console.log(acc, match);
      const participants: ParticipantType[] =
        typeof match.participants === "string"
          ? JSON.parse(match.participants)
          : (match.participants as ParticipantType[]);

      const playerParticipant = participants.find(
        (p) => p.playerId === playerId.toString(),
      );

      if (playerParticipant) {
        if (playerParticipant.team === match.outcome.toLowerCase()) {
          acc.wins++;
        } else {
          acc.losses++;
        }
      }

      return acc;
    },
    { wins: 0, losses: 0 },
  );
  return { wins, losses };
}
