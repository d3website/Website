import type { Metadata } from "next";
import { getService } from "@/lib/content";
import { ServicePageView } from "@/components/service-page";

const service = getService("leather-finish-sofa-cloth")!;

export const metadata: Metadata = {
  title: { absolute: service.metaTitle },
  description: service.metaDescription,
};

export default function Page() {
  return <ServicePageView service={service} />;
}
