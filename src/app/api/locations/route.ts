import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { locations } from "~/server/db/schema";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

const locationSchema = z.object({
  name: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = locationSchema.parse(body);

    const newLocation = await db
      .insert(locations)
      .values({
        name,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json(newLocation[0], { status: 201 });
  } catch (error) {
    console.error("Error adding location:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const allLocations = await db
      .select({
        id: locations.id,
        name: locations.name,
        createdBy: locations.createdBy,
        createdAt: locations.createdAt,
      })
      .from(locations);
    return NextResponse.json(allLocations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
