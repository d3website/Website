import type { Metadata } from "next";
import { CatalogueSection } from "../_catalogue/catalogue-section";

export const metadata: Metadata = {
  title: "All Collections",
  description:
    "Browse all D3 Dynamic furnishing fabric collections across curtains, upholstery and outdoor fabric.",
};

const DESCRIPTION =
  "Every published fabric collection across all sections. Use the tabs to focus on a section, or filter by design type.";

export default function CataloguePage() {
  return <CatalogueSection description={DESCRIPTION} />;
}
