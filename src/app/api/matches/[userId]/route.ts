import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;

  try {
    const userMatches = await db
      .select()
      .from(matches)
      .where(sql`${matches.participants}::text LIKE ${"%" + userId + "%"}`);

    return NextResponse.json(userMatches, { status: 200 });
  } catch (error) {
    console.error("Error fetching user matches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
