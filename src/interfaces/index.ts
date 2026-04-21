// ============================================================
// INTERFACES — Central type definitions
// ============================================================

export type Role = "STUDENT" | "TUTOR" | "ADMIN" | "MODERATOR" | "technician";

export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";
export type PaymentMethod = "STRIPE" | "PAYPAL" | "SSLCOMMERZ";
export type BlogStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type IssueType = "ISSUE" | "IMPROVEMENT" | "FEEDBACK";
export type IssueStatus = "PENDING" | "SUCCESS";
export type UserStatus = "ACTIVE" | "BANNED" | "DELETED";
export type VerificationStatus = "approved" | "pending" | "rejected";
export type Priority = "low" | "medium" | "high" | "critical";
export type Severity = "info" | "warning" | "critical";

export interface Tutor {
  id: string;
  name: string;
  subject: string;
  bio: string;
  rating: number;
  reviews: number;
  rate: number;
  image: string;
  online: boolean;
  languages: string[];
  specializations: string[];
  category: string;
  experience: string;
  verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
  subjects: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  fullContent: string;
  date: string;
  category: string;
  status: BlogStatus;
  authorId: string;
  thumbnail: string | null;
  seoTags: Record<string, unknown> | null;
}

export interface Booking {
  id: string;
  student: string;
  studentId: string;
  tutor: string;
  tutorId: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: BookingStatus;
  amount: number;
  meetingLink: string;
  notes: string;
  attachments: string[];
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string;
  invoiceUrl: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply: string | null;
}

export interface AvailabilitySlot {
  id: string;
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Issue {
  id: string;
  title: string;
  username: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  location: string | null;
  userMessage: string;
  adminFeedback: string | null;
  imageUrl: string | null;
  createdAt: string;
  priority: Priority;
}

export interface IssueReply {
  id: string;
  issueId: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  joined: string;
  avatar: string;
  phone: string;
  bio: string;
  location: string;
}

export interface VerificationDoc {
  id: string;
  tutorId: string;
  tutorName: string;
  documentType: string;
  fileName: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string | null;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorId: string;
  target: string;
  details: string;
  severity: Severity;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  bankName: string;
  accountEnding: string;
  status: "completed" | "pending" | "failed";
  date: string;
  transactionId: string;
}

export interface FlaggedContent {
  id: string;
  type: "bio" | "review";
  userId: string;
  userName: string;
  content: string;
  reason: string;
  reportedBy: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface ReportedUser {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedBy: string;
  reportedByName: string;
  reason: string;
  priority: Priority;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
  actionHistory: string[];
}

export interface SessionComplaint {
  id: string;
  sessionId: string;
  studentName: string;
  tutorName: string;
  reason: string;
  status: "investigating" | "escalated" | "resolved";
  priority: Priority;
  createdAt: string;
  moderatorNotes: string;
}

export interface ChatConversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "Tutor" | "Student";
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

// Pagination & Filter helpers
export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

export interface FilterState {
  search: string;
  status: string;
  category: string;
  sortBy: string;
}
