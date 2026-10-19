import { TOOLS } from "@/lib/tools";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, priority: 1 },
    { url: `${SITE.url}/audit/`, lastModified: now, priority: 0.9 },
    ...TOOLS.map((t) => ({ url: `${SITE.url}/tools/${t.slug}/`, lastModified: now, priority: 0.8 })),
  ];
}
