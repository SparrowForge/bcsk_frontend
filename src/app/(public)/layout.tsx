import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      {/* data-auto-reveal: every public page animates its blocks in on scroll, both ways,
          without hand-tagging — see the bootstrap in `lib/motion.ts`. */}
      <main className="flex-1" data-auto-reveal>{children}</main>
      <Footer />
    </div>
  );
}
