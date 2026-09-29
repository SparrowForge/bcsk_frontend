import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("about-us");
}

export default function Page() {
  return (
    <CmsPage
      slug="about-us"
      eyebrow="BCSK"
    >
      <SideCard />
    </CmsPage>
  );
}
