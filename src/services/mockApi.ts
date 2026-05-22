import { categories, playlists, videos } from "@/mock/videos";

const wait = (ms = 240) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getVideos({ page = 0, limit = 24, category, query }: {
  page?: number;
  limit?: number;
  category?: string;
  query?: string;
} = {}) {
  await wait();
  let filtered = videos;
  if (category && category !== "Trending") {
    filtered = filtered.filter((video) => video.category.toLowerCase() === category.toLowerCase());
  }
  if (query) {
    const needle = query.toLowerCase();
    filtered = filtered.filter((video) =>
      [video.title, video.creator.name, video.category, ...video.tags].join(" ").toLowerCase().includes(needle),
    );
  }
  const start = page * limit;
  return {
    items: filtered.slice(start, start + limit),
    nextPage: start + limit < filtered.length ? page + 1 : undefined,
    total: filtered.length,
  };
}

export async function getVideo(id: string) {
  await wait(120);
  return videos.find((video) => video.id === id) ?? videos[0];
}

export async function getSuggested(id?: string) {
  await wait(160);
  const offset = id ? Number(id.replace("video-", "")) % 20 : 0;
  return videos.slice(offset, offset + 12);
}

export async function getPlaylist(id: string) {
  await wait(160);
  return playlists.find((playlist) => playlist.id === id) ?? playlists[0];
}

export function getCategories() {
  return categories;
}
