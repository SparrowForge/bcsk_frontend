import "server-only";
import { getSettings } from "@/services";
import { SCHOOL } from "@/lib/constants";

/**
 * The school's contact details, as every surface that prints them should read them.
 *
 * Each field is an admin setting with the `SCHOOL` constant as its fallback, so the office
 * can correct a phone number or an email from the Admin Panel without a deploy. Before
 * this existed, five components each hard-coded the constants and a change had to be made
 * in five places — which is how a site ends up showing two different email addresses.
 *
 * `getSettings` is cached and already swallows a backend outage into an empty map, so a
 * failed read degrades to the constants rather than to a blank footer.
 */
export type Contact = {
  phone: string;
  phone2: string;
  /** Free text beside the phone numbers, e.g. "9AM – 10PM". Empty means "print no hours". */
  hours: string;
  email: string;
  /** E.164, digits only after the +, for `wa.me` links. */
  whatsapp: string;
  whatsappDisplay: string;
  facebookUrl: string;
  /** The bare handle a reader sees: "fb.com/bcskr". */
  facebookHandle: string;
  address: string;
  addressKo: string;
};

export async function getContact(): Promise<Contact> {
  const s = await getSettings([
    "school_phone",
    "school_phone2",
    "contact_hours",
    "support_email",
    "whatsapp_number",
    "facebook_url",
  ]);

  const whatsapp = s.whatsapp_number || SCHOOL.whatsapp;
  const facebookUrl = s.facebook_url || SCHOOL.facebook;

  return {
    phone: s.school_phone || SCHOOL.phone,
    phone2: s.school_phone2 || SCHOOL.phone2,
    hours: s.contact_hours,
    email: s.support_email || SCHOOL.email,
    whatsapp: whatsapp.replace(/[^\d+]/g, "").replace(/^\+/, ""),
    // A stored number may arrive in any punctuation; the display form keeps the "+".
    whatsappDisplay: whatsapp.startsWith("+") ? whatsapp : `+${whatsapp.replace(/^\+/, "")}`,
    facebookUrl,
    facebookHandle: facebookUrl.replace(/^https?:\/\/(www\.)?facebook\.com\//, "fb.com/").replace(/\/$/, ""),
    address: SCHOOL.address,
    addressKo: SCHOOL.addressKo,
  };
}
