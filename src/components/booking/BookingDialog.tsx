import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CreditCard, Loader2, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldAlert } from "lucide-react";
import { useCheckBookingConflict, useCreateBookingWithPayment } from "@/hooks/useBookingFlow";
import { toast } from "sonner";

const stepSchema1 = z.object({
  subject: z.string().min(1, "Pick a subject"),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  duration: z.coerce.number().min(30).max(240),
  notes: z.string().max(400).optional().or(z.literal("")),
});

const stepSchema2 = z.object({
  cardName: z.string().trim().min(2, "Required").max(80),
  cardNumber: z.string().trim().refine((v) => /^[\d\s]{13,23}$/.test(v) && v.replace(/\s/g, "").length >= 12, "Enter a valid card number"),
  expiry: z.string().trim().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY"),
  cvv: z.string().trim().regex(/^\d{3,4}$/, "3-4 digits"),
});

const fullSchema = stepSchema1.merge(stepSchema2);
type BookingForm = z.infer<typeof fullSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  tutorUserId: string;
  tutorProfileId?: string;
  tutorName: string;
  hourlyRate: number;
  subjects: string[];
}

export function BookingDialog({ open, onClose, tutorUserId, tutorProfileId, tutorName, hourlyRate, subjects }: Props) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const isBlockedRole = !!user && !!role && role !== "student";

  const form = useForm<BookingForm>({
    resolver: zodResolver(fullSchema) as any,
    defaultValues: {
      subject: subjects[0] || "",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      time: "14:00",
      duration: 60,
      notes: "",
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const { date, time, duration } = form.watch();
  const scheduledAt = useMemo(() => {
    if (!date || !time) return undefined;
    return new Date(`${date}T${time}:00`).toISOString();
  }, [date, time]);

  const { data: conflictCheck, isFetching: checkingConflict } = useCheckBookingConflict(tutorUserId, scheduledAt, Number(duration), tutorProfileId);
  const totalAmount = (hourlyRate * Number(duration || 60)) / 60;

  const createMut = useCreateBookingWithPayment();

  const handleNext = async () => {
    if (!user) {
      toast.error("Please sign in to book");
      navigate("/login");
      return;
    }
    if (isBlockedRole) {
      toast.error("Only students can book sessions");
      return;
    }
    const valid = await form.trigger(["subject", "date", "time", "duration"]);
    if (!valid) return;
    if (conflictCheck?.conflict) {
      toast.error("This time slot is already booked. Pick another.");
      return;
    }
    if (!scheduledAt || new Date(scheduledAt) < new Date()) {
      toast.error("Pick a future date/time");
      return;
    }
    setStep(2);
  };

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handlePay = async () => {
    const valid = await form.trigger(["cardName", "cardNumber", "expiry", "cvv"]);
    if (!valid) return;
    const v = form.getValues();
    try {
      await createMut.mutateAsync({
        tutorUserId,
        tutorProfileId,
        subject: v.subject,
        scheduledAt: scheduledAt!,
        durationMinutes: Number(v.duration),
        amount: totalAmount,
        notes: v.notes,
        cardLast4: v.cardNumber.replace(/\s/g, "").slice(-4),
      });
      setStep(3);
    } catch (e: any) {
      toast.error(e.message || "Payment failed");
    }
  };

  const close = () => {
    setStep(1);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-3xl border-border/60">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/15 to-transparent p-5 border-b border-border/40">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-lg font-black flex items-center gap-2">
              {step === 3 ? "Booking confirmed" : `Book ${tutorName}`}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {step === 1 && "Pick your session details"}
              {step === 2 && "Secure payment — your card is not stored"}
              {step === 3 && "Your session is on the calendar"}
            </DialogDescription>
          </DialogHeader>
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mt-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  step >= n ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {isBlockedRole ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-warning/15 flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-warning" />
              </div>
              <h3 className="text-base font-bold text-foreground">Booking is for students only</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                You're signed in as <span className="font-semibold capitalize">{role}</span>. Switch to a student account to book sessions.
              </p>
            </div>
          ) : (
          <AnimatePresence mode="wait">
            {/* STEP 1: Details */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Subject</Label>
                  <Select value={form.watch("subject")} onValueChange={(v) => form.setValue("subject", v, { shouldValidate: true })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {subjects.length === 0 && <SelectItem value="General">General</SelectItem>}
                      {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.subject && <p className="text-xs text-destructive mt-1">{form.formState.errors.subject.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Date</Label>
                    <Input type="date" {...form.register("date")} min={new Date().toISOString().slice(0,10)} className="rounded-xl" />
                    {form.formState.errors.date && <p className="text-xs text-destructive mt-1">{form.formState.errors.date.message}</p>}
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block flex items-center gap-1.5"><Clock className="w-3 h-3" /> Time</Label>
                    <Input type="time" {...form.register("time")} className="rounded-xl" />
                    {form.formState.errors.time && <p className="text-xs text-destructive mt-1">{form.formState.errors.time.message}</p>}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Duration</Label>
                  <Select value={String(form.watch("duration"))} onValueChange={(v) => form.setValue("duration", Number(v), { shouldValidate: true })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notes (optional)</Label>
                  <Textarea {...form.register("notes")} placeholder="What would you like to focus on?" className="rounded-xl min-h-[70px]" />
                </div>

                {/* Conflict warning */}
                {scheduledAt && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      checkingConflict ? "bg-muted/50 text-muted-foreground" :
                      conflictCheck?.conflict ? "bg-destructive/10 text-destructive border border-destructive/30" :
                      "bg-success/10 text-success border border-success/30"
                    }`}
                  >
                    {checkingConflict ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking availability…</>
                    ) : conflictCheck?.outsideAvailability ? (
                      <>⚠️ Tutor is not available at this time. Pick a time within their availability.</>
                    ) : conflictCheck?.bookingConflict ? (
                      <>⚠️ This slot conflicts with another booking. Please pick a different time.</>
                    ) : (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> Slot is available</>
                    )}
                  </motion.div>
                )}

                <div className="p-3 rounded-xl bg-muted/40 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="text-lg font-black text-foreground">${totalAmount.toFixed(2)}</span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="space-y-4">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2 text-xs text-foreground">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span><strong>Demo mode:</strong> No real charge. Card details are not stored.</span>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cardholder name</Label>
                  <Input {...form.register("cardName")} placeholder="Name on card" className="rounded-xl" />
                  {form.formState.errors.cardName && <p className="text-xs text-destructive mt-1">{form.formState.errors.cardName.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block flex items-center gap-1.5"><CreditCard className="w-3 h-3" /> Card number</Label>
                  <Input
                    {...form.register("cardNumber")}
                    onChange={(e) => form.setValue("cardNumber", formatCard(e.target.value), { shouldValidate: true })}
                    placeholder="4242 4242 4242 4242"
                    className="rounded-xl font-mono tracking-wider"
                  />
                  {form.formState.errors.cardNumber && <p className="text-xs text-destructive mt-1">{form.formState.errors.cardNumber.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Expiry</Label>
                    <Input
                      {...form.register("expiry")}
                      onChange={(e) => form.setValue("expiry", formatExpiry(e.target.value), { shouldValidate: true })}
                      placeholder="MM/YY"
                      className="rounded-xl font-mono"
                    />
                    {form.formState.errors.expiry && <p className="text-xs text-destructive mt-1">{form.formState.errors.expiry.message}</p>}
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">CVV</Label>
                    <Input
                      {...form.register("cvv")}
                      type="password"
                      maxLength={4}
                      placeholder="123"
                      className="rounded-xl font-mono"
                    />
                    {form.formState.errors.cvv && <p className="text-xs text-destructive mt-1">{form.formState.errors.cvv.message}</p>}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{form.watch("subject")} • {form.watch("duration")}min</span>
                    <span className="text-foreground">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/40">
                    <span className="text-xs font-bold text-foreground">Total</span>
                    <span className="text-lg font-black text-primary">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 250, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </motion.div>
                <h3 className="text-xl font-black text-foreground">Session booked!</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  Your session with {tutorName} is confirmed for {scheduledAt && new Date(scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 pt-3 border-t border-border/40 flex gap-2">
          {isBlockedRole ? (
            <Button onClick={close} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">Close</Button>
          ) : step === 1 ? (
            <>
              <Button variant="ghost" onClick={close} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleNext} disabled={!!conflictCheck?.conflict || checkingConflict} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                Continue to payment
              </Button>
            </>
          ) : step === 2 ? (
            <>
              <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 rounded-xl">Back</Button>
              <Button onClick={handlePay} disabled={createMut.isPending} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                {createMut.isPending ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Processing</> : <><ShieldCheck className="w-4 h-4 mr-1.5" />Pay ${totalAmount.toFixed(2)}</>}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={close} className="flex-1 rounded-xl">Close</Button>
              <Button onClick={() => { close(); navigate("/dashboard/sessions"); }} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                View bookings
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
