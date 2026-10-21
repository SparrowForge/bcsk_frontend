import type { ClassColor, SubjectColor } from "@/services/types";

/**
 * The colours of the Academic class and subject pages. Hex values rather than Tailwind classes
 * because the colour is data - chosen per class and per subject in the admin panel - and
 * Tailwind only ships classes it can see written out.
 *
 * `deep` is the text-strength step (4.5:1 or better on `tint` and on white); `shades` run
 * light to dark for the quarter-circle sign on each subject panel.
 */
export type Palette = { base: string; deep: string; tint: string; shades: [string, string, string, string] };

export const PALETTE: Record<ClassColor | SubjectColor, Palette> = {
  green: { base: "#16A34A", deep: "#166534", tint: "#DCFCE7", shades: ["#4ADE80", "#22C55E", "#16A34A", "#166534"] },
  blue: { base: "#2563EB", deep: "#1E40AF", tint: "#DBEAFE", shades: ["#60A5FA", "#3B82F6", "#2563EB", "#1E40AF"] },
  purple: { base: "#9333EA", deep: "#6B21A8", tint: "#F3E8FF", shades: ["#C084FC", "#A855F7", "#9333EA", "#6B21A8"] },
  orange: { base: "#EA580C", deep: "#9A3412", tint: "#FFEDD5", shades: ["#FB923C", "#F97316", "#EA580C", "#9A3412"] },
  teal: { base: "#0D9488", deep: "#115E59", tint: "#CCFBF1", shades: ["#2DD4BF", "#14B8A6", "#0D9488", "#115E59"] },
  red: { base: "#DC2626", deep: "#991B1B", tint: "#FEE2E2", shades: ["#F87171", "#EF4444", "#DC2626", "#991B1B"] },
  indigo: { base: "#4F46E5", deep: "#3730A3", tint: "#E0E7FF", shades: ["#818CF8", "#6366F1", "#4F46E5", "#3730A3"] },
  pink: { base: "#DB2777", deep: "#9D174D", tint: "#FCE7F3", shades: ["#F472B6", "#EC4899", "#DB2777", "#9D174D"] },
  yellow: { base: "#CA8A04", deep: "#854D0E", tint: "#FEF9C3", shades: ["#FACC15", "#EAB308", "#CA8A04", "#854D0E"] },
};

export const paletteFor = (color: string): Palette => PALETTE[color as keyof typeof PALETTE] ?? PALETTE.green;

export const CLASS_COLOR_OPTIONS: ClassColor[] = ["green", "blue", "purple", "orange", "teal", "red", "indigo"];
export const SUBJECT_COLOR_OPTIONS: SubjectColor[] = ["pink", "purple", "blue", "teal", "green", "yellow", "orange", "red", "indigo"];

export const SUBJECT_CATEGORIES = [
  { key: "MAIN", label: "Main subjects" },
  { key: "RELATED", label: "Related books" },
  { key: "HOMEWORK", label: "Homework books" },
] as const;
