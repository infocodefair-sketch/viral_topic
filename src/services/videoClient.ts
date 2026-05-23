import type { Video } from "@/mock/videos";

type VideoQuery = {
  page?: number;
  limit?: number;
  category?: string;
  query?: string;
};

type VideoResponse = {
  items: Video[];
  nextPage?: number;
  total: number;
};

export async function getVideos({ page = 0, limit = 24, category, query }: VideoQuery = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (category) {
    params.set("category", category);
  }

  if (query) {
    params.set("query", query);
  }

  const response = await fetch(`/api/videos?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Unable to load videos");
  }

  return (await response.json()) as VideoResponse;
}
