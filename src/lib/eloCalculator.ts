// import { db } from "~/server/db";
// import { matches } from "~/server/db/schema";

// const K_FACTOR = 32; // This determines how much the rating can change in a single match
export const INITIAL_RATING = 1500;

// function calculateEloRating(
//   playerRating: number,
//   opponentRating: number,
//   playerWon: boolean,
// ): number {
//   const expectedScore =
//     1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
//   const actualScore = playerWon ? 1 : 0;
//   return Math.round(playerRating + K_FACTOR * (actualScore - expectedScore));
// }

// export async function updateEloRatings(matchId: number) {
//   const match = (await db.query.matches.findFirst({
//     where: eq(matches.id, matchId),
//     with: {
//       player: {
//         with: {
//           stats: true,
//         },
//       },
//       partner: {
//         with: {
//           stats: true,
//         },
//       },
//       opponent1: {
//         with: {
//           stats: true,
//         },
//       },
//       opponent2: {
//         with: {
//           stats: true,
//         },
//       },
//     },
//   })) as NonNullable<typeof match>;

//   if (!match) throw new Error("Match not found");

//   const teamAAvgRating =
//     (match.player.stats.eloRating + match.partner.stats.eloRating) / 2;
//   const teamBAvgRating =
//     (match.opponent1.stats.eloRating + match.opponent2.stats.eloRating) / 2;

//   const teamAWon = match.outcome === "win";

//   const newTeamARating = calculateEloRating(
//     teamAAvgRating,
//     teamBAvgRating,
//     teamAWon,
//   );
//   const newTeamBRating = calculateEloRating(
//     teamBAvgRating,
//     teamAAvgRating,
//     !teamAWon,
//   );

//   const ratingDiffA = newTeamARating - teamAAvgRating;
//   const ratingDiffB = newTeamBRating - teamBAvgRating;

//   // Update player ratings
//   await db.transaction(async (tx) => {
//     await tx
//       .update(playerStats)
//       .set({ eloRating: match.player.stats.eloRating + ratingDiffA })
//       .where(eq(playerStats.playerId, match.player.id));
//     await tx
//       .update(playerStats)
//       .set({ eloRating: match.partner.stats.eloRating + ratingDiffA })
//       .where(eq(playerStats.playerId, match.partner.id));
//     await tx
//       .update(playerStats)
//       .set({ eloRating: match.opponent1.stats.eloRating + ratingDiffB })
//       .where(eq(playerStats.playerId, match.opponent1.id));
//     await tx
//       .update(playerStats)
//       .set({ eloRating: match.opponent2.stats.eloRating + ratingDiffB })
//       .where(eq(playerStats.playerId, match.opponent2.id));
//   });
// }

// // Call this function after each match is recorded or updated
// // updateEloRatings(newMatchId);
