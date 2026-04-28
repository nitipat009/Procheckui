import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import landscape001 from "../../imports/landscape_001.png";
import landscape002 from "../../imports/landscape_002.png";
import landscape003 from "../../imports/landscape_003.png";
import p001 from "../../imports/p_001.png";
import p002 from "../../imports/p_002.png";
import p003 from "../../imports/p_003.jpeg";

type Banner = {
  id: string;
  tag: string;
  headline: string;
  subtext: string;
  cta_text: string;
  cta_href: string;
  bg_color: string;
  art_variant: "promo-badge" | "shield-check" | "open-badge";
  landscapeImg: string;
  mobileImg: string;
};

const banners: Banner[] = [
  {
    id: "banner-1",
    tag: "กสทช. พิเศษ",
    headline: "โปรโมชั่นพิเศษ สำหรับ กสทช.",
    subtext: "รับสิทธิประโยชน์และส่วนลดสุดพิเศษ สำหรับผู้ใช้งาน กสทช Pro Check",
    cta_text: "ดูโปรโมชั่น →",
    cta_href: "/promotions",
    bg_color: "#30050E",
    art_variant: "promo-badge",
    landscapeImg: landscape001,
    mobileImg: p001,
  },
  {
    id: "banner-2",
    tag: "เกี่ยวกับเรา",
    headline: "ทำไมต้องใช้ กสทช Pro Check?",
    subtext: "ตรวจสอบแพ็กเกจอย่างโปร่งใส ปลอดภัย และน่าเชื่อถือ",
    cta_text: "เรียนรู้เพิ่มเติม →",
    cta_href: "/about",
    bg_color: "#1E100F",
    art_variant: "shield-check",
    landscapeImg: landscape002,
    mobileImg: p002,
  },
  {
    id: "banner-3",
    tag: "เปิดตัวแล้ว",
    headline: "กสทช Pro Check เปิดให้บริการแล้ว!",
    subtext: "เริ่มตรวจสอบแพ็กเกจของคุณ ได้เลยวันนี้ ฟรี ไม่มีค่าใช้จ่าย",
    cta_text: "เริ่มต้นใช้งาน →",
    cta_href: "/register",
    bg_color: "#4D0C12",
    art_variant: "open-badge",
    landscapeImg: landscape003,
    mobileImg: p003,
  },
];

const services = [
  { id: "telecom", label: "Telecom", href: "/services/telecom" },
  { id: "broadcasting", label: "Broadcasting", href: "/services/broadcasting" },
  { id: "spectrum", label: "Spectrum Management", href: "/services/spectrum" },
  { id: "satellite", label: "Satellite and orbit management", href: "/services/satellite" },
];

function BgOverlay({ variant }: { variant: Banner["art_variant"] }) {
  const common = {
    style: { position: "absolute" as const, inset: 0, width: "100%", height: "100%", pointerEvents: "none" as const, zIndex: 0 },
    preserveAspectRatio: "none" as const,
    viewBox: "0 0 800 400",
  };
  if (variant === "promo-badge") {
    return (
      <svg {...common}>
        <circle cx="590" cy="200" r="130" fill="#F6F3E4" opacity="0.05" />
        <circle cx="570" cy="100" r="70" fill="#F6F3E4" opacity="0.06" />
        <rect x="490" y="240" width="90" height="90" rx="6" transform="rotate(20, 535, 285)" fill="#F6F3E4" opacity="0.04" />
      </svg>
    );
  }
  if (variant === "shield-check") {
    return (
      <svg {...common}>
        <rect x="600" y="-20" width="40" height="280" transform="rotate(18, 620, 120)" fill="#F6F3E4" opacity="0.04" />
        <rect x="680" y="-20" width="20" height="280" transform="rotate(18, 690, 120)" fill="#F6F3E4" opacity="0.03" />
        <circle cx="80" cy="320" r="80" fill="#F6F3E4" opacity="0.05" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="650" cy="200" r="180" fill="#30050E" opacity="0.5" />
      <circle cx="650" cy="200" r="130" fill="#F6F3E4" opacity="0.04" />
      <circle cx="650" cy="200" r="80" fill="#30050E" opacity="0.5" />
    </svg>
  );
}

function BannerArt({ variant }: { variant: Banner["art_variant"] }) {
  if (variant === "promo-badge") {
    return (
      <svg width="145" height="145" viewBox="0 0 145 145" fill="none">
        <circle cx="72" cy="72" r="68" fill="#4D0C12" stroke="rgba(246,243,228,0.18)" />
        <circle cx="72" cy="72" r="55" fill="none" stroke="rgba(246,243,228,0.1)" strokeDasharray="4 3" />
        <text x="72" y="68" textAnchor="middle" fontSize="30" fill="#F6F3E4" fontWeight="500">%</text>
        <rect x="42" y="76" width="60" height="1" fill="#F6F3E4" opacity="0.15" />
        <text x="72" y="92" textAnchor="middle" fontSize="11" fill="rgba(246,243,228,0.8)">สิทธิพิเศษ</text>
        <text x="72" y="106" textAnchor="middle" fontSize="9" fill="rgba(246,243,228,0.45)">กสทช Pro Check</text>
      </svg>
    );
  }
  if (variant === "shield-check") {
    return (
      <svg width="150" height="145" viewBox="0 0 150 145" fill="none">
        <path d="M75 12 L122 34 L122 82 Q122 118 75 134 Q28 118 28 82 L28 34 Z" fill="#4D0C12" stroke="rgba(246,243,228,0.18)" />
        <path d="M52 73 L67 88 L100 55" stroke="#F6F3E4" strokeWidth="3" strokeLinecap="round" fill="none" />
        <text x="75" y="110" textAnchor="middle" fontSize="9" fill="rgba(246,243,228,0.4)">Verified</text>
        <circle cx="35" cy="20" r="2" fill="#F6F3E4" opacity="0.5" />
        <circle cx="115" cy="22" r="1.5" fill="#F6F3E4" opacity="0.4" />
        <circle cx="125" cy="60" r="1.8" fill="#F6F3E4" opacity="0.35" />
      </svg>
    );
  }
  return (
    <svg width="145" height="145" viewBox="0 0 145 145" fill="none">
      <circle cx="72" cy="72" r="66" fill="none" stroke="rgba(246,243,228,0.18)" />
      <circle cx="72" cy="72" r="52" fill="#30050E" stroke="rgba(246,243,228,0.12)" />
      <rect x="26" y="58" width="92" height="28" rx="5" fill="#F6F3E4" />
      <text x="72" y="78" textAnchor="middle" fontSize="17" fontWeight="500" fill="#1E100F">OPEN</text>
      <circle cx="20" cy="40" r="2" fill="#F6F3E4" opacity="0.5" />
      <circle cx="125" cy="35" r="1.8" fill="#F6F3E4" opacity="0.45" />
      <circle cx="130" cy="100" r="1.5" fill="#F6F3E4" opacity="0.4" />
      <circle cx="18" cy="110" r="1.8" fill="#F6F3E4" opacity="0.55" />
      <circle cx="72" cy="10" r="1.5" fill="#F6F3E4" opacity="0.35" />
    </svg>
  );
}

function ServiceIcon({ id }: { id: string }) {
  switch (id) {
    case "telecom":
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="9" y="13" width="4" height="8" rx="1" fill="#F6F3E4" />
          <line x1="11" y1="2" x2="11" y2="13" stroke="#F6F3E4" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M5 5.5 Q11 2 17 5.5" stroke="#F6F3E4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M7.5 8.5 Q11 6 14.5 8.5" stroke="#F6F3E4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "broadcasting":
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="9" y="9" width="4" height="11" rx="1" fill="#F6F3E4" />
          <circle cx="11" cy="9" r="2.5" fill="#F6F3E4" />
          <path d="M4 4.5 Q11 1 18 4.5" stroke="#F6F3E4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M6.5 7.5 Q11 5 15.5 7.5" stroke="#F6F3E4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "spectrum":
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M1 13 Q5.5 7.5 11 11 Q16.5 14.5 21 9" stroke="#F6F3E4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M1 17 Q5.5 11.5 11 15 Q16.5 18.5 21 13" stroke="rgba(246,243,228,0.45)" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M1 9 Q5.5 3.5 11 7 Q16.5 10.5 21 5" stroke="rgba(246,243,228,0.28)" strokeWidth="1" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "satellite":
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="8.5" y="8.5" width="5" height="5" rx="1" fill="#F6F3E4" />
          <rect x="1" y="9.5" width="6.5" height="3" rx="1" fill="rgba(246,243,228,0.7)" stroke="#F6F3E4" strokeWidth="0.5" />
          <rect x="14.5" y="9.5" width="6.5" height="3" rx="1" fill="rgba(246,243,228,0.7)" stroke="#F6F3E4" strokeWidth="0.5" />
          <path d="M13.5 7.5 Q17 3.5 19.5 5" stroke="#F6F3E4" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <circle cx="19.5" cy="5" r="1.5" fill="#F6F3E4" />
        </svg>
      );
    default:
      return null;
  }
}

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [docVisible, setDocVisible] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const onVis = () => setDocVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (paused || !docVisible) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [paused, docVisible, index]);

  const goTo = (i: number) => {
    setIndex(i);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <section
      className="relative w-screen left-1/2 -translate-x-1/2 flex flex-col lg:h-[95svh]"
      style={{ background: "var(--clr-bg-primary)" }}
    >
      {/* Section A — Banner Carousel */}
      <div
        className="relative overflow-hidden h-[200px] sm:h-[220px] lg:h-[75svh]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex h-full"
          style={{
            width: `${banners.length * 100}%`,
            transform: `translateX(-${index * (100 / banners.length)}%)`,
            transition: "transform 550ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {banners.map((b) => (
            <div
              key={b.id}
              className="relative h-full flex items-center banner-slide"
              style={{ width: `${100 / banners.length}%`, background: b.bg_color }}
            >
              <div
                className="banner-bg-image"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <BgOverlay variant={b.art_variant} />
              {/*<div
                className="relative w-full h-full flex items-center gap-6 sm:flex-row flex-col justify-center"
                style={{ padding: "0 clamp(24px, 5vw, 40px)", zIndex: 1 }}
              >
                <div className="flex-1 max-w-2xl text-center sm:text-left">
                  <span
                    className="inline-block"
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "#F6F3E4",
                      background: "#4D0C12",
                      border: "0.5px solid rgba(246,243,228,0.28)",
                      padding: "3px 10px",
                      borderRadius: 20,
                      marginBottom: 10,
                    }}
                  >
                    {b.tag}
                  </span>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#F6F3E4",
                      margin: "0 0 8px",
                      lineHeight: 1.35,
                    }}
                  >
                    {b.headline}
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(246,243,228,0.62)",
                      margin: "0 0 18px",
                      lineHeight: 1.65,
                    }}
                  >
                    {b.subtext}
                  </p>
                  <NavLink
                    to={b.cta_href}
                    className="nbtc-primary-btn"
                    style={{
                      display: "inline-block",
                      padding: "7px 18px",
                      fontSize: 12,
                      fontWeight: 500,
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    {b.cta_text}
                  </NavLink>
                </div>
                <div className="hidden sm:flex flex-shrink-0 items-center justify-center" style={{ flex: "0 0 clamp(140px, 18vw, 180px)" }}>
                  <BannerArt variant={b.art_variant} />
                </div>
              </div>*/}
            </div>
          ))}
        </div>

        {/* Dot indicator bar */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2"
          style={{ padding: "24px 0" }}
        >
          {banners.map((b, i) => (
            <button
              key={b.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                width: i === index ? 20 : 5,
                height: 5,
                borderRadius: 3,
                background: i === index ? "#F6F3E4" : "rgba(246,243,228,0.22)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 300ms ease, background 300ms ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Section B — Service Quick Links */}
      <div
        className="flex justify-around sm:gap-4 md:gap-16 items-start m-auto"
        style={{
          padding: "16px 12px",
          background: "--var(--clr-bg-primar)",
        }}
      >
        {services.map((s) => {
          const isExternal = /^https?:\/\//.test(s.href);
          const inner = (
            <>
              <div
                className="service-icon flex items-center justify-center"
                style={{
                  width: 64,
                  height: 64,
                  background: "#30050E",
                  borderRadius: 12,
                  border: "0.5px solid rgba(246,243,228,0.15)",
                  transition: "background 0.2s ease",
                }}
              >
                <ServiceIcon id={s.id} />
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(246,243,228,0.68)",
                  textAlign: "center",
                  lineHeight: 1.4,
                  maxLines: 2,
                  maxWidth: 72,
                  maxHeight: 28,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {s.label}
              </span>
            </>
          );
          const cls = "service-btn flex flex-col items-center cursor-pointer";
          const style = { gap: 7, transition: "transform 0.2s ease" } as const;
          return isExternal ? (
            <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
              {inner}
            </a>
          ) : (
            <NavLink key={s.id} to={s.href} className={cls} style={style}>
              {inner}
            </NavLink>
          );
        })}
      </div>

      <style>{`
        .service-btn:hover { transform: translateY(-2px); }
        .service-btn:hover .service-icon { background: #4D0C12 !important; }
        
        /* Banner background images - Mobile first */
        .banner-slide:nth-child(1) .banner-bg-image {
          background-image: url(${p001});
        }
        .banner-slide:nth-child(2) .banner-bg-image {
          background-image: url(${p002});
        }
        .banner-slide:nth-child(3) .banner-bg-image {
          background-image: url(${p003});
        }
        
        /* Desktop/Landscape images */
        @media (min-width: 768px) {
          .banner-slide:nth-child(1) .banner-bg-image {
            background-image: url(${landscape001});
          }
          .banner-slide:nth-child(2) .banner-bg-image {
            background-image: url(${landscape002});
          }
          .banner-slide:nth-child(3) .banner-bg-image {
            background-image: url(${landscape003});
          }
        }
        
        @media (max-width: 640px) {
          .service-btn .service-icon { width: 40px !important; height: 40px !important; }
          .service-btn span { font-size: 9px !important; }
        }
      `}</style>
    </section>
  );
}
