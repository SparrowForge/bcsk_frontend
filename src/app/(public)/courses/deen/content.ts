/**
 * Copy for the Deen page. The Bangla is the school's own text from its Deen design
 * (sites.google.com/view/bcskr/deen), kept word for word apart from one fix ("knowledge" →
 * "জ্ঞান"); the English is a translation. Korean visitors see English.
 *
 * Qur'an and Hadith text is quoted with its reference so the school can check every line —
 * any change here should be reviewed by a teacher before it ships.
 */

export type Text = { bn: string; en: string };
export type Lang = "bn" | "en";
export const pick = (t: Text, lang: Lang) => t[lang];

export type DeenCourse = {
  id: string;
  icon: string;
  tag: Text;
  title: Text;
  body: Text;
  facts: { label: Text; value: Text }[];
};

const DURATION: Text = { bn: "মেয়াদ", en: "Duration" };
const FORMAT: Text = { bn: "পদ্ধতি", en: "Format" };
const FOR: Text = { bn: "কাদের জন্য", en: "Who it's for" };
const AWARD: Text = { bn: "সনদ", en: "Certificate" };

export const COURSES: DeenCourse[] = [
  {
    id: "quran-learning",
    icon: "📖",
    tag: { bn: "তাজবীদ ও কিরাত", en: "Tajweed & Qira'at" },
    title: { bn: "কুরআন লার্নিং কোর্স", en: "Qur'an Learning Course" },
    body: {
      bn: "সঠিক তাজবীদ ও মাখরাজসহ কুরআন তেলাওয়াত শেখার পূর্ণাঙ্গ কোর্স। মাখরাজের সঠিক উচ্চারণ, গুণাবলী, তাজভীদের মৌলিক নিয়ম যেমন ইদগাম, ইখফা, ইযহার, ক্বলকালাহ। সাপ্তাহিক লাইভ ক্লাস ও ছোট গ্রুপে মশকের সুব্যবস্থা। ৬ মাসে কুরআন তেলাওয়াত শুদ্ধ করতে সহায়ক। শেষে সার্টিফিকেট প্রদান করা হয়। বিশেষভাবে প্রাথমিক থেকে মাধ্যমিক স্তরের শিক্ষার্থীদের জন্য ডিজাইন করা।",
      en: "A complete course in reciting the Qur'an with correct Tajweed and makharij: accurate articulation of each letter, its qualities, and the core rules such as idgham, ikhfa, izhar and qalqalah. Weekly live classes with practice in small groups. Helps students perfect their recitation in six months, with a certificate at the end. Designed especially for primary to secondary students.",
    },
    facts: [
      { label: DURATION, value: { bn: "৬ মাস", en: "6 months" } },
      { label: FORMAT, value: { bn: "সাপ্তাহিক লাইভ ক্লাস ও ছোট গ্রুপে মশক", en: "Weekly live class, small-group practice" } },
      { label: FOR, value: { bn: "প্রাথমিক থেকে মাধ্যমিক স্তর", en: "Primary to secondary students" } },
      { label: AWARD, value: { bn: "সার্টিফিকেট প্রদান", en: "Yes" } },
    ],
  },
  {
    id: "quranic-language",
    icon: "📜",
    tag: { bn: "কুরআনের ভাষা", en: "Language of the Qur'an" },
    title: { bn: "কুরআনিক ল্যাংগুয়েজ কোর্স", en: "Qur'anic Language Course" },
    body: {
      bn: "কুরআনের সরাসরি বুঝার জন্য আরবি ব্যাকরণ (নাহু ও সরফ) ও শব্দভাণ্ডার শিক্ষা। কুরআনের ৮০% শব্দার্থ আয়ত্তের পদ্ধতি যেন আয়াত দেখলেই অর্থ বুঝতে পারেন। লাইভ ক্লাস, ইন্টারেক্টিভ সেশন ও অনুশীলনপত্র। ৪ মাস মেয়াদী এই কোর্স শেষে কুরআনের আভিধানিক দক্ষতা অর্জিত হবে। তাফসীর পড়ার পূর্বশর্ত হিসেবে এই কোর্স অত্যন্ত গুরুত্বপূর্ণ।",
      en: "Arabic grammar (nahw and sarf) and vocabulary for understanding the Qur'an directly — a method for mastering the words behind 80% of the Qur'an, so the meaning is clear as soon as you read an ayah. Live classes, interactive sessions and worksheets. After four months students gain real Qur'anic vocabulary; an essential step before studying tafsir.",
    },
    facts: [
      { label: DURATION, value: { bn: "৪ মাস", en: "4 months" } },
      { label: FORMAT, value: { bn: "লাইভ ক্লাস, ইন্টারেক্টিভ সেশন ও অনুশীলনপত্র", en: "Live classes, interactive sessions, worksheets" } },
      { label: FOR, value: { bn: "তাফসীর পড়তে আগ্রহী শিক্ষার্থী", en: "Students preparing to study tafsir" } },
    ],
  },
  {
    id: "amali-surah-hifz",
    icon: "🤲",
    tag: { bn: "হিফজ ও আমল", en: "Hifz & practice" },
    title: { bn: "আমলী সূরা হিফজ কোর্স", en: "Everyday Surah Hifz Course" },
    body: {
      bn: "প্রয়োজনীয় সূরা যেমন সূরা মুলক, সূরা কাহফের প্রথম ও শেষ ১০ আয়াত, সূরা যিলযাল, সূরা ওয়াক্বিয়ার গুরুত্বপূর্ণ অংশ মুখস্থ করানো হবে। শুধু মুখস্থ নয়, অর্থ, ফজিলত ও দৈনন্দিন আমলে প্রয়োগ। সাপ্তাহিক তাকরার ও লিখিত পরীক্ষার ব্যবস্থা। ৬ মাস মেয়াদী প্রোগ্রাম। সূরা মুখস্থ করে কবরের আজাব থেকে মুক্তি ও জান্নাত লাভের পথ সুগম হয়।",
      en: "Memorise the surahs a Muslim needs every day — Surah al-Mulk, the first and last ten ayat of Surah al-Kahf, Surah az-Zalzalah and key passages of Surah al-Waqi'ah. Not only memorisation: their meaning, virtues and place in daily practice. Weekly revision (takrar) and written tests over a six-month programme.",
    },
    facts: [
      { label: DURATION, value: { bn: "৬ মাস", en: "6 months" } },
      { label: FORMAT, value: { bn: "সাপ্তাহিক তাকরার ও লিখিত পরীক্ষা", en: "Weekly revision and written tests" } },
    ],
  },
  {
    id: "dua-sunnah",
    icon: "🕌",
    tag: { bn: "সুন্নাহ চর্চা", en: "Living the Sunnah" },
    title: { bn: "দুআ ও সুন্নাহ কোর্স", en: "Dua & Sunnah Course" },
    body: {
      bn: "নিত্যদিনের প্রয়োজনীয় দোয়া (ঘুম থেকে ওঠা, খাওয়া-দাওয়া, পোশাক পরিধান, ঘরে ও বাইরে যাওয়া) আরবি ও বাংলা উচ্চারণসহ শিক্ষা। প্রতিটি দোয়ার ফজিলত ও সুন্নত পদ্ধতি। রাসুলুল্লাহ (সা.)-এর আদর্শ আমলি জীবনে প্রয়োগের পদ্ধতি। দৈনন্দিন জীবন সুন্নত সমৃদ্ধ হবে ইনশাআল্লাহ। সাপ্তাহিক লাইভ ক্লাস ও পিডিএফ নোট প্রদান করা হয়।",
      en: "The duas of everyday life — waking, eating, dressing, entering and leaving the home — taught in Arabic with Bangla pronunciation, together with each dua's virtue and the Sunnah way of doing it. How to bring the example of the Messenger ﷺ into daily life, insha'Allah. Weekly live class, with PDF notes.",
    },
    facts: [
      { label: FORMAT, value: { bn: "সাপ্তাহিক লাইভ ক্লাস ও পিডিএফ নোট", en: "Weekly live class, PDF notes" } },
      { label: FOR, value: { bn: "সকল বয়সী শিক্ষার্থী", en: "All ages" } },
    ],
  },
  {
    id: "forty-hadith",
    icon: "📚",
    tag: { bn: "৪০ হাদিস", en: "40 Hadith" },
    title: { bn: "৪০ হাদিস কোর্স", en: "40 Hadith Course" },
    body: {
      bn: "ইমাম নববীর (রহ.) ৪০ হাদীসের সম্পূর্ণ ব্যাখ্যা ও জীবনমুখী শিক্ষা। প্রতিটি হাদিসের আরবি, বাংলা অর্থ ও সারমর্ম সহ দৈনন্দিন জীবনে প্রয়োগের কৌশল। ক্লাসে কুইজ ও গ্রুপ আলোচনা। ৬ মাসের এই কোর্স শেষে হাদিসের মৌলিক জ্ঞান ও নৈতিক বিকাশ ঘটবে। হাদীসগুলো মুমিনের জীবনব্যবস্থার মূল ভিত্তি। প্রতিটি হাদিসের বিশ্লেষণ ও ব্যবহারিক প্রয়োগ শেখানো হয়।",
      en: "A full explanation of Imam an-Nawawi's Forty Hadith and the lessons they hold for life: each hadith in Arabic with its Bangla meaning, summary and practical application. Quizzes and group discussion in class. These hadith are the foundation of a believer's way of life; after six months students gain a firm grounding in hadith and in character.",
    },
    facts: [
      { label: DURATION, value: { bn: "৬ মাস", en: "6 months" } },
      { label: FORMAT, value: { bn: "ক্লাসে কুইজ ও গ্রুপ আলোচনা", en: "Quizzes and group discussion" } },
    ],
  },
  {
    id: "seerah",
    icon: "📖",
    tag: { bn: "নবীর জীবনী", en: "Life of the Prophet ﷺ" },
    title: { bn: "সীরাহ কোর্স", en: "Seerah Course" },
    body: {
      bn: "মহানবী মুহাম্মাদ ﷺ এর পূর্ণাঙ্গ জীবনী: জন্ম থেকে ওফাত পর্যন্ত মক্কী ও মাদানী জীবনের প্রতিটি গুরুত্বপূর্ণ ঘটনা, নবুওয়াত লাভ, কষ্ট ও সংগ্রাম, হিজরত, যুদ্ধ ও সন্ধি, বিদায় হজের ভাষণ। নেতৃত্বের গুণাবলী ও মানবিক মূল্যবোধ। ১ বছরের পূর্ণাঙ্গ আয়োজন। সীরাহ জ্ঞান ছাড়া ইসলামের প্রকৃত রূপ বোঝা সম্ভব নয়।",
      en: "The complete life of the Prophet Muhammad ﷺ, from birth to his passing: every key event of the Makkan and Madinan years — prophethood, hardship and struggle, the Hijrah, battles and treaties, and the Farewell Sermon — with his qualities as a leader and his human values. A full one-year programme; Islam cannot be truly understood without the Seerah.",
    },
    facts: [
      { label: DURATION, value: { bn: "১ বছর", en: "1 year" } },
    ],
  },
  {
    id: "farz-e-ain",
    icon: "⚖️",
    tag: { bn: "ফরজ শিক্ষা", en: "Obligatory knowledge" },
    title: { bn: "ফরজে আইন কোর্স", en: "Farz-e-Ain Course" },
    body: {
      bn: "প্রত্যেক মুসলিমের জন্য আবশ্যক জ্ঞান: ঈমান ও আকাইদ, তাহারাত, নামাজ, রোজা, যাকাত, হজ্ব ও দৈনন্দিন হালাল-হারামের মাসায়েল। ৬ মাসের এই কোর্সে ইসলামের মৌলিক বিধান সহজভাবে শেখানো হয়। লাইভ ক্লাস, কুইজ ও সমাপনী পরীক্ষা। সনদ প্রদান করা হয়। ফরজে আইন জ্ঞান প্রতিটি মুসলিম নর-নারীর জন্য অপরিহার্য।",
      en: "The knowledge every Muslim must have: iman and aqeedah, purification, salah, fasting, zakat, Hajj and the everyday rulings of halal and haram. Six months of the fundamentals taught simply, with live classes, quizzes and a final exam. A certificate is awarded. Farz-e-Ain knowledge is essential for every Muslim man and woman.",
    },
    facts: [
      { label: DURATION, value: { bn: "৬ মাস", en: "6 months" } },
      { label: FORMAT, value: { bn: "লাইভ ক্লাস, কুইজ ও সমাপনী পরীক্ষা", en: "Live classes, quizzes, final exam" } },
      { label: FOR, value: { bn: "প্রতিটি মুসলিম নর-নারী", en: "Every Muslim man and woman" } },
      { label: AWARD, value: { bn: "সনদ প্রদান", en: "Yes" } },
    ],
  },
  {
    id: "maktab",
    icon: "📚",
    tag: { bn: "প্রাথমিক শিক্ষা", en: "First steps" },
    title: { bn: "মক্তব কোর্স", en: "Maktab Course" },
    body: {
      bn: "নূরানী পদ্ধতিতে আরবি বর্ণমালা ও যুক্তাক্ষর শিক্ষা থেকে শুরু করে সূরা ফাতিহা ও ছোট ছোট সূরা, প্রাথমিক দোয়া ও আদব-কায়দা শেখানো হয়। শিশু ও নতুন মুসলিমদের জন্য উপযোগী। ধাপে ধাপে কুরআন তেলাওয়াত ও ইসলামি জ্ঞানের ভিত্তি গঠন। সময়কাল ৮ মাস পর্যন্ত। শেষে অভিভাবকদের জন্য প্রতিবেদন ও সনদ প্রদান। বাচ্চাদের জন্য আকর্ষণীয় শিক্ষণ পদ্ধতি।",
      en: "From the Arabic alphabet and joined letters by the Noorani method, to Surah al-Fatihah and the short surahs, first duas and good manners. Suited to children and new Muslims: step by step it builds Qur'an recitation and a foundation of Islamic knowledge. Up to eight months, ending with a report for parents and a certificate. Taught in ways children enjoy.",
    },
    facts: [
      { label: DURATION, value: { bn: "৮ মাস পর্যন্ত", en: "Up to 8 months" } },
      { label: FOR, value: { bn: "শিশু ও নতুন মুসলিম", en: "Children and new Muslims" } },
      { label: AWARD, value: { bn: "অভিভাবকদের জন্য প্রতিবেদন ও সনদ", en: "Report for parents and certificate" } },
    ],
  },
];

export type KidsProgram = { id: string; icon: string; title: Text; body: Text };

export const KIDS_ZONE: KidsProgram[] = [
  {
    id: "kids-quran",
    icon: "📖",
    title: { bn: "শিশুদের কোরআন শিক্ষা কোর্স", en: "Qur'an for Children" },
    body: {
      bn: "নূরানী পদ্ধতিতে আরবি বর্ণমালা, যুক্তাক্ষর ও তাজবীদ সহ কুরআন তেলাওয়াত শেখানো হয়। ছোটদের জন্য মজার ছড়া ও গানের মাধ্যমে শেখার ব্যবস্থা।",
      en: "The Arabic alphabet, joined letters and Tajweed by the Noorani method, leading to Qur'an recitation — with fun rhymes and songs for the little ones.",
    },
  },
  {
    id: "seerah-stories",
    icon: "⭐",
    title: { bn: "গল্পে গল্পে সীরাহ কোর্স", en: "Seerah in Stories" },
    body: {
      bn: "রাসুলুল্লাহ (সা.)-এর জীবনী গল্পের আকারে। নবীজির শৈশব, সততা, আমানতদারিতা ও সাহসিকতার কাহিনী শিশুদের উপযোগী ভাষায় উপস্থাপন।",
      en: "The life of the Messenger ﷺ told as stories — his childhood, honesty, trustworthiness and courage, in words children understand.",
    },
  },
  {
    id: "islamic-stories",
    icon: "📚",
    title: { bn: "ইসলামিক স্টোরি কোর্স", en: "Islamic Stories" },
    body: {
      bn: "নবী-রাসুল, সাহাবি ও পুণ্যবানদের অনুপ্রেরণামূলক গল্প। প্রতিটি গল্প থেকে শিক্ষণীয় দিক তুলে ধরা হয় যা শিশুর চরিত্র গঠনে সহায়তা করে।",
      en: "Inspiring stories of the prophets, the Sahabah and the righteous. Each story draws out a lesson that helps build a child's character.",
    },
  },
  {
    id: "kids-dua",
    icon: "🤲",
    title: { bn: "দোয়া ও সুন্নাহ কোর্স", en: "Duas & Sunnah for Kids" },
    body: {
      bn: "শিশুদের জন্য দৈনন্দিন দোয়া যেমন: ঘুম থেকে ওঠার দোয়া, খাওয়ার আগে-পরে দোয়া, ঘরে ও বাইরে যাওয়ার দোয়া সহ সুন্নত আমল শেখানো হয়।",
      en: "Everyday duas for children — on waking, before and after eating, entering and leaving the home — along with Sunnah habits.",
    },
  },
  {
    id: "calligraphy",
    icon: "✍️",
    title: { bn: "ইসলামিক ক্যালিগ্রাফি প্রতিযোগিতা", en: "Islamic Calligraphy Competition" },
    body: {
      bn: "শিশুদের জন্য আরবি হরফ ও ইসলামিক ক্যালিগ্রাফি প্রতিযোগিতার আয়োজন। বিজয়ীদের মাঝে পুরস্কার ও সনদ প্রদান করা হয়।",
      en: "An Arabic-letter and Islamic calligraphy competition for children. Winners receive prizes and certificates.",
    },
  },
  {
    id: "akhlaq",
    icon: "🌿",
    title: { bn: "আখলাক ও আদব প্রোগ্রাম", en: "Akhlaq & Manners Program" },
    body: {
      bn: "সৎ চরিত্র ও ভালো আচরণের শিক্ষা। বড়দের সম্মান করা, ছোটদের স্নেহ করা, সত্য কথা বলা, সময়ানুবর্তিতা ও শিষ্টাচার শেখানো হয় নানান মজার মাধ্যমে।",
      en: "Good character and good conduct: respecting elders, caring for younger ones, telling the truth, punctuality and courtesy — taught through lots of fun activities.",
    },
  },
];

/* ------------------------------------------------------------------
   Ibadah corner — one of each per day, rotating by the Seoul date.
   ------------------------------------------------------------------ */

export type Verse = { arabic: string; meaning: Text; ref: Text; note?: Text };
export type Hadith = { arabic: string; meaning: Text; ref: Text; lesson: Text };
export type DuaSunnah = { when: Text; arabic: string; meaning: Text; ref: Text; sunnah: Text };
export type Masala = { q: Text; a: Text };

export const DAILY_QURAN: Verse[] = [
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    meaning: {
      bn: "হে আমাদের রব! আমাদের দুনিয়াতে কল্যাণ দাও এবং আখিরাতে কল্যাণ দাও এবং জাহান্নামের আযাব থেকে রক্ষা করো।",
      en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    },
    ref: { bn: "সূরা বাকারা: ২০১", en: "Surah al-Baqarah 2:201" },
    note: { bn: "দুনিয়া ও আখিরাতের সর্বোত্তম দোয়া", en: "The best dua for this world and the next" },
  },
  {
    arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    meaning: { bn: "আর বলুন, হে আমার রব! আমার জ্ঞান বৃদ্ধি করে দিন।", en: "And say: My Lord, increase me in knowledge." },
    ref: { bn: "সূরা ত্ব-হা: ১১৪", en: "Surah Ta-Ha 20:114" },
    note: { bn: "পড়াশোনা শুরুর আগে পড়ার দোয়া", en: "A dua to read before studying" },
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    meaning: {
      bn: "নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে। নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।",
      en: "So surely with hardship comes ease. Surely with hardship comes ease.",
    },
    ref: { bn: "সূরা আশ-শারহ: ৫–৬", en: "Surah ash-Sharh 94:5–6" },
  },
  {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    meaning: { bn: "জেনে রাখো, আল্লাহর স্মরণেই অন্তর প্রশান্ত হয়।", en: "Verily, in the remembrance of Allah do hearts find rest." },
    ref: { bn: "সূরা রা'দ: ২৮", en: "Surah ar-Ra'd 13:28" },
  },
  {
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    meaning: { bn: "আল্লাহ কাউকে তার সাধ্যের অতিরিক্ত দায়িত্ব দেন না।", en: "Allah does not burden a soul beyond what it can bear." },
    ref: { bn: "সূরা বাকারা: ২৮৬", en: "Surah al-Baqarah 2:286" },
  },
  {
    arabic: "وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    meaning: {
      bn: "আর বলুন, হে আমার রব! তাঁদের প্রতি দয়া করুন, যেভাবে তাঁরা শৈশবে আমাকে লালন-পালন করেছেন।",
      en: "And say: My Lord, have mercy on them as they raised me when I was small.",
    },
    ref: { bn: "সূরা বনী ইসরাঈল: ২৪", en: "Surah al-Isra 17:24" },
    note: { bn: "পিতা-মাতার জন্য দোয়া", en: "A dua for one's parents" },
  },
];

export const DAILY_HADITH: Hadith[] = [
  {
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    meaning: {
      bn: "যে ব্যক্তি আল্লাহ ও শেষ দিনের প্রতি ঈমান রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
      en: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    },
    ref: { bn: "বুখারী ও মুসলিম", en: "al-Bukhari and Muslim" },
    lesson: {
      bn: "মুমিনের পরিচয় মুখের নিয়ন্ত্রণ। নিরর্থক ও খারাপ কথা থেকে বিরত থাকা উত্তম।",
      en: "A believer is known by guarding the tongue; staying away from idle and hurtful talk is best.",
    },
  },
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    meaning: { bn: "নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল।", en: "Actions are only by intentions." },
    ref: { bn: "বুখারী ও মুসলিম", en: "al-Bukhari and Muslim" },
    lesson: {
      bn: "প্রতিটি ভালো কাজ আল্লাহর সন্তুষ্টির নিয়তে করলে তা ইবাদতে পরিণত হয়।",
      en: "Any good deed done to please Allah becomes an act of worship.",
    },
  },
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    meaning: {
      bn: "তোমাদের মধ্যে সর্বোত্তম সে, যে কুরআন শেখে এবং অন্যকে শেখায়।",
      en: "The best of you are those who learn the Qur'an and teach it.",
    },
    ref: { bn: "বুখারী", en: "al-Bukhari" },
    lesson: {
      bn: "কুরআন শেখা ও শেখানো সবচেয়ে সম্মানের কাজ।",
      en: "Learning and teaching the Qur'an is among the most honoured of deeds.",
    },
  },
  {
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    meaning: {
      bn: "তোমাদের কেউ পূর্ণ মুমিন হবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা-ই পছন্দ করে যা নিজের জন্য পছন্দ করে।",
      en: "None of you truly believes until he loves for his brother what he loves for himself.",
    },
    ref: { bn: "বুখারী ও মুসলিম", en: "al-Bukhari and Muslim" },
    lesson: {
      bn: "অন্যের কল্যাণ কামনা ঈমানের অংশ।",
      en: "Wishing good for others is part of faith.",
    },
  },
  {
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    meaning: { bn: "তোমার ভাইয়ের সামনে তোমার হাসিমুখ তোমার জন্য সদকা।", en: "Your smile in your brother's face is charity for you." },
    ref: { bn: "তিরমিযী", en: "at-Tirmidhi" },
    lesson: {
      bn: "ছোট ভালো কাজও আল্লাহর কাছে মূল্যবান।",
      en: "Even a small kindness is precious to Allah.",
    },
  },
  {
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    meaning: { bn: "পবিত্রতা ঈমানের অর্ধেক।", en: "Purity is half of faith." },
    ref: { bn: "মুসলিম", en: "Muslim" },
    lesson: {
      bn: "শরীর, পোশাক ও মনের পরিচ্ছন্নতা ঈমানের গুরুত্বপূর্ণ অংশ।",
      en: "Cleanliness of body, clothes and heart is a major part of faith.",
    },
  },
];

export const DAILY_DUA: DuaSunnah[] = [
  {
    when: { bn: "ঘুম থেকে উঠে পড়ুন", en: "On waking up" },
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    meaning: {
      bn: "সকল প্রশংসা আল্লাহর, যিনি আমাদের মৃত্যুর (ঘুমের) পর জীবিত করেছেন এবং তাঁর কাছেই ফিরে যেতে হবে।",
      en: "All praise is for Allah who gave us life after causing us to die, and to Him is the return.",
    },
    ref: { bn: "বুখারী", en: "al-Bukhari" },
    sunnah: {
      bn: "ডান হাত দিয়ে খাওয়া, বসে পানি পান করা এবং মসজিদে প্রবেশের সময় ডান পা দিয়ে প্রবেশ করা।",
      en: "Eat with the right hand, drink sitting down, and enter the masjid with the right foot.",
    },
  },
  {
    when: { bn: "খাওয়ার শুরুতে", en: "Before eating" },
    arabic: "بِسْمِ اللَّهِ",
    meaning: {
      bn: "আল্লাহর নামে (শুরু করছি)। ভুলে গেলে পড়ুন: بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
      en: "In the name of Allah. If you forget at the start, say: bismillahi awwalahu wa akhirahu.",
    },
    ref: { bn: "আবু দাউদ, তিরমিযী", en: "Abu Dawud, at-Tirmidhi" },
    sunnah: {
      bn: "নিজের সামনে থেকে খাওয়া এবং খাবারের দোষ না ধরা।",
      en: "Eat from what is in front of you, and never find fault with food.",
    },
  },
  {
    when: { bn: "খাওয়ার পরে", en: "After eating" },
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    meaning: {
      bn: "সকল প্রশংসা আল্লাহর, যিনি আমার কোনো শক্তি ও সামর্থ্য ছাড়াই আমাকে এই খাবার খাইয়েছেন ও রিযিক দিয়েছেন।",
      en: "All praise is for Allah who fed me this and provided it for me without any might or power from me.",
    },
    ref: { bn: "আবু দাউদ, তিরমিযী", en: "Abu Dawud, at-Tirmidhi" },
    sunnah: {
      bn: "দেখা হলে আগে সালাম দেওয়া।",
      en: "Be the first to greet with salam.",
    },
  },
  {
    when: { bn: "ঘর থেকে বের হওয়ার সময়", en: "When leaving home" },
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    meaning: {
      bn: "আল্লাহর নামে বের হলাম, আল্লাহর উপর ভরসা করলাম। আল্লাহ ছাড়া কোনো শক্তি ও সামর্থ্য নেই।",
      en: "In the name of Allah, I place my trust in Allah; there is no might nor power except with Allah.",
    },
    ref: { bn: "আবু দাউদ, তিরমিযী", en: "Abu Dawud, at-Tirmidhi" },
    sunnah: {
      bn: "ঘরে প্রবেশের সময় সালাম দিয়ে প্রবেশ করা।",
      en: "Say salam when entering your home.",
    },
  },
  {
    when: { bn: "ঘুমানোর আগে", en: "Before sleeping" },
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    meaning: { bn: "হে আল্লাহ! আপনার নামেই আমি মৃত্যুবরণ করি (ঘুমাই) এবং জীবিত হই (জাগি)।", en: "In Your name, O Allah, I die and I live." },
    ref: { bn: "বুখারী", en: "al-Bukhari" },
    sunnah: {
      bn: "অজু করে ডান কাতে শোয়া।",
      en: "Make wudu and sleep on your right side.",
    },
  },
  {
    when: { bn: "মসজিদে প্রবেশের সময়", en: "On entering the masjid" },
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    meaning: { bn: "হে আল্লাহ! আমার জন্য আপনার রহমতের দরজাগুলো খুলে দিন।", en: "O Allah, open for me the doors of Your mercy." },
    ref: { bn: "মুসলিম", en: "Muslim" },
    sunnah: {
      bn: "ডান পা দিয়ে মসজিদে প্রবেশ করা এবং বাম পা দিয়ে বের হওয়া।",
      en: "Enter the masjid with the right foot and leave with the left.",
    },
  },
];

export const DAILY_MASALA: Masala[] = [
  {
    q: { bn: "সফরে নামাজ কসর (সংক্ষেপ) করার বিধান কী?", en: "What is the ruling on shortening (qasr) salah while travelling?" },
    a: {
      bn: "শরয়ী সফরে (প্রায় ৮০ কিমি) ৪ রাকাত ফরজ নামাজ ২ রাকাত করে পড়া সুন্নতে মুয়াক্কাদা। মাগরিব ও ফজর কসর হয় না।",
      en: "On a journey of Shari'ah distance (about 80 km), the four-rak'ah fard prayers are prayed as two. Maghrib and Fajr are not shortened.",
    },
  },
  {
    q: { bn: "অজুর ফরজ কয়টি?", en: "How many fard acts are there in wudu?" },
    a: {
      bn: "চারটি: পুরো মুখমণ্ডল ধোয়া, কনুইসহ দুই হাত ধোয়া, মাথার এক-চতুর্থাংশ মাসাহ করা এবং টাখনুসহ দুই পা ধোয়া।",
      en: "Four: washing the whole face, washing both arms including the elbows, wiping a quarter of the head, and washing both feet including the ankles.",
    },
  },
  {
    q: { bn: "রোজা অবস্থায় ভুলে কিছু খেয়ে ফেললে কি রোজা ভেঙে যায়?", en: "Does eating by mistake break the fast?" },
    a: {
      bn: "না। ভুলে খেলে বা পান করলে রোজা ভাঙে না; মনে পড়ার সাথে সাথে থেমে যেতে হবে এবং রোজা পূর্ণ করতে হবে।",
      en: "No. Eating or drinking out of forgetfulness does not break the fast; stop as soon as you remember and complete the fast.",
    },
  },
  {
    q: { bn: "নামাজে কোনো ওয়াজিব ভুলে ছুটে গেলে কী করতে হয়?", en: "What if a wajib act of salah is missed by mistake?" },
    a: {
      bn: "নামাজের শেষে সাহু সিজদা আদায় করতে হয়; এতে নামাজ সম্পূর্ণ হয়ে যায়।",
      en: "Perform sajdah as-sahw (the prostration of forgetfulness) at the end of the prayer; the prayer is then complete.",
    },
  },
  {
    q: { bn: "যাকাত কখন ফরজ হয়?", en: "When does zakat become obligatory?" },
    a: {
      bn: "নিসাব পরিমাণ সম্পদ পূর্ণ এক চান্দ্র বছর মালিকানায় থাকলে তার ২.৫% যাকাত দেওয়া ফরজ।",
      en: "When a person owns wealth at or above the nisab for a full lunar year, 2.5% of it is due as zakat.",
    },
  },
];

/** Index into a list that changes once a day, by the Seoul calendar date. */
export function dailyIndex(length: number, now = new Date()) {
  const seoul = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const start = new Date(seoul.getFullYear(), 0, 0);
  const day = Math.floor((seoul.getTime() - start.getTime()) / 86_400_000);
  return day % length;
}
