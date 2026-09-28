import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/services";
import { getLang } from "@/lib/i18n";
import { SCHOOL } from "@/lib/constants";
import { PrayerBoard } from "./PrayerBoard";
import {
  COURSES,
  KIDS_ZONE,
  DAILY_QURAN,
  DAILY_HADITH,
  DAILY_DUA,
  DAILY_MASALA,
  dailyIndex,
  pick,
  type Lang,
  type Text,
} from "./content";

export const metadata: Metadata = { title: "Deen — Qur'an & Islamic Studies" };

const L = {
  eyebrow: { bn: "দ্বীন · কুরআন ও ইসলামিক শিক্ষা", en: "Deen · Qur'an & Islamic Studies" },
  school: { bn: "বাংলাদেশ কমিউনিটি স্কুল, দক্ষিণ কোরিয়া", en: "Bangladesh Community School, South Korea" },
  tagline: { bn: "জাগতিক ও দ্বীনি শিক্ষার সমন্বিত প্রয়াস", en: "Worldly and Islamic education, brought together" },
  apply: { bn: "ভর্তি আবেদন করুন", en: "Apply for Deen classes" },
  courses: { bn: "আমাদের কোর্স সমূহ", en: "Our Courses" },
  learnMore: { bn: "আরো জানুন", en: "Learn more" },
  applyCourse: { bn: "এই কোর্সে ভর্তি হোন", en: "Apply for this course" },
  prayer: { bn: "নামাজ", en: "Prayer times" },
  ibadah: { bn: "ইবাদাহ কর্নার", en: "Ibadah Corner" },
  dailyQuran: { bn: "ডেইলি কুরআন", en: "Daily Qur'an" },
  dailyHadith: { bn: "ডেইলি হাদিস", en: "Daily Hadith" },
  duaSunnah: { bn: "দোয়া ও সুন্নাহ", en: "Dua & Sunnah" },
  fiqh: { bn: "ফিকহ (মাসআলা)", en: "Fiqh (a ruling)" },
  meaning: { bn: "অর্থ", en: "Meaning" },
  lesson: { bn: "শিক্ষণীয়", en: "Lesson" },
  tafsir: { bn: "তাফসীর", en: "Note" },
  dua: { bn: "দোয়া", en: "Dua" },
  sunnah: { bn: "সুন্নাহ", en: "Sunnah" },
  question: { bn: "প্রশ্ন", en: "Question" },
  answer: { bn: "উত্তর", en: "Answer" },
  changesDaily: { bn: "প্রতিদিন নতুন", en: "Changes every day" },
  community: { bn: "কমিউনিটি", en: "Community" },
  joinUs: { bn: "যোগ দিন আমাদের সামাজিক প্ল্যাটফর্মে:", en: "Join us on our social platforms:" },
  kids: { bn: "কিডস জোন", en: "Kids Zone" },
  join: { bn: "যোগ দিন", en: "Join" },
  koie: { bn: "KOIE — কোরিয়া অনলাইন ইসলামিক এডুকেশন", en: "KOIE — Korea Online Islamic Education" },
  programs: { bn: "কুরআন প্রোগ্রাম ও লাইভ ক্লাস", en: "Qur'an programs & live classes" },
  schedule: { bn: "ক্লাসের সময়সূচি", en: "Class schedule" },
  track: { bn: "প্রোগ্রাম", en: "Track" },
  day: { bn: "দিন", en: "Day" },
  time: { bn: "সময়", en: "Time" },
  teacher: { bn: "শিক্ষক", en: "Instructor" },
  klass: { bn: "ক্লাস", en: "Class" },
  joinZoom: { bn: "Zoom-এ যোগ দিন", en: "Join Zoom" },
  enrolledOnly: { bn: "শুধু ভর্তিকৃত শিক্ষার্থী", en: "Enrolled students" },
  resources: { bn: "শিক্ষা উপকরণ", en: "Learning resources" },
  resourcesText: {
    bn: "তেলাওয়াতের অডিও, তাজবীদ গাইড ও প্রিন্টযোগ্য দোয়ার শিট ভর্তিকৃত শিক্ষার্থীরা ক্লাসরুম পোর্টালে পায়।",
    en: "Recitation audio, Tajweed guides and printable dua sheets are provided to enrolled students in the Classroom portal.",
  },
  openResources: { bn: "আমার উপকরণ দেখুন →", en: "Open my resources →" },
  login: { bn: "লগ ইন করুন →", en: "Log in to access →" },
  hifzTrack: { bn: "হিফজ অগ্রগতি", en: "Hifz progress tracking" },
  hifzTrackText: {
    bn: "প্রত্যেক হিফজ শিক্ষার্থীর মুখস্থ সূরা ও পারা অনুযায়ী ট্র্যাক করা হয়। শিক্ষার্থী ও অভিভাবক ক্লাসরুম ড্যাশবোর্ডে অগ্রগতি দেখতে পারেন।",
    en: "Every Hifz student's memorisation is tracked surah by surah and juz by juz; students and guardians follow it on the Classroom dashboard.",
  },
  seeHifz: { bn: "আমার হিফজ অগ্রগতি →", en: "See my Hifz progress →" },
  joinHifz: { bn: "হিফজ প্রোগ্রামে যোগ দিন →", en: "Join the Hifz program →" },
  ready: { bn: "শুরু করতে প্রস্তুত?", en: "Ready to begin?" },
  readyText: {
    bn: "কুরআন ও ইসলামিক শিক্ষা অথবা হিফজ প্রোগ্রামে আবেদন করুন — ছেলে, মেয়ে ও মহিলাদের জন্য আলাদা ক্লাস।",
    en: "Apply for Qur'an & Islamic Studies or the Hifz program — separate classes for boys, girls and ladies.",
  },
  applyDeen: { bn: "আবেদন — কুরআন ও দ্বীন", en: "Apply — Qur'an & Deen" },
  applyHifz: { bn: "আবেদন — হিফজ প্রোগ্রাম", en: "Apply — Hifz Program" },
  footer: {
    bn: "বাংলাদেশ কমিউনিটি স্কুল, দক্ষিণ কোরিয়া — দ্বীন ও দুনিয়ার সমন্বিত শিক্ষা কার্যক্রম।",
    en: "Bangladesh Community School, South Korea — an education for this world and the next.",
  },
} satisfies Record<string, Text>;

/** KOIE copy from the school's content specification (§6). */
const KOIE = {
  body: {
    en: [
      "Bangladesh Community School Korea (BCSK) is proud to run its Online Islamic Education Program, designed specifically for Bangladeshi children living across South Korea. Wherever they live, students have access to structured and authentic Islamic learning from the comfort of their homes, taught by qualified and experienced instructors.",
      "The program supports children's spiritual development and helps them stay connected to their religious identity in a multicultural environment — especially valuable for families in areas without a local Islamic institution. As it grows, BCSK aims to add advanced Islamic studies, interactive sessions and certification tracks.",
    ],
    bn: [
      "বাংলাদেশ কমিউনিটি স্কুল কোরিয়া (BCSK) দক্ষিণ কোরিয়ায় বসবাসরত বাংলাদেশি শিশুদের জন্য বিশেষভাবে তৈরি অনলাইন ইসলামিক শিক্ষা কার্যক্রম পরিচালনা করছে। শিক্ষার্থীরা যেখানেই থাকুক, ঘরে বসেই যোগ্য ও অভিজ্ঞ শিক্ষকদের কাছ থেকে সুশৃঙ্খল ও বিশুদ্ধ ইসলামি শিক্ষা গ্রহণ করতে পারে।",
      "এই কার্যক্রম শিশুদের আত্মিক বিকাশে সহায়তা করে এবং বহুসাংস্কৃতিক পরিবেশে তাদের দ্বীনি পরিচয়ের সাথে যুক্ত রাখে — বিশেষ করে যেসব এলাকায় স্থানীয় ইসলামি প্রতিষ্ঠান নেই সেখানকার পরিবারের জন্য। ভবিষ্যতে উচ্চতর ইসলামি শিক্ষা, ইন্টারেক্টিভ সেশন ও সার্টিফিকেশন ট্র্যাক যুক্ত করার পরিকল্পনা রয়েছে।",
    ],
  } satisfies Record<Lang, string[]>,
  topics: [
    { bn: "তাজবীদসহ কুরআন তেলাওয়াত", en: "Qur'an recitation with Tajweed" },
    { bn: "ইসলামের মৌলিক বিশ্বাস (আকিদা)", en: "Basic Islamic beliefs (aqeedah)" },
    { bn: "নবীজির ﷺ শিক্ষা (হাদিস)", en: "Prophetic teachings (Hadith)" },
    { bn: "সাহাবিদের জীবনী", en: "Stories of the Sahabah" },
    { bn: "দৈনন্দিন দোয়া", en: "Daily duas" },
    { bn: "ইসলামি আদব ও মূল্যবোধ", en: "Islamic manners and values" },
  ] satisfies Text[],
};

/** The spec's Qur'an programs (§3.4, items 3–5). */
const PROGRAMS: { icon: string; title: Text; body: Text; course: "deen" | "hifz" }[] = [
  {
    icon: "📖",
    title: { bn: "কুরআন তেলাওয়াত ও তাজবীদ", en: "Qur'an Recitation & Tajweed" },
    body: {
      bn: "ছেলে ও মেয়েদের জন্য আলাদা ক্লাস — সঠিক উচ্চারণ (তাজবীদ), মুখস্থ করার কৌশল এবং মৌলিক অর্থ ও প্রেক্ষাপট। ইসলামিক শিক্ষায় দক্ষ যোগ্য শিক্ষকগণ ক্লাস নেন।",
      en: "Separate classes for boys and girls: correct Qur'anic pronunciation (Tajweed), memorisation techniques, and the basic meaning and context — led by instructors qualified in Islamic education.",
    },
    course: "deen",
  },
  {
    icon: "🌙",
    title: { bn: "কুরআন হিফজ প্রোগ্রাম", en: "Qur'an Hifz Program" },
    body: {
      bn: "কুরআন মুখস্থ করতে আগ্রহী শিক্ষার্থীদের জন্য ব্যক্তিগত দিকনির্দেশনা ও নিয়মিত মূল্যায়নসহ সুশৃঙ্খল হিফজ কোর্স।",
      en: "A structured Hifz course for students who wish to memorise the Qur'an, with personal guidance and regular assessments to track progress.",
    },
    course: "hifz",
  },
  {
    icon: "🌸",
    title: { bn: "শুধু মহিলাদের জন্য কুরআন প্রোগ্রাম", en: "Qur'an Program for Ladies" },
    body: {
      bn: "কুরআন পড়া ও মুখস্থ করতে আগ্রহী প্রাপ্তবয়স্ক নারীদের জন্য মহিলা শিক্ষিকার ব্যক্তিগত দিকনির্দেশনা ও নিয়মিত মূল্যায়নসহ সুশৃঙ্খল কোর্স।",
      en: "For adult women who want to read and memorise the Qur'an: a structured course with personal guidance from a female teacher and regular assessments.",
    },
    course: "deen",
  },
];

function SectionTitle({ icon, children, id }: { icon: string; children: React.ReactNode; id?: string }) {
  return (
    <div className="text-center mb-8">
      <h2 id={id} className="font-display text-3xl sm:text-4xl font-semibold text-green">
        <span aria-hidden>{icon}</span> {children}
      </h2>
      <span className="block mx-auto mt-3 w-16 h-1 rounded-full bg-crimson-bright/60" aria-hidden />
    </div>
  );
}

function Arabic({ children }: { children: string }) {
  return (
    <p lang="ar" dir="rtl" className="font-arabic text-xl sm:text-2xl leading-loose text-ink">
      {children}
    </p>
  );
}

/** 3.8.1 Deen page (FR-DEEN-01..07), following the school's Deen design. */
export default async function DeenPage() {
  const [course, slugs, siteLang] = await Promise.all([site.course("deen"), site.enrolledCourseSlugs(), getLang()]);
  const lang: Lang = siteLang === "bn" ? "bn" : "en";
  const t = (x: Text) => pick(x, lang);
  const enrolled = slugs.includes("deen") || slugs.includes("hifz");

  const verse = DAILY_QURAN[dailyIndex(DAILY_QURAN.length)];
  const hadith = DAILY_HADITH[dailyIndex(DAILY_HADITH.length)];
  const dua = DAILY_DUA[dailyIndex(DAILY_DUA.length)];
  const masala = DAILY_MASALA[dailyIndex(DAILY_MASALA.length)];

  const sections = [
    ["#courses", L.courses],
    ["#prayer", L.prayer],
    ["#ibadah", L.ibadah],
    ["#kids", L.kids],
    ["#koie", { bn: "KOIE", en: "KOIE" }],
    ["#classes", L.schedule],
  ] as const;

  const social = [
    { label: "Facebook", href: SCHOOL.facebook, bg: "bg-[#1877f2]", path: "M14 8h3V4h-3c-2.8 0-4.5 1.9-4.5 4.7V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V9c0-.6.4-1 1-1Z" },
    { label: "WhatsApp", href: `https://wa.me/${SCHOOL.whatsapp.replace(/\D/g, "")}`, bg: "bg-[#128c3e]", path: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.6 12.6c-.2.6-1.1 1.1-1.6 1.2-.4.1-1 .1-1.6-.1-3-1-4.9-3.9-5-4.1-.2-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1 2.2 1.3 2.5 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" },
    { label: "YouTube", href: SCHOOL.youtube, bg: "bg-[#d91c1c]", path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" },
    { label: "Email", href: `mailto:${SCHOOL.email}`, bg: "bg-crimson", path: "M3 6h18v12H3V6Zm2 2v.3l7 4.6 7-4.6V8H5Zm14 2.7-7 4.6-7-4.6V16h14v-5.3Z" },
  ];

  return (
    <div lang={lang}>
      {/* hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6">
        <div className="relative bg-green rounded-3xl px-6 sm:px-12 py-12 overflow-hidden text-white text-center">
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-green-deep/60" aria-hidden />
          <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-crimson/20" aria-hidden />
          <p className="relative text-xs font-extrabold tracking-[0.2em] uppercase text-green-soft">{t(L.eyebrow)}</p>
          <h1 className="relative mt-3 font-display text-3xl sm:text-5xl font-semibold leading-tight">{t(L.school)}</h1>
          <p className="relative mt-3 text-white/80 text-base sm:text-lg">{t(L.tagline)}</p>
          <Link
            href="/apply/special?course=deen"
            className="relative inline-block mt-7 bg-crimson hover:bg-crimson-deep text-white font-bold rounded-lg px-7 py-3 text-sm transition-colors"
          >
            {t(L.apply)}
          </Link>
        </div>
        <nav className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Deen sections">
          {sections.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-xs font-bold bg-white border border-line hover:border-green-mid text-green rounded-full px-4 py-2 transition-colors"
            >
              {t(label)}
            </a>
          ))}
        </nav>
      </section>

      {/* courses */}
      <section id="courses" className="mx-auto max-w-7xl px-4 mt-14 scroll-mt-24">
        <SectionTitle icon="📚">{t(L.courses)}</SectionTitle>
        <div className="grid md:grid-cols-2 gap-6">
          {COURSES.map((c) => (
            <article key={c.id} className="bg-white border border-line rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col">
              <span className="self-start text-xs font-bold bg-crimson-band text-crimson-ink rounded-full px-3 py-1">
                <span aria-hidden>{c.icon}</span> {t(c.tag)}
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-green">{t(c.title)}</h3>
              <p className="mt-3 border-l-4 border-crimson-bright/40 pl-4 text-sm text-ink-soft leading-relaxed flex-1">
                <span aria-hidden>✅ </span>
                {t(c.body)}
              </p>
              <details className="group mt-5">
                <summary className="inline-flex cursor-pointer list-none [&::-webkit-details-marker]:hidden items-center gap-1.5 border-2 border-green text-green hover:bg-green hover:text-white font-bold text-sm rounded-full px-5 py-2 transition-colors">
                  {t(L.learnMore)} <span aria-hidden className="group-open:rotate-180 transition-transform">✨</span>
                </summary>
                <div className="mt-4 bg-mist rounded-2xl p-5">
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {c.facts.map((f) => (
                      <div key={f.label.en}>
                        <dt className="text-xs font-extrabold uppercase tracking-wide text-green-mid">{t(f.label)}</dt>
                        <dd className="text-ink">{t(f.value)}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href="/apply/special?course=deen"
                    className="inline-block mt-4 bg-crimson hover:bg-crimson-deep text-white font-bold rounded-lg px-5 py-2 text-xs transition-colors"
                  >
                    {t(L.applyCourse)}
                  </Link>
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>

      {/* date, time and prayer times */}
      <section id="prayer" className="mx-auto max-w-7xl px-4 mt-16 scroll-mt-24">
        <PrayerBoard lang={lang} />
      </section>

      {/* ibadah corner */}
      <section id="ibadah" className="mx-auto max-w-7xl px-4 mt-10 scroll-mt-24">
        <div className="bg-white border border-line rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl font-semibold text-green border-l-4 border-crimson-bright pl-3">✨ {t(L.ibadah)}</h2>
            <span className="text-xs font-bold text-ink-soft">{t(L.changesDaily)}</span>
          </div>
          <div className="mt-6 divide-y divide-line">
            <div className="pb-6">
              <h3 className="font-bold text-crimson-ink">📖 {t(L.dailyQuran)}</h3>
              <Arabic>{verse.arabic}</Arabic>
              <p className="mt-1 text-ink italic">
                <strong className="not-italic">{t(L.meaning)}:</strong> {t(verse.meaning)}
              </p>
              <p className="mt-3 bg-green-soft rounded-xl px-4 py-2 text-sm text-ink">
                📜 {verse.note ? `${t(L.tafsir)}: ${t(verse.note)} ` : ""}({t(verse.ref)})
              </p>
            </div>
            <div className="py-6">
              <h3 className="font-bold text-crimson-ink">📜 {t(L.dailyHadith)}</h3>
              <Arabic>{hadith.arabic}</Arabic>
              <p className="mt-1 text-ink">
                <strong>{t(L.meaning)}:</strong> {t(hadith.meaning)} ({t(hadith.ref)})
              </p>
              <p className="mt-2 text-sm text-ink">📌 <strong>{t(L.lesson)}:</strong> {t(hadith.lesson)}</p>
            </div>
            <div className="py-6">
              <h3 className="font-bold text-crimson-ink">🤲 {t(L.duaSunnah)}</h3>
              <p className="mt-2 text-ink">
                <strong>{t(L.dua)}:</strong> {t(dua.when)}
              </p>
              <Arabic>{dua.arabic}</Arabic>
              <p className="text-sm text-ink-soft">
                {t(dua.meaning)} ({t(dua.ref)})
              </p>
              <p className="mt-2 text-ink">
                <strong>{t(L.sunnah)}:</strong> {t(dua.sunnah)}
              </p>
            </div>
            <div className="pt-6">
              <h3 className="font-bold text-crimson-ink">📘 {t(L.fiqh)}</h3>
              <p className="mt-2 text-ink">
                <strong>{t(L.question)}:</strong> {t(masala.q)}
              </p>
              <p className="mt-1 text-ink">
                <strong className="text-crimson-ink">{t(L.answer)}:</strong> {t(masala.a)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* community */}
      <section className="mx-auto max-w-7xl px-4 mt-10">
        <div className="bg-white border border-line rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-green border-l-4 border-crimson-bright pl-3">🌐 {t(L.community)}</h2>
          <p className="mt-4 text-ink">{t(L.joinUs)}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-6">
            {social.map((s) => (
              <li key={s.label} className="text-center">
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-12 h-12 rounded-full ${s.bg} text-white flex items-center justify-center hover:scale-110 transition-transform`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
                <span className="block mt-1.5 text-xs text-ink-soft">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* kids zone */}
      <section id="kids" className="mx-auto max-w-7xl px-4 mt-16 scroll-mt-24">
        <SectionTitle icon="🧸">{t(L.kids)}</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {KIDS_ZONE.map((k) => (
            <article key={k.id} className="bg-white border border-line rounded-3xl p-7 text-center flex flex-col items-center">
              <span className="text-5xl" aria-hidden>{k.icon}</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-green">{t(k.title)}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed flex-1">{t(k.body)}</p>
              <Link
                href="/apply/special?course=deen"
                className="mt-5 bg-green-mid hover:bg-green text-white font-bold text-sm rounded-full px-6 py-2 transition-colors"
                aria-label={`${t(L.join)}: ${t(k.title)}`}
              >
                {t(L.join)} <span aria-hidden>📖</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* KOIE + programs */}
      <section id="koie" className="mx-auto max-w-7xl px-4 mt-16 scroll-mt-24 grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <div className="bg-mist rounded-3xl p-7 sm:p-9">
          <p className="text-xs font-extrabold tracking-wide uppercase text-crimson-ink">KOIE</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-green">{t(L.koie)}</h2>
          {KOIE.body[lang].map((para) => (
            <p key={para.slice(0, 24)} className="mt-4 text-sm text-ink leading-relaxed">{para}</p>
          ))}
          <ul className="mt-5 grid sm:grid-cols-2 gap-2.5 text-sm text-ink">
            {KOIE.topics.map((x) => (
              <li key={x.en} className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-green mt-1.5 shrink-0" aria-hidden />
                {t(x)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{t(L.programs)}</h2>
          <div className="mt-5 space-y-4">
            {PROGRAMS.map((p) => (
              <div key={p.title.en} className="bg-white border border-line rounded-2xl p-5">
                <h3 className="font-bold text-green">
                  <span aria-hidden>{p.icon}</span> {t(p.title)}
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{t(p.body)}</p>
                <Link href={`/apply/special?course=${p.course}`} className="inline-block mt-2 text-xs font-bold text-green-mid hover:underline">
                  {t(p.course === "hifz" ? L.joinHifz : L.applyCourse)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* schedule (FR-DEEN-04) */}
      <section id="classes" className="mx-auto max-w-7xl px-4 mt-16 scroll-mt-24">
        <h2 className="font-display text-3xl font-semibold text-ink mb-6">{t(L.schedule)}</h2>
        <div className="scroll-fade overflow-x-auto rounded-2xl border border-line max-w-4xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mist text-green text-left">
                <th className="px-5 py-3.5 font-bold">{t(L.track)}</th>
                <th className="px-5 py-3.5 font-bold">{t(L.day)}</th>
                <th className="px-5 py-3.5 font-bold">{t(L.time)}</th>
                <th className="px-5 py-3.5 font-bold">{t(L.teacher)}</th>
                <th className="px-5 py-3.5 font-bold">{t(L.klass)}</th>
              </tr>
            </thead>
            <tbody>
              {course?.sessions.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-5 py-3.5 font-bold text-ink">{s.level?.name ?? s.title}</td>
                  <td className="px-5 py-3.5">{s.dayOfWeek}</td>
                  <td className="px-5 py-3.5 tabular-nums">{s.startTime}{s.endTime ? `–${s.endTime}` : ""}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{s.teacher?.user.name ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    {enrolled && s.zoomLink ? (
                      <a href={s.zoomLink} target="_blank" rel="noopener noreferrer" className="text-white bg-green hover:bg-green-deep text-xs font-bold rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap">
                        {t(L.joinZoom)}
                      </a>
                    ) : (
                      <Link href="/classroom" className="text-xs font-bold text-green-mid hover:underline whitespace-nowrap">
                        {t(L.enrolledOnly)}
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* resources (FR-DEEN-05) + Hifz tracking (FR-DEEN-06) */}
        <div className="mt-8 grid md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-white border border-line rounded-2xl p-7">
            <h3 className="font-display text-xl font-semibold text-green">{t(L.resources)}</h3>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">{t(L.resourcesText)}</p>
            <Link href={enrolled ? "/classroom/syllabus" : "/classroom"} className="inline-block mt-4 text-green-mid text-sm font-bold hover:underline">
              {t(enrolled ? L.openResources : L.login)}
            </Link>
          </div>
          <div className="bg-white border border-line rounded-2xl p-7">
            <h3 className="font-display text-xl font-semibold text-green">{t(L.hifzTrack)}</h3>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">{t(L.hifzTrackText)}</p>
            <Link href={enrolled ? "/classroom/results" : "/apply/special?course=hifz"} className="inline-block mt-4 text-green-mid text-sm font-bold hover:underline">
              {t(enrolled ? L.seeHifz : L.joinHifz)}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA (FR-DEEN-07) */}
      <section className="mx-auto max-w-7xl px-4 mt-16">
        <div className="bg-green rounded-3xl px-6 sm:px-12 py-11 text-center">
          <h2 className="font-display text-3xl font-semibold text-white">{t(L.ready)}</h2>
          <p className="mt-2 text-sm text-white/75 max-w-xl mx-auto">{t(L.readyText)}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/apply/special?course=deen" className="bg-crimson hover:bg-crimson-deep text-white font-bold rounded-lg px-6 py-2.5 text-sm transition-colors">
              {t(L.applyDeen)}
            </Link>
            <Link href="/apply/special?course=hifz" className="bg-white hover:bg-mist text-green font-bold rounded-lg px-6 py-2.5 text-sm transition-colors">
              {t(L.applyHifz)}
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/60">🌸 {t(L.footer)}</p>
        </div>
      </section>
    </div>
  );
}
