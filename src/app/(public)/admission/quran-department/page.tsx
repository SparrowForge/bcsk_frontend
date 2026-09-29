import { CmsPage } from "@/components/site/CmsPage";
import { SideCard } from "@/components/site/SideCard";
import { cmsMetadata } from "@/lib/seo";

export function generateMetadata() {
  return cmsMetadata("quran-department");
}

export default function Page() {
  return (
    <CmsPage
      slug="quran-department"
      eyebrow="Admission"
      cta={{ label: "Apply Now", href: "/apply" }}
    >
      <SideCard />
    </CmsPage>
  );
}
