import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories, useSubjectsForCategory } from "@/hooks/useCategories";
import { useMyTutorProfile, useOnboardingStatus } from "@/hooks/useTutorProfile";
import { VerifiedAvatar } from "@/components/VerifiedAvatar";

const profileSchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(80),
  phone: z.string().trim().min(6, "Enter a valid phone").max(40),
  location: z.string().trim().min(2, "Required").max(120),
  bio: z.string().trim().min(20, "Bio should be at least 20 characters").max(1000),
  headline: z.string().trim().max(160).optional().or(z.literal("")),
  category: z.string().trim().min(1, "Pick a category"),
  hourlyRate: z.coerce.number().min(1, "Set your hourly rate").max(10000),
  experience: z.coerce.number().int().min(1, "Years of experience required").max(80),
  education: z.string().trim().max(200).optional().or(z.literal("")),
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function TutorAccount() {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const { data: tp, isLoading: tpLoading } = useMyTutorProfile();
  const { data: categories } = useCategories();
  const { percent, missing, isComplete } = useOnboardingStatus();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: { name: "", phone: "", location: "", bio: "", headline: "", category: "", hourlyRate: 0, experience: 0, education: "" },
  });

  const watchedCategory = form.watch("category");
  const { subjects: availableSubjects } = useSubjectsForCategory(watchedCategory);

  useEffect(() => {
    if (!user || !profile || tpLoading) return;
    form.reset({
      name: profile.full_name || "",
      phone: profile.phone || "",
      location: profile.location || "",
      bio: profile.bio || "",
      headline: tp?.headline || "",
      category: tp?.category || "",
      hourlyRate: Number(tp?.hourly_rate || 0),
      experience: Number(tp?.experience_years || 0),
      education: tp?.education || "",
    });
    setSelectedSubjects(tp?.subjects || []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, tp, tpLoading]);

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const onSubmit = async (values: ProfileForm) => {
    if (!user) return;
    if (selectedSubjects.length === 0) {
      toast.error("Select at least one subject");
      return;
    }
    setSaving(true);
    const { error: pErr } = await updateProfile({
      full_name: values.name,
      phone: values.phone,
      bio: values.bio,
      location: values.location,
    });
    const { error: tErr } = await supabase.from("tutor_profiles").upsert({
      user_id: user.id,
      headline: values.headline || null,
      category: values.category,
      hourly_rate: values.hourlyRate,
      experience_years: values.experience,
      education: values.education || null,
      subjects: selectedSubjects,
      onboarding_completed: true,
      is_active: true,
    }, { onConflict: "user_id" });
    setSaving(false);
    if (pErr || tErr) {
      toast.error(pErr?.message || (tErr as any)?.message || "Failed to save");
      return;
    }
    toast.success("Profile saved");
    await refreshProfile();
  };

  const onPickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setConfirmOpen(true);
  };

  const confirmUpload = async () => {
    if (!user || !avatarFile) return;
    setUploadingAvatar(true);
    try {
      const ext = avatarFile.name.split(".").pop() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      await updateProfile({ avatar_url: pub.publicUrl });
      await refreshProfile();
      setConfirmOpen(false);
      setSuccessOpen(true);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading || tpLoading) {
    return (
      <>
        <PageHeader title="Tutor Profile" description="Loading..." />
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Tutor Profile" description="Update your professional information" actions={
        <Button onClick={form.handleSubmit(onSubmit)} disabled={saving} className="bg-primary hover:bg-primary/90 rounded-xl">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Saving..." : "Save changes"}
        </Button>
      } />

      {/* Profile completion banner */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl border border-destructive/30 bg-destructive/5"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Profile {percent}% complete</p>
              <p className="text-xs text-muted-foreground">{missing.length} fields remaining: {missing.map(m=>m.label).join(", ")}</p>
            </div>
          </div>
          <Progress value={percent} className="h-2" />
        </motion.div>
      )}

      <form className="grid lg:grid-cols-3 gap-6">
        <div className="bento-card text-center">
          <div className="relative inline-block mb-4">
            <VerifiedAvatar
              src={profile?.avatar_url}
              name={form.watch("name") || "T"}
              size="xl"
              isVerified={tp?.is_verified ?? false}
              status={tp?.verification_status as any}
            />
            <label className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-primary/30 z-10">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={onPickAvatar} className="hidden" />
            </label>
          </div>
          <h3 className="text-lg font-bold text-foreground">{form.watch("name") || "Your name"}</h3>
          <p className="text-sm text-muted-foreground">{form.watch("category") || "Pick a category"}</p>
          <p className="text-xs text-muted-foreground mt-1">{form.watch("experience") || 0} years experience</p>
          {tp?.is_verified && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary">
              <CheckCircle2 className="w-3 h-3" /> Verified Tutor
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bento-card">
            <h3 className="font-bold text-foreground mb-4">Personal Info</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" error={form.formState.errors.name?.message}>
                <Input {...form.register("name")} className="rounded-xl" />
              </Field>
              <Field label="Email">
                <Input value={profile?.email || ""} disabled className="rounded-xl" />
              </Field>
              <Field label="Phone" error={form.formState.errors.phone?.message}>
                <Input {...form.register("phone")} className="rounded-xl" />
              </Field>
              <Field label="Location" error={form.formState.errors.location?.message}>
                <Input {...form.register("location")} placeholder="City, Country" className="rounded-xl" />
              </Field>
            </div>
          </div>

          <div className="bento-card">
            <h3 className="font-bold text-foreground mb-4">Professional Info</h3>
            <div className="space-y-4">
              <Field label="Headline" error={form.formState.errors.headline?.message}>
                <Input {...form.register("headline")} placeholder="e.g. PhD Mathematics Tutor with 10+ years experience" className="rounded-xl" />
              </Field>
              <Field label="Bio" error={form.formState.errors.bio?.message}>
                <Textarea {...form.register("bio")} className="rounded-xl min-h-[100px]" placeholder="Tell students about your teaching style, approach, and what makes you unique..." />
              </Field>
              <Field label="Education" error={form.formState.errors.education?.message}>
                <Input {...form.register("education")} placeholder="e.g. PhD in Mathematics, MIT" className="rounded-xl" />
              </Field>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Hourly Rate ($)" error={form.formState.errors.hourlyRate?.message}>
                  <Input type="number" {...form.register("hourlyRate")} className="rounded-xl" />
                </Field>
                <Field label="Category" error={form.formState.errors.category?.message}>
                  <Select value={watchedCategory} onValueChange={(v) => { form.setValue("category", v, { shouldValidate: true }); setSelectedSubjects([]); }}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      {(categories || []).map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Experience (years)" error={form.formState.errors.experience?.message}>
                  <Input type="number" {...form.register("experience")} className="rounded-xl" />
                </Field>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Subjects {selectedSubjects.length > 0 && <span className="text-primary">({selectedSubjects.length} selected)</span>}
                </Label>
                {!watchedCategory ? (
                  <p className="text-xs text-muted-foreground italic p-3 bg-muted/30 rounded-xl">Select a category first to see available subjects.</p>
                ) : availableSubjects.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No subjects defined for this category.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSubjects.map((s) => {
                      const active = selectedSubjects.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSubject(s)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                            active
                              ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30"
                              : "bg-muted text-muted-foreground border-transparent hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Confirm avatar */}
      <Dialog open={confirmOpen} onOpenChange={(o) => { if (!o) { setConfirmOpen(false); setAvatarFile(null); setAvatarPreview(null); } }}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Update profile photo?</DialogTitle>
            <DialogDescription>This image will be visible to students.</DialogDescription>
          </DialogHeader>
          {avatarPreview && (
            <div className="flex justify-center py-2">
              <img src={avatarPreview} alt="preview" className="w-32 h-32 rounded-2xl object-cover ring-2 ring-primary/30" />
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setConfirmOpen(false); setAvatarFile(null); }}>Cancel</Button>
            <Button onClick={confirmUpload} disabled={uploadingAvatar} className="bg-primary hover:bg-primary/90 rounded-xl">
              {uploadingAvatar && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Confirm upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl text-center">
          <AnimatePresence>
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-4">
              <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-9 h-9 text-accent" />
              </div>
              <DialogTitle>Photo updated</DialogTitle>
              <DialogDescription className="mt-1">Your new profile photo is now live.</DialogDescription>
            </motion.div>
          </AnimatePresence>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setSuccessOpen(false)} className="bg-primary hover:bg-primary/90 rounded-xl">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
