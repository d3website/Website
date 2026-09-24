"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import * as data from "@/lib/data/admin";

export type ArrivalFormState = { error: string | null };

export async function saveArrival(
  _prev: ArrivalFormState,
  formData: FormData,
): Promise<ArrivalFormState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const isUpdate = id.length > 0;
  const kind = String(formData.get("kind") ?? "catalogue") as
    | "catalogue"
    | "manual";
  const sortRaw = String(formData.get("sort_order") ?? "0").trim();
  const sort_order = Number.isFinite(Number(sortRaw)) ? Number(sortRaw) : 0;
  const is_active = String(formData.get("publish") ?? "true") === "true";

  try {
    if (kind === "catalogue") {
      const entry_id = String(formData.get("entry_id") ?? "").trim();
      if (!entry_id) return { error: "Please choose a catalogue collection." };

      const input = {
        kind: "catalogue" as const,
        entry_id,
        title: null,
        subtitle: null,
        image_url: null,
        sort_order,
        is_active,
      };
      if (isUpdate) await data.updateNewArrival(id, input);
      else await data.insertNewArrival(input);
    } else {
      const title = String(formData.get("title") ?? "").trim();
      const subtitle = String(formData.get("subtitle") ?? "").trim();
      if (!title) return { error: "Title is required." };
      if (!subtitle) return { error: "Subtitle is required." };

      const image_url = String(formData.get("image_url") ?? "").trim();
      if (!isUpdate && !image_url) {
        return { error: "An image is required for a new product card." };
      }

      if (isUpdate) {
        await data.updateNewArrival(id, {
          kind: "manual",
          entry_id: null,
          title,
          subtitle,
          sort_order,
          is_active,
          ...(image_url ? { image_url } : {}),
        });
      } else {
        await data.insertNewArrival({
          kind: "manual",
          entry_id: null,
          title,
          subtitle,
          image_url,
          sort_order,
          is_active,
        });
      }
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save." };
  }

  revalidatePath("/admin/arrivals");
  revalidatePath("/");
  redirect("/admin/arrivals");
}

export async function setArrivalActive(id: string, active: boolean) {
  await requireUser();
  await data.updateNewArrival(id, { is_active: active });
  revalidatePath("/admin/arrivals");
  revalidatePath("/");
}

export async function removeArrival(id: string) {
  await requireUser();
  await data.deleteNewArrival(id);
  revalidatePath("/admin/arrivals");
  revalidatePath("/");
}
