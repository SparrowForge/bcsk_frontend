import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("administration");
}

export default function Page() {
  return (
    <CmsPage
      slug="administration"
      eyebrow="BCSK"
    >
      <SideCard />
    </CmsPage>
  );
}
