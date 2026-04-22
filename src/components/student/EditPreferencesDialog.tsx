import { useEffect, useState } from "react";
import { Loader2, Save, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","Computer Science","English","History","Economics","Music","Art","Languages","Business"];
const STYLES = [
  { v: "visual", l: "Visual" },
  { v: "auditory", l: "Auditory" },
  { v: "reading", l: "Reading" },
  { v: "kinesthetic", l: "Hands-on" },
];
const SCHEDULES = [
  { v: "morning", l: "Morning" },
  { v: "afternoon", l: "Afternoon" },
  { v: "evening", l: "Evening" },
  { v: "flexible", l: "Flexible" },
];
const LEVELS = ["beginner", "intermediate", "advanced"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function EditPreferencesDialog({ open, onClose }: Props) {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [subjects, setSubjects] = useState<string[]>([]);
  const [style, setStyle] = useState("visual");
  const [schedule, setSchedule] = useState("flexible");
  const [level, setLevel] = useState("beginner");
  const [budgetMin, setBudgetMin] = useState("10");
  const [budgetMax, setBudgetMax] = useState("50");
  const [goals, setGoals] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    supabase.from("student_preferences").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setExistingId(data.id);
        setSubjects(data.preferred_subjects || []);
        setStyle(data.learning_style || "visual");
        setSchedule(data.preferred_schedule || "flexible");
        setLevel(data.experience_level || "beginner");
        setBudgetMin(String(data.budget_min ?? 10));
        setBudgetMax(String(data.budget_max ?? 50));
        setGoals(data.goals || "");
      } else {
        setExistingId(null);
      }
      setLoading(false);
    });
  }, [open, user]);

  const toggle = (s: string) => setSubjects(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      preferred_subjects: subjects,
      learning_style: style,
      preferred_schedule: schedule,
      experience_level: level,
      budget_min: parseFloat(budgetMin) || 0,
      budget_max: parseFloat(budgetMax) || 100,
      goals,
    };
    const { error } = existingId
      ? await supabase.from("student_preferences").update(payload).eq("id", existingId)
      : await supabase.from("student_preferences").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message || "Failed to save"); return; }
    toast.success("Preferences updated");
    await refreshProfile();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Edit Learning Preferences</DialogTitle>
          <DialogDescription>Tell us what you want to learn so we can match you with the right tutors.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-5 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Subjects of Interest</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {SUBJECTS.map(s => (
                  <button key={s} type="button" onClick={() => toggle(s)} className={`p-2 rounded-lg text-xs font-medium transition border ${subjects.includes(s) ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Learning Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map(o => (
                    <button key={o.v} type="button" onClick={() => setStyle(o.v)} className={`p-2 rounded-lg text-xs font-medium border ${style === o.v ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground"}`}>{o.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Schedule</label>
                <div className="grid grid-cols-2 gap-2">
                  {SCHEDULES.map(o => (
                    <button key={o.v} type="button" onClick={() => setSchedule(o.v)} className={`p-2 rounded-lg text-xs font-medium border ${schedule === o.v ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground"}`}>{o.l}</button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Experience Level</label>
              <div className="flex gap-2">
                {LEVELS.map(l => (
                  <button key={l} type="button" onClick={() => setLevel(l)} className={`flex-1 p-2 rounded-lg text-xs font-medium capitalize border ${level === l ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground"}`}>{l}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Budget Min ($/hr)</label>
                <Input type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Budget Max ($/hr)</label>
                <Input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} className="rounded-xl" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Learning Goals</label>
              <Textarea value={goals} onChange={e => setGoals(e.target.value)} placeholder="What do you want to achieve?" className="rounded-xl min-h-[80px]" maxLength={500} />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={save} disabled={saving || loading} className="bg-primary hover:bg-primary/90">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : <><Save className="w-4 h-4 mr-2" /> Save Preferences</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
