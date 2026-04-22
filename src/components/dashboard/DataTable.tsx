import { ReactNode, useEffect } from "react";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "./EmptyState";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  page?: number;
  totalPages?: number;
  total?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  page,
  totalPages,
  total,
  pageSize = 10,
  onPageChange,
  emptyTitle = "No data found",
  emptyDescription,
  onRowClick,
}: DataTableProps<T>) {
  // Scroll to top of table on page change
  useEffect(() => {
    if (page && page > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className={`text-left py-3 font-medium text-muted-foreground ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={`border-b border-border/50 ${onRowClick ? "cursor-pointer hover:bg-muted/30" : ""}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 ${col.className || ""}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {page !== undefined && totalPages !== undefined && onPageChange && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          perPage={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
