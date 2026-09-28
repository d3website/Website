"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ImagePlus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MEDIA_GROUPS,
  MEDIA_SIZE_LIMITS,
  MEDIA_SLOTS,
  resolveMedia,
  type MediaMap,
  type MediaSlotDef,
} from "@/lib/media";
import { uploadToStorage } from "@/lib/upload-client";
import {
  resetMediaSlot,
  setMediaSlot,
  setMediaSlotPoster,
  setMediaSlotText,
} from "./actions";

const acceptAttr = (accept: MediaSlotDef["accept"]) =>
  accept === "image"
    ? "image/*"
    : accept === "video"
      ? "video/*"
      : "image/*,video/*";

type Busy = null | "media" | "poster" | "text";

function SlotCard({
  slot,
  map,
  setMap,
}: {
  slot: MediaSlotDef;
  map: MediaMap;
  setMap: React.Dispatch<React.SetStateAction<MediaMap>>;
}) {
  const resolved = resolveMedia(map, slot.key);
  const isCustom = Boolean(map[slot.key]);
  const isVideo = resolved.type === "video" && Boolean(resolved.url);

  const [busy, setBusy] = useState<Busy>(null);
  const [title, setTitle] = useState(resolved.title ?? "");
  const [subtitle, setSubtitle] = useState(resolved.subtitle ?? "");
  const [, startTransition] = useTransition();

  const mediaInput = useRef<HTMLInputElement>(null);
  const posterInput = useRef<HTMLInputElement>(null);

  function merge(patch: Partial<MediaMap[string]>) {
    setMap((m) => {
      const prev = m[slot.key] ?? { type: "image" as const };
      return { ...m, [slot.key]: { ...prev, ...patch } };
    });
  }

  function uploadMedia(file: File) {
    const isImage = file.type.startsWith("image/");
    const isVid = file.type.startsWith("video/");
    if (!isImage && !isVid) return toast.error("Choose an image or a video.");
    if (slot.accept === "image" && !isImage)
      return toast.error("This slot accepts images only.");
    if (slot.accept === "video" && !isVid)
      return toast.error("This slot accepts videos only.");
    const type: "image" | "video" = isVid ? "video" : "image";
    if (file.size > MEDIA_SIZE_LIMITS[type]) {
      return toast.error(
        type === "video"
          ? "Video must be 50 MB or smaller."
          : "Image must be 5 MB or smaller.",
      );
    }
    setBusy("media");
    startTransition(async () => {
      try {
        const url = await uploadToStorage("media", slot.key, file);
        const r = await setMediaSlot(slot.key, url, type);
        if (r.ok) {
          merge({ url: r.url, type: r.type });
          toast.success("Media updated.");
        } else toast.error(r.error);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed.");
      }
      setBusy(null);
    });
  }

  function uploadPoster(file: File) {
    if (!file.type.startsWith("image/"))
      return toast.error("Thumbnail must be an image.");
    if (file.size > MEDIA_SIZE_LIMITS.image)
      return toast.error("Thumbnail must be 5 MB or smaller.");
    setBusy("poster");
    startTransition(async () => {
      try {
        const url = await uploadToStorage("media", `${slot.key}-poster`, file);
        const r = await setMediaSlotPoster(slot.key, url);
        if (r.ok) {
          merge({ poster: url });
          toast.success("Thumbnail updated.");
        } else toast.error(r.error);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed.");
      }
      setBusy(null);
    });
  }

  function saveText() {
    setBusy("text");
    startTransition(async () => {
      try {
        const r = await setMediaSlotText(slot.key, title, subtitle);
        if (r.ok) {
          merge({ title: title.trim() || null, subtitle: subtitle.trim() || null });
          toast.success("Text updated.");
        } else toast.error(r.error);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed.");
      }
      setBusy(null);
    });
  }

  function reset() {
    setBusy("media");
    startTransition(async () => {
      try {
        await resetMediaSlot(slot.key);
        setMap((m) => {
          const next = { ...m };
          delete next[slot.key];
          return next;
        });
        setTitle(slot.defaultTitle ?? "");
        setSubtitle(slot.defaultSubtitle ?? "");
        toast.success("Reset to default.");
      } catch {
        toast.error("Could not reset.");
      }
      setBusy(null);
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <div className="relative aspect-video overflow-hidden rounded bg-muted">
        {resolved.url ? (
          resolved.type === "video" ? (
            <video
              src={resolved.url}
              poster={resolved.poster}
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
        <span className="truncate text-sm font-medium">{slot.label}</span>
        <Badge variant={isCustom ? "default" : "secondary"}>
          {isCustom ? "Custom" : "Default"}
        </Badge>
      </div>

      {/* Media upload */}
      <input
        ref={mediaInput}
        type="file"
        accept={acceptAttr(slot.accept)}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadMedia(f);
          e.target.value = "";
        }}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={busy !== null}
          onClick={() => mediaInput.current?.click()}
        >
          <ImagePlus className="size-4" />
          {busy === "media" ? "Uploading…" : "Upload"}
        </Button>
        {isCustom && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Reset to default"
            disabled={busy !== null}
            onClick={reset}
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

      {/* Video thumbnail (poster) */}
      {isVideo && (
        <div className="mt-1 flex flex-col gap-1 border-t pt-2">
          <span className="text-[11px] font-medium text-muted-foreground">
            Thumbnail {resolved.poster ? "· set" : "· none"}
          </span>
          <input
            ref={posterInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadPoster(f);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy !== null}
            onClick={() => posterInput.current?.click()}
          >
            <ImagePlus className="size-4" />
            {busy === "poster"
              ? "Uploading…"
              : resolved.poster
                ? "Replace thumbnail"
                : "Add thumbnail"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Shown while the video is paused or loading.
          </p>
        </div>
      )}

      {/* Editable heading / subheading */}
      {slot.editableText && (
        <div className="mt-1 flex flex-col gap-2 border-t pt-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${slot.key}-title`} className="text-[11px]">
              Heading
            </Label>
            <Input
              id={`${slot.key}-title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={slot.defaultTitle}
              className="h-8 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${slot.key}-sub`} className="text-[11px]">
              Subheading
            </Label>
            <Input
              id={`${slot.key}-sub`}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={slot.defaultSubtitle}
              className="h-8 text-sm"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy !== null}
            onClick={saveText}
          >
            {busy === "text" ? "Saving…" : "Save text"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Leave blank to use the default.
          </p>
        </div>
      )}
    </div>
  );
}

export function MediaManager({ media }: { media: MediaMap }) {
  const [map, setMap] = useState<MediaMap>(media);

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
              {group.slots.map((slot) => (
                <SlotCard
                  key={slot.key}
                  slot={MEDIA_SLOTS[slot.key]}
                  map={map}
                  setMap={setMap}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
