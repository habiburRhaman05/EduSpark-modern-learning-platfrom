import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { blogPosts } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function AdminCMS() {
  const [search, setSearch] = useState("");
  const filtered = blogPosts.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader title="Content Management" description="Manage blog posts, FAQ, and help center" actions={<Button className="bg-primary hover:bg-primary/90 rounded-xl"><Plus className="w-4 h-4 mr-2" />New Post</Button>} />
      <div className="bento-card">
        <div className="mb-4">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="max-w-xs glass border-white/[0.08] rounded-xl" />
        </div>
        <div className="space-y-3">
          {filtered.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-white/[0.04]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">{post.title}</h3>
                  <StatusBadge status={post.status.toLowerCase()} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{post.excerpt}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{post.date} • {post.category}</p>
              </div>
              <div className="flex gap-1 ml-4">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Eye className="w-3 h-3" /></Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="w-3 h-3" /></Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => toast.success("Deleted")}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
