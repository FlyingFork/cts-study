"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@/components/icons";

/** Lesson image (06 §2): constrained, never overflows; tap to zoom on mobile. */
export function LessonImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoom]);

  return (
    <figure className="my-4">
      <button
        type="button"
        onClick={() => setZoom(true)}
        className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Zoom image"
      >
        {/* Local public assets with unknown dimensions — plain img is simplest. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="mx-auto max-h-[60vh] w-auto max-w-full rounded-xl border border-border"
        />
      </button>
      {caption && (
        <figcaption className="mt-1.5 text-center text-xs text-fg-muted">{caption}</figcaption>
      )}
      {zoom &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 p-4 backdrop-blur-sm"
            onClick={() => setZoom(false)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-fg"
            >
              <XIcon className="text-xl" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="max-h-full max-w-full rounded-xl" />
          </div>,
          document.body,
        )}
    </figure>
  );
}
