import type { MetadataRoute } from "next";
import { cms } from "@/services";
import { siteUrl } from "@/lib/env";
import { ABOUT_TOPICS } from "./(public)/courses/abacus/content";

/**
 * Regenerated so a newly published news item appears without a deploy. In practice the news
 * read's own 60s cache sets the pace; this hour is the ceiling when that read failed at build
 * time and registered nothing.
 */
export const revalidate = 3600;

/**
 * The public pages worth a search result. Portals, sign-in and password screens, search
 * results, payment and verification pages are left out on purpose — the last four are also
 * `noindex` in their own metadata.
 */
const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/bcsk/about-us", priority: 0.9 },
  { path: "/admission/process", priority: 0.9 },
  { path: "/admission/tuition-fee", priority: 0.9 },
  { path: "/apply", priority: 0.9 },
  { path: "/contact", priority: 0.8 },
  { path: "/enquiry", priority: 0.7 },
  { path: "/bcsk/education-process", priority: 0.7 },
  { path: "/bcsk/administration", priority: 0.6 },
  { path: "/bcsk/teachers", priority: 0.7 },
  { path: "/bcsk/governing-body", priority: 0.6 },
  { path: "/bcsk/regional-representatives", priority: 0.5 },
  { path: "/bcsk/message-chairman", priority: 0.5 },
  { path: "/bcsk/message-principal", priority: 0.5 },
  { path: "/bcsk/our-community", priority: 0.5 },
  { path: "/admission/regular-course", priority: 0.8 },
  { path: "/admission/special-course", priority: 0.8 },
  { path: "/admission/quran-department", priority: 0.7 },
  { path: "/admission/re-admission", priority: 0.6 },
  { path: "/admission/brochure", priority: 0.6 },
  { path: "/academic/curriculum", priority: 0.7 },
  { path: "/academic/syllabus", priority: 0.6 },
  { path: "/academic/book-list", priority: 0.6 },
  { path: "/academic/calendar", priority: 0.6 },
  { path: "/academic/class-schedule", priority: 0.6 },
  { path: "/courses/deen", priority: 0.8 },
  { path: "/courses/ielts-for-kids", priority: 0.8 },
  { path: "/courses/abacus", priority: 0.8 },
  { path: "/courses/abacus/about", priority: 0.6 },
  { path: "/courses/abacus/syllabus", priority: 0.6 },
  { path: "/courses/abacus/books", priority: 0.5 },
  { path: "/courses/abacus/online-class", priority: 0.5 },
  { path: "/courses/abacus/fun", priority: 0.5 },
  { path: "/events/news", priority: 0.7 },
  { path: "/events/seminars", priority: 0.6 },
  { path: "/events/gallery", priority: 0.6 },
  { path: "/student-corner", priority: 0.5 },
  { path: "/privacy-policy", priority: 0.3 },
  { path: "/refund-policy", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages: MetadataRoute.Sitemap = [
    ...ROUTES.map(({ path, priority }) => ({ url: `${base}${path === "/" ? "" : path}`, priority })),
    ...ABOUT_TOPICS.map((t) => ({ url: `${base}/courses/abacus/about/${t.slug}`, priority: 0.4 })),
  ];

  // News is the only part that needs the API. If it is unreachable — as in a build with no
  // environment — the static pages still ship and the next revalidation adds the articles.
  let news: Awaited<ReturnType<typeof cms.news>> = [];
  try {
    news = await cms.news(200);
  } catch {
    news = [];
  }
  return [
    ...pages,
    ...news.map((n) => ({ url: `${base}/events/news/${n.id}`, lastModified: n.date, priority: 0.5 })),
  ];
}
