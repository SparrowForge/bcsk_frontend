import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("message-principal");
}

export default function Page() {
  return (
    <CmsPage
      slug="message-principal"
      eyebrow="BCSK"
    >
      <SideCard />
    </CmsPage>
  );
}
