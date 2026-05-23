"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, MessageSquare, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { Video } from "@/mock/videos";
import { formatViews } from "@/utils/format";
import { CommentCard } from "./CommentCard";

type VideoStats = {
  videoId: string;
  likes: number;
  dislikes: number;
  shares: number;
  saves: number;
  comments: number;
};

type VideoComment = {
  id: string;
  videoId: string;
  author: string;
  body: string;
  createdAt: string;
};

const defaultStats = (videoId: string): VideoStats => ({
  videoId,
  likes: 0,
  dislikes: 0,
  shares: 0,
  saves: 0,
  comments: 0,
});

async function fetchStats(videoId: string) {
  const response = await fetch(`/api/videos/${encodeURIComponent(videoId)}/stats`);
  if (!response.ok) throw new Error("Unable to load stats");
  return (await response.json()) as VideoStats;
}

async function updateStat(videoId: string, action: "likes" | "dislikes" | "shares" | "saves") {
  const response = await fetch(`/api/videos/${encodeURIComponent(videoId)}/stats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) throw new Error("Unable to update stats");
  return (await response.json()) as VideoStats;
}

async function fetchComments(videoId: string) {
  const response = await fetch(`/api/videos/${encodeURIComponent(videoId)}/comments`);
  if (!response.ok) throw new Error("Unable to load comments");
  return (await response.json()) as { items: VideoComment[] };
}

async function createComment(videoId: string, author: string, body: string) {
  const response = await fetch(`/api/videos/${encodeURIComponent(videoId)}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, body }),
  });

  if (!response.ok) throw new Error("Unable to post comment");
  return (await response.json()) as VideoComment;
}

export function WatchEngagement({ video }: { video: Video }) {
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const statsKey = useMemo(() => ["video-stats", video.id], [video.id]);
  const commentsKey = useMemo(() => ["video-comments", video.id], [video.id]);

  const statsQuery = useQuery({
    queryKey: statsKey,
    queryFn: () => fetchStats(video.id),
    initialData: defaultStats(video.id),
  });

  const commentsQuery = useQuery({
    queryKey: commentsKey,
    queryFn: () => fetchComments(video.id),
  });

  const statMutation = useMutation({
    mutationFn: (action: "likes" | "dislikes" | "shares" | "saves") => updateStat(video.id, action),
    onSuccess: (stats) => queryClient.setQueryData(statsKey, stats),
  });

  const commentMutation = useMutation({
    mutationFn: () => createComment(video.id, author, comment),
    onSuccess: (newComment) => {
      setComment("");
      queryClient.setQueryData(commentsKey, (current: { items: VideoComment[] } | undefined) => ({
        items: [newComment, ...(current?.items ?? [])],
      }));
      queryClient.setQueryData(statsKey, (current: VideoStats | undefined) => ({
        ...(current ?? defaultStats(video.id)),
        comments: (current?.comments ?? 0) + 1,
      }));
    },
  });

  const stats = statsQuery.data ?? defaultStats(video.id);
  const comments = commentsQuery.data?.items ?? [];
  const commentCount = Math.max(stats.comments, comments.length);

  async function handleShare() {
    await statMutation.mutateAsync("shares");

    if (navigator.share) {
      await navigator.share({ title: video.title, url: window.location.href }).catch(() => undefined);
      return;
    }

    await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!comment.trim() || commentMutation.isPending) return;
    commentMutation.mutate();
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => statMutation.mutate("likes")} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">
          <ThumbsUp className="mr-2 inline size-4" />
          {formatViews(video.likes + stats.likes)}
        </button>
        {video.kind !== "image" ? (
          <button onClick={() => statMutation.mutate("dislikes")} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">
            <ThumbsDown className="mr-2 inline size-4" />
            {formatViews(stats.dislikes)}
          </button>
        ) : null}
        <button onClick={handleShare} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">
          <Share2 className="mr-2 inline size-4" />
          {formatViews(stats.shares)}
        </button>
        <button onClick={() => statMutation.mutate("saves")} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">
          <Bookmark className="mr-2 inline size-4" />
          {formatViews(stats.saves)}
        </button>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <MessageSquare className="size-5 text-orange-300" />
          Comments {commentCount ? <span className="text-sm font-normal text-neutral-500">{formatViews(commentCount)}</span> : null}
        </h2>
        <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Your name"
              className="h-11 rounded-lg border border-white/10 bg-black/30 px-3 text-sm outline-none focus:border-orange-400"
            />
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Add a comment"
              className="h-11 rounded-lg border border-white/10 bg-black/30 px-3 text-sm outline-none focus:border-orange-400"
            />
            <button disabled={!comment.trim() || commentMutation.isPending} className="h-11 rounded-lg bg-orange-500 px-5 text-sm font-black text-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50">
              Post
            </button>
          </div>
        </form>
        {commentsQuery.isLoading ? <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-neutral-400">Loading comments...</div> : null}
        {commentsQuery.isError ? <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">Comments are unavailable right now.</div> : null}
        {comments.map((item, index) => (
          <CommentCard key={item.id} index={index} author={item.author} body={item.body} createdAt={item.createdAt} />
        ))}
        {!commentsQuery.isLoading && comments.length === 0 ? <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-neutral-400">No comments yet.</div> : null}
      </section>
    </>
  );
}
