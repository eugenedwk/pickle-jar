import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { players } from "~/server/db/schema";
import { getPlayerStats } from "~/server/services/playerStats";

export async function GET() {
  try {
    // Fetch all players
    const playersList = await db
      .select({
        id: players.id,
        userId: players.userId,
        realName: players.realName,
        screenName: players.screenName,
        hideRealName: players.hideRealName,
      })
      .from(players);

    // Fetch stats for each player
    const playersWithStats = await Promise.all(
      playersList.map(async (player) => {
        const stats = await getPlayerStats(player.id);
        return {
          ...player,
          ...stats,
          displayName: player.hideRealName
            ? player.screenName
            : player.realName,
        };
      }),
    );

    // Calculate rankings
    const rankings = playersWithStats
      .sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0))
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));

    return NextResponse.json(rankings);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 },
    );
  }
}
