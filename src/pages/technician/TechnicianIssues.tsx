import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { issues, issueReplies } from "@/lib/mock-data";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, MessageSquare } from "lucide-react";

export default function TechnicianIssues({ resolved = false }: { resolved?: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = issues.filter(i => i.type === "ISSUE" && (resolved ? (i.status as string) === "SUCCESS" : i.status === "PENDING"));
  const selected = issues.find(i => i.id === selectedId);
  const replies = issueReplies.filter(r => r.issueId === selectedId);

  const sendReply = () => {
    if (!replyText.trim()) return;
    toast.success("Reply sent");
    setReplyText("");
  };

  const markResolved = (id: string) => {
    toast.success("Issue marked as resolved");
  };

  return (
    <>
      <PageHeader title={resolved ? "Resolved Issues" : "Platform Issues"} description={resolved ? "Previously resolved technical issues" : "Active platform issues requiring attention"} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* List */}
        <div className="lg:w-1/2 space-y-3">
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No issues found.</p>}
          {filtered.map(issue => (
            <button
              key={issue.id}
              onClick={() => setSelectedId(issue.id)}
              className={`w-full text-left bento-card transition-colors ${selectedId === issue.id ? "border-primary/30" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground truncate">{issue.title}</p>
                <StatusBadge status={issue.priority} />
              </div>
              <p className="text-xs text-muted-foreground truncate">{issue.description}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{issue.createdAt} • {issue.username}</p>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:w-1/2">
          {selected ? (
            <div className="bento-card space-y-4 sticky top-24">
              <div>
                <h3 className="font-semibold text-foreground">{selected.title}</h3>
                <div className="flex gap-2 mt-1">
                  <StatusBadge status={selected.status.toLowerCase()} />
                  <StatusBadge status={selected.priority} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <p className="text-sm text-muted-foreground italic">"{selected.userMessage}"</p>
              {selected.location && <p className="text-xs text-muted-foreground">Location: {selected.location}</p>}

              {/* Replies */}
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground">Conversation</p>
                {replies.map(r => (
                  <div key={r.id} className={`p-3 rounded-xl text-sm ${r.isAdmin ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground"}`}>
                    <p className="text-[10px] font-semibold mb-1">{r.isAdmin ? "Support" : "User"} • {r.createdAt}</p>
                    {r.content}
                  </div>
                ))}
              </div>

              {selected.status === "PENDING" && (
                <>
                  <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." rows={3} className="glass border-border rounded-xl" />
                  <div className="flex gap-2">
                    <Button onClick={sendReply} className="bg-primary hover:bg-primary/90 rounded-xl"><MessageSquare className="w-4 h-4 mr-2" /> Reply</Button>
                    <Button variant="outline" onClick={() => markResolved(selected.id)} className="border-border rounded-xl"><CheckCircle className="w-4 h-4 mr-2" /> Resolve</Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bento-card text-center py-16">
              <p className="text-sm text-muted-foreground">Select an issue to view details</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
