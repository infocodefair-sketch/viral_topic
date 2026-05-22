import Image from "next/image";

export function CommentCard({ index }: { index: number }) {
  return (
    <article className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <Image src={`https://i.pravatar.cc/80?img=${index + 20}`} alt="" width={40} height={40} className="size-10 rounded-full" />
      <div>
        <p className="text-sm font-semibold">Viewer {index + 1} <span className="ml-2 text-xs font-normal text-neutral-500">{index + 2} hours ago</span></p>
        <p className="mt-1 text-sm leading-6 text-neutral-300">Clean layout, fast preview behavior, and the queue feels easy to scan on mobile.</p>
      </div>
    </article>
  );
}
