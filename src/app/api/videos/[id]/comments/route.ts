import { NextResponse } from "next/server";
import { addVideoComment, getVideoComments } from "@/services/engagementRepository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comments = await getVideoComments(id);

  return NextResponse.json({ items: comments });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { author?: string; body?: string };
  const author = body.author?.trim() || "Guest Viewer";
  const commentBody = body.body?.trim();

  if (!commentBody) {
    return NextResponse.json({ error: "Comment body is required" }, { status: 400 });
  }

  if (commentBody.length > 1000) {
    return NextResponse.json({ error: "Comment body is too long" }, { status: 400 });
  }

  const comment = await addVideoComment(id, author.slice(0, 80), commentBody);

  return NextResponse.json(comment, { status: 201 });
}

