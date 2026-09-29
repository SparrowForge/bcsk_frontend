import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("re-admission");
}

export default function Page() {
  return (
    <CmsPage
      slug="re-admission"
      eyebrow="Admission"
    >
      <SideCard />
    </CmsPage>
  );
}
