// interface MatchFormData {
//   homePlayer1Id: string;
//   homePlayer2Id?: string;
//   awayPlayer1Id: string;
//   awayPlayer2Id?: string;
// }

// const handleSubmit = async (data: MatchFormData) => {
//   const today = new Date();

//   const participants = [
//     // Team 1 (Home)
//     {
//       playerId: data.homePlayer1Id || undefined,
//       teamId: 1,
//       position: 1,
//     },
//     {
//       playerId: data.homePlayer2Id || undefined,
//       teamId: 1,
//       position: 2,
//     },
//     // Team 2 (Away)
//     {
//       playerId: data.awayPlayer1Id || undefined,
//       teamId: 2,
//       position: 1,
//     },
//     {
//       playerId: data.awayPlayer2Id || undefined,
//       teamId: 2,
//       position: 2,
//     },
//   ];

//   const matchData = {
//     startTime: today,
//     endTime: today,
//     courtId: "court-id", // Add actual court ID from form
//     participants,
//   };

//   const response = await fetch("/api/matches", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(matchData),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to create match");
//   }

//   return response.json();
// };
