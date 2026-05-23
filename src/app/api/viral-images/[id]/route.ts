import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { deleteViralImage, getViralImage, updateViralImage } from "@/services/viralImageRepository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = await getViralImage(id);

  if (!image) {
    return NextResponse.json({ error: "Viral image topic not found" }, { status: 404 });
  }

  return NextResponse.json(image);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ error: "Multipart form data is required" }, { status: 400 });
  }

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const titleHtml = formData.get("titleHtml")?.toString().trim();
  const descriptionHtml = formData.get("descriptionHtml")?.toString().trim();
  const files = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  if (files.length > 12) {
    return NextResponse.json({ error: "Upload up to 12 images at a time" }, { status: 400 });
  }

  if (files.some((file) => !file.type.startsWith("image/"))) {
    return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
  }

  if (files.some((file) => file.size > 8 * 1024 * 1024)) {
    return NextResponse.json({ error: "Each image must be smaller than 8MB" }, { status: 400 });
  }

  const image = await updateViralImage(id, {
    title: title.slice(0, 120),
    description: description.slice(0, 600),
    titleHtml: titleHtml?.slice(0, 3000),
    descriptionHtml: descriptionHtml?.slice(0, 8000),
    files,
  });

  if (!image) {
    return NextResponse.json({ error: "Viral image topic not found" }, { status: 404 });
  }

  return NextResponse.json(image);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteViralImage(id);

  if (!deleted) {
    return NextResponse.json({ error: "Viral image topic not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
