import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, BookOpen, Shield, Video, Star, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const steps = [
  { icon: FileText, title: "1. Create Your Profile", desc: "Sign up and complete your professional profile with your bio, qualifications, and areas of expertise." },
  { icon: Shield, title: "2. Submit Verification", desc: "Upload your credentials, government ID, and proof of qualifications for our team to verify." },
  { icon: Clock, title: "3. Set Your Availability", desc: "Configure your weekly schedule and set your preferred time slots for tutoring sessions." },
  { icon: Video, title: "4. Start Teaching", desc: "Once verified, you'll appear in search results and students can book sessions with you." },
  { icon: Star, title: "5. Build Your Reputation", desc: "Deliver great sessions, collect reviews, and grow your student base organically." },
  { icon: BookOpen, title: "6. Grow & Earn", desc: "Track your earnings, withdraw funds, and expand your teaching portfolio." },
];

const rules = [
  "Be punctual — join sessions on time or earlier",
  "Maintain a professional and respectful demeanor",
  "Respond to student messages within 24 hours",
  "Keep your availability calendar up to date",
  "Provide constructive feedback and session notes",
  "Report any issues through the support system",
  "Do not share personal contact information",
  "Follow our community guidelines at all times",
];

export default function TutorOnboarding() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-black mb-4">Welcome to <span className="text-gradient">SkillBridge</span> for Tutors</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Your guide to getting started as a tutor on our platform. Follow these steps to begin sharing your expertise with students worldwide.</p>
          </motion.div>

          {/* Roadmap */}
          <motion.div variants={fadeUp} className="space-y-4 mb-12">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="bento-card flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Platform Rules */}
          <motion.div variants={fadeUp} className="bento-card mb-12">
            <h2 className="text-xl font-bold text-foreground mb-4">Platform Rules & Guidelines</h2>
            <div className="space-y-3">
              {rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{rule}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Verification Info */}
          <motion.div variants={fadeUp} className="bento-card bg-primary/5 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Applying for Verification</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Verification builds trust with students and improves your visibility. To get verified, submit the following documents through your Tutor Dashboard:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Government-issued photo ID</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Degree certificate or professional qualification</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Teaching or subject-related certifications (optional)</li>
            </ul>
            <p className="text-xs text-muted-foreground">Verification typically takes 2-3 business days.</p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="text-center">
            <Link to="/tutor">
              <Button size="lg" className="bg-primary hover:bg-primary/90 glow-primary rounded-xl px-8">
                Go to Tutor Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
