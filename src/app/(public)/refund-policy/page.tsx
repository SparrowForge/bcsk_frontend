import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("refund-policy");
}

export default function Page() {
  return (
    <CmsPage
      slug="refund-policy"
      eyebrow="Legal"
    >
      <SideCard />
    </CmsPage>
  );
}
