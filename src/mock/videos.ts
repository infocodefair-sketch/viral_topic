export type Creator = {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  verified: boolean;
};

export type Video = {
  id: string;
  title: string;
  creator: Creator;
  thumbnail: string;
  preview: string;
  kind?: "video" | "image";
  streamUrl?: string;
  sourceMimeType?: string;
  driveFileId?: string;
  fileSize?: number;
  duration: string;
  views: number;
  likes: number;
  uploadedAt: string;
  category: string;
  tags: string[];
  hd: boolean;
  trending: boolean;
  description: string;
};

export type Playlist = {
  id: string;
  title: string;
  description: string;
  videos: Video[];
  updatedAt: string;
};

export const categories = [
  "Trending",
  "Drive Videos",
  "Drive Images",
  "Featured",
  "Studio",
  "Live",
  "Short Clips",
  "Premium",
  "New",
  "Popular",
  "Creators",
  "HD",
  "VR",
  "Interviews",
];

const titleStarts = [
  "After Dark City",
  "Neon Lounge",
  "Private Studio",
  "Velvet Hour",
  "Midnight Edit",
  "Creator Spotlight",
  "Late Night Cut",
  "Soft Focus",
  "Urban Heat",
  "Weekend Session",
  "Golden Room",
  "Backstage Mood",
];

const titleEnds = [
  "cinematic teaser",
  "exclusive scene",
  "creator compilation",
  "high contrast episode",
  "slow burn preview",
  "editor pick",
  "new release",
  "extended trailer",
  "behind the scenes",
  "featured drop",
];

const creators: Creator[] = Array.from({ length: 18 }, (_, index) => ({
  id: `creator-${index + 1}`,
  name: [
    "Nova Studio",
    "Amber House",
    "Velvet Media",
    "Orbit Clips",
    "Afterglow",
    "Metro Lens",
  ][index % 6] + ` ${index + 1}`,
  avatar: `https://i.pravatar.cc/96?img=${(index % 60) + 1}`,
  followers: 12000 + index * 8431,
  verified: index % 3 !== 0,
}));

const imageIds = [
  1011, 1015, 1025, 1033, 1035, 1040, 1041, 1043, 1050, 1057, 1062, 1066,
  1068, 1074, 1080, 1081, 1083, 1084, 1089, 109, 110, 119, 122, 128, 130,
  133, 146, 152, 164, 177, 188, 190, 201, 219, 225, 239, 250, 275, 292,
  301,
];

const makeDate = (index: number) => {
  const date = new Date();
  date.setDate(date.getDate() - index);
  return date.toISOString();
};

export const videos: Video[] = Array.from({ length: 128 }, (_, index) => {
  const category = categories[(index + 2) % categories.length];
  const creator = creators[index % creators.length];
  const image = imageIds[index % imageIds.length];
  return {
    id: `video-${index + 1}`,
    title: `${titleStarts[index % titleStarts.length]} ${titleEnds[(index * 3) % titleEnds.length]}`,
    creator,
    thumbnail: `https://picsum.photos/id/${image}/640/360`,
    preview: `https://picsum.photos/id/${image}/640/360?blur=1`,
    duration: `${6 + (index % 32)}:${String((index * 7) % 60).padStart(2, "0")}`,
    views: 18000 + index * 9241,
    likes: 700 + index * 331,
    uploadedAt: makeDate(index + 1),
    category,
    tags: [category, index % 2 ? "verified" : "editor-pick", index % 5 ? "hd" : "trending"],
    hd: index % 4 !== 0,
    trending: index % 7 === 0,
    description:
      "A polished placeholder video entry for frontend demonstration only. No real adult media is included.",
  };
});

export const playlists: Playlist[] = [
  {
    id: "playlist-1",
    title: "Tonight's Queue",
    description: "A high-retention recommendation set based on mock watch history.",
    videos: videos.slice(0, 14),
    updatedAt: "Updated 12 minutes ago",
  },
  {
    id: "playlist-2",
    title: "Creator Picks",
    description: "Curated channel uploads and studio highlights.",
    videos: videos.slice(24, 40),
    updatedAt: "Updated today",
  },
];
