import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, BookOpen, Clock, Target, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
  "English", "History", "Economics", "Music", "Art", "Languages", "Business",
];

const learningStyles = [
  { value: "visual", label: "Visual", desc: "Learn through images, diagrams & videos" },
  { value: "auditory", label: "Auditory", desc: "Learn through listening & discussion" },
  { value: "reading", label: "Reading/Writing", desc: "Learn through texts & notes" },
  { value: "kinesthetic", label: "Hands-on", desc: "Learn through practice & experimentation" },
];

const schedules = [
  { value: "morning", label: "Morning", desc: "6 AM - 12 PM" },
  { value: "afternoon", label: "Afternoon", desc: "12 PM - 5 PM" },
  { value: "evening", label: "Evening", desc: "5 PM - 9 PM" },
  { value: "flexible", label: "Flexible", desc: "Any time works" },
];

const levels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function StudentPreferences() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState("");
  const [schedule, setSchedule] = useState("");
  const [level, setLevel] = useState("beginner");
  const [budgetMin, setBudgetMin] = useState("10");
  const [budgetMax, setBudgetMax] = useState("50");
  const [goals, setGoals] = useState("");

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("student_preferences").insert({
      user_id: user.id,
      preferred_subjects: selectedSubjects,
      learning_style: learningStyle,
      preferred_schedule: schedule,
      experience_level: level,
      budget_min: parseFloat(budgetMin) || 0,
      budget_max: parseFloat(budgetMax) || 100,
      goals,
    });
    setSubmitting(false);
    if (error) { toast.error("Failed to save preferences"); return; }
    toast.success("Preferences saved! Let's find your perfect tutor.");
    await refreshProfile();
    navigate("/dashboard");
  };

  const steps = [
    // Step 0: Subjects
    <motion.div key="subjects" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground">What do you want to learn?</h2>
        <p className="text-sm text-muted-foreground">Select subjects you're interested in</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => toggleSubject(s)}
            className={`p-3 rounded-xl text-sm font-medium transition-all border ${
              selectedSubjects.includes(s)
                ? "bg-primary/10 border-primary text-primary"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 1: Learning Style
    <motion.div key="style" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground">How do you learn best?</h2>
        <p className="text-sm text-muted-foreground">Choose your preferred learning style</p>
      </div>
      <div className="space-y-3">
        {learningStyles.map((ls) => (
          <button
            key={ls.value}
            onClick={() => setLearningStyle(ls.value)}
            className={`w-full p-4 rounded-xl text-left transition-all border ${
              learningStyle === ls.value
                ? "bg-primary/10 border-primary"
                : "border-border hover:border-primary/30"
            }`}
          >
            <p className="font-medium text-foreground">{ls.label}</p>
            <p className="text-xs text-muted-foreground">{ls.desc}</p>
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 2: Schedule + Level
    <motion.div key="schedule" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground">When can you study?</h2>
        <p className="text-sm text-muted-foreground">Set your preferred schedule and level</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {schedules.map((s) => (
          <button
            key={s.value}
            onClick={() => setSchedule(s.value)}
            className={`p-3 rounded-xl text-left transition-all border ${
              schedule === s.value ? "bg-primary/10 border-primary" : "border-border hover:border-primary/30"
            }`}
          >
            <p className="font-medium text-sm text-foreground">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </button>
        ))}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Experience Level</p>
        <div className="flex gap-3">
          {levels.map((l) => (
            <button
              key={l.value}
              onClick={() => setLevel(l.value)}
              className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all border ${
                level === l.value ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>,

    // Step 3: Budget + Goals
    <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <Target className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground">Almost there!</h2>
        <p className="text-sm text-muted-foreground">Set your budget and learning goals</p>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Budget Range (per hour)
        </p>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Min ($)</label>
            <Input value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} type="number" className="glass border-white/[0.08] rounded-xl" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Max ($)</label>
            <Input value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} type="number" className="glass border-white/[0.08] rounded-xl" />
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">What are your learning goals?</label>
        <Textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="e.g., Pass my calculus exam, learn Python for web development, prepare for SAT..."
          className="glass border-white/[0.08] rounded-xl min-h-[100px]"
        />
      </div>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {steps[step]}

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="border-border rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          )}
          <Button
            onClick={step === steps.length - 1 ? handleSubmit : () => setStep(step + 1)}
            disabled={submitting}
            className="flex-1 bg-primary hover:bg-primary/90 glow-primary rounded-xl h-12"
          >
            {step === steps.length - 1 ? (submitting ? "Saving..." : "Complete Setup") : "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {step === 0 && (
          <button onClick={() => navigate("/dashboard")} className="text-sm text-muted-foreground hover:text-foreground mt-4 block mx-auto">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
