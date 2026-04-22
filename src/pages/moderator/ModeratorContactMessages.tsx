import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Mail, CheckCircle2, RotateCcw, Inbox, Calendar } from "lucide-react";
import { useContactMessages, useResolveContact } from "@/hooks/useContactMessages";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ModeratorContactMessages() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "new" | "resolved">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [open, setOpen] = useState<any>(null);

  const { data: messages = [], isLoading } = useContactMessages({ search, status, fromDate, toDate });
  const resolve = useResolveContact();

  const stats = {
    total: messages.length,
    nw: messages.filter((m: any) => m.status === "new").length,
    rs: messages.filter((m: any) => m.status === "resolved").length,
  };

  const onResolve = async (id: string, resolved: boolean) => {
    try {
      await resolve.mutateAsync({ id, resolved });
      toast.success(resolved ? "Marked as resolved" : "Reopened");
    } catch (e: any) {
      toast.error(e.message || "Failed");
    }
  };

  return (
    <>
      <PageHeader title="Contact Messages" description={`${stats.total} message${stats.total === 1 ? "" : "s"} • ${stats.nw} new`} />

      {/* Filters */}
      <div className="bento-card mb-4">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, subject…"
              className="pl-10 h-10 rounded-xl"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="pl-10 h-10 rounded-xl" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="pl-10 h-10 rounded-xl" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {([
            { k: "", label: `All (${stats.total})` },
            { k: "new", label: `New (${stats.nw})` },
            { k: "resolved", label: `Resolved (${stats.rs})` },
          ] as const).map((b) => (
            <button
              key={b.k}
              onClick={() => setStatus(b.k)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                status === b.k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {b.label}
            </button>
          ))}
          {(search || fromDate || toDate || status) && (
            <button
              onClick={() => { setSearch(""); setFromDate(""); setToDate(""); setStatus(""); }}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid gap-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : messages.length === 0 ? (
        <div className="bento-card text-center py-16">
          <Inbox className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No messages match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {messages.map((m: any) => (
            <div
              key={m.id}
              className="bento-card flex items-start gap-4 hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => setOpen(m)}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.status === "new" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm font-bold text-foreground truncate">{m.name}</h3>
                  <span className="text-xs text-muted-foreground truncate">·  {m.email}</span>
                  {m.status === "new" ? (
                    <Badge variant="default" className="rounded-full">New</Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-full">Resolved</Badge>
                  )}
                </div>
                {m.subject && <p className="text-xs font-semibold text-foreground/80 mb-0.5 truncate">{m.subject}</p>}
                <p className="text-xs text-muted-foreground line-clamp-1">{m.message}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {m.status === "new" ? (
                  <Button size="sm" variant="outline" onClick={() => onResolve(m.id, true)} className="rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Resolve
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => onResolve(m.id, false)} className="rounded-lg">
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reopen
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>{open.subject || "(No subject)"}</DialogTitle>
                <DialogDescription>
                  From <span className="font-semibold text-foreground">{open.name}</span> ({open.email}) · {new Date(open.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl bg-muted/40 border border-border p-4 text-sm whitespace-pre-wrap leading-relaxed">
                {open.message}
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject || "Your message to EduSpark")}`}>
                  <Button variant="outline" className="rounded-xl">Reply via email</Button>
                </a>
                {open.status === "new" ? (
                  <Button onClick={() => { onResolve(open.id, true); setOpen({ ...open, status: "resolved" }); }} className="rounded-xl">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Mark resolved
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => { onResolve(open.id, false); setOpen({ ...open, status: "new" }); }} className="rounded-xl">
                    <RotateCcw className="w-4 h-4 mr-1" /> Reopen
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
