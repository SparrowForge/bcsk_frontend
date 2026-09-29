import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("class-schedule");
}

export default function Page() {
  return (
    <CmsPage
      slug="class-schedule"
      eyebrow="Academic"
    >
      <SideCard />
    </CmsPage>
  );
}
