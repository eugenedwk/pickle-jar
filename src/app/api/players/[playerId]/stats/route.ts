import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { type ParticipantType } from "~/components/PickleballMatchForm";
import { matches } from "~/server/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string } },
) {
  const { playerId } = params;

  try {
    const playerMatches = await db
      .select()
      .from(matches)
      .where(sql`${matches.participants}::text LIKE ${"%" + playerId + "%"}`);

    const { wins, losses } = playerMatches.reduce(
      (acc, match) => {
        const participants: ParticipantType[] =
          typeof match.participants === "string"
            ? JSON.parse(match.participants)
            : (match.participants as ParticipantType[]);

        const playerTeam = participants.find(
          (p) => p.playerId === playerId,
        )?.team;

        if (playerTeam === match.outcome) {
          acc.wins++;
        } else {
          acc.losses++;
        }

        return acc;
      },
      { wins: 0, losses: 0 },
    );
    return NextResponse.json({ wins, losses });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
