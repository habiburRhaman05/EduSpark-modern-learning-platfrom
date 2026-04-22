import { useState, useRef } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useBlogList, useUpsertBlog, useDeleteBlog, useUploadThumbnail } from "@/hooks/useBlogs";
import { Plus, Edit, Trash2, Save, X, Upload, ImageIcon, Loader2, BookOpen, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);

const emptyForm = {
  id: undefined as string | undefined,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: [] as string[],
  cover_image: null as string | null,
  is_published: false,
};

export default function ModeratorBlogManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [tagInput, setTagInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: posts = [], isLoading } = useBlogList({ search, status: statusFilter });
  const upsert = useUpsertBlog();
  const del = useDeleteBlog();
  const upload = useUploadThumbnail();

  const startNew = () => setEditing({ ...emptyForm });
  const startEdit = (p: any) => setEditing({
    id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt || "",
    content: p.content || "", category: p.category || "", tags: p.tags || [],
    cover_image: p.cover_image, is_published: !!p.is_published,
  });

  const handleFile = async (file?: File | null) => {
    if (!file || !editing) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    try {
      const url = await upload.mutateAsync(file);
      setEditing({ ...editing, cover_image: url });
      toast.success("Thumbnail uploaded");
    } catch (e: any) { toast.error(e.message || "Upload failed"); }
  };

  const addTag = () => {
    if (!editing || !tagInput.trim()) return;
    if (editing.tags.includes(tagInput.trim())) return setTagInput("");
    setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] });
    setTagInput("");
  };

  const save = async (publish: boolean) => {
    if (!editing) return;
    if (!editing.title.trim()) return toast.error("Title is required");
    if (!editing.content || editing.content === "<p></p>") return toast.error("Content is required");
    try {
      await upsert.mutateAsync({
        id: editing.id, title: editing.title, slug: editing.slug || slugify(editing.title),
        excerpt: editing.excerpt, content: editing.content, category: editing.category,
        tags: editing.tags, cover_image: editing.cover_image, is_published: publish,
      });
      toast.success(editing.id ? "Post updated" : publish ? "Post published" : "Draft saved");
      setEditing(null);
    } catch (e: any) { toast.error(e.message || "Failed to save"); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    try { await del.mutateAsync(id); toast.success("Post deleted"); }
    catch (e: any) { toast.error(e.message || "Failed"); }
  };

  if (editing) {
    return (
      <>
        <PageHeader
          title={editing.id ? "Edit Post" : "New Blog Post"}
          description="Compose and publish a blog article"
          actions={
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditing(null)} className="rounded-xl">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button variant="outline" onClick={() => save(false)} disabled={upsert.isPending} className="rounded-xl">
                {upsert.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save draft
              </Button>
              <Button onClick={() => save(true)} disabled={upsert.isPending} className="bg-primary hover:bg-primary/90 rounded-xl">
                {upsert.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
                {editing.is_published ? "Update & publish" : "Publish"}
              </Button>
            </div>
          }
        />

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="bento-card space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Title</label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })}
                  placeholder="An eye-catching title…"
                  className="rounded-xl text-lg font-semibold h-12"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Excerpt</label>
                <Textarea
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  rows={2}
                  placeholder="A short summary shown on cards and previews"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Content</label>
                <RichTextEditor
                  value={editing.content}
                  onChange={(html) => setEditing({ ...editing, content: html })}
                  placeholder="Write your post… use the toolbar above for formatting."
                  minHeight={400}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Thumbnail */}
            <div className="bento-card">
              <h3 className="text-sm font-bold text-foreground mb-3">Thumbnail</h3>
              {editing.cover_image ? (
                <div className="relative group rounded-xl overflow-hidden border border-border">
                  <img src={editing.cover_image} alt="" className="w-full aspect-video object-cover" />
                  <button
                    onClick={() => setEditing({ ...editing, cover_image: null })}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  ><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={upload.isPending}
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
                >
                  {upload.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  <span className="text-xs">Click to upload (max 5MB)</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
            </div>

            {/* Slug & category */}
            <div className="bento-card space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Slug</label>
                <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} className="rounded-xl font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Category</label>
                <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="e.g. Study Tips" className="rounded-xl" />
              </div>
            </div>

            {/* Tags */}
            <div className="bento-card">
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Add tag…"
                  className="rounded-xl h-9"
                />
                <Button size="sm" onClick={addTag} variant="outline" className="rounded-xl"><Plus className="w-3.5 h-3.5" /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {editing.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="rounded-full">
                    #{t}
                    <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((x) => x !== t) })} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {editing.tags.length === 0 && <p className="text-xs text-muted-foreground">No tags yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Blog Management"
        description={`${posts.length} post${posts.length === 1 ? "" : "s"}`}
        actions={
          <Button onClick={startNew} className="bg-primary hover:bg-primary/90 rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> New post
          </Button>
        }
      />

      <div className="bento-card mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search posts…"
          filters={[{
            label: "All",
            value: "status",
            options: [
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
            ],
          }]}
          filterValues={{ status: statusFilter }}
          onFilterChange={(_, v) => setStatusFilter(v)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : posts.length === 0 ? (
        <div className="bento-card text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No blog posts yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {posts.map((p: any) => (
            <div key={p.id} className="bento-card flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                {p.cover_image
                  ? <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
                  : <ImageIcon className="w-6 h-6 text-muted-foreground/40" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-foreground truncate">{p.title}</h3>
                  <StatusBadge status={p.is_published ? "published" : "draft"} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{p.excerpt || "No excerpt"}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                  {p.category && <span>• {p.category}</span>}
                  {p.tags?.length > 0 && <span>• {p.tags.length} tag{p.tags.length === 1 ? "" : "s"}</span>}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {p.is_published && (
                  <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Link to={`/blog/${p.slug}`} target="_blank"><Eye className="w-3.5 h-3.5" /></Link>
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => startEdit(p)}>
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => remove(p.id)} disabled={del.isPending}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
