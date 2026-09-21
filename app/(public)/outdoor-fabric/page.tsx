import type { Metadata } from "next";
import { CatalogueSection } from "../_catalogue/catalogue-section";

export const metadata: Metadata = {
  title: "Outdoor Fabrics",
  description:
    "Browse D3 Dynamic's outdoor fabric collections — durable, weather-ready furnishing fabrics. Filter by design and download e-catalogues.",
};

const DESCRIPTION =
  "Durable, weather-ready fabrics for outdoor furnishing. Filter by design type and download the full e-catalogue for any collection.";

export default function OutdoorFabricPage() {
  return <CatalogueSection slug="outdoor-fabric" description={DESCRIPTION} />;
}
