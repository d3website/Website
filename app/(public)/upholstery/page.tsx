import type { Metadata } from "next";
import { CatalogueSection } from "../_catalogue/catalogue-section";

export const metadata: Metadata = {
  title: "Upholstery Fabrics",
  description:
    "Browse D3 Dynamic's upholstery and sofa fabric collections. Filter by design type and download e-catalogues.",
};

const DESCRIPTION =
  "Sofa and upholstery fabrics in a wide range of designs and finishes. Filter by design type and download the full e-catalogue for any collection.";

export default function UpholsteryPage() {
  return <CatalogueSection slug="upholstery" description={DESCRIPTION} />;
}
