import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";
import { createMatchSchema } from "~/lib/schema";
import { z } from "zod";

const MatchSchema = z.object({
  gameType: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.object({
    id: z.string(),
    name: z.string(),
  }),
  outcome: z.string(),
  scores: z
    .array(
      z.object({
        round: z.number(),
        home: z.number(),
        away: z.number(),
      }),
    )
    .optional(),
  participants: z.array(
    z.object({
      playerId: z.string(),
      playerName: z.string(),
      team: z.string(),
    }),
  ),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = MatchSchema.parse(json);

    const { date, location, gameType, outcome, scores, participants } = body;

    const [match] = await db
      .insert(matches)
      .values({
        date: new Date(date),
        time: body.time,
        location: {
          id: location.id,
          name: location.name,
        },
        gameType,
        scores: scores ?? [],
        participants: participants.map((participant) => ({
          playerId: participant.playerId,
          team: participant.team,
          playerName: participant.playerName,
        })),
        outcome,
        verified: false,
      })
      .returning();

    if (!match) {
      throw new Error("Failed to create match");
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const allMatches = await db.select().from(matches);
    const parsedMatches = allMatches.map((match) => ({
      ...match,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      participants: match.participants,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      scores: match.scores,
      location: match.location,
    }));
    return NextResponse.json(parsedMatches, { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
