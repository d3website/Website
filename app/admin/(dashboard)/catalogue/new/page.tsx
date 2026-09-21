import { listDesignTypes, listFeatures, listSections } from "@/lib/data/admin";
import { EntryForm } from "../entry-form";

export default async function NewEntryPage() {
  const [sections, features, designTypes] = await Promise.all([
    listSections(),
    listFeatures(),
    listDesignTypes(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Add catalogue entry</h1>
        <p className="text-sm text-muted-foreground">
          Upload a collection and publish it to the public catalogue.
        </p>
      </div>
      <EntryForm
        sections={sections}
        features={features}
        designTypes={designTypes}
      />
    </div>
  );
}
