"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-36 rounded-lg border border-white/10 bg-black/30" />,
});

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
};

export function RichTextEditor({ value, onChange, placeholder, compact = false }: Props) {
  const modules = useMemo(
    () => ({
      toolbar: compact
        ? [
            [{ header: [2, 3, false] }],
            ["bold", "italic", "underline"],
            ["link"],
            ["clean"],
          ]
        : [
            [{ header: [2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "link"],
            ["clean"],
          ],
      clipboard: {
        matchVisual: false,
      },
    }),
    [compact],
  );

  const formats = useMemo(() => ["header", "bold", "italic", "underline", "strike", "list", "blockquote", "link"], []);

  return (
    <div className={compact ? "quill-shell quill-shell-compact" : "quill-shell"}>
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} placeholder={placeholder} />
    </div>
  );
}
