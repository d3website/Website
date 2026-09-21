"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addTaxonomy } from "../actions";

type Item = { id: string; name: string };
type Kind = "section" | "feature" | "design_type";

const NONE = "none";

export function TaxonomySelect({
  name,
  label,
  kind,
  items: initialItems,
  defaultValue,
  includeNone = false,
  required = false,
}: {
  name: string;
  label: string;
  kind: Kind;
  items: Item[];
  defaultValue?: string | null;
  includeNone?: boolean;
  required?: boolean;
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [value, setValue] = useState<string>(
    defaultValue ?? (includeNone ? NONE : ""),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const result = await addTaxonomy(kind, trimmed);
      if (result.ok) {
        setItems((prev) =>
          [...prev, result.item].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setValue(result.item.id);
        setNewName("");
        setDialogOpen(false);
        toast.success(`Added “${result.item.name}”.`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={(v) => setValue(v ?? "")}>
          <SelectTrigger id={name} className="flex-1">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {includeNone && <SelectItem value={NONE}>None</SelectItem>}
            {items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Add new ${label.toLowerCase()}`}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Value submitted with the form */}
      <input type="hidden" name={name} value={value} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {label.toLowerCase()}</DialogTitle>
            <DialogDescription>
              Create a new {label.toLowerCase()} option. It becomes available
              across the admin panel immediately.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`New ${label.toLowerCase()} name`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            autoFocus
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd} disabled={pending}>
              {pending ? "Adding…" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
