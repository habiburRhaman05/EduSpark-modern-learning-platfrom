import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  perPage?: number;
}

export function Pagination({ page, totalPages, onPageChange, total, perPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      {total != null && perPage != null && (
        <p className="text-xs text-muted-foreground hidden sm:block">
          Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}
        </p>
      )}
      <div className="flex items-center gap-1 ml-auto">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)} className="border-border rounded-xl h-8 w-8 p-0">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {getVisiblePages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-xs text-muted-foreground">…</span>
          ) : (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(p as number)}
              className={`rounded-xl h-8 w-8 p-0 text-xs ${page === p ? "bg-primary" : "border-border"}`}
            >
              {p}
            </Button>
          )
        )}
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className="border-border rounded-xl h-8 w-8 p-0">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
