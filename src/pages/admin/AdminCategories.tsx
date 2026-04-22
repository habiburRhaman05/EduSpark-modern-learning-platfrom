import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Loader2, X as XIcon, AlertCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCategories, useUpsertCategory, useDeleteCategory } from "@/hooks/useAdmin";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "At least 2 chars").max(80),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, dashes only"),
  icon: z.string().trim().max(40).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export default function AdminCategories() {
  const { data, isLoading, error } = useAdminCategories();
  const upsert = useUpsertCategory();
  const del = useDeleteCategory();

  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

  const form = useForm<FormValues>({ resolver: zodResolver(schema) as any, defaultValues: { name: "", slug: "", icon: "" } });

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: "", slug: "", icon: "" });
    setSubjects([]);
    setSubjectInput("");
    setOpen(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    form.reset({ name: c.name, slug: c.slug, icon: c.icon || "" });
    setSubjects(c.subjects || []);
    setSubjectInput("");
    setOpen(true);
  };

  const addSubject = () => {
    const s = subjectInput.trim();
    if (!s) return;
    if (subjects.includes(s)) { toast.error("Already added"); return; }
    setSubjects((p) => [...p, s]);
    setSubjectInput("");
  };

  const removeSubject = (s: string) => setSubjects((p) => p.filter((x) => x !== s));

  const onSubmit = async (v: FormValues) => {
    if (subjects.length === 0) { toast.error("Add at least one subject"); return; }
    try {
      await upsert.mutateAsync({ id: editing?.id, name: v.name, slug: v.slug, icon: v.icon, subjects });
      toast.success(editing ? "Category updated" : "Category created");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed");
    }
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    try {
      await del.mutateAsync(confirmDel.id);
      toast.success("Category deleted");
      setConfirmDel(null);
    } catch (e: any) {
      toast.error(e.message || "Failed");
    }
  };

  if (error) {
    return (
      <>
        <PageHeader title="Categories" description="Setup required" />
        <div className="bento-card border-destructive/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground">Setup required</h3>
            <p className="text-sm text-muted-foreground mt-1">{(error as any).message}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Categories & Subjects"
        description="Manage what tutors can teach"
        actions={<Button onClick={openCreate} className="bg-primary hover:bg-primary/90 rounded-xl"><Plus className="w-4 h-4 mr-1.5" /> New category</Button>}
      />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
      ) : (data || []).length === 0 ? (
        <div className="bento-card text-center py-12">
          <p className="text-muted-foreground mb-4">No categories yet.</p>
          <Button onClick={openCreate} className="bg-primary rounded-xl">Create first category</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data || []).map((c: any) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bento-card group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground truncate">{c.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono truncate">/{c.slug}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(c)}><Edit className="w-3 h-3" /></Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => setConfirmDel(c)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{c.tutor_count} tutor{c.tutor_count === 1 ? "" : "s"} • {(c.subjects || []).length} subjects</p>
              <div className="flex flex-wrap gap-1">
                {(c.subjects || []).slice(0, 6).map((s: string) => (
                  <span key={s} className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground">{s}</span>
                ))}
                {(c.subjects || []).length > 6 && (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground">+{(c.subjects || []).length - 6}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription>Subjects appear when tutors pick this category.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name</Label>
                <Input
                  {...form.register("name")}
                  onChange={(e) => {
                    form.setValue("name", e.target.value);
                    if (!editing) form.setValue("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }}
                  className="rounded-xl"
                />
                {form.formState.errors.name && <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Slug</Label>
                <Input {...form.register("slug")} className="rounded-xl font-mono" />
                {form.formState.errors.slug && <p className="text-xs text-destructive mt-1">{form.formState.errors.slug.message}</p>}
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Icon (lucide name, optional)</Label>
              <Input {...form.register("icon")} placeholder="e.g. Calculator" className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Subjects ({subjects.length})</Label>
              <div className="flex gap-2">
                <Input value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubject(); } }} placeholder="Add a subject and press Enter" className="rounded-xl" />
                <Button type="button" onClick={addSubject} variant="outline" className="rounded-xl">Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {subjects.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {s}
                    <button type="button" onClick={() => removeSubject(s)} className="hover:text-destructive">
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {subjects.length === 0 && <p className="text-xs text-muted-foreground italic">No subjects yet.</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={upsert.isPending} className="bg-primary hover:bg-primary/90 rounded-xl">
                {upsert.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editing ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmDel} onOpenChange={(o) => { if (!o) setConfirmDel(null); }}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>{confirmDel?.tutor_count > 0 ? `${confirmDel.tutor_count} tutors are tagged here. This cannot be undone.` : "This cannot be undone."}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDel(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={del.isPending} className="rounded-xl">
              {del.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
