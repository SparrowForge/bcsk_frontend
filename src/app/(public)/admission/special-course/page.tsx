import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("special-course");
}

export default function Page() {
  return (
    <CmsPage
      slug="special-course"
      eyebrow="Admission"
      cta={{ label: "Apply Now", href: "/apply" }}
    >
      <SideCard />
    </CmsPage>
  );
}
