import { useState } from "react";
import { useNavigate } from "react-router";
import { Wifi, Phone, Zap, Heart, ArrowUpRight, Film, Trophy, Gamepad2, ShoppingBag, UtensilsCrossed } from "lucide-react";

type CategoryKey = "บันเทิง" | "กีฬา" | "เกม" | "ช้อปปิ้ง" | "อาหาร";

const categoryMeta: Record<CategoryKey, { Icon: React.ElementType; color: string; bg: string }> = {
  บันเทิง:  { Icon: Film,           color: "#7C3AED", bg: "#EDE9FB" },
  กีฬา:    { Icon: Trophy,          color: "#0B5ED7", bg: "#EBF2FF" },
  เกม:     { Icon: Gamepad2,        color: "#E30613", bg: "#FDEAEB" },
  ช้อปปิ้ง: { Icon: ShoppingBag,    color: "#F59E0B", bg: "#FEF7E5" },
  อาหาร:   { Icon: UtensilsCrossed, color: "#10B981", bg: "#D1FAE5" },
};

type Package = {
  id: number;
  provider: string;
  providerColor: string;
  providerBg: string;
  name: string;
  price: number;
  data: string;
  speed: string;
  calls: string;
  category: CategoryKey;
};

const packages: Package[] = [
  {
    id: 1,
    provider: "AIS",
    providerColor: "#009B3A",
    providerBg: "#E6F5EC",
    name: "Happy Max 5G",
    price: 599,
    data: "ไม่อั้น",
    speed: "1 Gbps",
    calls: "ไม่อั้น",
    category: "บันเทิง",
  },
  {
    id: 2,
    provider: "True",
    providerColor: "#E30613",
    providerBg: "#FDEAEB",
    name: "True 5G Turbo",
    price: 499,
    data: "100 GB",
    speed: "1 Gbps",
    calls: "500 นาที",
    category: "กีฬา",
  },
  {
    id: 3,
    provider: "DTAC",
    providerColor: "#005BAA",
    providerBg: "#E5EDF8",
    name: "DTAC Go No Limit",
    price: 399,
    data: "ไม่อั้น",
    speed: "100 Mbps",
    calls: "300 นาที",
    category: "บันเทิง",
  },
  {
    id: 4,
    provider: "AIS",
    providerColor: "#009B3A",
    providerBg: "#E6F5EC",
    name: "Happy Together 4G",
    price: 299,
    data: "60 GB",
    speed: "100 Mbps",
    calls: "200 นาที",
    category: "บันเทิง",
  },
  {
    id: 5,
    provider: "True",
    providerColor: "#E30613",
    providerBg: "#FDEAEB",
    name: "True Move 4G Plus",
    price: 249,
    data: "40 GB",
    speed: "100 Mbps",
    calls: "100 นาที",
    category: "บันเทิง",
  },
  {
    id: 6,
    provider: "DTAC",
    providerColor: "#005BAA",
    providerBg: "#E5EDF8",
    name: "DTAC Smart 30",
    price: 199,
    data: "30 GB",
    speed: "50 Mbps",
    calls: "ไม่อั้น",
    category: "เกม",
  },
  {
    id: 7,
    provider: "NT",
    providerColor: "#1A56A0",
    providerBg: "#E5EDF8",
    name: "NT Mobile Pro",
    price: 149,
    data: "20 GB",
    speed: "50 Mbps",
    calls: "60 นาที",
    category: "ช้อปปิ้ง",
  },
  {
    id: 8,
    provider: "FIN",
    providerColor: "#F59E0B",
    providerBg: "#FEF7E5",
    name: "FIN Starter Pack",
    price: 99,
    data: "10 GB",
    speed: "30 Mbps",
    calls: "30 นาที",
    category: "อาหาร",
  },
];

function ProviderDot({ color, bg, name }: { color: string; bg: string; name: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg"
      style={{ background: bg, color }}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      {name}
    </span>
  );
}

function CategoryChip({ category }: { category: CategoryKey }) {
  const { Icon, color, bg } = categoryMeta[category];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
      style={{ background: bg, color }}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.75} />
      {category}
    </span>
  );
}

function PackageCard({
  pkg,
  isFavorite,
  onToggleFavorite,
}: {
  pkg: Package;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/package-detail?id=${pkg.id}`)} className="relative nbtc-panel rounded-2xl p-5 hover:border-[rgba(246,243,228,0.28)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.45)] transition-all cursor-pointer group flex flex-col gap-3">
      {/* Favorite toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isFavorite
            ? "bg-rose-50 text-rose-500"
            : "bg-gray-50 text-gray-300 hover:bg-rose-50 hover:text-rose-400"
        }`}
        aria-label="บันทึกรายการโปรด"
      >
        <Heart
          className="w-4 h-4 transition-all"
          fill={isFavorite ? "currentColor" : "none"}
          strokeWidth={isFavorite ? 0 : 2}
        />
      </button>

      {/* Provider */}
      <div className="flex items-start gap-3 pr-10">
        <ProviderDot color={pkg.providerColor} bg={pkg.providerBg} name={pkg.provider} />
      </div>

      {/* Name + Price */}
      <div>
        <p className="font-semibold leading-tight" style={{ color: "var(--clr-light)" }}>{pkg.name}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold" style={{ color: "var(--clr-light)" }}>{pkg.price.toLocaleString()}</span>
          <span className="text-xs" style={{ color: "rgba(246,243,228,0.45)" }}>บาท/เดือน</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-center min-h-[68px]" style={{ background: "rgba(246,243,228,0.06)" }}>
          <Wifi className="w-3.5 h-3.5" style={{ color: "var(--clr-light)" }} strokeWidth={2} />
          <span className="text-xs font-semibold leading-tight break-words w-full" style={{ color: "var(--clr-light)" }}>{pkg.data}</span>
          <span className="text-[10px]" style={{ color: "rgba(246,243,228,0.45)" }}>ข้อมูล</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-center min-h-[68px]" style={{ background: "rgba(246,243,228,0.06)" }}>
          <Zap className="w-3.5 h-3.5" style={{ color: "var(--clr-light)" }} strokeWidth={2} />
          <span className="text-xs font-semibold leading-tight break-words w-full" style={{ color: "var(--clr-light)" }}>{pkg.speed}</span>
          <span className="text-[10px]" style={{ color: "rgba(246,243,228,0.45)" }}>ความเร็ว</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-center min-h-[68px]" style={{ background: "rgba(246,243,228,0.06)" }}>
          <Phone className="w-3.5 h-3.5" style={{ color: "var(--clr-light)" }} strokeWidth={2} />
          <span className="text-xs font-semibold leading-tight break-words w-full" style={{ color: "var(--clr-light)" }}>{pkg.calls}</span>
          <span className="text-[10px]" style={{ color: "rgba(246,243,228,0.45)" }}>โทร</span>
        </div>
      </div>

      {/* Category chip */}
      <div>
        <CategoryChip category={pkg.category} />
      </div>

      {/* CTA */}
      <button className="mt-auto w-full py-2.5 rounded-xl nbtc-primary-btn text-sm font-medium flex items-center justify-center gap-1.5">
        ดูรายละเอียด <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function PopularPackages() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-12 md:py-16" style={{ background: "var(--clr-bg-primary)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header — centered */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--clr-light)" }}>
            แพ็กเกจยอดนิยม
          </h2>
          <p className="mt-2 text-sm" style={{ color: "rgba(246,243,228,0.65)" }}>เปรียบเทียบและเลือกแพ็กเกจที่ใช่สำหรับคุณ</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isFavorite={favorites.has(pkg.id)}
              onToggleFavorite={() => toggleFavorite(pkg.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
