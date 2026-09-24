import { notFound } from "next/navigation";
import { getNewArrival, listEntries } from "@/lib/data/admin";
import { ArrivalForm } from "../../arrival-form";

export default async function EditArrivalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [arrival, entries] = await Promise.all([getNewArrival(id), listEntries()]);
  if (!arrival) notFound();

  const options = entries.map((e) => ({
    id: e.id,
    label: `${e.collection_name}${e.section ? ` — ${e.section.name}` : ""}`,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Edit arrival</h1>
      </div>
      <ArrivalForm
        entries={options}
        initial={{
          id: arrival.id,
          kind: arrival.kind === "manual" ? "manual" : "catalogue",
          entry_id: arrival.entry_id,
          title: arrival.title,
          subtitle: arrival.subtitle,
          image_url: arrival.image_url,
          sort_order: arrival.sort_order,
          is_active: arrival.is_active,
        }}
      />
    </div>
  );
}
