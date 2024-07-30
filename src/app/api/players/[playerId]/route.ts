import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { players, matches } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { playerId: string } },
) {
  try {
    const playerId = params.playerId;

    // Fetch player profile
    const playerProfile = await db.query.players.findFirst({
      where: eq(players.id, playerId),
    });

    if (!playerProfile) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Fetch player matches
    const playerMatches = await db
      .select()
      .from(matches)
      .where(sql`${matches.participants}::text LIKE ${"%" + playerId + "%"}`);

    // Construct the response object
    const response = {
      playerProfile,
      matches: playerMatches,
    };

    // Return the response as JSON
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching player data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
