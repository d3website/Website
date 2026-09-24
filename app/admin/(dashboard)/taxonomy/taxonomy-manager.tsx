"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addTaxonomy } from "../actions";
import { SectionsManager, type SectionItem } from "./section-manager";

type Item = { id: string; name: string };
type Kind = "section" | "feature" | "design_type";

function TaxonomyColumn({
  title,
  description,
  kind,
  initialItems,
}: {
  title: string;
  description: string;
  kind: Kind;
  initialItems: Item[];
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();

  function add() {
    const trimmed = name.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const result = await addTaxonomy(kind, trimmed);
      if (result.ok) {
        setItems((prev) =>
          [...prev, result.item].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setName("");
        toast.success(`Added “${result.item.name}”.`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`New ${title.toLowerCase()}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button
            type="button"
            size="icon"
            aria-label={`Add ${title.toLowerCase()}`}
            onClick={add}
            disabled={pending}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet.</p>
        ) : (
          <ul className="flex flex-col divide-y text-sm">
            {items.map((item) => (
              <li key={item.id} className="py-2">
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function TaxonomyManager({
  sections,
  features,
  designTypes,
}: {
  sections: SectionItem[];
  features: Item[];
  designTypes: Item[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-3">
        <SectionsManager initial={sections} />
      </div>
      <TaxonomyColumn
        title="Design types"
        description="Plain, Textured, Floral, Geometric…"
        kind="design_type"
        initialItems={designTypes}
      />
      <TaxonomyColumn
        title="Features"
        description="Pet Friendly, Fire Retardant, Easy to Clean…"
        kind="feature"
        initialItems={features}
      />
    </div>
  );
}
