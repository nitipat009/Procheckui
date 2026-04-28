import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  accentColor?: string;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (n: number) => void;
}

function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, itemsPerPage, totalItems, accentColor = "#0B5ED7", onPageChange, onItemsPerPageChange }: Props) {
  const [goInput, setGoInput] = useState("");
  const pages = buildPages(currentPage, totalPages);

  const handleGo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const n = parseInt(goInput, 10);
      if (!isNaN(n) && n >= 1 && n <= totalPages) {
        onPageChange(n);
        setGoInput("");
      }
    }
  };

  if (totalPages <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
      {/* Left: total + items per page */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>แสดง {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}–{Math.min(currentPage * itemsPerPage, totalItems)} จาก {totalItems} รายการ</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">แสดง</span>
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => { onItemsPerPageChange(Number(e.target.value)); onPageChange(1); }}
              className="appearance-none pl-2.5 pr-6 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none cursor-pointer"
            >
              {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span className="text-xs">รายการ/หน้า</span>
        </div>
      </div>

      {/* Center: page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === currentPage ? "text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              style={p === currentPage ? { background: accentColor } : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right: go to page */}
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <span className="text-xs">ไปหน้า</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={goInput}
          onChange={(e) => setGoInput(e.target.value)}
          onKeyDown={handleGo}
          placeholder="—"
          className="w-14 px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-current"
          style={{ ["--tw-border-color" as string]: accentColor }}
        />
      </div>
    </div>
  );
}
