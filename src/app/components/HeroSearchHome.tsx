import { useState } from "react";
import { Search, ChevronDown, Plus, Minus, Tv, ShieldCheck, Gamepad2, Phone, Wifi } from "lucide-react";
import { useNavigate } from "react-router";

function Dropdown({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-[#0EA5E9] text-sm text-gray-700 focus:outline-none transition-colors cursor-pointer pr-8"
        >
          <option value="">ทั้งหมด</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function RangeSlider({ label, min, max, unit, defaultValue, onChange, accentColor }: { label: string; min: number; max: number; unit: string; defaultValue: number; onChange: (v: number) => void; accentColor: string }) {
  const [val, setVal] = useState(defaultValue);
  const pct = ((val - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500">{label}</label>
        <span className="text-sm font-medium text-gray-900">{val} <span className="text-gray-400">{unit}</span></span>
      </div>
      <div className="relative py-2">
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div className="h-1.5 bg-[#0EA5E9] rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#0EA5E9] shadow-sm pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
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
    "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0EA5E9] " +
    "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform " +
    "[&::-webkit-slider-thumb]:hover:scale-110 " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none " +
    "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0EA5E9] " +
    "[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500">ช่วงราคา</label>
        <span className="text-sm font-semibold text-[#0EA5E9]">
          ฿{minVal.toLocaleString()}
          <span className="text-gray-400 font-normal mx-1">–</span>
          ฿{maxVal === MAX ? "2,000+" : maxVal.toLocaleString()}
          <span className="text-[10px] text-gray-400 font-normal ml-1">บาท/เดือน</span>
        </span>
      </div>

      <div className="relative h-8 flex items-center px-2.5">
        <div className="absolute inset-x-2.5 h-1.5 bg-gray-100 rounded-full" />
        <div
          className="absolute h-1.5 bg-[#0EA5E9] rounded-full"
          style={{ left: `calc(${minPct}% * (100% - 20px) / 100% + 10px)`, right: `calc((100% - ${maxPct}%) * (100% - 20px) / 100% + 10px)` }}
        />
        <input type="range" min={MIN} max={MAX} step={STEP} value={minVal} onChange={handleMin} className={thumbCls} style={{ zIndex: minVal === maxVal ? 5 : undefined }} />
        <input type="range" min={MIN} max={MAX} step={STEP} value={maxVal} onChange={handleMax} className={thumbCls} />
      </div>

      <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
        <span>฿0</span>
        <span>฿2,000+</span>
      </div>
    </div>
  );
}

const privileges = [
  { Icon: Tv,          label: "ดูทีวี",       color: "#7C3AED", bg: "#EDE9FB" },
  { Icon: ShieldCheck, label: "ความปลอดภัย",  color: "#0EA5E9", bg: "#E0F2FE" },
  { Icon: Gamepad2,    label: "เกม",          color: "#E30613", bg: "#FDEAEB" },
  { Icon: Phone,       label: "โทรฟรี",       color: "#F59E0B", bg: "#FEF7E5" },
  { Icon: Wifi,        label: "ความเร็วสูง",  color: "#10B981", bg: "#D1FAE5" },
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
    <section className="relative overflow-hidden pt-8 pb-12 md:pt-10 md:pb-14"
      style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 55%, #075985 100%)" }}
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 bg-white -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 bg-white translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-5 bg-white -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-5 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight drop-shadow-sm">
            ค้นหาโปรโมชั่นอินเทอร์เน็ตบ้าน
          </h1>
          <p className="text-white/70 mt-2 text-xs md:text-sm">
            เปรียบเทียบแพ็กเกจอินเทอร์เน็ตบ้านจากผู้ให้บริการชั้นนำในที่เดียว
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35)] border border-white/10 p-4 md:p-8">

          {/* Main filter row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:items-start">
            <div className="grid grid-cols-2 gap-3">
              <Dropdown label="ประเภทการเชื่อมต่อ" value={connType} onChange={setConnType} options={["ไฟเบอร์", "ADSL"]} />
              <Dropdown label="ผู้ให้บริการ" value={provider} onChange={setProvider} options={["AIS Fiber", "True Online", "3BB", "NT", "CAT"]} />
            </div>
            <div className="md:border-l md:border-gray-100 md:pl-6">
              <PriceRangeSlider minVal={minPrice} maxVal={maxPrice} onMinChange={setMinPrice} onMaxChange={setMaxPrice} />
            </div>
          </div>

          {/* Privileges + Advanced toggle merged */}
          <div className="mt-5 md:mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs text-gray-500">ฟีเจอร์ที่คุณสนใจ</h3>
              <button
                type="button"
                onClick={() => setAdvanced((v) => !v)}
                className="text-xs text-[#0EA5E9] hover:text-[#0284C7] font-medium inline-flex items-center gap-1 transition-colors"
              >
                ค้นหาขั้นสูง {advanced ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {privileges.map(({ Icon, label, color, bg }) => {
                const isActive = selected.has(label);
                return (
                  <button
                    key={label}
                    onClick={() => togglePrivilege(label)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border transition-all ${
                      isActive ? "" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                    style={isActive ? { borderColor: color, backgroundColor: bg, color } : undefined}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced search panel */}
          <div className={`mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5 p-4 md:p-5 bg-[#F9FAFC] rounded-xl border border-gray-100 transition-all ${advanced ? "block" : "hidden"}`}>
            <RangeSlider label="Download ขั้นต่ำ (Mbps)" min={0} max={2000} unit="Mbps" defaultValue={0} onChange={setMinDownload} accentColor="#0EA5E9" />
            <RangeSlider label="Upload ขั้นต่ำ (Mbps)" min={0} max={1000} unit="Mbps" defaultValue={0} onChange={setMinUpload} accentColor="#0EA5E9" />
            <RangeSlider label="สัญญาไม่เกิน (เดือน)" min={0} max={24} unit="เดือน" defaultValue={24} onChange={setMaxContract} accentColor="#0EA5E9" />
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="mt-5 md:mt-6 w-full text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-[0_6px_20px_-8px_rgba(14,165,233,0.6)]"
            style={{ background: "linear-gradient(90deg,#0EA5E9,#0284C7)" }}
          >
            <Search className="w-4 h-4" />
            ค้นหา
          </button>
        </div>
      </div>
    </section>
  );
}