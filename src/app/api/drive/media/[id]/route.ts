import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_DRIVE_API_KEY is not configured" }, { status: 500 });
  }

  const headers = new Headers();
  const range = request.headers.get("range");

  if (range) {
    headers.set("Range", range);
  }

  const driveUrl = new URL(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}`);
  driveUrl.searchParams.set("alt", "media");
  driveUrl.searchParams.set("key", apiKey);

  const driveResponse = await fetch(driveUrl, {
    headers,
    cache: "no-store",
  });

  if (!driveResponse.ok && driveResponse.status !== 206) {
    return NextResponse.json({ error: "Unable to load Google Drive media" }, { status: driveResponse.status });
  }

  const responseHeaders = new Headers();

  for (const header of ["content-type", "content-length", "content-range", "accept-ranges"]) {
    const value = driveResponse.headers.get(header);
    if (value) {
      responseHeaders.set(header, value);
    }
  }

  responseHeaders.set("Cache-Control", "public, max-age=3600");

  return new Response(driveResponse.body, {
    status: driveResponse.status,
    headers: responseHeaders,
  });
}
