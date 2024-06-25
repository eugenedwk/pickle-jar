import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";

export async function GET() {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  try {
    const session = await getServerAuthSession();

    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user) {
      console.log("Session has no user");
      return NextResponse.json(
        { error: "No user in session" },
        { status: 401 },
      );
    }

    if (!session.user.id) {
      console.log("User has no id");
      return NextResponse.json({ error: "User has no ID" }, { status: 401 });
    }

    const player = await db.query.players.findFirst({
      where: (players, { eq }) => eq(players.userId, session.user.id),
    });

    if (!player) {
      return NextResponse.json({ hasProfile: false }, { status: 200 });
    }

    // Omit sensitive information if necessary
    const { ...safePlayerData } = player;
    return NextResponse.json(
      {
        hasProfile: true,
        playerData: safePlayerData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking player profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
