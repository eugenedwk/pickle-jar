import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { players, users } from "~/server/db/schema";
import { getServerAuthSession } from "~/server/auth";

const PlayerSchema = z.object({
  screenName: z.string().min(1, "Username is required"),
  realName: z.string().optional(),
  skillLevel: z.string().optional(),
  paddleBrand: z.string().optional(),
  paddlePreference: z.string().optional(),
  plays: z.string().optional(),
  homeCourt: z.string().optional(),
});

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const players = await db
      .select({ id: users.id, name: users.name })
      .from(users);
    return NextResponse.json(players, { status: 200 });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json({ error: `Unauthorized` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await request.json();
    const validatedData = PlayerSchema.parse(body);

    const newPlayer = await db
      .insert(players)
      .values({
        ...validatedData,
        userId: userId,
      })
      .returning();

    return NextResponse.json(newPlayer[0], { status: 201 });
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
