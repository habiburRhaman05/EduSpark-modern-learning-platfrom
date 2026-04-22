import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Award, Globe, Heart } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-black mb-4">About <span className="text-gradient">SkillBridge</span></h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">We're on a mission to democratize education by connecting learners with the world's best tutors.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="bento-card p-8 mb-12">
            <h2 className="text-2xl font-black mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Founded in 2024, SkillBridge emerged from a simple observation: quality education shouldn't depend on geography or economic background. Our founders, themselves products of mentorship, envisioned a platform where anyone could access world-class tutoring from verified experts.</p>
            <p className="text-muted-foreground leading-relaxed">Today, we serve over 50,000 students across 120 countries, with 2,500+ verified tutors covering 200+ subjects. From SAT prep to PhD-level research guidance, SkillBridge is where serious learners meet exceptional educators.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Users, label: "50,000+ Students", desc: "Active learners worldwide" },
              { icon: Award, label: "2,500+ Tutors", desc: "Verified experts" },
              { icon: Globe, label: "120 Countries", desc: "Global reach" },
              { icon: Heart, label: "98% Satisfaction", desc: "Student happiness" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="bento-card text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-bold text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="bento-card p-8">
            <h2 className="text-2xl font-black mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Excellence", desc: "We hold our tutors to the highest standards with rigorous vetting and ongoing quality checks." },
                { title: "Accessibility", desc: "Education should be available to everyone. We offer flexible pricing and scholarship programs." },
                { title: "Innovation", desc: "We continuously improve our platform with cutting-edge technology to enhance the learning experience." },
              ].map((v, i) => (
                <div key={i}>
                  <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
