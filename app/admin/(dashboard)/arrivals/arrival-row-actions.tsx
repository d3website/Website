"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { removeArrival, setArrivalActive } from "./actions";

export function ArrivalRowActions({
  id,
  title,
  isActive,
}: {
  id: string;
  title: string;
  isActive: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      try {
        await setArrivalActive(id, !isActive);
        toast.success(isActive ? "Hidden from homepage." : "Shown on homepage.");
      } catch {
        toast.error("Could not update.");
      }
    });
  }

  function doDelete() {
    startTransition(async () => {
      try {
        await removeArrival(id);
        toast.success("Arrival removed.");
      } catch {
        toast.error("Could not remove.");
      } finally {
        setConfirmOpen(false);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" aria-label="Actions" />}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/admin/arrivals/${id}/edit`} />}>
            Modify
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggle} disabled={pending}>
            {isActive ? "Hide" : "Show"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove “{title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the card from the homepage New Arrivals. The catalogue
              entry itself is not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                doDelete();
              }}
              disabled={pending}
            >
              {pending ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
