import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";
import { z } from "zod";

const ParticipantSchema = z.object({
  playerId: z.string().uuid(),
  team: z.enum(["home", "away"]),
});

const MatchSchema = z.object({
  gameType: z.string(),
  date: z.string().transform((str) => new Date(str)),
  time: z.string(),
  location: z.string(),
  outcome: z.string(),
  scores: z.array(
    z.object({
      round: z.number(),
      home: z.number(),
      away: z.number(),
    }),
  ),
  participants: z.array(ParticipantSchema),
});

export async function POST(request: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await request.json();
    const validatedData = MatchSchema.parse(body);

    // Ensure participants is serialized as JSON
    const matchData = {
      ...validatedData,
      participants: JSON.stringify(validatedData.participants),
      scores: JSON.stringify(validatedData.scores),
    };

    const newMatch = await db.insert(matches).values(matchData).returning();

    return NextResponse.json(newMatch[0], { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const allMatches = await db.select().from(matches);

    const parsedMatches = allMatches.map((match) => ({
      ...match,
      participants: JSON.parse(match.participants as string),
      scores: JSON.parse(match.scores as string),
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
