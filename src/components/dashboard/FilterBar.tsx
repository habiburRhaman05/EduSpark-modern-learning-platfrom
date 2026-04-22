import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: { label: string; value: string; options: { label: string; value: string }[] }[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  rightContent?: React.ReactNode;
}

export function FilterBar({ searchValue, onSearchChange, searchPlaceholder = "Search...", filters, filterValues, onFilterChange, rightContent }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-10 h-10 glass border-white/[0.08] rounded-xl text-sm"
        />
      </div>
      {filters?.map((filter) => (
        <select
          key={filter.value}
          value={filterValues?.[filter.value] || ""}
          onChange={(e) => onFilterChange?.(filter.value, e.target.value)}
          className="text-sm bg-muted border-none rounded-xl px-4 py-2 text-foreground"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
      {rightContent}
    </div>
  );
}
