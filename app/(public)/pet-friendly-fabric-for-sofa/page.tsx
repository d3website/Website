import type { Metadata } from "next";
import { getService } from "@/lib/content";
import { ServicePageView } from "@/components/service-page";

const service = getService("pet-friendly-fabric-for-sofa")!;

export const metadata: Metadata = {
  title: { absolute: service.metaTitle },
  description: service.metaDescription,
};

export default function Page() {
  return <ServicePageView service={service} />;
}
