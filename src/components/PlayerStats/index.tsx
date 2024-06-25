import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { playerStats } from "~/server/db/schema";

export async function getPlayerStats(playerId: string) {
  const stats = await db.query.playerStats.findFirst({
    where: eq(playerStats.playerId, playerId),
  });

  if (!stats) {
    throw new Error("Player stats not found");
  }

  const winPercentage =
    stats.totalMatches > 0 ? (stats.wins / stats.totalMatches) * 100 : 0;
  const avgPointsPerGame =
    stats.totalMatches > 0 ? stats.totalPoints / (stats.totalMatches * 3) : 0;

  return {
    ...stats,
    winPercentage,
    avgPointsPerGame,
  };
}

export async function calculateRankings() {
  const allStats = await db.query.playerStats.findMany({
    with: {
      player: true,
    },
  });

  return allStats
    .map((stat) => ({
      playerId: stat.playerId,
      playerName: stat.player.screenName,
      eloRating: stat.eloRating,
    }))
    .sort((a, b) => b.eloRating - a.eloRating);
}
