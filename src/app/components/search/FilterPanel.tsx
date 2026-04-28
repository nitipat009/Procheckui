import { useState } from "react";
import { Film, Trophy, Gamepad2, ShoppingBag, UtensilsCrossed, Tv, ShieldCheck, Phone, Wifi, Zap } from "lucide-react";

export interface FilterValues {
  provider: string;
  serviceType: string;
  minPrice: number;
  maxPrice: number;
  privileges: string[];
  minData: number;
  minSpeed: number;
  minCalls: number;
  minDownload: number;
  minUpload: number;
  maxContract: number;
}

export const defaultFilterValues: FilterValues = {
  provider: "",
  serviceType: "",
  minPrice: 0,
  maxPrice: 2000,
  privileges: [],
  minData: 0,
  minSpeed: 0,
  minCalls: 0,
  minDownload: 0,
  minUpload: 0,
  maxContract: 24,
};

const mobileProviders = ["AIS", "True", "DTAC", "NT", "FIN"];
const mobileServiceTypes = ["5G", "4G", "3G"];
const internetProviders = ["AIS Fiber", "True Online", "3BB", "NT", "CAT"];
const internetServiceTypes = ["ไฟเบอร์", "ADSL"];

const mobilePrivileges = [
  { Icon: Film, label: "บันเทิง" },
  { Icon: Trophy, label: "กีฬา" },
  { Icon: Gamepad2, label: "เกม" },
  { Icon: ShoppingBag, label: "ช้อปปิ้ง" },
  { Icon: UtensilsCrossed, label: "อาหาร" },
];

const internetPrivileges = [
  { Icon: Tv, label: "ดูทีวี" },
  { Icon: ShieldCheck, label: "ความปลอดภัย" },
  { Icon: Gamepad2, label: "เกม" },
  { Icon: Phone, label: "โทรฟรี" },
  { Icon: Wifi, label: "ความเร็วสูง" },
];

function Slider({ label, min, max, value, unit, onChange }: {
  label: string;
  min: number;
  max: number;
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs" style={{ color: "rgba(246,243,228,0.65)" }}>{label}</label>
        <span className="text-xs font-medium" style={{ color: "var(--clr-light)" }}>
          {value >= max ? `${max}+` : value} <span style={{ color: "rgba(246,243,228,0.45)" }}>{unit}</span>
        </span>
      </div>
      <div className="relative py-2">
        <div className="h-1.5 rounded-full" style={{ background: "rgba(246,243,228,0.12)" }}>
          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: "var(--clr-light)" }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-sm pointer-events-none"
          style={{
            left: `calc(${pct}% - 8px)`,
            background: "var(--clr-bg-primary)",
            border: "2px solid var(--clr-light)",
          }}
        />
      </div>
    </div>
  );
}

function PriceSlider({ min: minVal, max: maxVal, onChange }: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const MIN = 0;
  const MAX = 2000;
  const STEP = 100;
  const minPct = ((minVal - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((maxVal - MIN) / (MAX - MIN)) * 100;

  const thumbCls =
    "absolute w-full appearance-none bg-transparent pointer-events-none " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none " +
    "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full " +
    "[&::-webkit-slider-thumb]:bg-[#1E100F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F6F3E4] " +
    "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none " +
    "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:bg-[#1E100F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#F6F3E4] " +
    "[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs" style={{ color: "rgba(246,243,228,0.65)" }}>ช่วงราคา</label>
        <span className="text-xs font-semibold" style={{ color: "var(--clr-light)" }}>
          ฿{minVal.toLocaleString()} – ฿{maxVal >= MAX ? "2,000+" : maxVal.toLocaleString()}
          <span className="text-[10px] font-normal ml-1" style={{ color: "rgba(246,243,228,0.45)" }}>บาท/เดือน</span>
        </span>
      </div>
      <div className="relative h-8 flex items-center px-2.5">
        <div className="absolute inset-x-2.5 h-1.5 rounded-full" style={{ background: "rgba(246,243,228,0.12)" }} />
        <div
          className="absolute h-1.5 rounded-full"
          style={{
            left: `calc(${minPct}% * (100% - 20px) / 100% + 10px)`,
            right: `calc((100% - ${maxPct}%) * (100% - 20px) / 100% + 10px)`,
            background: "var(--clr-light)",
          }}
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={minVal}
          onChange={(e) => onChange(Math.min(Number(e.target.value), maxVal - STEP), maxVal)}
          className={thumbCls}
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={maxVal}
          onChange={(e) => onChange(minVal, Math.max(Number(e.target.value), minVal + STEP))}
          className={thumbCls}
        />
      </div>
      <div className="flex justify-between text-[10px] px-0.5" style={{ color: "rgba(246,243,228,0.45)" }}>
        <span>฿0</span><span>฿2,000+</span>
      </div>
    </div>
  );
}

interface Props {
  type: "mobile" | "internet";
  initialValues: FilterValues;
  onApply: (values: FilterValues) => void;
}

export function FilterPanel({ type, initialValues, onApply }: Props) {
  const [v, setV] = useState<FilterValues>(initialValues);
  const isMobile = type === "mobile";
  const providers = isMobile ? mobileProviders : internetProviders;
  const serviceTypes = isMobile ? mobileServiceTypes : internetServiceTypes;
  const privileges = isMobile ? mobilePrivileges : internetPrivileges;

  const togglePrivilege = (label: string) => {
    setV((prev) => ({
      ...prev,
      privileges: prev.privileges.includes(label)
        ? prev.privileges.filter((p) => p !== label)
        : [...prev.privileges, label],
    }));
  };

  const reset = () => setV({ ...defaultFilterValues });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs" style={{ color: "rgba(246,243,228,0.65)" }}>ผู้ให้บริการ</label>
        <div className="relative">
          <select
            value={v.provider}
            onChange={(e) => setV({ ...v, provider: e.target.value })}
            className="nbtc-input w-full appearance-none px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-colors cursor-pointer pr-8"
          >
            <option value="" style={{ background: "#1E100F", color: "#F6F3E4" }}>ทั้งหมด</option>
            {providers.map((p) => <option key={p} value={p} style={{ background: "#1E100F", color: "#F6F3E4" }}>{p}</option>)}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(246,243,228,0.45)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs" style={{ color: "rgba(246,243,228,0.65)" }}>{isMobile ? "ประเภทบริการ" : "ประเภทการเชื่อมต่อ"}</label>
        <div className="relative">
          <select
            value={v.serviceType}
            onChange={(e) => setV({ ...v, serviceType: e.target.value })}
            className="nbtc-input w-full appearance-none px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-colors cursor-pointer pr-8"
          >
            <option value="" style={{ background: "#1E100F", color: "#F6F3E4" }}>ทั้งหมด</option>
            {serviceTypes.map((s) => <option key={s} value={s} style={{ background: "#1E100F", color: "#F6F3E4" }}>{s}</option>)}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(246,243,228,0.45)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <PriceSlider
        min={v.minPrice}
        max={v.maxPrice}
        onChange={(mn, mx) => setV({ ...v, minPrice: mn, maxPrice: mx })}
      />

      <div className="flex flex-col gap-2">
        <label className="text-xs" style={{ color: "rgba(246,243,228,0.65)" }}>{isMobile ? "สิทธิพิเศษ" : "ฟีเจอร์"}</label>
        <div className="flex flex-wrap gap-2">
          {privileges.map(({ Icon, label }) => {
            const active = v.privileges.includes(label);
            return (
              <button
                key={label}
                onClick={() => togglePrivilege(label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all"
                style={active
                  ? { background: "var(--clr-accent)", borderColor: "rgba(246,243,228,0.25)", color: "var(--clr-light)" }
                  : { borderColor: "rgba(246,243,228,0.15)", background: "rgba(246,243,228,0.03)", color: "rgba(246,243,228,0.68)" }}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} /> {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-dashed nbtc-divider" />

      <div className="flex flex-col gap-4">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(246,243,228,0.45)" }}>ค้นหาขั้นสูง</p>
        {isMobile ? (
          <>
            <Slider label="ปริมาณเน็ต (GB)" min={0} max={200} value={v.minData} unit="GB+" onChange={(val) => setV({ ...v, minData: val })} />
            <Slider label="ความเร็วขั้นต่ำ (Mbps)" min={0} max={1000} value={v.minSpeed} unit="Mbps+" onChange={(val) => setV({ ...v, minSpeed: val })} />
            <Slider label="โทร (นาที)" min={0} max={1000} value={v.minCalls} unit="นาที+" onChange={(val) => setV({ ...v, minCalls: val })} />
          </>
        ) : (
          <>
            <Slider label="ความเร็ว Download (Mbps)" min={0} max={2000} value={v.minDownload} unit="Mbps+" onChange={(val) => setV({ ...v, minDownload: val })} />
            <Slider label="ความเร็ว Upload (Mbps)" min={0} max={1000} value={v.minUpload} unit="Mbps+" onChange={(val) => setV({ ...v, minUpload: val })} />
            <Slider label="สัญญาไม่เกิน (เดือน)" min={0} max={24} value={v.maxContract} unit="เดือน" onChange={(val) => setV({ ...v, maxContract: val })} />
          </>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={reset}
          className="flex-1 py-2.5 rounded-xl border text-sm transition-colors"
          style={{ borderColor: "rgba(246,243,228,0.2)", color: "rgba(246,243,228,0.78)", background: "rgba(246,243,228,0.03)" }}
        >
          ล้างค่า
        </button>
        <button onClick={() => onApply(v)} className="flex-[2] py-2.5 rounded-xl text-sm font-medium nbtc-primary-btn">
          ใช้ filter
        </button>
      </div>
    </div>
  );
}
