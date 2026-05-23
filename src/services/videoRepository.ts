import { videos, type Creator, type Video } from "@/mock/videos";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  videoMediaMetadata?: {
    width?: number;
    height?: number;
    durationMillis?: string;
  };
};

type DriveListResponse = {
  files?: DriveFile[];
  nextPageToken?: string;
  error?: {
    message?: string;
  };
};

type VideoQuery = {
  page?: number;
  limit?: number;
  category?: string;
  query?: string;
};

const driveCreator: Creator = {
  id: "google-drive",
  name: "Google Drive",
  avatar: "https://i.pravatar.cc/96?img=12",
  followers: 1,
  verified: true,
};

const hashNumber = (value: string) =>
  [...value].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);

const formatDuration = (durationMillis?: string) => {
  const totalSeconds = Math.max(0, Math.round(Number(durationMillis ?? 0) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const cleanTitle = (name: string) => name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();

const makeThumbnail = (file: DriveFile) => {
  if (file.thumbnailLink) {
    return file.thumbnailLink.replace(/=s\d+$/, "=s640");
  }

  return `/api/drive/media/${file.id}`;
};

const mapDriveFileToVideo = (file: DriveFile, index: number): Video => {
  const isImage = file.mimeType.startsWith("image/");
  const seed = hashNumber(file.id);

  return {
    id: file.id,
    title: cleanTitle(file.name) || `Drive media ${index + 1}`,
    creator: driveCreator,
    thumbnail: makeThumbnail(file),
    preview: makeThumbnail(file),
    kind: isImage ? "image" : "video",
    streamUrl: `/api/drive/media/${file.id}`,
    sourceMimeType: file.mimeType,
    driveFileId: file.id,
    fileSize: file.size ? Number(file.size) : undefined,
    duration: isImage ? "Image" : formatDuration(file.videoMediaMetadata?.durationMillis),
    views: 1000 + (seed % 90000),
    likes: 100 + (seed % 9000),
    uploadedAt: file.createdTime ?? file.modifiedTime ?? new Date().toISOString(),
    category: isImage ? "Drive Images" : "Drive Videos",
    tags: ["google-drive", isImage ? "image" : "video", file.mimeType.split("/")[1] ?? "media"],
    hd: (file.videoMediaMetadata?.width ?? 0) >= 1280 || isImage,
    trending: index < 6,
    description: `Fetched from Google Drive${file.webViewLink ? `: ${file.webViewLink}` : "."}`,
  };
};

async function listDriveMedia() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!folderId || !apiKey) {
    return [];
  }

  const files: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      key: apiKey,
      pageSize: "100",
      fields:
        "nextPageToken,files(id,name,mimeType,thumbnailLink,webViewLink,size,createdTime,modifiedTime,videoMediaMetadata,imageMediaMetadata)",
      q: `'${folderId}' in parents and trashed=false`,
      orderBy: "createdTime desc",
    });

    if (pageToken) {
      params.set("pageToken", pageToken);
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
      cache: "no-store",
    });
    const data = (await response.json()) as DriveListResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? "Unable to fetch Google Drive media");
    }

    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return files
    .filter((file) => file.mimeType.startsWith("video/") || file.mimeType.startsWith("image/"))
    .map(mapDriveFileToVideo);
}

async function getRepositoryVideos() {
  try {
    const driveVideos = await listDriveMedia();
    return driveVideos.length > 0 ? driveVideos : videos;
  } catch (error) {
    console.error(error);
    return videos;
  }
}

function filterVideos(items: Video[], category?: string, query?: string) {
  let filtered = items;

  if (category && category !== "Trending") {
    filtered = filtered.filter((video) => video.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    const needle = query.toLowerCase();
    filtered = filtered.filter((video) =>
      [video.title, video.creator.name, video.category, ...video.tags].join(" ").toLowerCase().includes(needle),
    );
  }

  return filtered;
}

export async function getVideos({ page = 0, limit = 24, category, query }: VideoQuery = {}) {
  const repositoryVideos = await getRepositoryVideos();
  const filtered = filterVideos(repositoryVideos, category, query);
  const start = page * limit;

  return {
    items: filtered.slice(start, start + limit),
    nextPage: start + limit < filtered.length ? page + 1 : undefined,
    total: filtered.length,
  };
}

export async function getVideo(id: string) {
  const repositoryVideos = await getRepositoryVideos();
  return repositoryVideos.find((video) => video.id === id) ?? repositoryVideos[0] ?? videos[0];
}

export async function getSuggested(id?: string) {
  const repositoryVideos = await getRepositoryVideos();
  const currentIndex = Math.max(0, repositoryVideos.findIndex((video) => video.id === id));
  const suggested = repositoryVideos.filter((video) => video.id !== id);

  return suggested.slice(currentIndex, currentIndex + 12).concat(suggested.slice(0, 12)).slice(0, 12);
}
