import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { ScrollProgress, ScrollToTop } from "@/components/ScrollProgress";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { FeaturedTutors } from "@/components/landing/FeaturedTutors";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { VideoCallSection } from "@/components/landing/VideoCallSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { BlogSection } from "@/components/landing/BlogSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
        <FeaturedTutors />
        <HowItWorks />
        <VideoCallSection />
        <FeaturesSection />
        <TestimonialsSection />
        <BlogSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <ChatbotWidget />
      <ScrollToTop />
    </div>
  );
};

export default Index;
