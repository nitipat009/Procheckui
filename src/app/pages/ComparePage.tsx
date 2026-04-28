import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  X, Plus, Search, Trophy, ArrowUpRight, RotateCcw, Smartphone, Wifi,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { AiChat } from "../components/AiChat";
import {
  mobilePackages, internetPackages,
  MobilePackage, InternetPackage, AnyPackage,
} from "../data/mockPackages";
import { useIsMobile } from "../components/ui/use-mobile";

const ACCENT = "#0B5ED7";
const MAX_SLOTS = 3;

// ── Helpers ──────────────────────────────────────────────────────────────────
function findPackage(id: number): AnyPackage | undefined {
  const direct = (mobilePackages as AnyPackage[]).find((p) => p.id === id)
    || (internetPackages as AnyPackage[]).find((p) => p.id === id);
  if (direct) return direct;
  if (!id) return undefined;
  const pool = mobilePackages as AnyPackage[];
  return pool[Math.abs(id) % pool.length];
}

type Field =
  | "price" | "duration_days" | "call_minutes" | "sms" | "mms" | "call_rate"
  | "internet_gb" | "internet_speed" | "wifi" | "internet_rate"
  | "other_privileges" | "entertainment";

type RowDef = { label: string; field: Field; better?: "lower" | "higher" };
type GroupDef = { title: string; rows: RowDef[] };

const GROUPS: GroupDef[] = [
  { title: "ค่าบริการ", rows: [
    { label: "ราคา/เดือน", field: "price", better: "lower" },
    { label: "ระยะเวลา", field: "duration_days" },
  ]},
  { title: "การโทร & ข้อความ", rows: [
    { label: "โทรออก (นาที)", field: "call_minutes", better: "higher" },
    { label: "SMS", field: "sms", better: "higher" },
    { label: "MMS", field: "mms", better: "higher" },
    { label: "อัตราค่าโทรเฉลี่ย (บาท/นาที)", field: "call_rate", better: "lower" },
  ]},
  { title: "อินเทอร์เน็ต", rows: [
    { label: "ปริมาณอินเทอร์เน็ต", field: "internet_gb", better: "higher" },
    { label: "ความเร็ว (Mbps)", field: "internet_speed", better: "higher" },
    { label: "WiFi", field: "wifi" },
    { label: "อัตราค่าอินเทอร์เน็ต (บาท/MB)", field: "internet_rate", better: "lower" },
  ]},
  { title: "สิทธิพิเศษ", rows: [
    { label: "สิทธิการใช้งานอื่น ๆ", field: "other_privileges" },
    { label: "ความบันเทิง", field: "entertainment" },
  ]},
];

type Cell = { display: string; numeric: number | null };
const DASH: Cell = { display: "–", numeric: null };

function getCell(pkg: AnyPackage, field: Field): Cell {
  if (pkg.type === "mobile") {
    const m = pkg as MobilePackage;
    switch (field) {
      case "price": return { display: `${m.price.toLocaleString()} บาท`, numeric: m.price };
      case "duration_days": return { display: "30 วัน", numeric: 30 };
      case "call_minutes":
        return m.callsMin >= 9999
          ? { display: "ไม่อั้น", numeric: 999999 }
          : { display: `${m.callsMin} นาที`, numeric: m.callsMin };
      case "sms":
        return m.sms >= 9999
          ? { display: "ไม่อั้น", numeric: 999999 }
          : m.sms === 0 ? DASH : { display: `${m.sms}`, numeric: m.sms };
      case "mms":
        return m.mms >= 9999
          ? { display: "ไม่อั้น", numeric: 999999 }
          : m.mms === 0 ? DASH : { display: `${m.mms}`, numeric: m.mms };
      case "call_rate":
        if (m.callsMin <= 0 || m.callsMin >= 9999) return DASH;
        return { display: (m.price / m.callsMin).toFixed(2), numeric: m.price / m.callsMin };
      case "internet_gb":
        return m.dataGb >= 9999
          ? { display: "ไม่อั้น", numeric: 999999 }
          : { display: `${m.dataGb} GB`, numeric: m.dataGb };
      case "internet_speed":
        return { display: m.speed, numeric: m.speedMbps };
      case "wifi": return DASH;
      case "internet_rate":
        if (m.dataGb >= 9999 || m.dataGb <= 0) return DASH;
        return { display: (m.price / (m.dataGb * 1024)).toFixed(4), numeric: m.price / (m.dataGb * 1024) };
      case "other_privileges": return { display: m.category, numeric: null };
      case "entertainment":
        return m.category === "บันเทิง" ? { display: "รวม", numeric: 1 } : DASH;
    }
  } else {
    const i = pkg as InternetPackage;
    switch (field) {
      case "price": return { display: `${i.price.toLocaleString()} บาท`, numeric: i.price };
      case "duration_days": return { display: "รายเดือน", numeric: 30 };
      case "call_minutes": return DASH;
      case "sms": return DASH;
      case "mms": return DASH;
      case "call_rate": return DASH;
      case "internet_gb": return { display: "ไม่จำกัด", numeric: 999999 };
      case "internet_speed": return { display: i.download, numeric: i.downloadMbps };
      case "wifi": return { display: "รวม Router", numeric: 1 };
      case "internet_rate": return DASH;
      case "other_privileges": return { display: i.category, numeric: null };
      case "entertainment":
        return i.category === "ดูทีวี" ? { display: "รวม", numeric: 1 } : DASH;
    }
  }
  return DASH;
}

function rowsAllSame(cells: Cell[]): boolean {
  if (cells.length < 2) return true;
  const first = cells[0].display;
  return cells.every((c) => c.display === first);
}

function bestIndex(cells: Cell[], better?: "lower" | "higher"): number | null {
  if (!better) return null;
  const numerics = cells.map((c) => c.numeric);
  if (numerics.every((n) => n === null)) return null;
  let best: number | null = null;
  let bestVal = better === "lower" ? Infinity : -Infinity;
  numerics.forEach((n, i) => {
    if (n === null) return;
    if (better === "lower" && n < bestVal) { bestVal = n; best = i; }
    if (better === "higher" && n > bestVal) { bestVal = n; best = i; }
  });
  // No highlight if tie
  const winners = numerics.filter((n) => n !== null && n === bestVal).length;
  return winners === 1 ? best : null;
}

// ── Add Package Modal ────────────────────────────────────────────────────────
function AddPackageModal({
  open, onClose, onSelect, excludedIds,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (pkg: AnyPackage) => void;
  excludedIds: number[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "mobile" | "internet">("all");

  const all: AnyPackage[] = useMemo(
    () => [...mobilePackages, ...internetPackages] as AnyPackage[],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((p) => {
      if (filter !== "all" && p.type !== filter) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q);
    });
  }, [all, query, filter]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900">เลือกแพ็กเกจเพื่อเปรียบเทียบ</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อแพ็กเกจหรือผู้ให้บริการ"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B5ED7]"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            {([
              { v: "all", label: "ทั้งหมด", Icon: null },
              { v: "mobile", label: "โทรศัพท์", Icon: Smartphone },
              { v: "internet", label: "อินเทอร์เน็ตบ้าน", Icon: Wifi },
            ] as const).map(({ v, label, Icon }) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
                  filter === v
                    ? "bg-[#0B5ED7] border-[#0B5ED7] text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto px-3 py-2 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">ไม่พบแพ็กเกจที่ตรงกับการค้นหา</div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((pkg) => {
                const disabled = excludedIds.includes(pkg.id);
                return (
                  <li key={pkg.id}>
                    <button
                      disabled={disabled}
                      onClick={() => { onSelect(pkg); onClose(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                        style={{ background: pkg.providerBg, color: pkg.providerColor }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: pkg.providerColor }} />
                        {pkg.provider}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{pkg.name}</p>
                        <p className="text-xs text-gray-400">
                          {pkg.type === "mobile"
                            ? `${(pkg as MobilePackage).data} • ${(pkg as MobilePackage).speed}`
                            : `${(pkg as InternetPackage).download} • ${(pkg as InternetPackage).contract}`}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#0B5ED7] flex-shrink-0">
                        {pkg.price.toLocaleString()}
                      </span>
                      {disabled && <span className="text-[10px] text-gray-400 ml-2">เพิ่มแล้ว</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const maxSlots = isMobile ? 2 : MAX_SLOTS;

  const initialIds = useMemo(() => {
    const raw = searchParams.get("ids") || "";
    return raw.split(",").map((s) => Number(s)).filter((n) => Number.isFinite(n) && n > 0);
  }, [searchParams]);

  const [slots, setSlots] = useState<(AnyPackage | null)[]>(() => {
    const arr: (AnyPackage | null)[] = Array(MAX_SLOTS).fill(null);
    initialIds.slice(0, MAX_SLOTS).forEach((id, i) => {
      const found = findPackage(id);
      if (found) arr[i] = found;
    });
    return arr;
  });

  const [showDiffOnly, setShowDiffOnly] = useState(false);
  const [modalOpenIndex, setModalOpenIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // Sync URL — only visible slots
  useEffect(() => {
    const visibleSlots = slots.slice(0, maxSlots);
    const ids = visibleSlots.filter((s): s is AnyPackage => !!s).map((s) => s.id).join(",");
    const next = new URLSearchParams(searchParams);
    if (ids) next.set("ids", ids);
    else next.delete("ids");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, maxSlots]);

  const visibleSlots = slots.slice(0, maxSlots);
  const filledIds = visibleSlots.filter((s): s is AnyPackage => !!s).map((s) => s.id);

  const setSlot = (idx: number, pkg: AnyPackage | null) => {
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = pkg;
      return next;
    });
  };

  const clearAll = () => setSlots(Array(MAX_SLOTS).fill(null));

  const filledCount = filledIds.length;

  // Dynamic grid classes
  const selectorGridClass = isMobile
    ? "grid-cols-[80px_repeat(2,minmax(0,1fr))]"
    : "grid-cols-[180px_repeat(3,minmax(0,1fr))]";

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-gray-900">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          เปรียบเทียบแพ็กเกจ
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {isMobile
            ? "เลือกแพ็กเกจสูงสุด 2 รายการเพื่อเปรียบเทียบแบบเคียงข้างกัน"
            : "เลือกแพ็กเกจสูงสุด 3 รายการเพื่อเปรียบเทียบแบบเคียงข้างกัน"}
        </p>
      </div>

      {/* Sticky Selector Header */}
      <div className="sticky top-16 z-30 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
          <div className={`grid ${selectorGridClass} gap-2 md:gap-3`}>
            <div className="hidden md:flex items-center text-xs uppercase tracking-wide text-gray-400">
              แพ็กเกจที่เลือก
            </div>
            <div className="md:hidden" />
            {visibleSlots.map((pkg, idx) => (
              <SlotCard
                key={idx}
                pkg={pkg}
                onAdd={() => setModalOpenIndex(idx)}
                onRemove={() => setSlot(idx, null)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {filledCount === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#0B5ED7]/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-[#0B5ED7]" />
            </div>
            <p className="font-semibold text-gray-800">ยังไม่มีแพ็กเกจให้เปรียบเทียบ</p>
            <p className="text-sm text-gray-500 mt-1">เริ่มต้นโดยเพิ่มแพ็กเกจในช่องด้านบน</p>
            <button
              onClick={() => setModalOpenIndex(0)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium"
              style={{ background: ACCENT }}
            >
              <Plus className="w-4 h-4" /> เพิ่มแพ็กเกจแรก
            </button>
          </div>
        ) : (
          <>
            {/* Diff toggle */}
            <div className="flex items-center justify-between mb-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDiffOnly}
                  onChange={(e) => setShowDiffOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5ED7] rounded"
                />
                แสดงเฉพาะหัวข้อที่ต่างกัน
              </label>
              {filledCount < maxSlots && (
                <span className="text-xs text-gray-400">
                  เพิ่มได้อีก {maxSlots - filledCount} รายการ
                </span>
              )}
            </div>

            <ComparisonTable
              slots={visibleSlots}
              showDiffOnly={showDiffOnly}
              isLoading={isLoading}
              isMobile={isMobile}
            />

            {/* Action Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {visibleSlots.map((pkg, idx) =>
                pkg ? (
                  <button
                    key={idx}
                    onClick={() => navigate(`/package-detail?id=${pkg.id}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-[#0B5ED7] hover:text-[#0B5ED7] transition-colors"
                  >
                    ดูรายละเอียด: <span className="font-medium truncate max-w-[140px]">{pkg.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : null
              )}
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 hover:bg-gray-50"
              >
                <RotateCcw className="w-3.5 h-3.5" /> ล้างการเปรียบเทียบ
              </button>
            </div>
          </>
        )}
      </div>

      <AddPackageModal
        open={modalOpenIndex !== null}
        onClose={() => setModalOpenIndex(null)}
        excludedIds={filledIds}
        onSelect={(pkg) => modalOpenIndex !== null && setSlot(modalOpenIndex, pkg)}
      />

      <Footer />
      <AiChat />
    </div>
  );
}

// ── Slot Card ────────────────────────────────────────────────────────────────
function SlotCard({
  pkg, onAdd, onRemove,
}: {
  pkg: AnyPackage | null;
  onAdd: () => void;
  onRemove: () => void;
}) {
  if (!pkg) {
    return (
      <button
        onClick={onAdd}
        className="h-[100px] md:h-[120px] rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 hover:border-[#0B5ED7] hover:bg-white transition-colors flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-[#0B5ED7]"
      >
        <Plus className="w-5 h-5" />
        <span className="text-xs font-medium">เพิ่มแพ็กเกจ</span>
      </button>
    );
  }
  return (
    <div className="relative h-[100px] md:h-[120px] rounded-2xl bg-white border border-gray-100 shadow-sm p-3 md:p-4 flex flex-col gap-1">
      <button
        onClick={onRemove}
        aria-label="ลบ"
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
      >
        <X className="w-3 h-3 text-gray-500" />
      </button>
      <span
        className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md w-fit"
        style={{ background: pkg.providerBg, color: pkg.providerColor }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: pkg.providerColor }} />
        {pkg.provider}
      </span>
      <p className="text-xs md:text-sm font-semibold text-gray-900 leading-tight line-clamp-2 hidden md:block pr-6">
        {pkg.name}
      </p>
      <div className="mt-auto flex items-baseline gap-1">
        <span className="text-base md:text-xl font-bold text-[#0B5ED7]">
          {pkg.price.toLocaleString()}
        </span>
        <span className="text-[10px] text-gray-400">บาท/เดือน</span>
      </div>
    </div>
  );
}

// ── Comparison Table ─────────────────────────────────────────────────────────
function ComparisonTable({
  slots, showDiffOnly, isLoading, isMobile,
}: {
  slots: (AnyPackage | null)[];
  showDiffOnly: boolean;
  isLoading: boolean;
  isMobile: boolean;
}) {
  const numCols = slots.length; // 2 on mobile, 3 on desktop

  const labelColClass = isMobile ? "w-[100px]" : "w-[160px] md:w-[200px]";
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? `100px repeat(${numCols}, minmax(0, 1fr))`
      : `160px repeat(${numCols}, minmax(0, 1fr))`,
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={gridStyle} className="gap-2 p-4 border-b border-gray-100 last:border-b-0">
            <div className="h-3 bg-gray-100 rounded" />
            {Array.from({ length: numCols }).map((__, j) => (
              <div key={j} className="h-3 bg-gray-100 rounded" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <div className={isMobile ? "" : "min-w-[640px]"}>
          {GROUPS.map((group) => {
            const visibleRows = group.rows.filter((row) => {
              if (!showDiffOnly) return true;
              const cells = slots.map((s) => (s ? getCell(s, row.field) : DASH));
              return !rowsAllSame(cells);
            });
            if (visibleRows.length === 0) return null;

            return (
              <div key={group.title}>
                {/* Group header */}
                <div
                  style={gridStyle}
                  className="bg-[#F5F7FA] px-4 md:px-5 py-2.5 border-y border-gray-100"
                >
                  <div
                    style={{ gridColumn: `1 / span ${numCols + 1}` }}
                    className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold"
                  >
                    {group.title}
                  </div>
                </div>

                {visibleRows.map((row) => {
                  const cells = slots.map((s) => (s ? getCell(s, row.field) : DASH));
                  const allSame = rowsAllSame(cells.filter((_, i) => slots[i]));
                  const best = bestIndex(
                    cells.map((c, i) => (slots[i] ? c : { display: "–", numeric: null })),
                    row.better
                  );
                  return (
                    <div
                      key={row.field}
                      style={gridStyle}
                      className={`px-4 md:px-5 py-3 border-b border-gray-100 last:border-b-0 ${
                        !allSame ? "bg-[#FFFAF0]/40" : ""
                      }`}
                    >
                      <div className={`text-xs md:text-sm text-gray-600 flex items-center gap-1.5 sticky left-0 bg-inherit pr-2 ${labelColClass}`}>
                        <span className="truncate">{row.label}</span>
                        {!allSame && (
                          <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 flex-shrink-0">
                            ต่างกัน
                          </span>
                        )}
                      </div>
                      {cells.map((cell, i) => {
                        const filled = !!slots[i];
                        const isBest = best === i && filled;
                        return (
                          <div
                            key={i}
                            className={`text-xs md:text-sm flex items-center gap-1.5 px-2 ${
                              isBest ? "font-bold text-[#0B5ED7]" : "text-gray-900"
                            }`}
                          >
                            {isBest && <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                            <span className="truncate">{filled ? cell.display : "–"}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ComparePage;