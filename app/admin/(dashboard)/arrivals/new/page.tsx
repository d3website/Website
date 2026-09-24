import { listEntries } from "@/lib/data/admin";
import { ArrivalForm } from "../arrival-form";

export default async function NewArrivalPage() {
  const entries = await listEntries();
  const options = entries.map((e) => ({
    id: e.id,
    label: `${e.collection_name}${e.section ? ` — ${e.section.name}` : ""}`,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Add arrival</h1>
        <p className="text-sm text-muted-foreground">
          Feature a catalogue collection or a new product on the homepage.
        </p>
      </div>
      <ArrivalForm entries={options} />
    </div>
  );
}
