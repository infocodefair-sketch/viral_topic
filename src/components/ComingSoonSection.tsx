import type { LucideIcon } from "lucide-react";
import { CalendarClock } from "lucide-react";
import Image from "next/image";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

export function ComingSoonSection({ eyebrow, title, description, Icon }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
        <div className="relative aspect-video bg-black">
          <Image src="/live-coming-soon.svg" alt={`${title} coming soon`} fill priority className="object-cover" />
        </div>
      </div>
      <div className="glass flex flex-col justify-center rounded-lg p-5">
        <span className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-orange-500 text-black">
          <Icon className="size-6" />
        </span>
        <p className="text-sm font-bold uppercase text-orange-300">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">{description}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-neutral-300">
          <CalendarClock className="size-4 text-orange-300" />
          Stay tuned for the next drop.
        </div>
      </div>
    </div>
  );
}
