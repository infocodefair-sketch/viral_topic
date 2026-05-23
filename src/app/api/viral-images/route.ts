import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { createViralImage, getViralImages } from "@/services/viralImageRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 8);
  const images = await getViralImages(Number.isFinite(limit) ? limit : 8);

  return NextResponse.json({ items: images });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ error: "Multipart form data is required" }, { status: 400 });
  }

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const files = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);
  const legacyFile = formData.get("image");
  if (legacyFile instanceof File && legacyFile.size > 0) {
    files.push(legacyFile);
  }

  if (!title || !description || files.length === 0) {
    return NextResponse.json({ error: "Title, description, and at least one image are required" }, { status: 400 });
  }

  if (files.length > 12) {
    return NextResponse.json({ error: "Upload up to 12 images for one topic" }, { status: 400 });
  }

  if (files.some((file) => !file.type.startsWith("image/"))) {
    return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
  }

  if (files.some((file) => file.size > 8 * 1024 * 1024)) {
    return NextResponse.json({ error: "Each image must be smaller than 8MB" }, { status: 400 });
  }

  const image = await createViralImage({
    title: title.slice(0, 120),
    description: description.slice(0, 600),
    files,
  });

  return NextResponse.json(image, { status: 201 });
}
