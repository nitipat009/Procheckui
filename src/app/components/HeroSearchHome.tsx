import { useState } from "react";
import { Search, ChevronDown, Plus, Minus, Tv, ShieldCheck, Gamepad2, Phone, Wifi } from "lucide-react";
import { useNavigate } from "react-router";

function Dropdown({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs" style={{ color: "rgba(246,243,228,0.65)" }}>{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="nbtc-input w-full appearance-none px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-colors cursor-pointer pr-8 hover:border-[rgba(246,243,228,0.3)]"
        >
          <option value="" style={{ background: "#1E100F", color: "#F6F3E4" }}>ทั้งหมด</option>
          {options.map((o) => (
            <option key={o} value={o} style={{ background: "#1E100F", color: "#F6F3E4" }}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(246,243,228,0.45)" }} />
      </div>
    </div>
  );
}

function RangeSlider({ label, min, max, unit, defaultValue, onChange }: { label: string; min: number; max: number; unit: string; defaultValue: number; onChange: (v: number) => void }) {
  const [val, setVal] = useState(defaultValue);
  const pct = ((val - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs" style={{ color: "rgba(246,243,228,0.65)" }}>{label}</label>
        <span className="text-sm font-medium" style={{ color: "var(--clr-light)" }}>{val} <span style={{ color: "rgba(246,243,228,0.45)" }}>{unit}</span></span>
      </div>
      <div className="relative py-2">
        <div className="h-1.5 rounded-full" style={{ background: "rgba(246,243,228,0.14)" }}>
          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: "var(--clr-light)" }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={val}
          onChange={(e) => {
            const next = Number(e.target.value);
            setVal(next);
            onChange(next);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-sm pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)`, background: "var(--clr-bg-primary)", border: "2px solid var(--clr-light)" }}
        />
      </div>
    </div>
  );
}

function PriceRangeSlider({ minVal, maxVal, onMinChange, onMaxChange }: { minVal: number; maxVal: number; onMinChange: (v: number) => void; onMaxChange: (v: number) => void }) {
  const MIN = 0;
  const MAX = 2000;
  const STEP = 100;

  const minPct = ((minVal - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((maxVal - MIN) / (MAX - MIN)) * 100;

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), maxVal - STEP);
    onMinChange(v);
  };
  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), minVal + STEP);
    onMaxChange(v);
  };

  const thumbCls =
    "absolute w-full appearance-none bg-transparent pointer-events-none " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none " +
    "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full " +
    "[&::-webkit-slider-thumb]:bg-[#1E100F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F6F3E4] " +
    "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform " +
    "[&::-webkit-slider-thumb]:hover:scale-110 " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none " +
    "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:bg-[#1E100F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#F6F3E4] " +
    "[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs" style={{ color: "rgba(246,243,228,0.65)" }}>ช่วงราคา</label>
        <span className="text-sm font-semibold" style={{ color: "var(--clr-light)" }}>
          ฿{minVal.toLocaleString()}
          <span style={{ color: "rgba(246,243,228,0.45)" }} className="font-normal mx-1">–</span>
          ฿{maxVal === MAX ? "2,000+" : maxVal.toLocaleString()}
          <span className="text-[10px] font-normal ml-1" style={{ color: "rgba(246,243,228,0.45)" }}>บาท/เดือน</span>
        </span>
      </div>

      <div className="relative h-8 flex items-center px-2.5">
        <div className="absolute inset-x-2.5 h-1.5 rounded-full" style={{ background: "rgba(246,243,228,0.14)" }} />
        <div
          className="absolute h-1.5 rounded-full"
          style={{
            background: "var(--clr-light)",
            left: `calc(${minPct}% * (100% - 20px) / 100% + 10px)`,
            right: `calc((100% - ${maxPct}%) * (100% - 20px) / 100% + 10px)`,
          }}
        />
        <input type="range" min={MIN} max={MAX} step={STEP} value={minVal} onChange={handleMin} className={thumbCls} style={{ zIndex: minVal === maxVal ? 5 : undefined }} />
        <input type="range" min={MIN} max={MAX} step={STEP} value={maxVal} onChange={handleMax} className={thumbCls} />
      </div>

      <div className="flex justify-between text-[10px] px-0.5" style={{ color: "rgba(246,243,228,0.45)" }}>
        <span>฿0</span>
        <span>฿2,000+</span>
      </div>
    </div>
  );
}

const privileges = [
  { Icon: Tv, label: "ดูทีวี" },
  { Icon: ShieldCheck, label: "ความปลอดภัย" },
  { Icon: Gamepad2, label: "เกม" },
  { Icon: Phone, label: "โทรฟรี" },
  { Icon: Wifi, label: "ความเร็วสูง" },
];

export function HeroSearchHome() {
  const navigate = useNavigate();
  const [advanced, setAdvanced] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [provider, setProvider] = useState("");
  const [connType, setConnType] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minDownload, setMinDownload] = useState(0);
  const [minUpload, setMinUpload] = useState(0);
  const [maxContract, setMaxContract] = useState(24);

  const togglePrivilege = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      type: "internet",
      ...(provider && { provider }),
      ...(connType && { serviceType: connType }),
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      ...(selected.size > 0 && { privileges: [...selected].join(",") }),
      ...(minDownload > 0 && { minDownload: String(minDownload) }),
      ...(minUpload > 0 && { minUpload: String(minUpload) }),
      maxContract: String(maxContract),
    });
    navigate(`/search-result?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 md:pt-10 md:pb-14" style={{ background: "var(--clr-bg-primary)" }}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" style={{ background: "var(--clr-light)" }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 translate-y-1/2 -translate-x-1/4 pointer-events-none" style={{ background: "var(--clr-light)" }} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: "var(--clr-light)" }} />

      <div className="relative max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-5 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight drop-shadow-sm" style={{ color: "var(--clr-light)" }}>
            ค้นหาโปรโมชั่นอินเทอร์เน็ตบ้าน
          </h1>
          <p className="mt-2 text-xs md:text-sm" style={{ color: "rgba(246,243,228,0.65)" }}>
            เปรียบเทียบแพ็กเกจอินเทอร์เน็ตบ้านจากผู้ให้บริการชั้นนำในที่เดียว
          </p>
        </div>

        <div className="nbtc-panel rounded-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:items-start">
            <div className="grid grid-cols-2 gap-3">
              <Dropdown label="ประเภทการเชื่อมต่อ" value={connType} onChange={setConnType} options={["ไฟเบอร์", "ADSL"]} />
              <Dropdown label="ผู้ให้บริการ" value={provider} onChange={setProvider} options={["AIS Fiber", "True Online", "3BB", "NT", "CAT"]} />
            </div>
            <div className="md:border-l md:pl-6 nbtc-divider">
              <PriceRangeSlider minVal={minPrice} maxVal={maxPrice} onMinChange={setMinPrice} onMaxChange={setMaxPrice} />
            </div>
          </div>

          <div className="mt-5 md:mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs" style={{ color: "rgba(246,243,228,0.65)" }}>ฟีเจอร์ที่คุณสนใจ</h3>
              <button
                type="button"
                onClick={() => setAdvanced((v) => !v)}
                className="text-xs font-medium inline-flex items-center gap-1 transition-colors hover:text-[#F6F3E4]"
                style={{ color: "rgba(246,243,228,0.78)" }}
              >
                ค้นหาขั้นสูง {advanced ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {privileges.map(({ Icon, label }) => {
                const isActive = selected.has(label);
                return (
                  <button
                    key={label}
                    onClick={() => togglePrivilege(label)}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border transition-all"
                    style={
                      isActive
                        ? { background: "var(--clr-accent)", borderColor: "rgba(246,243,228,0.25)", color: "var(--clr-light)" }
                        : { borderColor: "rgba(246,243,228,0.15)", background: "rgba(246,243,228,0.04)", color: "rgba(246,243,228,0.68)" }
                    }
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5 p-4 md:p-5 rounded-xl border nbtc-divider transition-all ${advanced ? "block" : "hidden"}`} style={{ background: "rgba(246,243,228,0.03)" }}>
            <RangeSlider label="Download ขั้นต่ำ (Mbps)" min={0} max={2000} unit="Mbps" defaultValue={0} onChange={setMinDownload} />
            <RangeSlider label="Upload ขั้นต่ำ (Mbps)" min={0} max={1000} unit="Mbps" defaultValue={0} onChange={setMinUpload} />
            <RangeSlider label="สัญญาไม่เกิน (เดือน)" min={0} max={24} unit="เดือน" defaultValue={24} onChange={setMaxContract} />
          </div>

          <button
            onClick={handleSearch}
            className="mt-5 md:mt-6 w-full nbtc-primary-btn py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)]"
          >
            <Search className="w-4 h-4" />
            ค้นหา
          </button>
        </div>
      </div>
    </section>
  );
}
