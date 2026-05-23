"use client";

import { Check, Copy, MessageCircle, Send, Share2, X } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  open: boolean;
  title: string;
  url: string;
  onClose: () => void;
};

const siteText = "Check out Viral Topic - fresh videos, viral image topics, and media discovery built for fast browsing.";

export function ShareModal({ open, title, url, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const message = useMemo(() => `${siteText}\n\n${title}\n${url}`, [title, url]);
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(url);
  const options = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedMessage}`, Icon: MessageCircle },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: Share2 },
    { label: "Text", href: `sms:?&body=${encodedMessage}`, Icon: Send },
  ];

  if (!open) return null;

  async function copyShareText() {
    await navigator.clipboard?.writeText(message).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/75 px-4 py-6 backdrop-blur-sm">
      <section className="glass w-full max-w-md rounded-lg p-5 shadow-2xl shadow-black/60" role="dialog" aria-modal="true" aria-labelledby="share-title">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-orange-500 text-black">
            <Share2 className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 id="share-title" className="text-xl font-black">Share this video</h2>
            <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{title}</p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-full p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white" aria-label="Close share options">
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {options.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-neutral-100 transition hover:border-orange-400/50 hover:bg-white/10"
            >
              <option.Icon className="size-5 text-orange-300" />
              {option.label}
            </a>
          ))}
          <button
            onClick={copyShareText}
            className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-neutral-100 transition hover:border-orange-400/50 hover:bg-white/10"
          >
            {copied ? <Check className="size-5 text-orange-300" /> : <Copy className="size-5 text-orange-300" />}
            {copied ? "Copied" : "Copy text"}
          </button>
        </div>

        <div className="mt-4 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-5 text-neutral-400">{message}</div>
      </section>
    </div>
  );
}

