import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("message-chairman");
}

export default function Page() {
  return (
    <CmsPage
      slug="message-chairman"
      eyebrow="BCSK"
    >
      <SideCard />
    </CmsPage>
  );
}
