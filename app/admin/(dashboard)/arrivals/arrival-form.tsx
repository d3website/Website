"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadToStorage } from "@/lib/upload-client";
import { saveArrival, type ArrivalFormState } from "./actions";

type EntryOption = { id: string; label: string };

type InitialArrival = {
  id: string;
  kind: "catalogue" | "manual";
  entry_id: string | null;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const initialState: ArrivalFormState = { error: null };

export function ArrivalForm({
  entries,
  initial,
}: {
  entries: EntryOption[];
  initial?: InitialArrival;
}) {
  const isEdit = Boolean(initial);
  const [state, formAction, pending] = useActionState(saveArrival, initialState);

  const [kind, setKind] = useState<"catalogue" | "manual">(
    initial?.kind ?? "catalogue",
  );
  const [entryId, setEntryId] = useState<string>(initial?.entry_id ?? "");
  const [publish, setPublish] = useState<boolean>(initial?.is_active ?? true);
  const [uploading, setUploading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(
    initial?.image_url ?? null,
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setClientError(null);
    const fd = new FormData(e.currentTarget);

    if (kind === "manual") {
      const file = fd.get("image");
      if (file instanceof File && file.size > 0) {
        if (!file.type.startsWith("image/")) {
          setClientError("Choose an image.");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setClientError("Image must be 5 MB or smaller.");
          return;
        }
        setUploading(true);
        try {
          const url = await uploadToStorage(
            "thumbnails",
            String(fd.get("title") || "arrival"),
            file,
          );
          fd.set("image_url", url);
        } catch (err) {
          setClientError(err instanceof Error ? err.message : "Upload failed.");
          setUploading(false);
          return;
        }
        setUploading(false);
      }
    }
    fd.delete("image");
    formAction(fd);
  }

  useEffect(() => {
    return () => {
      if (imgPreview?.startsWith("blob:")) URL.revokeObjectURL(imgPreview);
    };
  }, [imgPreview]);

  function onImgChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (imgPreview?.startsWith("blob:")) URL.revokeObjectURL(imgPreview);
    setImgPreview(file ? URL.createObjectURL(file) : initial?.image_url ?? null);
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-5">
      {isEdit && <input type="hidden" name="id" value={initial!.id} />}
      <input type="hidden" name="kind" value={kind} />

      {/* Card type */}
      <div className="flex flex-col gap-2">
        <Label>Card type</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setKind("catalogue")}
            className={`rounded-md border px-4 py-2 text-sm ${
              kind === "catalogue"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            From catalogue
          </button>
          <button
            type="button"
            onClick={() => setKind("manual")}
            className={`rounded-md border px-4 py-2 text-sm ${
              kind === "manual"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            New product (manual)
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          From catalogue: title, type, image and PDF come from the selected
          collection (button = Download PDF). Manual: enter your own (button =
          Contact us).
        </p>
      </div>

      {kind === "catalogue" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="entry_id">Catalogue collection</Label>
          <Select value={entryId} onValueChange={(v) => setEntryId(v ?? "")}>
            <SelectTrigger id="entry_id">
              <SelectValue placeholder="Choose a collection" />
            </SelectTrigger>
            <SelectContent>
              {entries.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="entry_id" value={entryId} />
          {entries.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No catalogue entries yet — add some under Catalogue first.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initial?.title ?? ""}
              placeholder="e.g. Aurora Velvet"
              required={kind === "manual"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              name="subtitle"
              defaultValue={initial?.subtitle ?? ""}
              placeholder="e.g. New Upholstery Collection"
              required={kind === "manual"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={onImgChange}
            />
            {imgPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgPreview}
                alt=""
                className="mt-1 h-40 w-full rounded-lg object-cover"
              />
            )}
            <p className="text-xs text-muted-foreground">
              Up to 5 MB.{isEdit && " Leave empty to keep the current image."}
            </p>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="sort_order">Sort order</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={initial?.sort_order ?? 0}
          className="w-32"
        />
        <p className="text-xs text-muted-foreground">
          Lower numbers show first.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={publish}
          onChange={(e) => setPublish(e.target.checked)}
          className="size-4 rounded border-input"
        />
        Show on the homepage
      </label>
      <input type="hidden" name="publish" value={publish ? "true" : "false"} />

      {(clientError || state.error) && (
        <p className="text-sm text-destructive" role="alert">
          {clientError || state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending || uploading}>
          {uploading
            ? "Uploading…"
            : pending
              ? "Saving…"
              : isEdit
                ? "Save changes"
                : "Save arrival"}
        </Button>
        <Button variant="ghost" nativeButton={false} render={<Link href="/admin/arrivals" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
