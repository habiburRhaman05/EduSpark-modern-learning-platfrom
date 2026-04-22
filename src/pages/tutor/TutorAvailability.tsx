import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Clock, Calendar, Pencil, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAvailabilityList, useCreateSlot, useUpdateSlot, useDeleteSlot, AvailabilitySlot } from "@/hooks/useTutorAvailability";

const slotSchema = z
  .object({
    specific_date: z.string().min(1, "Date is required").refine((v) => {
      const d = new Date(v + "T00:00:00");
      const today = new Date(); today.setHours(0, 0, 0, 0);
      return d >= today;
    }, "Date cannot be in the past"),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  })
  .refine((d) => d.end_time > d.start_time, { message: "End must be after start", path: ["end_time"] });

type SlotForm = z.infer<typeof slotSchema>;

export default function TutorAvailability() {
  const { data: slots, isLoading } = useAvailabilityList();
  const createMut = useCreateSlot();
  const updateMut = useUpdateSlot();
  const deleteMut = useDeleteSlot();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AvailabilitySlot | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<SlotForm>({
    resolver: zodResolver(slotSchema),
    defaultValues: { specific_date: "", start_time: "09:00", end_time: "10:00" },
  });

  const openAdd = () => {
    setEditing(null);
    form.reset({ specific_date: "", start_time: "09:00", end_time: "10:00" });
    setModalOpen(true);
  };
  const openEdit = (slot: AvailabilitySlot) => {
    setEditing(slot);
    form.reset({
      specific_date: slot.specific_date || "",
      start_time: slot.start_time.slice(0, 5),
      end_time: slot.end_time.slice(0, 5),
    });
    setModalOpen(true);
  };

  const onSubmit = async (values: SlotForm) => {
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, ...values });
        toast.success("Slot updated");
      } else {
        await createMut.mutateAsync(values);
        toast.success("Slot added");
      }
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save slot");
    }
  };

  const grouped = (slots || []).reduce<Record<string, AvailabilitySlot[]>>((acc, s) => {
    const key = s.specific_date || "Recurring";
    (acc[key] = acc[key] || []).push(s);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort();

  return (
    <>
      <PageHeader
        title="Availability"
        description="Set the time slots when students can book you"
        actions={
          <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add Slot
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : sortedDates.length === 0 ? (
        <div className="bento-card text-center py-16">
          <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No availability slots yet. Click "Add Slot" to create one.</p>
        </div>
      ) : (
        <motion.div className="space-y-4" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
          {sortedDates.map((date) => (
            <motion.div
              key={date}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              className="bento-card"
            >
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {date === "Recurring" ? "Recurring" : new Date(date + "T00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
              </h4>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {grouped[date]
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((slot) => (
                      <motion.div
                        key={slot.id}
                        layout
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-sm border ${
                          slot.is_booked
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-muted/30 border-border text-foreground hover:border-primary/40 transition-colors"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-medium">{slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}</span>
                        {slot.is_booked && <span className="text-[10px] font-bold bg-primary/20 px-1.5 py-0.5 rounded-md">BOOKED</span>}
                        {!slot.is_booked && (
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(slot)} className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary"><Pencil className="w-3 h-3" /></button>
                            <button onClick={() => setDeleteId(slot.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Slot" : "Add Availability Slot"}</DialogTitle>
            <DialogDescription>Define when you're available for bookings.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...form.register("specific_date")} className="mt-1.5 rounded-xl" />
              {form.formState.errors.specific_date && <p className="text-xs text-destructive mt-1">{form.formState.errors.specific_date.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start">Start time</Label>
                <Input id="start" type="time" {...form.register("start_time")} className="mt-1.5 rounded-xl" />
                {form.formState.errors.start_time && <p className="text-xs text-destructive mt-1">{form.formState.errors.start_time.message}</p>}
              </div>
              <div>
                <Label htmlFor="end">End time</Label>
                <Input id="end" type="time" {...form.register("end_time")} className="mt-1.5 rounded-xl" />
                {form.formState.errors.end_time && <p className="text-xs text-destructive mt-1">{form.formState.errors.end_time.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}><X className="w-4 h-4 mr-1" />Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending} className="bg-primary hover:bg-primary/90 rounded-xl">
                {(createMut.isPending || updateMut.isPending) ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                {editing ? "Save changes" : "Add slot"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete this slot?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteMut.mutateAsync(deleteId);
            toast.success("Slot deleted");
          } catch (e: any) {
            toast.error(e.message || "Failed to delete");
          }
          setDeleteId(null);
        }}
      />
    </>
  );
}
