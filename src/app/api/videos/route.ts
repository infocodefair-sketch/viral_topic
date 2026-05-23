import { NextResponse } from "next/server";
import { getVideos } from "@/services/videoRepository";

export const dynamic = "force-dynamic";

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const parsePage = (value: string | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parsePage(url.searchParams.get("page"));
  const limit = parsePositiveInt(url.searchParams.get("limit"), 24);
  const category = url.searchParams.get("category") ?? undefined;
  const query = url.searchParams.get("query") ?? undefined;

  const videos = await getVideos({ page, limit, category, query });

  return NextResponse.json(videos);
}
