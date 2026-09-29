import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("academic-calendar");
}

export default function Page() {
  return (
    <CmsPage
      slug="academic-calendar"
      eyebrow="Academic"
    >
      <SideCard />
    </CmsPage>
  );
}
