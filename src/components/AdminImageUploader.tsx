"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import type { ViralImage } from "@/services/viralImageRepository";

async function fetchViralImages() {
  const response = await fetch("/api/viral-images?limit=12");
  if (!response.ok) throw new Error("Unable to load images");
  return (await response.json()) as { items: ViralImage[] };
}

async function uploadImage(formData: FormData) {
  const response = await fetch("/api/viral-images", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Unable to upload image");
  }

  return (await response.json()) as ViralImage;
}

export function AdminImageUploader() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState("");

  const imagesQuery = useQuery({
    queryKey: ["viral-images"],
    queryFn: fetchViralImages,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (image) => {
      setTitle("");
      setDescription("");
      setFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setError("");
      queryClient.setQueryData(["viral-images"], (current: { items: ViralImage[] } | undefined) => ({
        items: [image, ...(current?.items ?? [])],
      }));
    },
    onError: (uploadError: Error) => setError(uploadError.message),
  });

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const nextFiles = Array.from(event.target.files ?? []);
    setFiles(nextFiles);
    setPreviewUrls(nextFiles.map((file) => URL.createObjectURL(file)));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || files.length === 0) {
      setError("Add a title, description, and at least one image.");
      return;
    }

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    files.forEach((file) => formData.append("images", file));
    uploadMutation.mutate(formData);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,460px)_1fr]">
      <form onSubmit={handleSubmit} className="glass h-fit rounded-lg p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-orange-500 text-black">
            <ImagePlus className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-black">Image admin</h1>
            <p className="text-sm text-neutral-400">Publish viral image cards to the homepage.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-neutral-300">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm outline-none transition focus:border-orange-400"
              placeholder="Weekend edit is taking off"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-neutral-300">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={600}
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none transition focus:border-orange-400"
              placeholder="Add a short caption or context for this image."
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-neutral-300">Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="mt-2 block w-full rounded-lg border border-dashed border-white/15 bg-black/30 px-3 py-3 text-sm text-neutral-300 file:mr-3 file:rounded-md file:border-0 file:bg-orange-500 file:px-3 file:py-2 file:text-sm file:font-black file:text-black"
            />
            <span className="mt-2 block text-xs text-neutral-500">Upload up to 12 images for one topic.</span>
          </label>

          {previewUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previewUrls.map((previewUrl, index) => (
                <div key={previewUrl} className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black">
                  <Image src={previewUrl} alt={`Preview ${index + 1}`} fill className="object-cover" unoptimized />
                  {index === 0 ? <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-1 text-[10px] font-black text-black">Cover</span> : null}
                </div>
              ))}
            </div>
          ) : null}

          {error ? <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}

          <button
            disabled={uploadMutation.isPending}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-orange-500 px-5 text-sm font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadMutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <UploadCloud className="mr-2 size-4" />}
            Publish topic
          </button>
        </div>
      </form>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase text-orange-300">Published</p>
            <h2 className="mt-1 text-2xl font-black">Recent viral topics</h2>
          </div>
        </div>
        {imagesQuery.isLoading ? <div className="glass rounded-lg p-5 text-sm text-neutral-400">Loading uploads...</div> : null}
        {imagesQuery.isError ? <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">Unable to load uploaded images.</div> : null}
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {imagesQuery.data?.items.map((image) => (
            <article key={image.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
              <div className="relative aspect-video bg-black">
                <Image src={image.coverImageUrl} alt={image.title} fill sizes="(max-width: 1280px) 50vw, 33vw" className="object-cover" />
                <span className="absolute right-2 top-2 rounded bg-black/75 px-2 py-1 text-[10px] font-bold text-white">{image.imageCount} images</span>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-bold">{image.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-neutral-400">{image.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
