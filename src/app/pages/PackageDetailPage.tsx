import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Heart, FileText, Phone, MessageSquare, Image as ImageIcon, Globe, Zap,
  Wifi, Sparkles, Calendar, ChevronDown, ChevronLeft, ChevronRight,
  ArrowLeft, AlertCircle, ArrowUpRight, ShieldCheck,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { AiChat } from "../components/AiChat";
import {
  mobilePackages, internetPackages,
  MobilePackage, InternetPackage, AnyPackage,
} from "../data/mockPackages";

const MOBILE_ACCENT = "#F6F3E4";
const INTERNET_ACCENT = "#F6F3E4";

// ── Helpers ──────────────────────────────────────────────────────────────────
function findPackage(id: number): AnyPackage | undefined {
  const direct = (mobilePackages as AnyPackage[]).find((p) => p.id === id)
    || (internetPackages as AnyPackage[]).find((p) => p.id === id);
  if (direct) return direct;
  if (!id) return undefined;
  const pool = mobilePackages as AnyPackage[];
  return pool[Math.abs(id) % pool.length];
}

function dash(v: string | number | undefined | null, suffix?: string): string {
  if (v === undefined || v === null || v === "" || v === 0 || v === "0") return "–";
  return suffix ? `${v} ${suffix}` : String(v);
}

// ── Info Row ─────────────────────────────────────────────────────────────────
type Row = {
  Icon: React.ElementType;
  label: string;
  value: string;
  expandable?: boolean;
  details?: string[];
};

function InfoRow({ row, accent }: { row: Row; accent: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { Icon } = row;
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => row.expandable && setOpen((o) => !o)}
        disabled={!row.expandable}
        className={`w-full flex items-center gap-3 py-3.5 text-left ${row.expandable ? "cursor-pointer" : "cursor-default"}`}
      >
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent}12`, color: accent }}
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </span>
        <span className="text-sm text-gray-600 flex-1 min-w-0 truncate">{row.label}</span>
        <span className="text-sm font-semibold text-gray-900 text-right">{row.value}</span>
        {row.expandable && (
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      <div
        style={{ maxHeight: open && ref.current ? ref.current.scrollHeight : 0 }}
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
      >
        <div ref={ref} className="pb-3 pl-12 pr-2 text-xs text-gray-500 space-y-1.5">
          {row.details?.map((d, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Related Card (compact, reused style) ─────────────────────────────────────
function RelatedCard({ pkg, accent }: { pkg: AnyPackage; accent: string }) {
  const navigate = useNavigate();
  const isMobile = pkg.type === "mobile";
  const stats = isMobile
    ? [
        { Icon: Wifi, val: (pkg as MobilePackage).data, label: "ข้อมูล" },
        { Icon: Zap, val: (pkg as MobilePackage).speed, label: "ความเร็ว" },
        { Icon: Phone, val: (pkg as MobilePackage).calls, label: "โทร" },
      ]
    : [
        { Icon: Wifi, val: (pkg as InternetPackage).download, label: "ดาวน์โหลด" },
        { Icon: Zap, val: (pkg as InternetPackage).upload, label: "อัปโหลด" },
        { Icon: ShieldCheck, val: (pkg as InternetPackage).contract, label: "สัญญา" },
      ];
  return (
    <div
      onClick={() => navigate(`/package-detail?id=${pkg.id}`)}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-[0_8px_30px_-8px_rgba(11,94,215,0.15)] transition-all cursor-pointer group flex flex-col gap-3 w-[260px] flex-shrink-0"
    >
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg w-fit"
        style={{ background: pkg.providerBg, color: pkg.providerColor }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: pkg.providerColor }} />
        {pkg.provider}
      </span>
      <div>
        <p className="font-semibold text-gray-900 leading-tight line-clamp-2 min-h-[2.5em]">{pkg.name}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold" style={{ color: accent }}>{pkg.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400">บาท/เดือน</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map(({ Icon, val, label }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-center min-h-[68px]" style={{ background: "rgba(246,243,228,0.06)" }}>
            <Icon className="w-3.5 h-3.5" strokeWidth={2} style={{ color: accent }} />
            <span className="text-[11px] font-semibold text-gray-900 leading-tight break-words w-full">{val}</span>
            <span className="text-[10px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-1">
        <span
          className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{ background: pkg.categoryBg, color: pkg.categoryColor }}
        >
          {pkg.category}
        </span>
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[color:var(--accent)] transition-colors"
          style={{ ["--accent" as string]: accent }} />
      </div>
    </div>
  );
}

// ── Related Carousel (with arrows, per spec) ────────────────────────────────
function RelatedCarousel({ items, accent }: { items: AnyPackage[]; accent: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const offset = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -offset : offset, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        aria-label="ก่อนหน้า"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={() => scroll("right")}
        aria-label="ถัดไป"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((pkg) => (
          <div key={pkg.id} className="snap-start">
            <RelatedCard pkg={pkg} accent={accent} />
          </div>
        ))}
      </div>
      <style>{`
        .related-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ── Skeletons ────────────────────────────────────────────────────────────────
function SkeletonHeader() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 animate-pulse">
      <div className="w-14 h-14 bg-gray-100 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/5 bg-gray-100 rounded" />
        <div className="h-3 w-1/4 bg-gray-100 rounded" />
      </div>
      <div className="h-10 w-24 bg-gray-100 rounded-xl" />
    </div>
  );
}
function SkeletonInfo() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100" />
          <div className="h-3 w-1/3 bg-gray-100 rounded flex-1" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function PackageDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = Number(searchParams.get("id"));

  const [isLoading, setIsLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [privilegeOpen, setPrivilegeOpen] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, [id]);

  const pkg = useMemo(() => (id ? findPackage(id) : undefined), [id]);
  const isMobile = pkg?.type === "mobile";
  const accent = isMobile ? MOBILE_ACCENT : INTERNET_ACCENT;

  const related = useMemo<AnyPackage[]>(() => {
    if (!pkg) return [];
    const pool = (pkg.type === "mobile" ? mobilePackages : internetPackages) as AnyPackage[];
    const sameProvider = pool.filter((p) => p.id !== pkg.id && p.provider === pkg.provider);
    const others = pool.filter((p) => p.id !== pkg.id && p.provider !== pkg.provider);
    return [...sameProvider, ...others].slice(0, 10);
  }, [pkg]);

  const rows: Row[] = useMemo(() => {
    if (!pkg) return [];
    if (pkg.type === "mobile") {
      const m = pkg as MobilePackage;
      return [
        { Icon: () => <span className="font-bold text-sm">฿</span>, label: "ราคา", value: `${m.price.toLocaleString()} บาท` },
        {
          Icon: Phone, label: "โทร", value: m.calls,
          expandable: m.callsMin > 0,
          details: [
            "โทรในเครือข่ายและนอกเครือข่าย",
            m.callsMin >= 9999 ? "ไม่จำกัดจำนวนนาที" : `รวม ${m.callsMin} นาที/เดือน`,
            "ส่วนเกินคิดตามอัตราปกติ",
          ],
        },
        { Icon: MessageSquare, label: "SMS", value: m.sms >= 9999 ? "ไม่อั้น" : dash(m.sms, "ข้อความ") },
        { Icon: ImageIcon, label: "MMS", value: m.mms >= 9999 ? "ไม่อั้น" : dash(m.mms, "ข้อความ") },
        {
          Icon: Globe, label: "อินเทอร์เน็ต", value: m.data,
          expandable: true,
          details: [
            m.dataGb >= 9999 ? "ใช้งานได้ไม่อั้น" : `ปริมาณรวม ${m.dataGb} GB ต่อเดือน`,
            "เมื่อใช้ครบจะลดความเร็วลงเหลือ 384 Kbps",
            "รองรับการใช้งาน 5G/4G ทุกเครือข่าย",
          ],
        },
        { Icon: Zap, label: "ความเร็วอินเทอร์เน็ต", value: m.speed },
        { Icon: Wifi, label: "WiFi", value: "–" },
        { Icon: Sparkles, label: "สิทธิการใช้งานอื่นๆ", value: m.category },
        { Icon: Calendar, label: "ระยะเวลาการใช้งาน", value: "30 วัน" },
      ];
    }
    const i = pkg as InternetPackage;
    return [
      { Icon: () => <span className="font-bold text-sm">฿</span>, label: "ราคา", value: `${i.price.toLocaleString()} บาท` },
      { Icon: Wifi, label: "ดาวน์โหลด", value: i.download },
      { Icon: Zap, label: "อัปโหลด", value: i.upload },
      {
        Icon: Globe, label: "ปริมาณการใช้งาน", value: "ไม่จำกัด",
        expandable: true,
        details: ["ใช้งานได้ตลอด 24 ชั่วโมง", "ไม่มีการลดความเร็วเมื่อใช้งานหนัก"],
      },
      { Icon: ShieldCheck, label: "สัญญาการใช้งาน", value: i.contract },
      { Icon: Sparkles, label: "สิทธิพิเศษ", value: i.category },
      { Icon: Calendar, label: "ระยะเวลาการใช้งาน", value: "รายเดือน" },
    ];
  }, [pkg]);

  // ── Not found / error ──
  if (!isLoading && !pkg) {
    return (
      <div className="min-h-screen nbtc-page nbtc-theme-surface flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="font-semibold text-gray-800">ไม่พบรายการแพ็กเกจ</p>
            <p className="text-sm text-gray-500 mt-1">ลิงก์อาจไม่ถูกต้องหรือแพ็กเกจถูกลบไปแล้ว</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" /> กลับหน้าก่อนหน้า
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen nbtc-page nbtc-theme-surface">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
        </button>

        {/* Section 1 — Title */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          รายละเอียดรายการส่งเสริมการขาย
        </h1>

        {isLoading ? (
          <div className="space-y-5">
            <SkeletonHeader />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <SkeletonInfo />
              <SkeletonInfo />
            </div>
          </div>
        ) : pkg ? (
          <>
            {/* Section 2 — Header Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 flex items-center gap-4 shadow-sm">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-base"
                style={{ background: pkg.providerBg, color: pkg.providerColor }}
              >
                {pkg.provider.slice(0, 3).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">{pkg.provider}</p>
                <h2 className="font-bold text-gray-900 leading-tight truncate">{pkg.name}</h2>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => window.print()}
                >
                  <FileText className="w-4 h-4" /> Export PDF
                </button>
                <button
                  onClick={() => setFavorite((f) => !f)}
                  aria-label="บันทึกรายการโปรด"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    favorite
                      ? "bg-rose-50 text-rose-500"
                      : "bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-400"
                  }`}
                >
                  <Heart className="w-4 h-4" fill={favorite ? "currentColor" : "none"} strokeWidth={favorite ? 0 : 2} />
                </button>
              </div>
            </div>

            {/* Section 3 — 2-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
              {/* Left — Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="font-semibold text-gray-900 mb-2">ข้อมูลแพ็กเกจ</p>
                <div>
                  {rows.map((r, i) => (
                    <InfoRow key={i} row={r} accent={accent} />
                  ))}
                </div>
              </div>

              {/* Right — Privileges + T&C */}
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <button
                    onClick={() => setPrivilegeOpen((o) => !o)}
                    className="w-full flex items-center justify-between"
                  >
                    <p className="font-semibold text-gray-900">สิทธิพิเศษ</p>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${privilegeOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {privilegeOpen && (
                    <ul className="mt-4 space-y-3">
                      {[
                        { label: "ความบันเทิง", desc: "ดูคอนเทนต์ฟรีจากพาร์ทเนอร์ที่เลือก" },
                        { label: "เน็ตเสริมยามฉุกเฉิน", desc: "เพิ่มเน็ต 1 GB เมื่อใช้ครบโควต้า" },
                        { label: "สะสมแต้ม", desc: "รับแต้มสะสมพิเศษทุกการใช้บริการ" },
                      ].map((p) => (
                        <li key={p.label} className="flex items-start gap-3">
                          <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${accent}12`, color: accent }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">{p.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <p className="font-semibold text-gray-900 mb-3">ข้อกำหนดและเงื่อนไขแพ็กเกจ</p>
                  <div className="max-h-56 overflow-y-auto pr-2 text-sm text-gray-600 leading-relaxed space-y-2">
                    <p>1. รายการส่งเสริมการขายนี้สำหรับลูกค้าใหม่และลูกค้าปัจจุบันที่ทำการสมัครภายในระยะเวลาที่กำหนด เท่านั้น</p>
                    <p>2. ผู้ใช้บริการที่ใช้ปริมาณข้อมูลครบตามที่กำหนดในแพ็กเกจ จะถูกปรับลดความเร็วลงเหลือ 384 Kbps จนกว่าจะถึงรอบบิลถัดไป</p>
                    <p>3. ค่าบริการรายเดือนจะถูกคิดล่วงหน้า ผู้ให้บริการขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไข โดยจะแจ้งให้ทราบล่วงหน้าตามที่กฎหมายกำหนด</p>
                    <p>4. การโอนสิทธิ์การใช้งานต้องดำเนินการ ณ ศูนย์บริการของผู้ให้บริการเท่านั้น</p>
                    <p>5. รายการนี้ไม่สามารถใช้ร่วมกับโปรโมชั่นอื่นได้</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    หมายเหตุ: เงื่อนไขเป็นไปตามที่ผู้ให้บริการกำหนด ราคายังไม่รวมภาษีมูลค่าเพิ่ม
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 — Related Carousel */}
            <div className="mt-10">
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">โปรโมชั่นล่าสุด</h3>
                <span className="text-xs text-gray-400">จาก {pkg.provider} และผู้ให้บริการอื่น</span>
              </div>
              <RelatedCarousel items={related} accent={accent} />
            </div>

            {/* Section 5 — Compare CTA */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => navigate(`/compare?ids=${pkg.id}`)}
                className="inline-flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 nbtc-primary-btn"
              >
                เปรียบเทียบแพ็กเกจ
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : null}
      </div>

      <Footer />
      <AiChat />
    </div>
  );
}

export default PackageDetailPage;
