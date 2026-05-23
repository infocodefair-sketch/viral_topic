import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type VideoStats = {
  videoId: string;
  likes: number;
  dislikes: number;
  shares: number;
  saves: number;
  comments: number;
};

export type VideoComment = {
  id: string;
  videoId: string;
  author: string;
  body: string;
  createdAt: string;
};

type CommentDocument = {
  _id: ObjectId;
  videoId: string;
  author: string;
  body: string;
  createdAt: Date;
};

const defaultStats = (videoId: string): VideoStats => ({
  videoId,
  likes: 0,
  dislikes: 0,
  shares: 0,
  saves: 0,
  comments: 0,
});

const toComment = (comment: CommentDocument): VideoComment => ({
  id: comment._id.toString(),
  videoId: comment.videoId,
  author: comment.author,
  body: comment.body,
  createdAt: comment.createdAt.toISOString(),
});

export async function getVideoStats(videoId: string): Promise<VideoStats> {
  const db = await getDb();
  const stats = await db.collection<VideoStats>("video_stats").findOne({ videoId }, { projection: { _id: 0 } });

  return { ...defaultStats(videoId), ...stats };
}

export async function incrementVideoStat(videoId: string, field: "likes" | "dislikes" | "shares" | "saves") {
  const db = await getDb();

  await db.collection("video_stats").updateOne(
    { videoId },
    {
      $setOnInsert: { videoId },
      $inc: { [field]: 1 },
    },
    { upsert: true },
  );

  return getVideoStats(videoId);
}

export async function getVideoComments(videoId: string) {
  const db = await getDb();
  const comments = await db
    .collection<CommentDocument>("video_comments")
    .find({ videoId })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return comments.map(toComment);
}

export async function addVideoComment(videoId: string, author: string, body: string) {
  const db = await getDb();
  const comment = {
    videoId,
    author,
    body,
    createdAt: new Date(),
  };

  const result = await db.collection<Omit<CommentDocument, "_id">>("video_comments").insertOne(comment);
  await db.collection("video_stats").updateOne(
    { videoId },
    {
      $setOnInsert: { videoId },
      $inc: { comments: 1 },
    },
    { upsert: true },
  );

  return toComment({ _id: result.insertedId, ...comment });
}
