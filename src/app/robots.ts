import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

/**
 * The three portals and the API rewrites are private; the sign-in pages at `/classroom`,
 * `/office` and `/admin` stay crawlable so a search for "BCSK classroom login" finds them,
 * while everything beneath them is disallowed. Payment and verification pages carry their
 * own `noindex`.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/classroom/", "/office/", "/admin/", "/apply/payment/", "/apply/complete/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
