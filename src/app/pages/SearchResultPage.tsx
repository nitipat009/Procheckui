import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Heart, Wifi, Zap, Phone, ArrowUpRight, SlidersHorizontal, X, RotateCcw, AlertCircle, PackageSearch, ShieldCheck } from "lucide-react";
import { Footer } from "../components/Footer";
import { AiChat } from "../components/AiChat";
import { FilterPanel, FilterValues, defaultFilterValues } from "../components/search/FilterPanel";
import { Pagination } from "../components/search/Pagination";
import { mobilePackages, internetPackages, MobilePackage, InternetPackage, AnyPackage } from "../data/mockPackages";

// ── Accent ───────────────────────────────────────────────────────────────────
const MOBILE_ACCENT  = "#0B5ED7";
const INTERNET_ACCENT = "#0EA5E9";

// ── Sort options ─────────────────────────────────────────────────────────────
type SortKey =
  | "ราคา"
  | "ปริมาณการโทรออก"
  | "ปริมาณอินเทอร์เน็ต"
  | "ความเร็วอินเทอร์เน็ต"
  | "ปริมาณ SMS"
  | "ปริมาณ MMS"
  | "อัตราค่าบริการเสียงเฉลี่ย (บาท/นาที)"
  | "อัตราค่าบริการ SMS เฉลี่ย (บาท/ข้อความ)"
  | "อัตราค่าบริการ MMS เฉลี่ย (บาท/ข้อความ)"
  | "อัตราค่าบริการอินเทอร์เน็ตเฉลี่ย (บาท/MB)";

const SORT_OPTIONS: SortKey[] = [
  "ราคา",
  "ปริมาณการโทรออก",
  "ปริมาณอินเทอร์เน็ต",
  "ความเร็วอินเทอร์เน็ต",
  "ปริมาณ SMS",
  "ปริมาณ MMS",
  "อัตราค่าบริการเสียงเฉลี่ย (บาท/นาที)",
  "อัตราค่าบริการ SMS เฉลี่ย (บาท/ข้อความ)",
  "อัตราค่าบริการ MMS เฉลี่ย (บาท/ข้อความ)",
  "อัตราค่าบริการอินเทอร์เน็ตเฉลี่ย (บาท/MB)",
];

function sortValue(pkg: AnyPackage, key: SortKey): number {
  if (pkg.type === "mobile") {
    const m = pkg as MobilePackage;
    switch (key) {
      case "ราคา": return m.price;
      case "ปริมาณการโทรออก": return m.callsMin;
      case "ปริมาณอินเทอร์เน็ต": return m.dataGb;
      case "ความเร็วอินเทอร์เน็ต": return m.speedMbps;
      case "ปริมาณ SMS": return m.sms;
      case "ปริมาณ MMS": return m.mms;
      case "อัตราค่าบริการเสียงเฉลี่ย (บาท/นาที)": return m.callsMin > 0 && m.callsMin < 9999 ? m.price / m.callsMin : 0;
      case "อัตราค่าบริการ SMS เฉลี่ย (บาท/ข้อความ)": return m.sms > 0 && m.sms < 9999 ? m.price / m.sms : 0;
      case "อัตราค่าบริการ MMS เฉลี่ย (บาท/ข้อความ)": return m.mms > 0 && m.mms < 9999 ? m.price / m.mms : 0;
      case "อัตราค่าบริการอินเทอร์เน็ตเฉลี่ย (บาท/MB)": return m.dataGb < 9999 ? m.price / (m.dataGb * 1024) : 0;
      default: return m.price;
    }
  } else {
    const i = pkg as InternetPackage;
    switch (key) {
      case "ราคา": return i.price;
      case "ความเร็วอินเทอร์เน็ต": return i.downloadMbps;
      case "ปริมาณอินเทอร์เน็ต": return i.downloadMbps;
      case "อัตราค่าบริการอินเทอร์เน็ตเฉลี่ย (บาท/MB)": return i.downloadMbps > 0 ? i.price / (i.downloadMbps * 1024) : 0;
      default: return i.price;
    }
  }
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-5 w-20 bg-gray-100 rounded-lg" />
      <div>
        <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
        <div className="h-7 w-1/3 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0,1,2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
      </div>
      <div className="h-5 w-24 bg-gray-100 rounded-lg" />
      <div className="h-9 w-full bg-gray-100 rounded-xl" />
    </div>
  );
}

// ── Mobile Package Card ───────────────────────────────────────────────────────
function MobileCard({ pkg, isFavorite, onToggle, accent, onOpen }: { pkg: MobilePackage; isFavorite: boolean; onToggle: () => void; accent: string; onOpen: () => void }) {
  return (
    <div onClick={onOpen} className="relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-[0_8px_30px_-8px_rgba(11,94,215,0.15)] transition-all cursor-pointer group flex flex-col gap-3"
      style={{ ["--hover-border-color" as string]: accent }}>
      <button onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFavorite ? "bg-rose-50 text-rose-500" : "bg-gray-50 text-gray-300 hover:bg-rose-50 hover:text-rose-400"}`}>
        <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
      </button>
      <div className="flex items-start gap-3 pr-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg"
          style={{ background: pkg.providerBg, color: pkg.providerColor }}>
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pkg.providerColor }} />
          {pkg.provider}
        </span>
      </div>
      <div>
        <p className="font-semibold text-gray-900 leading-tight">{pkg.name}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold" style={{ color: accent }}>{pkg.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400">บาท/เดือน</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { Icon: Wifi, val: pkg.data, label: "ข้อมูล" },
          { Icon: Zap, val: pkg.speed, label: "ความเร็ว" },
          { Icon: Phone, val: pkg.calls, label: "โทร" },
        ].map(({ Icon, val, label }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-1 bg-[#F5F7FA] rounded-xl p-2 text-center min-h-[68px]">
            <Icon className="w-3.5 h-3.5" strokeWidth={2} style={{ color: accent }} />
            <span className="text-xs font-semibold text-gray-900 leading-tight break-words w-full">{val}</span>
            <span className="text-[10px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{ background: pkg.categoryBg, color: pkg.categoryColor }}>
          {pkg.category}
        </span>
      </div>
      <button className="mt-auto w-full py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-1.5 group-hover:text-white transition-all"
        style={{ borderColor: accent, color: accent }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = accent; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = accent; }}>
        ดูรายละเอียด <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Internet Package Card ─────────────────────────────────────────────────────
function InternetCard({ pkg, isFavorite, onToggle, accent, onOpen }: { pkg: InternetPackage; isFavorite: boolean; onToggle: () => void; accent: string; onOpen: () => void }) {
  return (
    <div onClick={onOpen} className="relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-[0_8px_30px_-8px_rgba(14,165,233,0.15)] transition-all cursor-pointer group flex flex-col gap-3">
      <button onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFavorite ? "bg-rose-50 text-rose-500" : "bg-gray-50 text-gray-300 hover:bg-rose-50 hover:text-rose-400"}`}>
        <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
      </button>
      <div className="flex items-start gap-3 pr-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg"
          style={{ background: pkg.providerBg, color: pkg.providerColor }}>
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pkg.providerColor }} />
          {pkg.provider}
        </span>
      </div>
      <div>
        <p className="font-semibold text-gray-900 leading-tight">{pkg.name}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold" style={{ color: accent }}>{pkg.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400">บาท/เดือน</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { Icon: Wifi, val: pkg.download, label: "ดาวน์โหลด" },
          { Icon: Zap, val: pkg.upload, label: "อัปโหลด" },
          { Icon: ShieldCheck, val: pkg.contract, label: "สัญญา" },
        ].map(({ Icon, val, label }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-1 bg-[#F5F7FA] rounded-xl p-2 text-center min-h-[68px]">
            <Icon className="w-3.5 h-3.5" strokeWidth={2} style={{ color: accent }} />
            <span className="text-[10px] font-semibold text-gray-900 leading-tight break-words w-full">{val}</span>
            <span className="text-[10px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{ background: pkg.categoryBg, color: pkg.categoryColor }}>
          {pkg.category}
        </span>
      </div>
      <button className="mt-auto w-full py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-1.5 transition-all"
        style={{ borderColor: accent, color: accent }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = accent; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = accent; }}>
        ดูรายละเอียด <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = (searchParams.get("type") as "mobile" | "internet") || "mobile";
  const isMobile = type === "mobile";
  const accent = isMobile ? MOBILE_ACCENT : INTERNET_ACCENT;

  // Parse initial filter from URL
  const initialFilter: FilterValues = {
    provider: searchParams.get("provider") || "",
    serviceType: searchParams.get("serviceType") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 2000,
    privileges: searchParams.get("privileges")?.split(",").filter(Boolean) || [],
    minData: Number(searchParams.get("minData")) || 0,
    minSpeed: Number(searchParams.get("minSpeed")) || 0,
    minCalls: Number(searchParams.get("minCalls")) || 0,
    minDownload: Number(searchParams.get("minDownload")) || 0,
    minUpload: Number(searchParams.get("minUpload")) || 0,
    maxContract: Number(searchParams.get("maxContract")) || 24,
  };

  // State
  const [filter, setFilter] = useState<FilterValues>(initialFilter);
  const [sortBy, setSortBy] = useState<SortKey>("ราคา");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Simulate initial load
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // Filtered + sorted data
  const allPackages = isMobile ? mobilePackages : internetPackages;

  const filtered = useMemo<AnyPackage[]>(() => {
    return (allPackages as AnyPackage[]).filter((pkg) => {
      if (pkg.price < filter.minPrice) return false;
      if (filter.maxPrice < 2000 && pkg.price > filter.maxPrice) return false;
      if (filter.provider && pkg.provider !== filter.provider) return false;
      if (filter.privileges.length > 0 && !filter.privileges.includes(pkg.category)) return false;
      if (pkg.type === "mobile") {
        const m = pkg as MobilePackage;
        if (filter.minData > 0 && m.dataGb < filter.minData && m.dataGb < 9999) return false;
        if (filter.minSpeed > 0 && m.speedMbps < filter.minSpeed) return false;
        if (filter.minCalls > 0 && m.callsMin < filter.minCalls && m.callsMin < 9999) return false;
      } else {
        const i = pkg as InternetPackage;
        if (filter.minDownload > 0 && i.downloadMbps < filter.minDownload) return false;
        if (filter.minUpload > 0 && i.uploadMbps < filter.minUpload) return false;
        if (filter.maxContract < 24 && i.contractMonths > filter.maxContract) return false;
      }
      return true;
    });
  }, [allPackages, filter, isMobile]);

  const sorted = useMemo<AnyPackage[]>(() => {
    return [...filtered].sort((a, b) => {
      const diff = sortValue(a, sortBy) - sortValue(b, sortBy);
      return sortOrder === "asc" ? diff : -diff;
    });
  }, [filtered, sortBy, sortOrder]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleApplyFilter = (values: FilterValues) => {
    setFilter(values);
    setCurrentPage(1);
    setDrawerOpen(false);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleRetry = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => setIsLoading(false), 900);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-gray-900">

      {/* ── Page Header Bar ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          {/* Title + count */}
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-bold text-gray-900 truncate">
              {isMobile ? "รายการแพ็กเกจโทรศัพท์" : "รายการแพ็กเกจอินเทอร์เน็ตบ้าน"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {isLoading ? "กำลังโหลด…" : `จำนวน ${sorted.length} รายการ`}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile: filter button */}
            <button
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 transition-colors"
              onClick={() => setDrawerOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" style={{ color: accent }} />
              <span className="text-xs">กรอง</span>
            </button>

            {/* Sort By */}
            <div className="relative hidden sm:block">
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortKey); setCurrentPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none cursor-pointer max-w-[180px] truncate">
                {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Sort Order */}
            <div className="relative hidden sm:block">
              <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value as "asc" | "desc"); setCurrentPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none cursor-pointer">
                <option value="asc">น้อย → มาก</option>
                <option value="desc">มาก → น้อย</option>
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile sort row */}
        <div className="sm:hidden px-4 pb-3 flex gap-2">
          <div className="relative flex-1">
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortKey); setCurrentPage(1); }}
              className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="relative">
            <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value as "asc" | "desc"); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-7 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none cursor-pointer">
              <option value="asc">น้อย → มาก</option>
              <option value="desc">มาก → น้อย</option>
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Main: sidebar + results ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex gap-6 items-start">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden md:block w-72 flex-shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-900 mb-4">ตัวกรอง</p>
            <FilterPanel type={type} initialValues={filter} onApply={handleApplyFilter} />
          </div>
        </aside>

        {/* ── Results ── */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: itemsPerPage }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">เกิดข้อผิดพลาด</p>
                <p className="text-sm text-gray-400 mt-1">ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง</p>
              </div>
              <button onClick={handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ background: accent }}>
                <RotateCcw className="w-4 h-4" /> ลองใหม่
              </button>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5F7FA] flex items-center justify-center">
                <PackageSearch className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">ไม่พบแพ็กเกจที่ตรงเงื่อนไข</p>
                <p className="text-sm text-gray-400 mt-1">ลองปรับเงื่อนไขการกรองหรือล้างค่า filter</p>
              </div>
              <button
                onClick={() => { setFilter(defaultFilterValues); setCurrentPage(1); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <RotateCcw className="w-4 h-4" /> ล้าง filter ทั้งหมด
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((pkg) =>
                  pkg.type === "mobile" ? (
                    <MobileCard key={pkg.id} pkg={pkg as MobilePackage}
                      isFavorite={favorites.has(pkg.id)} onToggle={() => toggleFavorite(pkg.id)} accent={accent}
                      onOpen={() => navigate(`/package-detail?id=${pkg.id}`)} />
                  ) : (
                    <InternetCard key={pkg.id} pkg={pkg as InternetPackage}
                      isFavorite={favorites.has(pkg.id)} onToggle={() => toggleFavorite(pkg.id)} accent={accent}
                      onOpen={() => navigate(`/package-detail?id=${pkg.id}`)} />
                  )
                )}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={sorted.length}
                accentColor={accent}
                onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
              />
            </>
          )}
        </main>
      </div>

      {/* ── Mobile filter drawer ────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          {/* Drawer */}
          <div className="relative w-[min(340px,90vw)] h-full bg-white flex flex-col shadow-2xl animate-[slideInLeft_0.25s_ease-out]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <p className="font-semibold text-gray-900">ตัวกรอง</p>
              <button onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterPanel type={type} initialValues={filter} onApply={handleApplyFilter} />
            </div>
          </div>
        </div>
      )}

      <Footer />
      <AiChat />

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}