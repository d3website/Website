"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ImagePlus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MEDIA_GROUPS,
  resolveMedia,
  type MediaMap,
  type MediaSlotDef,
} from "@/lib/media";
import { resetMediaSlot, uploadMediaSlot } from "./actions";

const acceptAttr = (accept: MediaSlotDef["accept"]) =>
  accept === "image"
    ? "image/*"
    : accept === "video"
      ? "video/*"
      : "image/*,video/*";

export function MediaManager({ media }: { media: MediaMap }) {
  const [map, setMap] = useState<MediaMap>(media);
  const [busy, setBusy] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  function upload(slot: string, file: File) {
    setBusy(slot);
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const r = await uploadMediaSlot(slot, fd);
      if (r.ok) {
        setMap((m) => ({ ...m, [slot]: { url: r.url, type: r.type } }));
        toast.success("Media updated.");
      } else {
        toast.error(r.error);
      }
      setBusy(null);
    });
  }

  function reset(slot: string) {
    setBusy(slot);
    startTransition(async () => {
      try {
        await resetMediaSlot(slot);
        setMap((m) => {
          const next = { ...m };
          delete next[slot];
          return next;
        });
        toast.success("Reset to default.");
      } catch {
        toast.error("Could not reset.");
      }
      setBusy(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {MEDIA_GROUPS.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle className="text-base">{group.label}</CardTitle>
            {group.note && <CardDescription>{group.note}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.slots.map((slot) => {
                const resolved = resolveMedia(map, slot.key);
                const isCustom = Boolean(map[slot.key]);
                return (
                  <div
                    key={slot.key}
                    className="flex flex-col gap-2 rounded-lg border p-3"
                  >
                    <div className="relative aspect-video overflow-hidden rounded bg-muted">
                      {resolved.url ? (
                        resolved.type === "video" ? (
                          <video
                            src={resolved.url}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={resolved.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          Empty
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {slot.label}
                      </span>
                      <Badge variant={isCustom ? "default" : "secondary"}>
                        {isCustom ? "Custom" : "Default"}
                      </Badge>
                    </div>

                    <input
                      ref={(el) => {
                        inputs.current[slot.key] = el;
                      }}
                      type="file"
                      accept={acceptAttr(slot.accept)}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) upload(slot.key, f);
                        e.target.value = "";
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={busy === slot.key}
                        onClick={() => inputs.current[slot.key]?.click()}
                      >
                        <ImagePlus className="size-4" />
                        {busy === slot.key ? "Uploading…" : "Upload"}
                      </Button>
                      {isCustom && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label="Reset to default"
                          disabled={busy === slot.key}
                          onClick={() => reset(slot.key)}
                        >
                          <RotateCcw className="size-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {slot.accept === "both"
                        ? "Image or video"
                        : slot.accept === "video"
                          ? "Video"
                          : "Image"}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
