import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black mb-4">Terms of <span className="text-gradient">Service</span></h1>
          <p className="text-muted-foreground mb-8">Last updated: April 10, 2026</p>
          
          {[
            { title: "1. Acceptance of Terms", content: "By accessing and using SkillBridge, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time." },
            { title: "2. User Accounts", content: "You must create an account to access certain features. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must provide accurate information during registration." },
            { title: "3. Tutor Services", content: "Tutors on SkillBridge are independent educators, not employees. While we verify credentials and maintain quality standards, sessions are conducted at the tutor's discretion. SkillBridge facilitates connections but does not guarantee specific learning outcomes." },
            { title: "4. Payment & Refunds", content: "Payments are processed securely through our platform. Our satisfaction guarantee covers refund requests made within 24 hours of a session. Tutors receive payment after session completion, minus the platform service fee." },
            { title: "5. Privacy & Data", content: "We take your privacy seriously. Personal data is collected, stored, and processed in accordance with our Privacy Policy. Session recordings, when enabled, are stored securely and accessible only to participants." },
            { title: "6. Code of Conduct", content: "All users must maintain respectful, professional behavior. Harassment, discrimination, or inappropriate conduct will result in immediate account suspension. We foster an inclusive learning environment for everyone." },
          ].map((section, i) => (
            <div key={i} className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
