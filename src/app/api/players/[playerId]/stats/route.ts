import { NextResponse, type NextRequest } from "next/server";
import { getPlayerStats } from "~/server/services/playerStats";

export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string } },
) {
  const { playerId } = params;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const stats = await getPlayerStats(playerId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching player stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
