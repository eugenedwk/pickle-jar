import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { matches, players } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { playerId: string } },
) {
  const { playerId } = params;

  try {
    const playerProfile = await db.query.players.findFirst({
      where: eq(players.id, playerId),
    });

    const playerMatches = await db
      .select()
      .from(matches)
      .where(
        sql`${matches.participants}::text LIKE ${"%" + playerProfile?.id + "%"}`,
      );
    // console.log("PLAYERS", playerId, playerProfile, playerMatches);
    return NextResponse.json({ playerProfile, matches: playerMatches });
  } catch (error) {
    console.error("Error fetching player data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
