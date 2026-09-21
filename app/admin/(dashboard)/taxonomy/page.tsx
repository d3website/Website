import { listDesignTypes, listFeatures, listSections } from "@/lib/data/admin";
import { TaxonomyManager } from "./taxonomy-manager";

export default async function TaxonomyPage() {
  const [sections, features, designTypes] = await Promise.all([
    listSections(),
    listFeatures(),
    listDesignTypes(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Taxonomy</h1>
        <p className="text-sm text-muted-foreground">
          Manage the options available when creating catalogue entries. New
          options can also be added inline from the entry form.
        </p>
      </div>
      <TaxonomyManager
        sections={sections}
        features={features}
        designTypes={designTypes}
      />
    </div>
  );
}
