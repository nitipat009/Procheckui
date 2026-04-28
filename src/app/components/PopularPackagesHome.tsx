import { useState } from "react";
import { useNavigate } from "react-router";
import { Wifi, Zap, Heart, ArrowUpRight, Tv, ShieldCheck, Gamepad2, Phone } from "lucide-react";

type CategoryKey = "ดูทีวี" | "ความปลอดภัย" | "เกม" | "โทรฟรี" | "ความเร็วสูง";

const categoryMeta: Record<CategoryKey, { Icon: React.ElementType; color: string; bg: string }> = {
  ดูทีวี:        { Icon: Tv,          color: "#7C3AED", bg: "#EDE9FB" },
  ความปลอดภัย:   { Icon: ShieldCheck, color: "#0EA5E9", bg: "#E0F2FE" },
  เกม:           { Icon: Gamepad2,    color: "#E30613", bg: "#FDEAEB" },
  โทรฟรี:        { Icon: Phone,       color: "#F59E0B", bg: "#FEF7E5" },
  ความเร็วสูง:   { Icon: Zap,         color: "#10B981", bg: "#D1FAE5" },
};

type Package = {
  id: number;
  provider: string;
  providerColor: string;
  providerBg: string;
  name: string;
  price: number;
  download: string;
  upload: string;
  contract: string;
  category: CategoryKey;
};

const packages: Package[] = [
  {
    id: 1,
    provider: "AIS Fiber",
    providerColor: "#009B3A",
    providerBg: "#E6F5EC",
    name: "AIS Fiber 1 Gbps",
    price: 599,
    download: "1 Gbps",
    upload: "500 Mbps",
    contract: "ไม่ผูกสัญญา",
    category: "ความเร็วสูง",
  },
  {
    id: 2,
    provider: "True Online",
    providerColor: "#E30613",
    providerBg: "#FDEAEB",
    name: "True Gigatex Fiber",
    price: 699,
    download: "1 Gbps",
    upload: "500 Mbps",
    contract: "12 เดือน",
    category: "ดูทีวี",
  },
  {
    id: 3,
    provider: "3BB",
    providerColor: "#1A56A0",
    providerBg: "#E5EDF8",
    name: "3BB Fiber 500M",
    price: 499,
    download: "500 Mbps",
    upload: "250 Mbps",
    contract: "ไม่ผูกสัญญา",
    category: "เกม",
  },
  {
    id: 4,
    provider: "AIS Fiber",
    providerColor: "#009B3A",
    providerBg: "#E6F5EC",
    name: "AIS Fiber 300 Mbps",
    price: 399,
    download: "300 Mbps",
    upload: "150 Mbps",
    contract: "ไม่ผูกสัญญา",
    category: "ความเร็วสูง",
  },
  {
    id: 5,
    provider: "True Online",
    providerColor: "#E30613",
    providerBg: "#FDEAEB",
    name: "True Online 200M",
    price: 349,
    download: "200 Mbps",
    upload: "100 Mbps",
    contract: "12 เดือน",
    category: "โทรฟรี",
  },
  {
    id: 6,
    provider: "3BB",
    providerColor: "#1A56A0",
    providerBg: "#E5EDF8",
    name: "3BB Home Office",
    price: 299,
    download: "100 Mbps",
    upload: "50 Mbps",
    contract: "ไม่ผูกสัญญา",
    category: "ความปลอดภัย",
  },
  {
    id: 7,
    provider: "NT",
    providerColor: "#1A56A0",
    providerBg: "#E5EDF8",
    name: "NT Fiber 100M",
    price: 199,
    download: "100 Mbps",
    upload: "50 Mbps",
    contract: "ไม่ผูกสัญญา",
    category: "โทรฟรี",
  },
  {
    id: 8,
    provider: "CAT",
    providerColor: "#F59E0B",
    providerBg: "#FEF7E5",
    name: "CAT Smart Home",
    price: 149,
    download: "30 Mbps",
    upload: "15 Mbps",
    contract: "12 เดือน",
    category: "ความปลอดภัย",
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
    <div onClick={() => navigate(`/package-detail?id=${pkg.id}`)} className="relative bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#0EA5E9]/30 hover:shadow-[0_8px_30px_-8px_rgba(14,165,233,0.15)] transition-all cursor-pointer group flex flex-col gap-3">
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
        <p className="font-semibold text-gray-900 leading-tight">{pkg.name}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-[#0EA5E9]">{pkg.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400">บาท/เดือน</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center gap-1 bg-[#F5F7FA] rounded-xl p-2 text-center min-h-[68px]">
          <Wifi className="w-3.5 h-3.5 text-[#0EA5E9]" strokeWidth={2} />
          <span className="text-xs font-semibold text-gray-900 leading-tight break-words w-full">{pkg.download}</span>
          <span className="text-[10px] text-gray-400">ดาวน์โหลด</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 bg-[#F5F7FA] rounded-xl p-2 text-center min-h-[68px]">
          <Zap className="w-3.5 h-3.5 text-[#0EA5E9]" strokeWidth={2} />
          <span className="text-xs font-semibold text-gray-900 leading-tight break-words w-full">{pkg.upload}</span>
          <span className="text-[10px] text-gray-400">อัปโหลด</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 bg-[#F5F7FA] rounded-xl p-2 text-center min-h-[68px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" strokeWidth={2} />
          <span className="text-xs font-semibold text-gray-900 leading-tight break-words w-full text-[10px] leading-tight">{pkg.contract}</span>
          <span className="text-[10px] text-gray-400">สัญญา</span>
        </div>
      </div>

      {/* Category chip */}
      <div>
        <CategoryChip category={pkg.category} />
      </div>

      {/* CTA */}
      <button className="mt-auto w-full py-2.5 rounded-xl border border-[#0EA5E9] text-[#0EA5E9] text-sm font-medium flex items-center justify-center gap-1.5 group-hover:bg-[#0EA5E9] group-hover:text-white transition-all">
        ดูรายละเอียด <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function PopularPackagesHome() {
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
    <section className="py-12 md:py-16 bg-[#F5F7FA]">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">
            แพ็กเกจอินเทอร์เน็ตบ้านยอดนิยม
          </h2>
          <p className="text-gray-500 mt-2 text-sm">เปรียบเทียบและเลือกแพ็กเกจที่ใช่สำหรับคุณ</p>
        </div>

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
