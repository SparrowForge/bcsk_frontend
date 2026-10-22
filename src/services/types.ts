/**
 * The shapes the API returns.
 *
 * Hand-written rather than imported from Prisma on purpose: the frontend must not depend on
 * the database schema. These describe the *contract*, which is narrower than the tables —
 * the backend deliberately omits fields (password hashes, staff contact details) that pages
 * have no business receiving.
 *
 * Dates arrive as ISO strings over JSON, not `Date` objects. Typing them as `string` is
 * honest; the previous code got `Date` from Prisma and called `.toLocaleDateString()` on it,
 * which is exactly the kind of thing that breaks silently across a network boundary.
 */

export type ISODate = string;

/* --------------------------------- people --------------------------------- */

export type Role = "STUDENT" | "TEACHER" | "HEAD_MASTER" | "ADMIN_SUPPORT" | "IT_SUPPORT" | "SUPER_ADMIN";

export type UserRow = {
  id: number;
  loginId: string;
  name: string;
  email: string | null;
  role: Role;
  active: boolean;
  mustChangePassword: boolean;
  createdAt: ISODate;
};

/**
 * A row of the admin Users table: an account plus the one profile field shown beneath the
 * name. Deliberately not the whole profile — the list has no use for a guardian's phone
 * number, and `/users` does not return one.
 */
export type UserListRow = UserRow & {
  studentProfile: { classLevel: string } | null;
  teacherProfile: { designation: string | null } | null;
};

export type StudentProfile = {
  id: number;
  userId: number;
  studentId: string;
  classLevel: string;
  photoUrl: string | null;
  dob: ISODate | null;
  gender: string | null;
  religion: string | null;
  fatherName: string | null;
  motherName: string | null;
  guardianPhone: string | null;
  guardianEmail: string | null;
  addressKorea: string | null;
  addressBangladesh: string | null;
  emergencyContact: string | null;
};

export type TeacherRow = {
  id: number;
  teacherId: string;
  designation: string | null;
  subjects: string | null;
  bio: string | null;
  photoUrl: string | null;
  guideClass: string | null;
  /** Office-board presence. IN_CLASS is derived on the server, so it is not one of these. */
  deskName: string | null;
  deskStatus: "DESK" | "OFFLINE";
  returnAt: ISODate | null;
  displayOrder: number;
  user: { name: string };
};

/* -------------------------------- academic -------------------------------- */

export type CourseLevel = {
  id: number;
  courseId: number;
  name: string;
  displayOrder: number;
  syllabus: string | null;
  studentBookUrl: string | null;
  workBookUrl: string | null;
};

export type Course = {
  id: number;
  slug: string;
  name: string;
  type: string;
  category: string | null;
  description: string | null;
  heroText: string | null;
  active: boolean;
  displayOrder: number;
  levels?: CourseLevel[];
  sessions?: ClassSession[];
};

/**
 * A course as `/public/courses/:slug` returns it — levels and this semester's sessions are
 * always present, so pages need no optional chaining. The looser `Course` above is what list
 * endpoints return.
 */
export type CourseDetail = Course & {
  levels: CourseLevel[];
  sessions: ClassSession[];
};

export type ClassSession = {
  id: number;
  courseId: number;
  courseLevelId: number | null;
  title: string;
  classLevel: string | null;
  dayOfWeek: string;
  startTime: string;
  endTime: string | null;
  semester: string;
  teacherId: number | null;
  zoomLink: string | null;
  isLive: boolean;
  liveSince: ISODate | null;
  notice: string | null;
  active: boolean;
  course?: Course;
  level?: CourseLevel | null;
  teacher?: { userId: number; user: { name: string } } | null;
  _count?: { enrollments: number };
};

export type CurriculumEntry = {
  id: number;
  classLevel: string;
  subject: string;
  details: string | null;
  displayOrder: number;
};

/**
 * The homepage office and classroom boards (LP-2, LP-3), from `/public/school-board`.
 *
 * Nulls here mean "nothing to show", not "zero": an idle class has no duration and no
 * attendee count, and the page prints an em dash rather than inventing a number.
 */
export type SchoolBoard = {
  /** True when at least one class is live — what the "Current Status" pill reads. */
  open: boolean;
  liveCount: number;
  availableTeachers: number;
  inClassTeachers: number;
  desks: {
    id: number;
    /** The card's title: a named desk, else the subjects they teach. */
    deskName: string;
    teacherName: string;
    photoUrl: string | null;
    /** IN_CLASS is derived from a live session, never stored — the teacher sets the other two. */
    status: "IN_CLASS" | "DESK" | "OFFLINE";
    /** The class they are teaching right now, when IN_CLASS. */
    classLabel: string | null;
    /** Minutes until they are back at the desk; null when unknown or already there. */
    returnInMinutes: number | null;
  }[];
  classes: {
    key: string;
    /** A raw class-level key ("CLASS_3") or a course name — run it through `classLevelLabel`. */
    label: string;
    classLevel: string | null;
    courseSlug: string | null;
    live: boolean;
    currentCourseName: string | null;
    teacherName: string | null;
    durationMinutes: number | null;
    attendees: number | null;
  }[];
};

/** A student as related records reference them. */
export type StudentRef = { id: number; name: string; studentProfile: StudentProfile | null };

export type Enrollment = {
  id: number;
  studentUserId: number;
  classSessionId: number;
  semester: string;
  status: string;
  classSession: ClassSession;
  student?: StudentRef;
};

export type Assignment = {
  id: number;
  classSessionId: number;
  title: string;
  description: string | null;
  fileUrl: string | null;
  dueDate: ISODate | null;
  createdAt: ISODate;
  classSession?: { title: string };
  submissions?: Submission[];
};

export type Submission = {
  id: number;
  assignmentId: number;
  studentUserId: number;
  fileUrl: string | null;
  text: string | null;
  submittedAt: ISODate;
  grade: string | null;
  feedback: string | null;
  gradedAt: ISODate | null;
  student?: StudentRef;
};

export type ClassVideo = {
  id: number;
  classSessionId: number;
  title: string;
  videoUrl: string;
  recordedAt: ISODate;
  classSession?: { title: string };
};

export type Attendance = {
  id: number;
  classSessionId: number;
  studentUserId: number;
  date: ISODate;
  status: string;
  /** Always present from /classroom/attendance. */
  classSession: { title: string };
};

export type ExamResult = {
  id: number;
  studentUserId: number;
  semester: string;
  subject: string;
  fullMarks: number;
  marks: number;
  grade: string | null;
  remark: string | null;
  /** LMS B5: the exam it was published from; null for results entered directly. */
  examId?: number | null;
};

export type ProgressRecord = {
  id: number;
  courseSlug: string;
  label: string;
  score: string;
  note: string | null;
  recordedAt: ISODate;
};

export type HifzProgress = { id: number; surahNumber: number; surahName: string; juz: number | null; completedAt: ISODate };
export type GameScore = { id: number; game: string; level: number; score: number; createdAt: ISODate };

export type Notification = {
  id: number;
  title: string;
  body: string | null;
  kind: string;
  link: string | null;
  read: boolean;
  createdAt: ISODate;
};

export type Question = {
  id: number;
  studentUserId: number;
  teacherUserId: number | null;
  subject: string;
  body: string;
  answer: string | null;
  answeredAt: ISODate | null;
  createdAt: ISODate;
  student?: StudentRef;
};

export type TeacherTask = {
  id: number;
  title: string;
  detail: string | null;
  done: boolean;
  dueDate: ISODate | null;
};

/* -------------------------- academic: general classes ------------------------- */

export type ClassColor = "green" | "blue" | "purple" | "orange" | "teal" | "red" | "indigo";
export type SubjectColor = "pink" | "purple" | "blue" | "teal" | "green" | "yellow" | "orange" | "red" | "indigo";
export type SubjectCategory = "MAIN" | "RELATED" | "HOMEWORK";

/** A class as its card on the All General Classes page shows it. */
export type AcademicClassCard = {
  id: number;
  slug: string;
  name: string;
  ageRange: string | null;
  summary: string | null;
  color: ClassColor;
  cardImageUrl: string | null;
};

export type ClassSubject = {
  id: number;
  classId: number;
  title: string;
  category: SubjectCategory;
  description: string | null;
  outcomes: string[];
  coverImageUrl: string | null;
  color: SubjectColor;
  displayOrder: number;
};

export type AcademicClass = AcademicClassCard & {
  tagline: string | null;
  intro: string | null;
  highlights: string[];
  bannerImageUrl: string | null;
  displayOrder: number;
  active: boolean;
  subjects?: ClassSubject[];
};

/* -------------------------------- admission ------------------------------- */

export type ApplicationForm = {
  id: number;
  type: string;
  status: string;
  applicantName: string;
  firstName?: string | null;
  lastName?: string | null;
  dob: ISODate | null;
  gender: string | null;
  religion: string | null;
  phone: string | null;
  email: string | null;
  photoUrl: string | null;
  addressKorea: string | null;
  addressBangladesh: string | null;
  emergencyContact: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  grade: string | null;
  fatherName: string | null;
  fatherEmail?: string | null;
  fatherEducation?: string | null;
  fatherProfession?: string | null;
  fatherPhone?: string | null;
  motherName: string | null;
  motherEmail?: string | null;
  motherEducation?: string | null;
  motherProfession?: string | null;
  motherPhone?: string | null;
  /** Single-guardian fields from applications made before each parent was asked separately. */
  guardianProfession: string | null;
  guardianEducation: string | null;
  guardianPhone2: string | null;
  presentQualification?: string | null;
  /** Staff-written, from the admission assessment. */
  assessorComment?: string | null;
  paymentNote?: string | null;
  courseName: string | null;
  highestEducation: string | null;
  isBcskStudent: boolean;
  parentalConsent: boolean;
  adminNote: string | null;
  correctionNote: string | null;
  createdStudentUserId: number | null;
  /** The coupon the family redeemed (a snapshot taken at submit), if any. */
  couponCode?: string | null;
  couponType?: "PERCENT" | "FIXED" | null;
  couponValue?: number | null;
  courseLevelId?: number | null;
  /** Staff detail only: the level or track chosen on a special-course application. */
  courseLevel?: { id: number; name: string } | null;
  createdAt: ISODate;
  payments?: Payment[];
};

export type Payment = {
  id: number;
  applicationId: number | null;
  payerUserId: number | null;
  purpose: string;
  method: string;
  amount: number;
  currency: string;
  status: string;
  gatewayTxnId: string | null;
  virtualRef: string | null;
  receiptUploadUrl: string | null;
  receiptPdfSerial: string | null;
  rejectReason: string | null;
  verifiedAt: ISODate | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  /** Populated by the staff ledger (`/payments`), absent from a student's own list. */
  application?: { id: number; applicantName: string } | null;
  payer?: { name: string } | null;
  verifiedBy?: { name: string } | null;
};

export type FeeConfig = {
  id: number;
  key: string;
  label: string;
  kind: string;
  /** What the fee prices: a level's own row, or a course's default row (no level). */
  courseId?: number | null;
  courseLevelId?: number | null;
  admissionFee: number;
  semesterFee: number;
  bcskPrice: number | null;
  nonBcskPrice: number | null;
  bookFee: number | null;
  displayOrder: number;
  active: boolean;
};

/* --------------------------------- content -------------------------------- */

export type ContentPageRow = {
  id: number;
  slug: string;
  lang: string;
  title: string;
  content: string;
  status: string;
  updatedAt: ISODate;
};

export type EventNews = {
  id: number;
  type: string;
  title: string;
  body: string;
  imageUrl: string | null;
  date: ISODate;
  published: boolean;
};

export type GalleryItem = { id: number; albumId: number; type: string; url: string; caption: string | null };
export type GalleryAlbum = { id: number; title: string; category: string | null; coverUrl: string | null; items: GalleryItem[] };

export type HeroImage = {
  id: number;
  url: string;
  caption: string | null;
  displayOrder: number;
  active: boolean;
};

export type StudentCornerPost = {
  id: number;
  title: string;
  body: string;
  studentName: string;
  kind: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: ISODate;
};

/** A teacher's public profile as the admin editor sees it — never the account's login details. */
export type TeacherProfileRow = {
  id: number;
  teacherId: string;
  name: string;
  designation: string | null;
  subjects: string | null;
  bio: string | null;
  photoUrl: string | null;
  isPublic: boolean;
  displayOrder: number;
};

export type GoverningMemberRow = {
  id: number;
  kind: string;
  name: string;
  role: string;
  organization: string | null;
  region: string | null;
  phone: string | null;
  email: string | null;
  photoUrl: string | null;
  bio: string | null;
  displayOrder: number;
};

export type SupportTicket = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  category: string;
  status: string;
  reply: string | null;
  createdAt: ISODate;
};

export type AuditLogRow = {
  id: number;
  action: string;
  entity: string;
  entityId: string | null;
  detail: string | null;
  createdAt: ISODate;
  user: { loginId: string; name: string } | null;
};

export type Setting = { key: string; value: string };

export type DashboardStats = {
  paymentsToVerify: number;
  openApplications: number;
  openTickets: number;
  students: number;
  teachers: number;
  unanswered: number;
};

export type Coupon = {
  id: number;
  code: string;
  description: string | null;
  discountType: "PERCENT" | "FIXED";
  value: number;
  appliesTo: "ALL" | "REGULAR" | "SPECIAL" | "RE_ADMISSION";
  maxUses: number | null;
  validFrom: ISODate | null;
  validUntil: ISODate | null;
  active: boolean;
  used: number;
  createdAt: ISODate;
};

export type CouponCheck = {
  code: string;
  label: string;
  description: string | null;
  options: { key: string; discount: number; payable: number }[];
};

/* ----------------------------------- CRM ----------------------------------- */

export type LeadStage = "NEW" | "CONTACTED" | "QUALIFIED" | "APPLIED" | "ADMITTED" | "ENROLLED" | "LOST";

export type Lead = {
  id: number;
  leadNo: string;
  name: string;
  email: string | null;
  phone: string | null;
  alternatePhone: string | null;
  gender: string | null;
  city: string | null;
  sourceId: number | null;
  source: { id: number; name: string } | null;
  campaign: string | null;
  referredBy: string | null;
  courseId: number | null;
  course: { id: number; name: string; slug: string; type: string } | null;
  stage: LeadStage;
  lostReason: string | null;
  lostNote: string | null;
  score: number;
  assignedToUserId: number | null;
  assignedTo: { id: number; name: string; loginId: string } | null;
  lastContactedAt: ISODate | null;
  nextFollowUpAt: ISODate | null;
  convertedApplicationId: number | null;
  convertedApplication: { id: number; status: string } | null;
  convertedAt: ISODate | null;
  remarks: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
};

export type LeadActivity = {
  id: number;
  leadId: number;
  type: string;
  subject: string;
  notes: string | null;
  outcome: string | null;
  scheduledAt: ISODate | null;
  completedAt: ISODate | null;
  isSystemGenerated: boolean;
  performedBy: { id: number; name: string } | null;
  createdAt: ISODate;
};

export type DueLeadActivity = Omit<LeadActivity, "performedBy"> & {
  lead: { id: number; leadNo: string; name: string; phone: string | null };
};

export type LeadSource = {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  isPublic: boolean;
  active: boolean;
  _count: { leads: number };
};

export type LeadCourseOption = {
  id: number;
  name: string;
  slug: string;
  type: string;
  levels: { id: number; name: string; code: string | null }[];
};

export type LeadFunnel = {
  byStage: { stage: LeadStage; count: number }[];
  bySource: { sourceId: number | null; sourceName: string; count: number; enrolled: number }[];
  lostReasons: { reason: string; count: number }[];
  total: number;
  enrolled: number;
  lost: number;
  open: number;
  conversionRate: number;
};

/* ------------------------------ menu permissions ------------------------------ */

export type MenuFlag = "access" | "insert" | "update" | "delete";
export type MenuGrid = Record<MenuFlag, boolean>;

export type Panel = "ADMIN" | "TEACHER" | "STUDENT";

export type PermissionMenu = {
  key: string;
  panel: Panel;
  module: string;
  label: string;
  note: string | null;
  /** Which of the four switches this menu actually has behind it. */
  offers: Record<MenuFlag, boolean>;
};

export type PermissionUser = { id: number; loginId: string; name: string; role: Role; panel: Panel; custom: boolean };
export type UserGrid = { custom: boolean; role: Role; panel: Panel; grid: Record<string, MenuGrid> };

/** A row of the Menu table, as the Menu entry screen sees it. */
export type MenuEntry = {
  id: number;
  key: string;
  panel: Panel;
  module: string;
  label: string;
  href: string;
  note: string | null;
  actions: MenuFlag[];
  displayOrder: number;
  active: boolean;
  /** The switches the menu offers (admin menus: from the capabilities they grant). */
  offers: MenuFlag[];
  /** Created by the system rather than on this screen: cannot be deleted. */
  builtIn: boolean;
  /** How many users have a saved permission row for it. */
  assigned: number;
};

/* ------------------------------- LMS: academic setup (F1) ------------------------------ */

export type Institute = {
  id: number; code: string; name: string; nameBn: string | null; nameKo: string | null;
  address: string | null; phone: string | null; email: string | null; website: string | null;
  logoUrl: string | null; headMasterName: string | null; signatureUrl: string | null;
  active: boolean; rankTies: "SHARED" | "SPLIT"; leaveTeacherMaxDays: number;
};

export type Department = {
  id: number; name: string; code: string; headUserId: number | null; displayOrder: number; active: boolean;
  head: { id: number; name: string } | null;
  _count: { courses: number; subjects: number };
};

export type AcademicTerm = {
  id: number; code: string; name: string; startDate: ISODate | null; endDate: ISODate | null; isCurrent: boolean;
  _count: { batches: number };
};

/** A course with its classes (levels), for the structure pickers. */
export type StructureCourse = {
  id: number; slug: string; name: string; type: string; active: boolean;
  department: { id: number; name: string } | null;
  levels: { id: number; name: string; code: string | null }[];
};

export type SectionSummary = { id: number; name: string; capacity: number | null; active: boolean; _count: { enrollments: number } };

export type Batch = {
  id: number; name: string; termId: number; courseLevelId: number;
  term: { id: number; code: string; name: string };
  courseLevel: { id: number; name: string; course: { id: number; name: string } };
  sections: SectionSummary[];
};

export type Subject = {
  id: number; code: string; name: string; type: "THEORY" | "PRACTICAL"; departmentId: number | null;
  displayOrder: number; active: boolean;
  department: { id: number; name: string } | null;
  _count: { curriculum: number; assignments: number };
};

export type CurriculumRow = {
  id: number; courseLevelId: number; subjectId: number; fullMarks: number; passMarks: number; isOptional: boolean; displayOrder: number;
  subject: { id: number; code: string; name: string; type: string; active: boolean };
};

export type SectionDetail = {
  id: number; name: string; capacity: number | null; room: string | null; classTeacherId: number | null; active: boolean;
  batch: { courseLevelId: number; termId: number };
  students: { id: number; rollNo: number | null; status: string; student: { id: number; name: string; studentProfile: { studentId: string } | null } }[];
  assignments: { id: number; subject: { id: number; code: string; name: string }; teacher: { id: number; teacherId: string; user: { name: string } } }[];
  curriculum: CurriculumRow[];
};

export type StructureTeacher = { id: number; teacherId: string; designation: string | null; user: { id: number; name: string } };

export type StructureStudent = {
  id: number; name: string; loginId: string;
  studentProfile: { classLevel: string; status: string } | null;
  sectionPlaces: { id: number; rollNo: number | null; section: { id: number; name: string; batch: { id: number; name: string; termId: number } } }[];
};

export type RoutineSlot = {
  id: number; title: string; dayOfWeek: string; startTime: string; endTime: string | null; room: string | null;
  zoomLink: string | null; notice: string | null; semester: string; active: boolean; isLive: boolean;
  sectionId: number | null; subjectId: number | null; teacherId: number | null;
  section: { id: number; name: string; batch: { id: number; name: string; courseLevelId: number } } | null;
  subject: { id: number; code: string; name: string } | null;
  teacher: { id: number; teacherId: string; user: { name: string } } | null;
};

export type CalendarEventType = "TERM" | "HOLIDAY" | "EXAM" | "EVENT" | "MEETING";
export type CalendarAudience = "ALL" | "STUDENTS" | "TEACHERS" | "STAFF";
export type CalendarEvent = {
  id: number; title: string; description: string | null; type: CalendarEventType; audience: CalendarAudience;
  startDate: ISODate; endDate: ISODate; published: boolean; termId: number | null; courseLevelId: number | null;
  term: { id: number; code: string } | null;
  courseLevel: { id: number; name: string } | null;
};

/* ---------------------------------- teacher portal (LMS F2) ---------------------------------- */

export type StudentRow = { id: number; name: string; studentProfile: { studentId: string } | null };

/** A section the teacher teaches or leads in the current term. */
export type TeacherSection = {
  id: number; name: string; room: string | null; isClassTeacher: boolean;
  batch: { id: number; name: string; term: { code: string; name: string }; courseLevel: { id: number; name: string } };
  subjects: { id: number; code: string; name: string }[];
  _count: { enrollments: number };
};

export type SectionRoster = {
  sectionId: number; isClassTeacher: boolean;
  students: { rollNo: number | null; student: { id: number; name: string; studentProfile: { studentId: string; photoUrl: string | null } | null } }[];
};

export type AttendanceTally = { present: number; absent: number; late: number; excused: number; total: number; rate: number | null };
export type SectionAttendanceReport = {
  sectionId: number; from: string; to: string;
  students: ({ rollNo: number | null; student: StudentRow } & AttendanceTally)[];
  days: ({ date: string } & AttendanceTally)[];
  overall: AttendanceTally;
};

export type AttendanceSheetDay = {
  classSessionId: number; date: string;
  students: { student: StudentRow; status: string | null; remark: string | null }[];
};

export type MaterialKind = "FILE" | "LINK" | "VIDEO";
export type CourseMaterial = {
  id: number; title: string; description: string | null; kind: MaterialKind; fileUrl: string | null; linkUrl: string | null;
  published: boolean; displayOrder: number; sectionId: number | null; courseLevelId: number; uploadedById: number | null;
  createdAt: ISODate; updatedAt: ISODate;
  subject: { id: number; code: string; name: string };
  courseLevel: { id: number; name: string };
  section: { id: number; name: string } | null;
};

export type OnlineClassStatus = "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
export type TeacherOnlineClass = {
  id: number; topic: string | null; startsAt: ISODate; endsAt: ISODate; status: OnlineClassStatus;
  startedAt: ISODate | null; endedAt: ISODate | null; recordingUrl: string | null; joinUrl: string | null;
  classSession: { id: number; title: string; subject: { name: string } | null; teacher: { user: { name: string } } | null };
  _count: { joins: number };
};
export type OnlineClassJoins = {
  onlineClass: { id: number; status: OnlineClassStatus; startsAt: ISODate; endsAt: ISODate };
  people: { id: number; name: string; role: string; studentProfile: { studentId: string } | null; joinedAt: ISODate | null }[];
};

export type MarkSheetStatus = "NOT_STARTED" | "DRAFT" | "SUBMITTED" | "LOCKED";
export type TeacherPaper = {
  id: number; date: ISODate; startTime: string; endTime: string | null; room: string | null; fullMarks: number; passMarks: number;
  examinerId: number | null; courseLevelId: number; subjectId: number;
  exam: { id: number; name: string; termId: number };
  subject: { name: string };
  courseLevel: { name: string };
  sections: { sectionId: number; section: string; status: MarkSheetStatus }[];
};
export type MarksGrid = {
  paper: { id: number; exam: { id: number; name: string; status: string }; subject: string; date: ISODate; startTime: string; fullMarks: number; passMarks: number };
  section: { id: number; name: string };
  status: MarkSheetStatus; submittedAt: ISODate | null; reopenReason: string | null;
  students: { rollNo: number | null; student: StudentRow; obtained: number | null; isAbsent: boolean }[];
};

export type LeaveStatus = "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED" | "CANCELLED";
export type LeaveRequest = {
  id: number; fromDate: ISODate; toDate: ISODate; days: number; reason: string; attachmentUrl: string | null; status: LeaveStatus;
  recommendation: "APPROVE" | "REJECT" | null; reviewedAt: ISODate | null; reviewNote: string | null;
  decidedAt: ISODate | null; decisionNote: string | null; excusedMarks: number; createdAt: ISODate;
  student: StudentRow;
};

export type ResultLineRow = {
  id: number; subjectName: string; fullMarks: number; passMarks: number; obtained: number | null; isAbsent: boolean;
  percent: number; grade: string; gradePoint: number | null; passed: boolean; isOptional: boolean;
};
export type ResultSummaryRow = {
  id: number; examId: number; sectionId: number; studentUserId: number; rollNo: number | null;
  totalObtained: number; totalFull: number; percent: number; gpa: number | null; grade: string; passed: boolean;
  failedSubjects: number; sectionPosition: number | null; classPosition: number | null; withheld: boolean;
  student: { name: string; studentProfile: { studentId: string } | null };
  lines: ResultLineRow[];
};
export type SectionResultStatus = "PROCESSED" | "APPROVED" | "RETURNED" | "PUBLISHED";
export type SectionResultReport = {
  exam: { id: number; name: string; term: { code: string; name: string }; gradingScheme: { name: string; kind: string } };
  status: SectionResultStatus; section: string; className: string; subjects: string[]; summaries: ResultSummaryRow[];
};
export type StudentPerformance = {
  student: { id: number; name: string; studentId: string | null };
  results: (Omit<ResultSummaryRow, "student" | "studentUserId"> & {
    status: SectionResultStatus; withheldReason: string | null;
    exam: { id: number; name: string; type: string; term: { code: string; name: string } };
  })[];
};

/* ---------------------------------- student portal (LMS F3) ---------------------------------- */

/** The student's place this term: class, section, roll number and subjects with their teachers. */
export type StudentPlace = {
  rollNo: number | null; sectionId: number; section: string; room: string | null; class: string;
  term: { code: string; name: string }; classTeacher: string | null;
  subjects: { id: number; code: string; name: string; fullMarks: number; passMarks: number; isOptional: boolean; teachers: string[] }[];
};

export type StudentOnlineClass = Omit<TeacherOnlineClass, "joinUrl" | "_count"> & { canJoin: boolean };

export type StudentExam = {
  id: number; name: string; type: string; instructions: string | null;
  papers: {
    id: number; date: ISODate; startTime: string; endTime: string | null; room: string | null; fullMarks: number; passMarks: number;
    subject: { name: string }; courseLevel: { name: string };
  }[];
};

export type StudentAttendanceSummary = {
  classes: ({ classSessionId: number; title: string; subject: string | null } & AttendanceTally)[];
  overall: AttendanceTally;
};

export type FeedEvent = Pick<CalendarEvent, "id" | "title" | "description" | "type" | "audience" | "startDate" | "endDate" | "courseLevel">;

/** A published exam result of the student's own (withholding is never shown to them). */
export type PublishedResult = {
  id: number; examId: number; rollNo: number | null; totalObtained: number; totalFull: number; percent: number;
  gpa: number | null; grade: string; passed: boolean; failedSubjects: number; sectionPosition: number | null; classPosition: number | null;
  createdAt: ISODate;
  exam: { id: number; name: string; type: string; term: { code: string; name: string } };
  lines: ResultLineRow[];
};

export type IssuedDocument = { serial: string; type: string; issuedAt: ISODate; revokedAt: ISODate | null };

export type TransferStatus = "SUBMITTED" | "VERIFIED" | "APPROVED" | "REJECTED" | "CANCELLED";
export type TransferRequest = {
  id: number; destination: string; reason: string; effectiveDate: ISODate; status: TransferStatus;
  duesCleared: boolean; libraryCleared: boolean; verifiedAt: ISODate | null; verifyNote: string | null;
  decidedAt: ISODate | null; decisionNote: string | null; letterSerial: string | null; createdAt: ISODate;
  student: { id: number; name: string; studentProfile: { studentId: string; status: string } | null };
};
