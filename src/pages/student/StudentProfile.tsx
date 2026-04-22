import { useState, useEffect, useRef, useMemo } from "react";
import {
  Camera, Save, Upload, CheckCircle2, Loader2, Sparkles,
  User as UserIcon, Mail, Phone, MapPin, Pencil, X,
  Shield, BookOpen, Heart, CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EditPreferencesDialog } from "@/components/student/EditPreferencesDialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentProfile() {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", bio: "", location: "" });
  const [initialForm, setInitialForm] = useState(form);

  // Avatar dialog state
  const [avatarDialog, setAvatarDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      const next = {
        name: profile.full_name || "", email: profile.email || "",
        phone: profile.phone || "", bio: profile.bio || "", location: profile.location || "",
      };
      setForm(next);
      setInitialForm(next);
    }
  }, [profile]);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  // Profile completion (simple weighted score)
  const completion = useMemo(() => {
    const fields = [
      !!form.name, !!form.email, !!form.phone, !!form.location,
      !!form.bio && form.bio.length >= 20, !!profile?.avatar_url,
    ];
    const done = fields.filter(Boolean).length;
    return Math.round((done / fields.length) * 100);
  }, [form, profile?.avatar_url]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    const { error } = await updateProfile({
      full_name: form.name, phone: form.phone, bio: form.bio, location: form.location,
    });
    setSaving(false);
    if (error) { toast.error("Failed to update profile"); return; }
    setInitialForm(form);
    toast.success("Profile updated", { description: "Your changes are now live." });
  };

  const handleDiscard = () => setForm(initialForm);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const initials = (form.name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const createdAt = (profile as any)?.created_at as string | undefined;
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : "—";

  const onPickFile = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSuccess(false);
  };

  const confirmUpload = async () => {
    if (!pendingFile || !user) return;
    setUploading(true);
    try {
      const ext = pendingFile.name.split(".").pop() || "png";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, pendingFile, { upsert: true, contentType: pendingFile.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: updErr } = await updateProfile({ avatar_url: pub.publicUrl });
      if (updErr) throw updErr;
      await refreshProfile();
      setSuccess(true);
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const closeDialog = () => {
    setAvatarDialog(false);
    setTimeout(() => { setPendingFile(null); setPreviewUrl(null); setSuccess(false); }, 200);
  };

  // SVG ring math
  const RING_R = 28;
  const RING_C = 2 * Math.PI * RING_R;
  const ringOffset = RING_C - (completion / 100) * RING_C;

  return (
    <>
      <PageHeader title="Profile & Account" description="Manage your personal information" />

      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card mb-6">
        <div className="h-36 sm:h-44 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.25),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--accent)/0.2),transparent_50%)]" />
        </div>
        <div className="px-6 pb-6 -mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end gap-4 relative">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-card border-4 border-card overflow-hidden shadow-xl flex items-center justify-center text-3xl font-black text-primary bg-primary/15">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt={form.name} className="w-full h-full object-cover" />
                : initials}
            </div>
            <button
              onClick={() => setAvatarDialog(true)}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform ring-2 ring-card"
              aria-label="Change avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-foreground truncate">{form.name || "Your Name"}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{form.email}</span>
              {form.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{form.location}</span>}
              <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />Joined {memberSince}</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setPrefsOpen(true)}
            className="rounded-xl border-border self-start sm:self-end"
          >
            <Sparkles className="w-4 h-4 mr-2" /> Edit Preferences
          </Button>
        </div>
      </div>

      {/* GRID: left rail + right tabs */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* LEFT RAIL */}
        <aside className="space-y-4">
          {/* Completion ring */}
          <div className="bento-card">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r={RING_R} stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
                  <motion.circle
                    cx="32" cy="32" r={RING_R}
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={RING_C}
                    initial={{ strokeDashoffset: RING_C }}
                    animate={{ strokeDashoffset: ringOffset }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-foreground">
                  {completion}%
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Profile completion</p>
                <p className="text-sm font-bold text-foreground">
                  {completion === 100 ? "All set!" : "Add more details"}
                </p>
                {completion < 100 && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    Complete your profile to get better tutor matches.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bento-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick stats</h4>
            {[
              { icon: BookOpen, label: "Member since", value: memberSince },
              { icon: Heart, label: "Saved tutors", value: "—" },
              { icon: CalendarDays, label: "Total sessions", value: "—" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <s.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-bold text-foreground truncate">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Verification */}
          <div className="bento-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-success/15 text-success flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Email verified</p>
                <p className="text-[11px] text-muted-foreground">Your account is secure.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT: tabs */}
        <div>
          <Tabs defaultValue="info">
            <TabsList className="bg-muted/50 rounded-xl p-1">
              <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="about" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                About
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4">
              <div className="bento-card">
                <h3 className="font-bold text-foreground mb-1">Personal Information</h3>
                <p className="text-xs text-muted-foreground mb-5">Update how others see you on EduSpark.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field icon={UserIcon} label="Full Name" value={form.name} onChange={(v) => update("name", v)} />
                  <Field icon={Mail} label="Email" value={form.email} onChange={() => {}} disabled />
                  <Field icon={Phone} label="Phone" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+880 1xxx xxxxxx" />
                  <Field icon={MapPin} label="Location" value={form.location} onChange={(v) => update("location", v)} placeholder="Dhaka, Bangladesh" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-4">
              <div className="bento-card">
                <h3 className="font-bold text-foreground mb-1">About Me</h3>
                <p className="text-xs text-muted-foreground mb-4">A short bio helps tutors understand your goals.</p>
                <Textarea
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder="Tell us about your learning goals, interests, and what you'd like to achieve…"
                  className="border-border rounded-xl min-h-[140px] resize-none"
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">Markdown not supported</p>
                  <p className="text-xs text-muted-foreground">{form.bio.length}/500</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <div className="bento-card space-y-4">
                <h3 className="font-bold text-foreground">Security</h3>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Password</p>
                    <p className="text-xs text-muted-foreground">Last changed recently</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Change
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl" disabled>Coming soon</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* STICKY SAVE BAR */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-popover/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <span className="text-sm font-medium text-foreground">You have unsaved changes</span>
            <Button variant="ghost" size="sm" onClick={handleDiscard} className="rounded-xl">
              <X className="w-3.5 h-3.5 mr-1" /> Discard
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="rounded-xl">
              {saving
                ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving</>
                : <><Save className="w-3.5 h-3.5 mr-1.5" /> Save changes</>
              }
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar dialog */}
      <Dialog open={avatarDialog} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          {success ? (
            <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <DialogTitle className="text-xl mb-2">Avatar Updated!</DialogTitle>
              <DialogDescription>Your new profile picture is now live.</DialogDescription>
              <Button onClick={closeDialog} className="mt-6 w-full rounded-xl">Done</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{pendingFile ? "Confirm new avatar" : "Change avatar"}</DialogTitle>
                <DialogDescription>
                  {pendingFile ? "This will replace your current profile picture." : "Pick an image (JPG/PNG, max 5MB)."}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-32 h-32 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl font-black text-primary overflow-hidden">
                  {previewUrl ? <img src={previewUrl} alt="preview" className="w-full h-full object-cover" /> :
                   profile?.avatar_url ? <img src={profile.avatar_url} alt="current" className="w-full h-full object-cover" /> : initials}
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onPickFile(e.target.files[0])} />
                <Button variant="outline" onClick={() => fileRef.current?.click()} className="rounded-xl">
                  <Upload className="w-4 h-4 mr-2" /> {pendingFile ? "Choose different" : "Choose image"}
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog} disabled={uploading}>Cancel</Button>
                <Button onClick={confirmUpload} disabled={!pendingFile || uploading}>
                  {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading…</> : "Confirm & Upload"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <EditPreferencesDialog open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </>
  );
}

function Field({
  icon: Icon, label, value, onChange, disabled, placeholder,
}: {
  icon: any; label: string; value: string;
  onChange: (v: string) => void; disabled?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="border-border rounded-xl h-10"
      />
    </div>
  );
}
