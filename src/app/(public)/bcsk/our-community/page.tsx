import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("our-community");
}

export default function Page() {
  return (
    <CmsPage
      slug="our-community"
      eyebrow="BCSK"
    >
      <SideCard />
    </CmsPage>
  );
}
