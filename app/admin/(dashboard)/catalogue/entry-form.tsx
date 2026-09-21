"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CatalogueCard } from "@/components/catalogue-card";
import { saveEntry, type EntryFormState } from "../actions";
import { TaxonomySelect } from "./taxonomy-select";
import type {
  DesignType,
  Feature,
  Section,
} from "@/lib/supabase/database.types";

type InitialEntry = {
  id: string;
  collection_name: string;
  section_id: string;
  feature_id: string | null;
  design_type_id: string;
  thumbnail_url: string;
  pdf_url: string;
  is_active: boolean;
};

const initialState: EntryFormState = { error: null };

export function EntryForm({
  sections,
  features,
  designTypes,
  initial,
}: {
  sections: Section[];
  features: Feature[];
  designTypes: DesignType[];
  initial?: InitialEntry;
}) {
  const isEdit = Boolean(initial);
  const [state, formAction, pending] = useActionState(saveEntry, initialState);

  const [collectionName, setCollectionName] = useState(
    initial?.collection_name ?? "",
  );
  const [thumbPreview, setThumbPreview] = useState<string | null>(
    initial?.thumbnail_url ?? null,
  );
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [publish, setPublish] = useState<boolean>(initial?.is_active ?? true);

  // Revoke object URLs we created for the thumbnail preview.
  useEffect(() => {
    return () => {
      if (thumbPreview && thumbPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbPreview);
      }
    };
  }, [thumbPreview]);

  function onThumbChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (thumbPreview?.startsWith("blob:")) URL.revokeObjectURL(thumbPreview);
    setThumbPreview(file ? URL.createObjectURL(file) : initial?.thumbnail_url ?? null);
  }

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]"
    >
      {/* ---- Fields ---- */}
      <div className="flex flex-col gap-5">
        {isEdit && <input type="hidden" name="id" value={initial!.id} />}

        <div className="flex flex-col gap-2">
          <Label htmlFor="collection_name">
            Collection name<span className="text-destructive"> *</span>
          </Label>
          <Input
            id="collection_name"
            name="collection_name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="e.g. Verona Velvet"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TaxonomySelect
            name="section_id"
            label="Section"
            kind="section"
            items={sections}
            defaultValue={initial?.section_id}
            required
          />
          <TaxonomySelect
            name="design_type_id"
            label="Design type"
            kind="design_type"
            items={designTypes}
            defaultValue={initial?.design_type_id}
            required
          />
        </div>

        <TaxonomySelect
          name="feature_id"
          label="Feature"
          kind="feature"
          items={features}
          defaultValue={initial?.feature_id ?? undefined}
          includeNone
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="thumbnail">
            Thumbnail image
            {!isEdit && <span className="text-destructive"> *</span>}
          </Label>
          <Input
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/*"
            onChange={onThumbChange}
          />
          <p className="text-xs text-muted-foreground">
            JPG/PNG/WebP, up to 5 MB.
            {isEdit && " Leave empty to keep the current image."}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="pdf">
            PDF e-catalogue
            {!isEdit && <span className="text-destructive"> *</span>}
          </Label>
          <Input
            id="pdf"
            name="pdf"
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfName(e.target.files?.[0]?.name ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            {pdfName
              ? `Selected: ${pdfName}`
              : isEdit
                ? "Leave empty to keep the current PDF."
                : "PDF, up to 25 MB."}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
            className="size-4 rounded border-input"
          />
          Publish to site (visible immediately)
        </label>
        <input type="hidden" name="publish" value={publish ? "true" : "false"} />

        {state.error && (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Save changes" : "Save entry"}
          </Button>
          <Button variant="ghost" render={<Link href="/admin" />}>
            Cancel
          </Button>
        </div>
      </div>

      {/* ---- Live preview ---- */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Preview</p>
        <p className="text-xs text-muted-foreground">
          How this card appears on the public catalogue page.
        </p>
        <div className="max-w-[300px]">
          <CatalogueCard
            thumbnailUrl={thumbPreview}
            collectionName={collectionName}
          />
        </div>
        {!publish && (
          <p className="text-xs text-muted-foreground">
            Currently set to <strong>hidden</strong> — it won’t show on the site
            until published.
          </p>
        )}
      </div>
    </form>
  );
}
