import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllTickets, useTicketMessages, useReplyTicket, useUpdateTicketStatus } from "@/hooks/useTickets";
import { toast } from "sonner";
import { Send, CheckCircle2, Inbox, Loader2 } from "lucide-react";

export default function ModeratorTickets() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const { data: tickets = [], isLoading } = useAllTickets({ search, status: statusFilter });
  const { data: messages = [], isLoading: loadingMsgs } = useTicketMessages(selectedId || undefined);
  const replyMut = useReplyTicket();
  const statusMut = useUpdateTicketStatus();

  const selected = tickets.find((t: any) => t.id === selectedId);

  const sendReply = async () => {
    if (!reply.trim() || !selectedId) return;
    try {
      await replyMut.mutateAsync({ ticketId: selectedId, content: reply, isStaff: true });
      setReply("");
    } catch (e: any) { toast.error(e.message || "Failed"); }
  };

  const closeTicket = async () => {
    if (!selectedId) return;
    try {
      await statusMut.mutateAsync({ id: selectedId, status: "closed" });
      toast.success("Ticket closed");
    } catch (e: any) { toast.error(e.message || "Failed"); }
  };

  return (
    <>
      <PageHeader title="Support Tickets" description={`${tickets.length} ticket${tickets.length === 1 ? "" : "s"}`} />
      <div className="grid lg:grid-cols-3 gap-4" style={{ height: "calc(100vh - 220px)" }}>
        <div className="bento-card p-0 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <FilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search tickets…"
              filters={[{
                label: "All",
                value: "status",
                options: [
                  { label: "Open", value: "open" },
                  { label: "In progress", value: "in_progress" },
                  { label: "Closed", value: "closed" },
                ],
              }]}
              filterValues={{ status: statusFilter }}
              onFilterChange={(_, v) => setStatusFilter(v)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center">
                <Inbox className="w-10 h-10 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No tickets</p>
              </div>
            ) : tickets.map((t: any) => (
              <button key={t.id} onClick={() => setSelectedId(t.id)}
                className={`w-full text-left p-4 border-b border-border/50 hover:bg-muted/30 transition-colors ${selectedId === t.id ? "bg-muted/50" : ""}`}>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">{t.subject}</span>
                  <StatusBadge status={t.priority || "medium"} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{t.user?.full_name || "User"} • {new Date(t.created_at).toLocaleDateString()}</p>
                <div className="mt-1.5"><StatusBadge status={t.status} /></div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bento-card p-0 flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="p-4 border-b border-border flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground truncate">{selected.subject}</h3>
                  <p className="text-xs text-muted-foreground">{selected.user?.full_name} • {selected.user?.email}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <StatusBadge status={selected.category || "general"} size="md" />
                  <StatusBadge status={selected.status} size="md" />
                  {selected.status !== "closed" && (
                    <Button size="sm" variant="outline" onClick={closeTicket} disabled={statusMut.isPending} className="h-8 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Close
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
                ) : messages.map((m: any) => (
                  <div key={m.id} className={`p-3 rounded-xl ${m.is_staff ? "bg-primary/5 border border-primary/10 ml-6" : "bg-muted/30 border border-border"}`}>
                    <p className="text-xs text-muted-foreground mb-1">{m.is_staff ? "Moderator" : "User"} • {new Date(m.created_at).toLocaleString()}</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{m.content}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                  placeholder="Type a reply…"
                  className="flex-1 h-9 bg-muted/50 border-none rounded-lg text-sm"
                />
                <Button size="sm" onClick={sendReply} disabled={replyMut.isPending || !reply.trim()} className="bg-primary hover:bg-primary/90 h-9 rounded-lg">
                  {replyMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Select a ticket to view the conversation</div>
          )}
        </div>
      </div>
    </>
  );
}
