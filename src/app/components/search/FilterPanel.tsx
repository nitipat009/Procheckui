import { useState } from "react";
import { Film, Trophy, Gamepad2, ShoppingBag, UtensilsCrossed, Tv, ShieldCheck, Phone, Wifi, Zap } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
export interface FilterValues {
  provider: string;
  serviceType: string;
  minPrice: number;
  maxPrice: number;
  privileges: string[];
  // mobile advanced
  minData: number;
  minSpeed: number;
  minCalls: number;
  // internet advanced
  minDownload: number;
  minUpload: number;
  maxContract: number;
}

export const defaultFilterValues: FilterValues = {
  provider: "", serviceType: "",
  minPrice: 0, maxPrice: 2000,
  privileges: [],
  minData: 0, minSpeed: 0, minCalls: 0,
  minDownload: 0, minUpload: 0, maxContract: 24,
};

// ── Provider + privilege options ─────────────────────────────────────────────
const mobileProviders = ["AIS", "True", "DTAC", "NT", "FIN"];
const mobileServiceTypes = ["5G", "4G", "3G"];
const internetProviders = ["AIS Fiber", "True Online", "3BB", "NT", "CAT"];
const internetServiceTypes = ["ไฟเบอร์", "ADSL"];

const mobilePrivileges = [
  { Icon: Film,            label: "บันเทิง",  color: "#7C3AED", bg: "#EDE9FB" },
  { Icon: Trophy,          label: "กีฬา",     color: "#0B5ED7", bg: "#EBF2FF" },
  { Icon: Gamepad2,        label: "เกม",      color: "#E30613", bg: "#FDEAEB" },
  { Icon: ShoppingBag,     label: "ช้อปปิ้ง", color: "#F59E0B", bg: "#FEF7E5" },
  { Icon: UtensilsCrossed, label: "อาหาร",    color: "#10B981", bg: "#D1FAE5" },
];

const internetPrivileges = [
  { Icon: Tv,          label: "ดูทีวี",       color: "#7C3AED", bg: "#EDE9FB" },
  { Icon: ShieldCheck, label: "ความปลอดภัย",  color: "#0EA5E9", bg: "#E0F2FE" },
  { Icon: Gamepad2,    label: "เกม",          color: "#E30613", bg: "#FDEAEB" },
  { Icon: Phone,       label: "โทรฟรี",       color: "#F59E0B", bg: "#FEF7E5" },
  { Icon: Wifi,        label: "ความเร็วสูง",  color: "#10B981", bg: "#D1FAE5" },
];

// ── Slider ───────────────────────────────────────────────────────────────────
function Slider({ label, min, max, value, unit, onChange, accentColor = "#0B5ED7" }: {
  label: string; min: number; max: number; value: number; unit: string;
  onChange: (v: number) => void; accentColor?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500">{label}</label>
        <span className="text-xs font-medium text-gray-900">{value >= max ? `${max}+` : value} <span className="text-gray-400">{unit}</span></span>
      </div>
      <div className="relative py-2">
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: accentColor }} />
        </div>
        <input type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer" />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-sm pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)`, borderColor: accentColor }} />
      </div>
    </div>
  );
}

// ── Dual Price Slider ────────────────────────────────────────────────────────
function PriceSlider({ min: minVal, max: maxVal, onChange, accentColor = "#0B5ED7" }: {
  min: number; max: number; onChange: (min: number, max: number) => void; accentColor?: string;
}) {
  const MIN = 0; const MAX = 2000; const STEP = 100;
  const minPct = ((minVal - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((maxVal - MIN) / (MAX - MIN)) * 100;

  const thumbCls =
    "absolute w-full appearance-none bg-transparent pointer-events-none " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none " +
    "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full " +
    "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 " +
    "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none " +
    "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500">ช่วงราคา</label>
        <span className="text-xs font-semibold" style={{ color: accentColor }}>
          ฿{minVal.toLocaleString()} – ฿{maxVal >= MAX ? "2,000+" : maxVal.toLocaleString()}
          <span className="text-[10px] text-gray-400 font-normal ml-1">บาท/เดือน</span>
        </span>
      </div>
      <div className="relative h-8 flex items-center px-2.5">
        <div className="absolute inset-x-2.5 h-1.5 bg-gray-100 rounded-full" />
        <div className="absolute h-1.5 rounded-full"
          style={{ left: `calc(${minPct}% * (100% - 20px) / 100% + 10px)`, right: `calc((100% - ${maxPct}%) * (100% - 20px) / 100% + 10px)`, background: accentColor }} />
        <input type="range" min={MIN} max={MAX} step={STEP} value={minVal}
          onChange={(e) => onChange(Math.min(Number(e.target.value), maxVal - STEP), maxVal)}
          className={thumbCls}
          style={{ "--tw-border-color": accentColor } as React.CSSProperties} />
        <input type="range" min={MIN} max={MAX} step={STEP} value={maxVal}
          onChange={(e) => onChange(minVal, Math.max(Number(e.target.value), minVal + STEP))}
          className={thumbCls} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
        <span>฿0</span><span>฿2,000+</span>
      </div>
    </div>
  );
}

// ── FilterPanel ──────────────────────────────────────────────────────────────
interface Props {
  type: "mobile" | "internet";
  initialValues: FilterValues;
  onApply: (values: FilterValues) => void;
}

export function FilterPanel({ type, initialValues, onApply }: Props) {
  const [v, setV] = useState<FilterValues>(initialValues);

  const isMobile = type === "mobile";
  const accentColor = isMobile ? "#0B5ED7" : "#0EA5E9";
  const providers = isMobile ? mobileProviders : internetProviders;
  const serviceTypes = isMobile ? mobileServiceTypes : internetServiceTypes;
  const privileges = isMobile ? mobilePrivileges : internetPrivileges;

  const togglePrivilege = (label: string) => {
    setV((prev) => {
      const s = prev.privileges.includes(label)
        ? prev.privileges.filter((p) => p !== label)
        : [...prev.privileges, label];
      return { ...prev, privileges: s };
    });
  };

  const reset = () => setV({ ...defaultFilterValues });

  return (
    <div className="flex flex-col gap-5">
      {/* Provider */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-500">ผู้ให้บริการ</label>
        <div className="relative">
          <select
            value={v.provider}
            onChange={(e) => setV({ ...v, provider: e.target.value })}
            className="w-full appearance-none px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-current transition-colors cursor-pointer pr-8"
            style={{ ["--tw-border-opacity" as string]: "1" }}
          >
            <option value="">ทั้งหมด</option>
            {providers.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Service type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-500">{isMobile ? "ประเภทบริการ" : "ประเภทการเชื่อมต่อ"}</label>
        <div className="relative">
          <select
            value={v.serviceType}
            onChange={(e) => setV({ ...v, serviceType: e.target.value })}
            className="w-full appearance-none px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none transition-colors cursor-pointer pr-8"
          >
            <option value="">ทั้งหมด</option>
            {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Price range */}
      <PriceSlider min={v.minPrice} max={v.maxPrice}
        onChange={(mn, mx) => setV({ ...v, minPrice: mn, maxPrice: mx })}
        accentColor={accentColor} />

      {/* Privileges chips */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">{isMobile ? "สิทธิพิเศษ" : "ฟีเจอร์"}</label>
        <div className="flex flex-wrap gap-2">
          {privileges.map(({ Icon, label, color, bg }) => {
            const active = v.privileges.includes(label);
            return (
              <button key={label} onClick={() => togglePrivilege(label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${active ? "" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                style={active ? { borderColor: color, backgroundColor: bg, color } : undefined}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-200" />

      {/* Advanced filters — always expanded */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">ค้นหาขั้นสูง</p>
        {isMobile ? (
          <>
            <Slider label="ปริมาณเน็ต (GB)" min={0} max={200} value={v.minData}
              unit="GB+" onChange={(val) => setV({ ...v, minData: val })} accentColor={accentColor} />
            <Slider label="ความเร็วขั้นต่ำ (Mbps)" min={0} max={1000} value={v.minSpeed}
              unit="Mbps+" onChange={(val) => setV({ ...v, minSpeed: val })} accentColor={accentColor} />
            <Slider label="โทร (นาที)" min={0} max={1000} value={v.minCalls}
              unit="นาที+" onChange={(val) => setV({ ...v, minCalls: val })} accentColor={accentColor} />
          </>
        ) : (
          <>
            <Slider label="ความเร็ว Download (Mbps)" min={0} max={2000} value={v.minDownload}
              unit="Mbps+" onChange={(val) => setV({ ...v, minDownload: val })} accentColor={accentColor} />
            <Slider label="ความเร็ว Upload (Mbps)" min={0} max={1000} value={v.minUpload}
              unit="Mbps+" onChange={(val) => setV({ ...v, minUpload: val })} accentColor={accentColor} />
            <Slider label="สัญญาไม่เกิน (เดือน)" min={0} max={24} value={v.maxContract}
              unit="เดือน" onChange={(val) => setV({ ...v, maxContract: val })} accentColor={accentColor} />
          </>
        )}
      </div>

      {/* CTA */}
      <div className="flex gap-2 pt-1">
        <button onClick={reset}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          ล้างค่า
        </button>
        <button onClick={() => onApply(v)}
          className="flex-[2] py-2.5 rounded-xl text-sm text-white font-medium transition-colors"
          style={{ background: accentColor }}>
          ใช้ filter
        </button>
      </div>
    </div>
  );
}
