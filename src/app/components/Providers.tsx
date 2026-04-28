import { useRef } from "react";

const providers = [
  {
    name: "AIS",
    color: "#009B3A",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#009B3A" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">AIS</text>
      </svg>
    ),
  },
  {
    name: "True Move H",
    color: "#E30613",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#E30613" />
        <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">TRUE</text>
        <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontFamily="sans-serif">Move H</text>
      </svg>
    ),
  },
  {
    name: "DTAC",
    color: "#005BAA",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#005BAA" />
        <polygon points="30,14 43,36 17,36" fill="white" opacity="0.9" />
        <text x="50%" y="76%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">dtac</text>
      </svg>
    ),
  },
  {
    name: "NT",
    color: "#1A56A0",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#1A56A0" />
        <rect x="16" y="20" width="6" height="20" fill="white" rx="1" />
        <line x1="22" y1="20" x2="38" y2="40" stroke="white" strokeWidth="5" strokeLinecap="round" />
        <rect x="38" y="20" width="6" height="20" fill="white" rx="1" />
      </svg>
    ),
  },
  {
    name: "MY by CAT",
    color: "#7C3AED",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#7C3AED" />
        <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">MY</text>
        <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif">by CAT</text>
      </svg>
    ),
  },
  {
    name: "FIN Mobile",
    color: "#F59E0B",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#F59E0B" />
        <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">FIN</text>
        <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif">Mobile</text>
      </svg>
    ),
  },
  {
    name: "Penguin",
    color: "#0EA5E9",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#0EA5E9" />
        <ellipse cx="30" cy="27" rx="10" ry="12" fill="white" />
        <ellipse cx="30" cy="29" rx="6" ry="8" fill="#1E3A5F" />
        <ellipse cx="30" cy="37" rx="4" ry="3" fill="white" />
        <circle cx="26.5" cy="25" r="2" fill="white" />
        <circle cx="33.5" cy="25" r="2" fill="white" />
      </svg>
    ),
  },
  {
    name: "MVNO",
    color: "#10B981",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#10B981" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">MVNO</text>
      </svg>
    ),
  },
  {
    name: "i-kool",
    color: "#EF4444",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#EF4444" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">i-kool</text>
      </svg>
    ),
  },
  {
    name: "TOT",
    color: "#0891B2",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#0891B2" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">TOT</text>
      </svg>
    ),
  },
  {
    name: "3BB",
    color: "#D97706",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#D97706" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">3BB</text>
      </svg>
    ),
  },
  {
    name: "NPERF",
    color: "#6366F1",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="30" cy="30" r="30" fill="#6366F1" />
        <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">N</text>
        <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontFamily="sans-serif">PERF</text>
      </svg>
    ),
  },
];

// Duplicate items for seamless infinite loop
const loopedProviders = [...providers, ...providers, ...providers];

export function Providers() {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <section className="py-16 overflow-hidden" style={{ background: "var(--clr-bg-primary)" }}>
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--clr-light)" }}>
          ผู้ให้บริการ
        </h2>
        <p className="mt-2 text-sm" style={{ color: "rgba(246,243,228,0.65)" }}>
          รวมผู้ให้บริการโทรศัพท์เคลื่อนที่ชั้นนำของประเทศไทย
        </p>
      </div>

      {/* Edge fade masks */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #1E100F, transparent)" }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #1E100F, transparent)" }}
        />

        {/* Scrolling track */}
        <div
          className="overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="marquee-track" ref={trackRef}>
            {loopedProviders.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex flex-col items-center gap-2 px-8 cursor-pointer group"
              >
                <div className="group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  {p.icon}
                </div>
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{ color: p.color }}
                >
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
