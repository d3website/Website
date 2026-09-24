"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { uploadToStorage } from "@/lib/upload-client";
import { addTaxonomy } from "../actions";
import { removeSectionHero, setSectionHeroUrl } from "./section-actions";

export type SectionItem = {
  id: string;
  name: string;
  hero_image_url: string | null;
};

export function SectionsManager({ initial }: { initial: SectionItem[] }) {
  const [items, setItems] = useState<SectionItem[]>(initial);
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  function add() {
    const trimmed = name.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const r = await addTaxonomy("section", trimmed);
      if (r.ok) {
        setItems((prev) =>
          [...prev, { ...r.item, hero_image_url: null }].sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        );
        setName("");
        toast.success(`Added “${r.item.name}”.`);
      } else {
        toast.error(r.error);
      }
    });
  }

  function upload(id: string, file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }
    setBusyId(id);
    startTransition(async () => {
      try {
        const url = await uploadToStorage("thumbnails", "section-hero", file);
        await setSectionHeroUrl(id, url);
        setItems((prev) =>
          prev.map((s) => (s.id === id ? { ...s, hero_image_url: url } : s)),
        );
        toast.success("Banner updated.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed.");
      }
      setBusyId(null);
    });
  }

  function clearImage(id: string) {
    setBusyId(id);
    startTransition(async () => {
      try {
        await removeSectionHero(id);
        setItems((prev) =>
          prev.map((s) => (s.id === id ? { ...s, hero_image_url: null } : s)),
        );
        toast.success("Banner removed.");
      } catch {
        toast.error("Could not remove.");
      }
      setBusyId(null);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sections</CardTitle>
        <CardDescription>
          Catalogue pages (Curtains, Upholstery…). Set a banner image shown
          behind each section&apos;s page header.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New section"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button type="button" size="icon" aria-label="Add section" onClick={add} disabled={pending}>
            <Plus className="size-4" />
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet.</p>
        ) : (
          <ul className="flex flex-col divide-y">
            {items.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-muted">
                  {s.hero_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.hero_image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span className="flex-1 text-sm font-medium">{s.name}</span>
                <input
                  ref={(el) => {
                    fileInputs.current[s.id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(s.id, f);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busyId === s.id}
                  onClick={() => fileInputs.current[s.id]?.click()}
                >
                  <ImagePlus className="size-4" />
                  {s.hero_image_url ? "Change" : "Banner"}
                </Button>
                {s.hero_image_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove banner"
                    disabled={busyId === s.id}
                    onClick={() => clearImage(s.id)}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
