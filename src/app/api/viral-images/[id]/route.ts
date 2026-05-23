import { NextResponse } from "next/server";
import { getViralImage } from "@/services/viralImageRepository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = await getViralImage(id);

  if (!image) {
    return NextResponse.json({ error: "Viral image topic not found" }, { status: 404 });
  }

  return NextResponse.json(image);
}
