import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("book-list");
}

export default function Page() {
  return (
    <CmsPage
      slug="book-list"
      eyebrow="Academic"
    >
      <SideCard />
    </CmsPage>
  );
}
