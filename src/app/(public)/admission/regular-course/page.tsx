import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("regular-course");
}

export default function Page() {
  return (
    <CmsPage
      slug="regular-course"
      eyebrow="Admission"
      cta={{ label: "Apply Now", href: "/apply" }}
    >
      <SideCard />
    </CmsPage>
  );
}
