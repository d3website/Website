import type { Metadata } from "next";
import { CatalogueSection } from "../_catalogue/catalogue-section";

export const metadata: Metadata = {
  title: "Curtain Fabrics",
  description:
    "Browse D3 Dynamic's curtain fabric collections — thousands of styles for living rooms, bedrooms and more. Download e-catalogues.",
};

const DESCRIPTION =
  "Choose from thousands of curtain fabric collections for every room. Filter by design type and download the full e-catalogue for any collection.";

export default function CurtainsPage() {
  return <CatalogueSection slug="curtains" description={DESCRIPTION} />;
}
