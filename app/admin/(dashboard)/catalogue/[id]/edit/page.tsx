import { notFound } from "next/navigation";
import {
  getEntry,
  listDesignTypes,
  listFeatures,
  listSections,
} from "@/lib/data/admin";
import { EntryForm } from "../../entry-form";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [entry, sections, features, designTypes] = await Promise.all([
    getEntry(id),
    listSections(),
    listFeatures(),
    listDesignTypes(),
  ]);

  if (!entry) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Edit catalogue entry</h1>
        <p className="text-sm text-muted-foreground">{entry.collection_name}</p>
      </div>
      <EntryForm
        sections={sections}
        features={features}
        designTypes={designTypes}
        initial={{
          id: entry.id,
          collection_name: entry.collection_name,
          section_id: entry.section_id,
          feature_id: entry.feature_id,
          design_type_id: entry.design_type_id,
          thumbnail_url: entry.thumbnail_url,
          pdf_url: entry.pdf_url,
          is_active: entry.is_active,
        }}
      />
    </div>
  );
}
