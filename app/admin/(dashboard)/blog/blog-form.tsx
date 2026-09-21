"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveBlogPost, type BlogFormState } from "./actions";
import { slugify } from "@/lib/slug";

type InitialPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  is_published: boolean;
};

const initialState: BlogFormState = { error: null };

export function BlogForm({ initial }: { initial?: InitialPost }) {
  const isEdit = Boolean(initial);
  const [state, formAction, pending] = useActionState(saveBlogPost, initialState);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initial?.cover_image_url ?? null,
  );
  const [publish, setPublish] = useState(initial?.is_published ?? false);

  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const effectiveSlug = slug.trim() || slugify(title);

  function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverPreview(
      file ? URL.createObjectURL(file) : initial?.cover_image_url ?? null,
    );
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {isEdit && <input type="hidden" name="id" value={initial!.id} />}

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">
          Title<span className="text-destructive"> *</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">URL slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder={slugify(title) || "auto-generated-from-title"}
        />
        <p className="text-xs text-muted-foreground">
          Will publish at <span className="font-mono">/blogs/{effectiveSlug || "…"}</span>. Leave blank to auto-generate.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={initial?.excerpt ?? ""}
          placeholder="Short summary shown on the blog listing."
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="body">
          Body<span className="text-destructive"> *</span>
        </Label>
        <Textarea
          id="body"
          name="body"
          rows={14}
          defaultValue={initial?.body ?? ""}
          className="font-mono text-sm"
          required
        />
        <p className="text-xs text-muted-foreground">
          Markdown supported (headings, **bold**, lists, [links](url), etc.).
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cover">Cover image</Label>
        <Input
          id="cover"
          name="cover"
          type="file"
          accept="image/*"
          onChange={onCoverChange}
        />
        {coverPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverPreview}
            alt=""
            className="mt-1 h-40 w-full rounded-lg object-cover"
          />
        )}
        <p className="text-xs text-muted-foreground">
          Up to 5 MB.{isEdit && " Leave empty to keep the current image."}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={publish}
          onChange={(e) => setPublish(e.target.checked)}
          className="size-4 rounded border-input"
        />
        Published (visible on the site)
      </label>
      <input type="hidden" name="publish" value={publish ? "true" : "false"} />

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Save post"}
        </Button>
        <Button variant="ghost" nativeButton={false} render={<Link href="/admin/blog" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
