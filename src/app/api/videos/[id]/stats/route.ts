import { NextResponse } from "next/server";
import { getVideoStats, incrementVideoStat } from "@/services/engagementRepository";

export const dynamic = "force-dynamic";

const allowedActions = new Set(["likes", "dislikes", "shares", "saves"]);

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stats = await getVideoStats(id);

  return NextResponse.json(stats);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { action?: string };
  const action = body.action;

  if (!action || !allowedActions.has(action)) {
    return NextResponse.json({ error: "Unsupported stat action" }, { status: 400 });
  }

  const stats = await incrementVideoStat(id, action as "likes" | "dislikes" | "shares" | "saves");

  return NextResponse.json(stats);
}

