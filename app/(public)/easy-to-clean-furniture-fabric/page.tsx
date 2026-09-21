import type { Metadata } from "next";
import { getService } from "@/lib/content";
import { ServicePageView } from "@/components/service-page";

const service = getService("easy-to-clean-furniture-fabric")!;

export const metadata: Metadata = {
  title: { absolute: service.metaTitle },
  description: service.metaDescription,
};

export default function Page() {
  return <ServicePageView service={service} />;
}
