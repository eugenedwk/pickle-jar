import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { matchId } = (await request.json()) as { matchId: string };
    const updatedMatch = await db
      .update(matches)
      .set({ verified: true })
      .where(eq(matches.id, matchId))
      .returning();

    return NextResponse.json(updatedMatch[0], { status: 200 });
  } catch (error) {
    console.error("Error verifying match:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
