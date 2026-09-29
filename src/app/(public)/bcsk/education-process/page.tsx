import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("education-process");
}

export default function Page() {
  return (
    <CmsPage
      slug="education-process"
      eyebrow="BCSK"
    >
      <SideCard />
    </CmsPage>
  );
}
