import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("syllabus");
}

export default function Page() {
  return (
    <CmsPage
      slug="syllabus"
      eyebrow="Academic"
    >
      <SideCard />
    </CmsPage>
  );
}
