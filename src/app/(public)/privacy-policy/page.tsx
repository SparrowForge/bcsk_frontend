import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("privacy-policy");
}

export default function Page() {
  return (
    <CmsPage
      slug="privacy-policy"
      eyebrow="Legal"
    >
      <SideCard />
    </CmsPage>
  );
}
