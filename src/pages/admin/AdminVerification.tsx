import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, ExternalLink, AlertCircle, Loader2, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { VerifiedAvatar } from "@/components/VerifiedAvatar";
import { useAdminVerifications, useReviewVerification, signedDocUrl } from "@/hooks/useAdmin";
import { toast } from "sonner";

export default function AdminVerification() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "pending";
  const setStatus = (s: string) => {
    const next = new URLSearchParams(params);
    next.set("status", s);
    setParams(next, { replace: true });
  };

  const { data, isLoading, error } = useAdminVerifications({ status });
  const review = useReviewVerification();

  const [viewing, setViewing] = useState<any | null>(null);
  const [docUrls, setDocUrls] = useState<Record<string, string>>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectingTutor, setRejectingTutor] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const openDocs = async (v: any) => {
    setViewing(v);
    const docs = {
      nid: v.nid_doc_path,
      photo: v.photo_doc_path,
      certificate: v.certificate_doc_path,
      additional: v.additional_doc_path,
    };
    const urls: Record<string, string> = {};
    for (const [k, p] of Object.entries(docs)) {
      if (!p) continue;
      const u = await signedDocUrl(p as string);
      if (u) urls[k] = u;
    }
    setDocUrls(urls);
  };

  const approve = async (v: any) => {
    try {
      await review.mutateAsync({ id: v.id, tutorId: v.tutor_id, status: "approved" });
      toast.success(`${v.tutor_name} approved`);
    } catch (e: any) {
      toast.error(e.message || "Failed");
    }
  };

  const confirmReject = async () => {
    if (!rejectingId || !rejectingTutor) return;
    if (reason.trim().length < 5) {
      toast.error("Provide a reason (min 5 chars)");
      return;
    }
    try {
      await review.mutateAsync({ id: rejectingId, tutorId: rejectingTutor, status: "rejected", reason: reason.trim() });
      toast.success("Application rejected");
      setRejectingId(null);
      setRejectingTutor(null);
      setReason("");
    } catch (e: any) {
      toast.error(e.message || "Failed");
    }
  };

  if (error) {
    return (
      <>
        <PageHeader title="Verification Applications" description="Setup required" />
        <div className="bento-card border-destructive/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground">Setup required</h3>
            <p className="text-sm text-muted-foreground mt-1">{(error as any).message}</p>
            <p className="text-xs text-muted-foreground mt-2">Run <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">SEED_DATA.sql</code> in the Supabase SQL editor.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Verification Applications" description="Approve or reject tutor verification requests" />

      <div className="flex gap-2 mb-6">
        {[
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
          { key: "", label: "All" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`px-4 py-2 text-sm rounded-xl transition-colors ${status === t.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      ) : (data || []).length === 0 ? (
        <div className="bento-card text-center py-12">
          <p className="text-muted-foreground">No {status || "all"} applications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(data || []).map((v: any) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bento-card">
              <div className="flex items-start gap-4">
                <VerifiedAvatar src={v.tutor_avatar} name={v.tutor_name} size="lg" status={v.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-foreground">{v.tutor_name}</h3>
                    <StatusBadge status={v.status} size="md" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.tutor_email || "—"}</p>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs text-muted-foreground">
                    <p><strong className="text-foreground">Profession:</strong> {v.profession}</p>
                    <p><strong className="text-foreground">Phone:</strong> {v.phone}</p>
                    <p><strong className="text-foreground">NID:</strong> {v.nid_number}</p>
                    <p><strong className="text-foreground">Experience:</strong> {v.years_experience} years</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Submitted {new Date(v.submitted_at).toLocaleString()}</p>
                  {v.rejection_reason && (
                    <p className="text-xs text-destructive mt-2"><strong>Reason:</strong> {v.rejection_reason}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openDocs(v)} className="rounded-xl">
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> View docs
                  </Button>
                  {v.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => approve(v)} disabled={review.isPending} className="bg-accent hover:bg-accent/90 rounded-xl">
                        <Check className="w-3.5 h-3.5 mr-1.5" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { setRejectingId(v.id); setRejectingTutor(v.tutor_id); }} className="rounded-xl">
                        <X className="w-3.5 h-3.5 mr-1.5" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Documents viewer */}
      <Dialog open={!!viewing} onOpenChange={(o) => { if (!o) { setViewing(null); setDocUrls({}); } }}>
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Verification documents</DialogTitle>
            <DialogDescription>{viewing?.tutor_name} — {viewing?.full_name}</DialogDescription>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
            {Object.entries({ "National ID": "nid", "Photo": "photo", "Certificate": "certificate", "Additional": "additional" }).map(([label, key]) => (
              <div key={key} className="bento-card p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
                {docUrls[key] ? (
                  <a href={docUrls[key]} target="_blank" rel="noreferrer" className="block group">
                    <img src={docUrls[key]} alt={label} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} className="w-full h-32 object-cover rounded-lg border border-border" />
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary group-hover:underline">
                      Open in new tab <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Not provided</p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject reason */}
      <Dialog open={!!rejectingId} onOpenChange={(o) => { if (!o) { setRejectingId(null); setRejectingTutor(null); setReason(""); } }}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reject application</DialogTitle>
            <DialogDescription>Provide a clear reason — this will be visible to the tutor.</DialogDescription>
          </DialogHeader>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. The ID document is unreadable. Please re-upload a clearer photo." className="rounded-xl min-h-[100px]" />
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setRejectingId(null); setRejectingTutor(null); setReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={review.isPending} className="rounded-xl">
              {review.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
              Reject application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
