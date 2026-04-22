import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAdminUsers } from "@/hooks/useAdmin";
import { useUserStatuses, useSetUserStatus, type UserStatus } from "@/hooks/useAdminUserStatus";
import { MoreVertical, Loader2, ShieldCheck, Ban, PauseCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const role = params.get("role") || "";
  const page = Number(params.get("page") || 1);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const setParam = (k: string, v: string | number) => {
    const next = new URLSearchParams(params);
    if (!v && v !== 0) next.delete(k); else next.set(k, String(v));
    if (k !== "page") next.set("page", "1");
    setParams(next, { replace: true });
  };

  const { data, isLoading } = useAdminUsers({ page, pageSize: 10, search, role });
  const userIds = (data?.items || []).map((u: any) => u.user_id);
  const { data: statusMap } = useUserStatuses(userIds);
  const setStatus = useSetUserStatus();

  const onSetStatus = async (userId: string, status: UserStatus, name: string) => {
    setPendingId(userId);
    try {
      await setStatus.mutateAsync({ userId, status });
      toast.success(`${name} is now ${status}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to update status");
    } finally {
      setPendingId(null);
    }
  };

  const columns = [
    {
      key: "name",
      header: "User",
      render: (u: any) => (
        <div className="flex items-center gap-2">
          {u.avatar_url ? (
            <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
              {(u.full_name || "?").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-foreground font-medium text-sm">{u.full_name || "Unnamed"}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (u: any) => <StatusBadge status={u.role} size="md" /> },
    {
      key: "status",
      header: "Status",
      render: (u: any) => {
        const s = (statusMap?.get(u.user_id) || "active") as UserStatus;
        return <StatusBadge status={s} size="md" />;
      },
    },
    { key: "phone", header: "Phone", render: (u: any) => <span className="text-muted-foreground text-xs">{u.phone || "—"}</span> },
    { key: "joined", header: "Joined", render: (u: any) => <span className="text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</span> },
    {
      key: "actions",
      header: "",
      render: (u: any) => {
        const current = (statusMap?.get(u.user_id) || "active") as UserStatus;
        const busy = pendingId === u.user_id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={busy}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuLabel>Change status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={current === "active"} onClick={() => onSetStatus(u.user_id, "active", u.full_name || "User")}>
                <ShieldCheck className="w-3.5 h-3.5 mr-2 text-success" /> Activate
              </DropdownMenuItem>
              <DropdownMenuItem disabled={current === "suspended"} onClick={() => onSetStatus(u.user_id, "suspended", u.full_name || "User")}>
                <PauseCircle className="w-3.5 h-3.5 mr-2 text-warning" /> Suspend
              </DropdownMenuItem>
              <DropdownMenuItem disabled={current === "banned"} onClick={() => onSetStatus(u.user_id, "banned", u.full_name || "User")} className="text-destructive">
                <Ban className="w-3.5 h-3.5 mr-2" /> Ban
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader title="User Management" description={isLoading ? "Loading…" : `${data?.total || 0} total users`} />
      <div className="bento-card">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => setParam("q", v)}
          searchPlaceholder="Search by name or email…"
          filters={[{
            label: "All Roles",
            value: "role",
            options: [
              { label: "Student", value: "student" },
              { label: "Tutor", value: "tutor" },
              { label: "Moderator", value: "moderator" },
              { label: "Admin", value: "admin" },
              { label: "Technician", value: "technician" },
            ],
          }]}
          filterValues={{ role }}
          onFilterChange={(_, v) => setParam("role", v)}
        />
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.items || []}
            keyExtractor={(u: any) => u.id}
            page={page}
            totalPages={data?.totalPages || 1}
            onPageChange={(p) => setParam("page", p)}
            emptyTitle="No users found"
          />
        )}
      </div>
    </>
  );
}
