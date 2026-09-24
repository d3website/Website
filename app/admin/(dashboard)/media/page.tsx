import { listSiteMedia } from "@/lib/data/site-media";
import { MediaManager } from "./media-manager";

export default async function MediaAdminPage() {
  const media = await listSiteMedia();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Manage Media</h1>
        <p className="text-sm text-muted-foreground">
          Upload or reset the images and videos used across the public site.
          Each slot falls back to a bundled placeholder until you upload your
          own. (Catalogue banners live under Taxonomy → Sections; New Arrivals
          images live under Arrivals.)
        </p>
      </div>
      <MediaManager media={media} />
    </div>
  );
}
