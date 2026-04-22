// ============================================================
// MOCK DATA — Full platform data layer
// ============================================================

// ── Tutors ──
export const tutors = [
  { id: "1", name: "Dr. Sarah Chen", subject: "Mathematics", bio: "PhD in Applied Mathematics from MIT. 10+ years of teaching experience.", rating: 4.9, reviews: 234, rate: 65, image: "SC", online: true, languages: ["English", "Mandarin"], specializations: ["Calculus", "Linear Algebra", "Statistics"], category: "Mathematics", experience: "10 years", verified: true },
  { id: "2", name: "James Mitchell", subject: "Physics", bio: "Former NASA engineer turned educator. Makes complex physics concepts accessible.", rating: 4.8, reviews: 189, rate: 55, image: "JM", online: true, languages: ["English"], specializations: ["Quantum Mechanics", "Thermodynamics", "Astrophysics"], category: "Science", experience: "8 years", verified: true },
  { id: "3", name: "Priya Sharma", subject: "Computer Science", bio: "Senior software engineer at Google. Expert in algorithms and system design.", rating: 4.9, reviews: 312, rate: 75, image: "PS", online: false, languages: ["English", "Hindi"], specializations: ["Data Structures", "Machine Learning", "Web Development"], category: "Programming", experience: "12 years", verified: true },
  { id: "4", name: "Michael Torres", subject: "Chemistry", bio: "Research scientist with publications in Nature. Passionate about organic chemistry.", rating: 4.7, reviews: 156, rate: 50, image: "MT", online: true, languages: ["English", "Spanish"], specializations: ["Organic Chemistry", "Biochemistry", "Lab Techniques"], category: "Science", experience: "6 years", verified: false },
  { id: "5", name: "Emma Williams", subject: "English Literature", bio: "Published author and literary critic. Oxford graduate with a love for storytelling.", rating: 4.8, reviews: 201, rate: 45, image: "EW", online: false, languages: ["English", "French"], specializations: ["Creative Writing", "Shakespeare", "Modern Literature"], category: "Languages", experience: "9 years", verified: true },
  { id: "6", name: "Dr. Ahmed Hassan", subject: "Biology", bio: "Medical doctor and university professor. Expert in molecular biology and genetics.", rating: 4.9, reviews: 267, rate: 70, image: "AH", online: true, languages: ["English", "Arabic"], specializations: ["Genetics", "Molecular Biology", "Anatomy"], category: "Science", experience: "15 years", verified: true },
  { id: "7", name: "Lisa Park", subject: "Music", bio: "Juilliard graduate and concert pianist. Teaching classical and contemporary music.", rating: 4.6, reviews: 98, rate: 60, image: "LP", online: false, languages: ["English", "Korean"], specializations: ["Piano", "Music Theory", "Composition"], category: "Music & Arts", experience: "7 years", verified: false },
  { id: "8", name: "David Okafor", subject: "Business", bio: "MBA from Wharton. Former McKinsey consultant helping students master business strategy.", rating: 4.8, reviews: 178, rate: 80, image: "DO", online: true, languages: ["English"], specializations: ["Strategy", "Finance", "Marketing"], category: "Business", experience: "11 years", verified: true },
];

// ── Categories ──
export const categories = [
  { id: "cat-1", name: "Mathematics", count: 1240, icon: "📐", subjects: ["Calculus", "Linear Algebra", "Statistics", "Geometry", "Trigonometry"] },
  { id: "cat-2", name: "Science", count: 980, icon: "🔬", subjects: ["Physics", "Chemistry", "Biology", "Astronomy"] },
  { id: "cat-3", name: "Programming", count: 1560, icon: "💻", subjects: ["Python", "JavaScript", "Java", "Data Structures", "ML"] },
  { id: "cat-4", name: "Languages", count: 2100, icon: "🌍", subjects: ["English", "Spanish", "French", "Mandarin", "Arabic"] },
  { id: "cat-5", name: "Business", count: 870, icon: "📊", subjects: ["Strategy", "Finance", "Marketing", "Accounting"] },
  { id: "cat-6", name: "Music & Arts", count: 650, icon: "🎵", subjects: ["Piano", "Guitar", "Music Theory", "Drawing", "Photography"] },
  { id: "cat-7", name: "Test Prep", count: 1100, icon: "📝", subjects: ["SAT", "GRE", "GMAT", "IELTS", "TOEFL"] },
  { id: "cat-8", name: "Writing", count: 740, icon: "✍️", subjects: ["Creative Writing", "Academic Writing", "Essay", "Copywriting"] },
];

// ── Testimonials ──
export const testimonials = [
  { name: "Alex Johnson", role: "Computer Science Student", text: "SkillBridge connected me with an incredible Python tutor. My grades improved from B- to A+ in just two months!", rating: 5 },
  { name: "Maria Garcia", role: "High School Senior", text: "The SAT prep tutors here are phenomenal. I scored 1520 after working with my tutor for 3 months.", rating: 5 },
  { name: "David Kim", role: "MBA Candidate", text: "Found an amazing finance tutor who helped me understand complex derivatives. Worth every penny.", rating: 4 },
  { name: "Sophie Laurent", role: "Music Student", text: "My piano tutor from SkillBridge prepared me for my conservatory audition. I got accepted!", rating: 5 },
];

export const stats = { tutors: 2500, students: 50000, sessions: 180000, satisfaction: 98 };

export const blogPosts = [
  { id: "blog-1", title: "10 Study Techniques Backed by Science", slug: "study-techniques", excerpt: "Discover proven methods to boost your learning efficiency and retain information longer.", fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "Mar 15, 2026", category: "Study Tips", status: "PUBLISHED" as const, authorId: "mod-1", thumbnail: null, seoTags: { keywords: ["study", "learning"] } },
  { id: "blog-2", title: "How to Choose the Right Online Tutor", slug: "choose-tutor", excerpt: "A comprehensive guide to finding the perfect tutor for your learning goals and style.", fullContent: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", date: "Mar 10, 2026", category: "Guide", status: "PUBLISHED" as const, authorId: "mod-1", thumbnail: null, seoTags: { keywords: ["tutor", "guide"] } },
  { id: "blog-3", title: "The Future of Online Education in 2026", slug: "future-education", excerpt: "Exploring emerging trends in EdTech and how they're reshaping the learning landscape.", fullContent: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", date: "Mar 5, 2026", category: "Industry", status: "DRAFT" as const, authorId: "mod-2", thumbnail: null, seoTags: { keywords: ["edtech", "future"] } },
  { id: "blog-4", title: "5 Tips for Effective Online Tutoring", slug: "effective-tutoring", excerpt: "Best practices for tutors to deliver exceptional online learning experiences.", fullContent: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", date: "Feb 28, 2026", category: "Tips", status: "ARCHIVED" as const, authorId: "mod-1", thumbnail: null, seoTags: null },
];

export const faqs = [
  { q: "How does SkillBridge work?", a: "SkillBridge connects students with expert tutors worldwide. Browse tutor profiles, book sessions at your convenience, and learn via our integrated video platform." },
  { q: "How are tutors vetted?", a: "Every tutor goes through a rigorous verification process including identity checks, credential verification, subject knowledge tests, and a demo teaching session." },
  { q: "What if I'm not satisfied with a session?", a: "We offer a 100% satisfaction guarantee. If you're not happy with your session, we'll provide a full refund or match you with another tutor at no cost." },
  { q: "Can I try a tutor before committing?", a: "Yes! Many tutors offer a free 15-minute introductory session so you can assess their teaching style before booking a full session." },
  { q: "What subjects are available?", a: "We cover 200+ subjects across academics, professional skills, music, arts, languages, and test preparation. If you need it, we likely have an expert for it." },
];

// ── Dashboard Stats ──
export const adminStats = [
  { label: "Total Revenue", value: "$128,450", change: "+12.5%", positive: true },
  { label: "Active Users", value: "8,234", change: "+8.2%", positive: true },
  { label: "Total Sessions", value: "12,456", change: "+15.3%", positive: true },
  { label: "Avg Rating", value: "4.8", change: "+0.2", positive: true },
];

export const studentStats = [
  { label: "Hours Learned", value: "42", change: "+5h", positive: true },
  { label: "Courses Active", value: "6", change: "+1", positive: true },
  { label: "Completed", value: "18", change: "+3", positive: true },
  { label: "Avg Score", value: "92%", change: "+4%", positive: true },
];

export const tutorStats = [
  { label: "Total Students", value: "356", change: "+23", positive: true },
  { label: "Active Sessions", value: "12", change: "+3", positive: true },
  { label: "Earnings", value: "$4,820", change: "+$680", positive: true },
  { label: "Avg Rating", value: "4.9", change: "+0.1", positive: true },
];

export const moderatorStats = [
  { label: "Open Tickets", value: "24", change: "-3", positive: true },
  { label: "Resolved Today", value: "12", change: "+5", positive: true },
  { label: "Flagged Content", value: "8", change: "-2", positive: true },
  { label: "Pending Verifications", value: "15", change: "+4", positive: false },
];

// ── Chart Data ──
export const chartData = [
  { name: "Mon", sessions: 24, revenue: 1200 },
  { name: "Tue", sessions: 30, revenue: 1500 },
  { name: "Wed", sessions: 28, revenue: 1400 },
  { name: "Thu", sessions: 35, revenue: 1750 },
  { name: "Fri", sessions: 42, revenue: 2100 },
  { name: "Sat", sessions: 18, revenue: 900 },
  { name: "Sun", sessions: 15, revenue: 750 },
];

export const monthlyRevenueData = [
  { name: "Jan", revenue: 18500, users: 1200 },
  { name: "Feb", revenue: 22300, users: 1450 },
  { name: "Mar", revenue: 28700, users: 1800 },
  { name: "Apr", revenue: 32100, users: 2100 },
  { name: "May", revenue: 35600, users: 2400 },
  { name: "Jun", revenue: 38200, users: 2650 },
  { name: "Jul", revenue: 41500, users: 2900 },
  { name: "Aug", revenue: 44800, users: 3200 },
  { name: "Sep", revenue: 48200, users: 3500 },
  { name: "Oct", revenue: 52100, users: 3800 },
  { name: "Nov", revenue: 55400, users: 4100 },
  { name: "Dec", revenue: 58900, users: 4400 },
];

export const pieData = [
  { name: "Mathematics", value: 30, fill: "hsl(239, 84%, 67%)" },
  { name: "Science", value: 25, fill: "hsl(170, 76%, 40%)" },
  { name: "Programming", value: 20, fill: "hsl(38, 92%, 50%)" },
  { name: "Languages", value: 15, fill: "hsl(270, 84%, 67%)" },
  { name: "Others", value: 10, fill: "hsl(215, 20%, 65%)" },
];

// ── Bookings ──
export const recentBookings = [
  { id: "BK001", student: "Alex Johnson", studentId: "stu-1", tutor: "Dr. Sarah Chen", tutorId: "1", subject: "Calculus II", date: "Apr 10, 2026", time: "10:00 AM", duration: "1 hour", status: "confirmed" as const, amount: 65, meetingLink: "https://meet.skillbridge.com/abc123", notes: "Focus on integration techniques", attachments: [] },
  { id: "BK002", student: "Maria Garcia", studentId: "stu-2", tutor: "James Mitchell", tutorId: "2", subject: "Physics 101", date: "Apr 10, 2026", time: "2:00 PM", duration: "1 hour", status: "pending" as const, amount: 55, meetingLink: "", notes: "", attachments: [] },
  { id: "BK003", student: "David Kim", studentId: "stu-3", tutor: "David Okafor", tutorId: "8", subject: "Business Strategy", date: "Apr 9, 2026", time: "3:00 PM", duration: "1.5 hours", status: "completed" as const, amount: 120, meetingLink: "https://meet.skillbridge.com/def456", notes: "Case study analysis", attachments: ["case-study.pdf"] },
  { id: "BK004", student: "Sophie Laurent", studentId: "stu-4", tutor: "Lisa Park", tutorId: "7", subject: "Piano", date: "Apr 9, 2026", time: "4:00 PM", duration: "1 hour", status: "confirmed" as const, amount: 60, meetingLink: "https://meet.skillbridge.com/ghi789", notes: "Chopin Nocturne practice", attachments: [] },
  { id: "BK005", student: "Ryan O'Brien", studentId: "stu-5", tutor: "Priya Sharma", tutorId: "3", subject: "Data Structures", date: "Apr 8, 2026", time: "11:00 AM", duration: "1 hour", status: "cancelled" as const, amount: 75, meetingLink: "", notes: "Cancelled by student", attachments: [] },
  { id: "BK006", student: "Alex Johnson", studentId: "stu-1", tutor: "Priya Sharma", tutorId: "3", subject: "Algorithms", date: "Apr 7, 2026", time: "9:00 AM", duration: "1 hour", status: "completed" as const, amount: 75, meetingLink: "https://meet.skillbridge.com/jkl012", notes: "Graph algorithms", attachments: ["graph-notes.pdf"] },
  { id: "BK007", student: "Maria Garcia", studentId: "stu-2", tutor: "Dr. Ahmed Hassan", tutorId: "6", subject: "Genetics", date: "Apr 6, 2026", time: "1:00 PM", duration: "1 hour", status: "completed" as const, amount: 70, meetingLink: "", notes: "DNA replication review", attachments: [] },
  { id: "BK008", student: "David Kim", studentId: "stu-3", tutor: "Emma Williams", tutorId: "5", subject: "Creative Writing", date: "Apr 5, 2026", time: "10:00 AM", duration: "1 hour", status: "completed" as const, amount: 45, meetingLink: "", notes: "Short story workshop", attachments: ["draft.docx"] },
];

export const upcomingClasses = [
  { time: "10:00 — 11:00", title: "Introduction to Calculus", level: "Beginner", tutor: "Dr. Sarah Chen" },
  { time: "13:00 — 14:00", title: "Advanced Python", level: "Advanced", tutor: "Priya Sharma" },
  { time: "15:00 — 16:00", title: "Organic Chemistry", level: "Intermediate", tutor: "Michael Torres" },
];

// ── Payments ──
export const payments = [
  { id: "PAY001", bookingId: "BK001", userId: "stu-1", amount: 65, currency: "USD", status: "SUCCESS" as const, paymentMethod: "STRIPE" as const, transactionId: "txn_abc123", invoiceUrl: "/invoices/PAY001.pdf", createdAt: "Apr 10, 2026" },
  { id: "PAY002", bookingId: "BK003", userId: "stu-3", amount: 120, currency: "USD", status: "SUCCESS" as const, paymentMethod: "PAYPAL" as const, transactionId: "txn_def456", invoiceUrl: "/invoices/PAY002.pdf", createdAt: "Apr 9, 2026" },
  { id: "PAY003", bookingId: "BK004", userId: "stu-4", amount: 60, currency: "USD", status: "PENDING" as const, paymentMethod: "STRIPE" as const, transactionId: "txn_ghi789", invoiceUrl: null, createdAt: "Apr 9, 2026" },
  { id: "PAY004", bookingId: "BK006", userId: "stu-1", amount: 75, currency: "USD", status: "SUCCESS" as const, paymentMethod: "STRIPE" as const, transactionId: "txn_jkl012", invoiceUrl: "/invoices/PAY004.pdf", createdAt: "Apr 7, 2026" },
  { id: "PAY005", bookingId: "BK007", userId: "stu-2", amount: 70, currency: "USD", status: "SUCCESS" as const, paymentMethod: "SSLCOMMERZ" as const, transactionId: "txn_mno345", invoiceUrl: "/invoices/PAY005.pdf", createdAt: "Apr 6, 2026" },
  { id: "PAY006", bookingId: "BK005", userId: "stu-5", amount: 75, currency: "USD", status: "FAILED" as const, paymentMethod: "STRIPE" as const, transactionId: "txn_pqr678", invoiceUrl: null, createdAt: "Apr 8, 2026" },
  { id: "PAY007", bookingId: "BK008", userId: "stu-3", amount: 45, currency: "USD", status: "SUCCESS" as const, paymentMethod: "PAYPAL" as const, transactionId: "txn_stu901", invoiceUrl: "/invoices/PAY007.pdf", createdAt: "Apr 5, 2026" },
];

// ── Reviews ──
export const reviews = [
  { id: "rev-1", bookingId: "BK003", studentId: "stu-3", studentName: "David Kim", tutorId: "8", tutorName: "David Okafor", rating: 5, comment: "Excellent session! The case study analysis was incredibly insightful.", createdAt: "Apr 9, 2026", reply: null },
  { id: "rev-2", bookingId: "BK006", studentId: "stu-1", studentName: "Alex Johnson", tutorId: "3", tutorName: "Priya Sharma", rating: 5, comment: "Priya makes algorithms feel intuitive. Best CS tutor I've ever had.", createdAt: "Apr 7, 2026", reply: "Thank you Alex! It was a pleasure working through those graph algorithms with you." },
  { id: "rev-3", bookingId: "BK007", studentId: "stu-2", studentName: "Maria Garcia", tutorId: "6", tutorName: "Dr. Ahmed Hassan", rating: 4, comment: "Very knowledgeable tutor. Could have been a bit more interactive.", createdAt: "Apr 6, 2026", reply: null },
  { id: "rev-4", bookingId: "BK008", studentId: "stu-3", studentName: "David Kim", tutorId: "5", tutorName: "Emma Williams", rating: 5, comment: "Emma's feedback on my short story was transformative. She really pushed me creatively.", createdAt: "Apr 5, 2026", reply: "David, your story had such raw potential! Can't wait to read the next draft." },
  { id: "rev-5", bookingId: "BK001", studentId: "stu-1", studentName: "Alex Johnson", tutorId: "1", tutorName: "Dr. Sarah Chen", rating: 5, comment: "Integration techniques finally make sense! Dr. Chen is amazing.", createdAt: "Apr 10, 2026", reply: null },
];

// ── Availability ──
export const availability = [
  { id: "avl-1", tutorId: "1", date: "2026-04-14", startTime: "09:00", endTime: "10:00", isBooked: false },
  { id: "avl-2", tutorId: "1", date: "2026-04-14", startTime: "11:00", endTime: "12:00", isBooked: true },
  { id: "avl-3", tutorId: "1", date: "2026-04-14", startTime: "14:00", endTime: "15:00", isBooked: false },
  { id: "avl-4", tutorId: "1", date: "2026-04-15", startTime: "10:00", endTime: "11:00", isBooked: false },
  { id: "avl-5", tutorId: "1", date: "2026-04-15", startTime: "13:00", endTime: "14:00", isBooked: true },
  { id: "avl-6", tutorId: "3", date: "2026-04-14", startTime: "09:00", endTime: "10:00", isBooked: false },
  { id: "avl-7", tutorId: "3", date: "2026-04-14", startTime: "15:00", endTime: "16:00", isBooked: false },
  { id: "avl-8", tutorId: "3", date: "2026-04-16", startTime: "10:00", endTime: "11:00", isBooked: true },
];

// ── Issues / Support Tickets ──
export const issues = [
  { id: "ISS001", title: "Session audio quality poor", username: "Alex Johnson", description: "The audio kept cutting out during my calculus session.", type: "ISSUE" as const, status: "PENDING" as const, location: "Session BK001", userMessage: "Please fix the audio issue, it was very disruptive.", adminFeedback: null, imageUrl: null, createdAt: "Apr 10, 2026", priority: "high" as const },
  { id: "ISS002", title: "Tutor didn't show up", username: "Maria Garcia", description: "Booked a physics session but the tutor was absent.", type: "ISSUE" as const, status: "PENDING" as const, location: "Session BK002", userMessage: "I need a refund for this session.", adminFeedback: null, imageUrl: null, createdAt: "Apr 10, 2026", priority: "critical" as const },
  { id: "ISS003", title: "Suggestion for mobile app", username: "David Kim", description: "It would be great to have a native mobile app.", type: "IMPROVEMENT" as const, status: "SUCCESS" as const, location: null, userMessage: "Please consider building a mobile app for easier access.", adminFeedback: "Thank you for the suggestion! We're working on it.", imageUrl: null, createdAt: "Apr 8, 2026", priority: "low" as const },
  { id: "ISS004", title: "Payment not reflected", username: "Sophie Laurent", description: "I paid for a piano session but it still shows pending.", type: "ISSUE" as const, status: "PENDING" as const, location: "Payment PAY003", userMessage: "My payment was deducted but status is still pending.", adminFeedback: null, imageUrl: null, createdAt: "Apr 9, 2026", priority: "high" as const },
  { id: "ISS005", title: "Great experience feedback", username: "Ryan O'Brien", description: "Just wanted to share my positive experience with SkillBridge.", type: "FEEDBACK" as const, status: "SUCCESS" as const, location: null, userMessage: "Love the platform! The tutors are amazing.", adminFeedback: "Thank you Ryan! We appreciate your kind words.", imageUrl: null, createdAt: "Apr 7, 2026", priority: "low" as const },
];

export const issueReplies = [
  { id: "rep-1", issueId: "ISS003", content: "Thank you for the suggestion! We're actively developing a mobile app.", isAdmin: true, createdAt: "Apr 8, 2026" },
  { id: "rep-2", issueId: "ISS003", content: "That's great to hear!", isAdmin: false, createdAt: "Apr 8, 2026" },
  { id: "rep-3", issueId: "ISS005", content: "Thank you for the feedback Ryan!", isAdmin: true, createdAt: "Apr 7, 2026" },
];

// ── Blog Comments ──
export const blogComments = [
  { id: "cmt-1", blogId: "blog-1", content: "Great article! These techniques really helped me.", authorId: "stu-1", authorName: "Alex Johnson", parentId: null, createdAt: "Mar 16, 2026" },
  { id: "cmt-2", blogId: "blog-1", content: "I agree, the spaced repetition method is a game changer.", authorId: "stu-2", authorName: "Maria Garcia", parentId: "cmt-1", createdAt: "Mar 16, 2026" },
  { id: "cmt-3", blogId: "blog-2", content: "This guide was super helpful for finding my tutor!", authorId: "stu-3", authorName: "David Kim", parentId: null, createdAt: "Mar 11, 2026" },
];

// ── Users (for admin management) ──
export const allUsers = [
  { id: "stu-1", name: "Alex Johnson", email: "alex@example.com", role: "STUDENT" as const, status: "ACTIVE" as const, joined: "Jan 2026", avatar: "AJ", phone: "+1234567890", bio: "CS student passionate about algorithms", location: "San Francisco, CA" },
  { id: "stu-2", name: "Maria Garcia", email: "maria@example.com", role: "STUDENT" as const, status: "ACTIVE" as const, joined: "Feb 2026", avatar: "MG", phone: "+1234567891", bio: "High school senior preparing for college", location: "New York, NY" },
  { id: "stu-3", name: "David Kim", email: "david@example.com", role: "STUDENT" as const, status: "ACTIVE" as const, joined: "Mar 2026", avatar: "DK", phone: "+1234567892", bio: "MBA candidate at Wharton", location: "Philadelphia, PA" },
  { id: "stu-4", name: "Sophie Laurent", email: "sophie@example.com", role: "STUDENT" as const, status: "ACTIVE" as const, joined: "Jan 2026", avatar: "SL", phone: "+1234567893", bio: "Music student at Berklee", location: "Boston, MA" },
  { id: "stu-5", name: "Ryan O'Brien", email: "ryan@example.com", role: "STUDENT" as const, status: "BANNED" as const, joined: "Dec 2025", avatar: "RO", phone: "+1234567894", bio: "CS freshman", location: "Austin, TX" },
  { id: "tut-1", name: "Dr. Sarah Chen", email: "sarah@example.com", role: "TUTOR" as const, status: "ACTIVE" as const, joined: "Dec 2025", avatar: "SC", phone: "+1234567895", bio: "PhD in Applied Mathematics from MIT", location: "Cambridge, MA" },
  { id: "tut-2", name: "James Mitchell", email: "james@example.com", role: "TUTOR" as const, status: "ACTIVE" as const, joined: "Nov 2025", avatar: "JM", phone: "+1234567896", bio: "Former NASA engineer", location: "Houston, TX" },
  { id: "tut-3", name: "Priya Sharma", email: "priya@example.com", role: "TUTOR" as const, status: "ACTIVE" as const, joined: "Oct 2025", avatar: "PS", phone: "+1234567897", bio: "Senior software engineer at Google", location: "Mountain View, CA" },
  { id: "mod-1", name: "Karen Williams", email: "karen@example.com", role: "MODERATOR" as const, status: "ACTIVE" as const, joined: "Sep 2025", avatar: "KW", phone: "+1234567898", bio: "Community manager", location: "Seattle, WA" },
  { id: "mod-2", name: "Tom Baker", email: "tom@example.com", role: "MODERATOR" as const, status: "ACTIVE" as const, joined: "Oct 2025", avatar: "TB", phone: "+1234567899", bio: "Content moderator", location: "Portland, OR" },
  { id: "adm-1", name: "Admin User", email: "admin@example.com", role: "ADMIN" as const, status: "ACTIVE" as const, joined: "Aug 2025", avatar: "AU", phone: "+1234567800", bio: "Platform administrator", location: "Remote" },
];

// ── Tutor Earnings / Wallet ──
export const tutorEarnings = {
  availableBalance: 3240,
  pendingPayouts: 680,
  totalEarned: 12450,
  thisMonth: 1580,
  lastMonth: 1420,
  weeklyData: [
    { name: "Week 1", earnings: 320 },
    { name: "Week 2", earnings: 450 },
    { name: "Week 3", earnings: 380 },
    { name: "Week 4", earnings: 430 },
  ],
  monthlyData: [
    { name: "Jan", earnings: 980 },
    { name: "Feb", earnings: 1120 },
    { name: "Mar", earnings: 1340 },
    { name: "Apr", earnings: 1580 },
  ],
};

export const withdrawals = [
  { id: "WD001", amount: 500, bankName: "Chase Bank", accountEnding: "4523", status: "completed" as const, date: "Apr 5, 2026", transactionId: "wd_abc123" },
  { id: "WD002", amount: 800, bankName: "Chase Bank", accountEnding: "4523", status: "completed" as const, date: "Mar 20, 2026", transactionId: "wd_def456" },
  { id: "WD003", amount: 350, bankName: "Chase Bank", accountEnding: "4523", status: "pending" as const, date: "Apr 10, 2026", transactionId: "wd_ghi789" },
];

// ── Verification Documents ──
export const verificationDocs = [
  { id: "ver-1", tutorId: "1", tutorName: "Dr. Sarah Chen", documentType: "Government ID", fileName: "sarah_id.pdf", status: "approved" as const, submittedAt: "Dec 2025", reviewedAt: "Dec 2025", reviewedBy: "mod-1", notes: "All documents verified" },
  { id: "ver-2", tutorId: "2", tutorName: "James Mitchell", documentType: "Degree Certificate", fileName: "james_degree.pdf", status: "approved" as const, submittedAt: "Nov 2025", reviewedAt: "Nov 2025", reviewedBy: "mod-1", notes: "NASA credentials confirmed" },
  { id: "ver-3", tutorId: "4", tutorName: "Michael Torres", documentType: "Government ID", fileName: "michael_id.pdf", status: "pending" as const, submittedAt: "Apr 8, 2026", reviewedAt: null, reviewedBy: null, notes: null },
  { id: "ver-4", tutorId: "7", tutorName: "Lisa Park", documentType: "Professional Certificate", fileName: "lisa_cert.pdf", status: "pending" as const, submittedAt: "Apr 9, 2026", reviewedAt: null, reviewedBy: null, notes: null },
  { id: "ver-5", tutorId: "4", tutorName: "Michael Torres", documentType: "Degree Certificate", fileName: "michael_degree.pdf", status: "rejected" as const, submittedAt: "Apr 1, 2026", reviewedAt: "Apr 3, 2026", reviewedBy: "mod-2", notes: "Document quality too low, please resubmit" },
];

// ── Flagged Content (for moderator) ──
export const flaggedContent = [
  { id: "flag-1", type: "bio" as const, userId: "tut-fake", userName: "Suspicious Tutor", content: "Get rich quick! Contact me at scam@email.com for guaranteed results.", reason: "Spam/Scam", reportedBy: "auto-filter", createdAt: "Apr 10, 2026", status: "pending" as const },
  { id: "flag-2", type: "review" as const, userId: "stu-5", userName: "Ryan O'Brien", content: "This tutor is absolutely terrible and a waste of money!!!", reason: "Inappropriate language", reportedBy: "stu-1", createdAt: "Apr 9, 2026", status: "pending" as const },
  { id: "flag-3", type: "bio" as const, userId: "tut-2", userName: "James Mitchell", content: "Former NASA engineer turned educator.", reason: "Unverified claims", reportedBy: "auto-filter", createdAt: "Apr 8, 2026", status: "approved" as const },
];

// ── Reported Users ──
export const reportedUsers = [
  { id: "rpt-1", reportedUserId: "stu-5", reportedUserName: "Ryan O'Brien", reportedBy: "tut-3", reportedByName: "Priya Sharma", reason: "Abusive language during session", priority: "high" as const, status: "pending" as const, createdAt: "Apr 9, 2026", actionHistory: ["Reported by tutor"] },
  { id: "rpt-2", reportedUserId: "tut-fake", reportedUserName: "Suspicious Tutor", reportedBy: "stu-1", reportedByName: "Alex Johnson", reason: "Spam profile with fake credentials", priority: "critical" as const, status: "pending" as const, createdAt: "Apr 10, 2026", actionHistory: ["Reported by student", "Flagged by auto-filter"] },
  { id: "rpt-3", reportedUserId: "stu-2", reportedUserName: "Maria Garcia", reportedBy: "tut-2", reportedByName: "James Mitchell", reason: "No-show for multiple sessions", priority: "medium" as const, status: "resolved" as const, createdAt: "Apr 5, 2026", actionHistory: ["Reported by tutor", "Warning issued", "Resolved"] },
];

// ── Session Complaints ──
export const sessionComplaints = [
  { id: "sc-1", sessionId: "BK002", studentName: "Maria Garcia", tutorName: "James Mitchell", reason: "Tutor was 20 minutes late", status: "investigating" as const, priority: "high" as const, createdAt: "Apr 10, 2026", moderatorNotes: "Checking tutor's connectivity logs" },
  { id: "sc-2", sessionId: "BK005", studentName: "Ryan O'Brien", tutorName: "Priya Sharma", reason: "Student was disruptive and rude", status: "escalated" as const, priority: "critical" as const, createdAt: "Apr 8, 2026", moderatorNotes: "Escalated to admin for account review" },
];

// ── Chat Messages ──
export const chatConversations = [
  {
    id: "conv-1",
    participantName: "Dr. Sarah Chen",
    participantAvatar: "SC",
    participantRole: "Tutor" as const,
    lastMessage: "Sure, let's review those integration problems in the next session!",
    lastMessageTime: "10:30 AM",
    unread: 2,
    online: true,
    messages: [
      { id: "msg-1", senderId: "stu-1", content: "Hi Dr. Chen! I had a question about the homework.", timestamp: "10:15 AM", isOwn: true },
      { id: "msg-2", senderId: "tut-1", content: "Of course! What's the question?", timestamp: "10:18 AM", isOwn: false },
      { id: "msg-3", senderId: "stu-1", content: "I'm stuck on problem 5 about integration by parts.", timestamp: "10:22 AM", isOwn: true },
      { id: "msg-4", senderId: "tut-1", content: "Sure, let's review those integration problems in the next session!", timestamp: "10:30 AM", isOwn: false },
    ],
  },
  {
    id: "conv-2",
    participantName: "Priya Sharma",
    participantAvatar: "PS",
    participantRole: "Tutor" as const,
    lastMessage: "The graph algorithms material has been uploaded.",
    lastMessageTime: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: "msg-5", senderId: "tut-3", content: "Hi Alex! I've uploaded the materials for our next session.", timestamp: "Yesterday 3:00 PM", isOwn: false },
      { id: "msg-6", senderId: "stu-1", content: "Thanks Priya! I'll review them before our session.", timestamp: "Yesterday 3:15 PM", isOwn: true },
      { id: "msg-7", senderId: "tut-3", content: "The graph algorithms material has been uploaded.", timestamp: "Yesterday 4:00 PM", isOwn: false },
    ],
  },
  {
    id: "conv-3",
    participantName: "David Okafor",
    participantAvatar: "DO",
    participantRole: "Tutor" as const,
    lastMessage: "Looking forward to our strategy session!",
    lastMessageTime: "2 days ago",
    unread: 1,
    online: true,
    messages: [
      { id: "msg-8", senderId: "tut-8", content: "Looking forward to our strategy session!", timestamp: "2 days ago", isOwn: false },
    ],
  },
];

// ── Audit Logs ──
export const auditLogs = [
  { id: "log-1", action: "user.login", actor: "Admin User", actorId: "adm-1", target: "admin@example.com", details: "Admin login from 192.168.1.1", severity: "info" as const, createdAt: "Apr 11, 2026 09:00" },
  { id: "log-2", action: "user.ban", actor: "Karen Williams", actorId: "mod-1", target: "Ryan O'Brien (stu-5)", details: "User banned for abusive behavior", severity: "warning" as const, createdAt: "Apr 10, 2026 14:30" },
  { id: "log-3", action: "payment.refund", actor: "Admin User", actorId: "adm-1", target: "PAY006", details: "Refund processed for cancelled session", severity: "info" as const, createdAt: "Apr 10, 2026 11:00" },
  { id: "log-4", action: "tutor.verify", actor: "Karen Williams", actorId: "mod-1", target: "Dr. Sarah Chen (tut-1)", details: "Tutor verification approved", severity: "info" as const, createdAt: "Apr 9, 2026 16:00" },
  { id: "log-5", action: "security.suspicious", actor: "System", actorId: "system", target: "unknown-ip", details: "Multiple failed login attempts from 10.0.0.1", severity: "critical" as const, createdAt: "Apr 9, 2026 03:00" },
  { id: "log-6", action: "withdrawal.approve", actor: "Admin User", actorId: "adm-1", target: "WD001", details: "Withdrawal of $500 approved for Dr. Sarah Chen", severity: "info" as const, createdAt: "Apr 5, 2026 10:00" },
  { id: "log-7", action: "content.flag", actor: "Auto-Filter", actorId: "system", target: "tut-fake bio", details: "Bio flagged for spam content", severity: "warning" as const, createdAt: "Apr 10, 2026 08:00" },
];

// ── Platform Settings ──
export const platformSettings = {
  general: { platformName: "SkillBridge", tagline: "Learn from the best", supportEmail: "support@skillbridge.com", maintenanceMode: false },
  payment: { commissionRate: 15, minWithdrawal: 50, payoutSchedule: "weekly", enabledGateways: ["STRIPE", "PAYPAL", "SSLCOMMERZ"] },
  features: { chatEnabled: true, videoEnabled: true, blogEnabled: true, reviewsEnabled: true, notificationsEnabled: true },
};

// ── Saved Tutors ──
export const savedTutors = ["1", "3", "6", "8"];
