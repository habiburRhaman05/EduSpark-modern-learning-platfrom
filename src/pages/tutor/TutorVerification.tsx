import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Shield, Clock, CheckCircle2, XCircle, Upload, Loader2, FileText, AlertCircle, BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyVerification, useSubmitVerification } from "@/hooks/useTutorVerification";
import { useOnboardingStatus } from "@/hooks/useTutorProfile";
import { toast } from "sonner";

const fileSchema = z.instanceof(File, { message: "File is required" })
  .refine((f) => f.size <= 8 * 1024 * 1024, "File must be under 8MB");

const formSchema = z.object({
  full_name: z.string().trim().min(2, "Required").max(120),
  nid_number: z.string().trim().min(5, "Enter a valid ID number").max(50),
  phone: z.string().trim().min(6, "Enter a valid phone").max(40),
  address: z.string().trim().min(5, "Required").max(300),
  profession: z.string().trim().min(2, "Required").max(120),
  institution: z.string().trim().max(120).optional().or(z.literal("")),
  years_experience: z.coerce.number().int().min(0).max(80),
  nid_file: fileSchema,
  photo_file: fileSchema,
  certificate_file: fileSchema,
  additional_file: z.instanceof(File).optional(),
});
type FormValues = z.infer<typeof formSchema>;

export default function TutorVerification() {
  const { data: verification, isLoading, error } = useMyVerification();
  const { isComplete: profileComplete, percent, missing } = useOnboardingStatus();
  const submitMut = useSubmitVerification();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: { years_experience: 0 } as any,
  });

  if (isLoading) {
    return (
      <>
        <PageHeader title="Verification Badge" description="Apply to become a verified tutor" />
        <Skeleton className="h-32 rounded-2xl mb-6" />
        <Skeleton className="h-96 rounded-2xl" />
      </>
    );
  }

  // Setup error (table missing)
  if (error) {
    return (
      <>
        <PageHeader title="Verification Badge" description="Setup required" />
        <div className="bento-card border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Setup required</h3>
              <p className="text-sm text-muted-foreground mt-1">{(error as any).message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Open the Supabase SQL editor and run the entire <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">SEED_DATA.sql</code> file from the project root.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Already applied
  if (verification) {
    const status = verification.status;
    return (
      <>
        <PageHeader title="Verification Badge" description="Your application status" />
        <div className="bento-card relative overflow-hidden">
          <div className={`absolute inset-0 ${status === "approved" ? "bg-accent/5" : status === "rejected" ? "bg-destructive/5" : "bg-warning/5"}`} />
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              status === "approved" ? "bg-accent/15" : status === "rejected" ? "bg-destructive/15" : "bg-warning/15"
            }`}>
              {status === "approved" ? <BadgeCheck className="w-8 h-8 text-accent" /> :
                status === "rejected" ? <XCircle className="w-8 h-8 text-destructive" /> :
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                  <Clock className="w-8 h-8 text-warning" />
                </motion.div>}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                {status === "approved" ? "You're verified! 🎉" :
                 status === "rejected" ? "Application rejected" :
                 "Application under review"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {status === "pending" && "Your verification documents are being reviewed. This usually takes up to 24 hours."}
                {status === "approved" && "You now have the verified badge on your profile."}
                {status === "rejected" && (verification.rejection_reason || "Please contact support for more information.")}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-3.5 h-3.5" />
                Submitted {new Date(verification.submitted_at).toLocaleString()}
              </div>
            </div>
          </motion.div>

          {status === "pending" && (
            <div className="relative z-10 mt-5 p-3.5 rounded-xl bg-muted/30 border border-border/40 text-xs text-muted-foreground">
              You cannot submit a new application while one is pending. We'll notify you within 24 hours.
            </div>
          )}
        </div>

        <div className="bento-card mt-6">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Submitted Information</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Full name" value={verification.full_name} />
            <Info label="NID number" value={verification.nid_number} />
            <Info label="Phone" value={verification.phone} />
            <Info label="Profession" value={verification.profession} />
            <Info label="Institution" value={verification.institution || "—"} />
            <Info label="Years experience" value={String(verification.years_experience ?? 0)} />
          </div>
        </div>
      </>
    );
  }

  // Block submission if profile incomplete
  if (!profileComplete) {
    return (
      <>
        <PageHeader title="Verification Badge" description="Complete your profile first" />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bento-card border-destructive/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">Finish your profile first</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You need a complete profile before submitting a verification application. {missing.length} fields remaining: {missing.map(m=>m.label).join(", ")}.
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Profile completion</span>
                  <span className="font-bold text-destructive">{percent}%</span>
                </div>
                <Progress value={percent} className="h-2" />
              </div>
              <Button asChild className="mt-4 bg-primary hover:bg-primary/90 rounded-xl">
                <Link to="/tutor/profile">Complete profile <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await submitMut.mutateAsync(values);
      setSubmitted(true);
      toast.success("Application submitted! We'll review within 24 hours.");
    } catch (e: any) {
      toast.error(e.message || "Submission failed");
    }
  };

  if (submitted) {
    return (
      <>
        <PageHeader title="Verification Badge" description="Application submitted" />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bento-card text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl bg-warning/15 flex items-center justify-center mx-auto mb-4"
          >
            <Clock className="w-8 h-8 text-warning" />
          </motion.div>
          <h3 className="text-xl font-bold text-foreground">Application received</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Our team will review your documents within 24 hours. You'll get a notification once it's done.</p>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Verification Badge" description="Submit your documents to get verified" />

      <div className="bento-card mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Why verify?</h3>
          <p className="text-sm text-muted-foreground mt-1">Verified tutors get a badge on their profile, rank higher in search, and earn 3× more bookings on average.</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name (as on ID)" error={form.formState.errors.full_name?.message}>
              <Input {...form.register("full_name")} className="rounded-xl" />
            </Field>
            <Field label="National ID number" error={form.formState.errors.nid_number?.message}>
              <Input {...form.register("nid_number")} className="rounded-xl" />
            </Field>
            <Field label="Phone" error={form.formState.errors.phone?.message}>
              <Input {...form.register("phone")} className="rounded-xl" />
            </Field>
            <Field label="Years of experience" error={form.formState.errors.years_experience?.message}>
              <Input type="number" {...form.register("years_experience")} className="rounded-xl" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address" error={form.formState.errors.address?.message}>
                <Textarea {...form.register("address")} className="rounded-xl min-h-[80px]" />
              </Field>
            </div>
          </div>
        </div>

        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Professional Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Profession / Title" error={form.formState.errors.profession?.message}>
              <Input {...form.register("profession")} placeholder="e.g. Mathematics Teacher" className="rounded-xl" />
            </Field>
            <Field label="Institution (optional)" error={form.formState.errors.institution?.message}>
              <Input {...form.register("institution")} className="rounded-xl" />
            </Field>
          </div>
        </div>

        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Documents</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <FileField label="National ID (front + back)" name="nid_file" form={form} />
            <FileField label="Professional photo" name="photo_file" form={form} />
            <FileField label="Academic certificate" name="certificate_file" form={form} />
            <FileField label="Other (optional)" name="additional_file" form={form} optional />
          </div>
        </div>

        <Button type="submit" disabled={submitMut.isPending} className="w-full sm:w-auto bg-primary hover:bg-primary/90 rounded-xl h-12 px-8">
          {submitMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
          Submit application
        </Button>
      </form>
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

function FileField({ label, name, form, optional }: { label: string; name: keyof FormValues; form: any; optional?: boolean }) {
  const file = form.watch(name) as File | undefined;
  const error = form.formState.errors[name]?.message as string | undefined;
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}{optional && " (optional)"}</Label>
      <label className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
        file ? "border-accent/50 bg-accent/5" : "border-border hover:border-primary/40 bg-muted/20"
      }`}>
        {file ? <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" /> : <Upload className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
        <span className="text-xs text-foreground truncate flex-1">{file ? file.name : "Choose file (PDF, JPG, PNG — max 8MB)"}</span>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => form.setValue(name, e.target.files?.[0], { shouldValidate: true })}
          className="hidden"
        />
      </label>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  );
}
