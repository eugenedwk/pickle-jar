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
    let playerProfile = await db.query.players.findFirst({
      where: eq(players.id, playerId),
    });

    if (!playerProfile) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    const playerMatches = await db
      .select()
      .from(matches)
      .where(
        sql`${matches.participants}::text LIKE ${"%" + playerProfile?.id + "%"}`,
      );
    // console.log("PLAYERS", playerId, playerProfile, playerMatches);
    playerProfile = {
      ...(playerProfile ?? {}),
      homeCourt: playerProfile?.homeCourt
        ? JSON.parse(playerProfile.homeCourt as string)
        : null,
    } as const;
    console.log(playerProfile);
    return NextResponse.json({ playerProfile, matches: playerMatches });
  } catch (error) {
    console.error("Error fetching player data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
