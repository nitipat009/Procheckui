import { useEffect, useRef, useState, Fragment } from "react";
import { NavLink } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  RadioTower,
} from "lucide-react";
import heroImage from "../../imports/ChatGPT_Image_May_7__2026__09_24_04_PM-1.png";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  art: "phone" | "shield" | "launch" | "phone3d" | "heroimage";
};

type HeroVariant = "mobile" | "internet";

const slidesByVariant: Record<HeroVariant, Slide[]> = {
  mobile: [
    {
      id: "s1",
      eyebrow: "เปิดให้บริการแล้ว",
      title: "PRO CHECK",
      subtitle:
        "เปรียบเทียบโปรโมชั่นโทรศัพท์เคลื่อนที่ ค้นหาโปรที่ใช่สำหรับคุณตัวเอง",
      cta: "เปรียบเทียบโปรโมชั่น",
      ctaHref: "/search-result",
      art: "heroimage",
    },
    {
      id: "s2",
      eyebrow: "ทำไมต้องใช้",
      title: "กสทช. Pro Check",
      subtitle:
        "ข้อมูลแพ็กเกจครบ อัปเดตตรง เปรียบเทียบได้ทุกค่าย ไม่มีค่าใช้จ่าย",
      cta: "ดูข้อมูลเพิ่มเติม",
      ctaHref: "/article",
      art: "shield",
    },
    {
      id: "s3",
      eyebrow: "กสทช. Pro Check",
      title: "เปิดให้บริการแล้ว",
      subtitle:
        "เข้าใช้งานได้ฟรี ไม่ต้องสมัครสมาชิก ครอบคลุมทุกผู้ให้บริการ",
      cta: "เริ่มใช้งาน",
      ctaHref: "/",
      art: "launch",
    },
    {
      id: "s4",
      eyebrow: "เปิดให้บริการแล้ว",
      title: "PRO CHECK",
      subtitle:
        "เปรียบเทียบโปรโมชั่นโทรศัพท์เคลื่อนที่ ค้นหาโปรที่ใช่สำหรับคุณตัวเอง ตัดสินใจง่าย เปรียบเทียบครบ จบในที่เดียว",
      cta: "เปรียบเทียบโปรโมชั่น",
      ctaHref: "/search-result",
      art: "phone3d",
    },
  ],
  internet: [
    {
      id: "i1",
      eyebrow: "เปิดให้บริการแล้ว",
      title: "แพ็กเกจอินเทอร์เน็ตบ้าน",
      subtitle:
        "เปรียบเทียบแพ็กเกจอินเทอร์เน็ตบ้านครบทุกค่าย เลือกความเร็วและราคาที่เหมาะกับคุณ",
      cta: "เริ่มค้นหาแพ็กเกจ",
      ctaHref: "/search-result",
      art: "phone",
    },
    {
      id: "i2",
      eyebrow: "ทำไมต้องใช้",
      title: "กสทช. Pro Check",
      subtitle:
        "ข้อมูลแพ็กเกจอินเทอร์เน็ตบ้านครบ อัปเดตตรง เปรียบเทียบทุกผู้ให้บริการ",
      cta: "ดูข้อมูลเพิ่มเติม",
      ctaHref: "/article",
      art: "shield",
    },
    {
      id: "i3",
      eyebrow: "กสทช. Pro Check",
      title: "เปิดให้บริการแล้ว",
      subtitle:
        "เข้าใช้งานได้ฟรี ไม่ต้องสมัครสมาชิก ครอบคลุมทุกผู้ให้บริการ",
      cta: "เริ่มใช้งาน",
      ctaHref: "/internet-ban",
      art: "launch",
    },
  ],
};

const services = [
  {
    id: "telecom",
    th: "โทรศัพท์เคลื่อนที่",
    en: "Mobile",
    href: "https://www.nbtc.go.th/",
  },
  {
    id: "broadcasting",
    th: "กระจายเสียง",
    en: "Broadcasting",
    href: "https://broadcast.nbtc.go.th/",
  },
  {
    id: "spectrum",
    th: "บริการสัมปทาน",
    en: "Spectrum Management",
    href: "https://spectrum.nbtc.go.th/",
  },
  {
    id: "satellite",
    th: "ดาวเทียมและอวกาศ",
    en: "Satellite and Orbit",
    href: "https://nbtc.go.th/satellite",
  },
];

function ServiceIcon({ id }: { id: string }) {
  const stroke = "currentColor";
  switch (id) {
    case "telecom":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 22 22"
          fill="none"
        >
          <rect
            x="9"
            y="13"
            width="4"
            height="8"
            rx="1"
            fill={stroke}
          />
          <line
            x1="11"
            y1="2"
            x2="11"
            y2="13"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M5 5.5 Q11 2 17 5.5"
            stroke={stroke}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M7.5 8.5 Q11 6 14.5 8.5"
            stroke={stroke}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "broadcasting":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <RadioTower />
          {/* <rect
            x="9"
            y="9"
            width="4"
            height="11"
            rx="1"
            fill={stroke}
          />
          <circle cx="11" cy="9" r="2.5" fill={stroke} />
          <path
            d="M4 4.5 Q11 1 18 4.5"
            stroke={stroke}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M6.5 7.5 Q11 5 15.5 7.5"
            stroke={stroke}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          /> */}
        </svg>
      );
    case "spectrum":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M1 13 Q5.5 7.5 11 11 Q16.5 14.5 21 9"
            stroke={stroke}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M1 17 Q5.5 11.5 11 15 Q16.5 18.5 21 13"
            stroke={stroke}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M1 9 Q5.5 3.5 11 7 Q16.5 10.5 21 5"
            stroke={stroke}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      );
    case "satellite":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 22 22"
          fill="none"
        >
          <rect
            x="8.5"
            y="8.5"
            width="5"
            height="5"
            rx="1"
            fill={stroke}
          />
          <rect
            x="1"
            y="9.5"
            width="6.5"
            height="3"
            rx="1"
            stroke={stroke}
            strokeWidth="1.2"
            fill="none"
          />
          <rect
            x="14.5"
            y="9.5"
            width="6.5"
            height="3"
            rx="1"
            stroke={stroke}
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M13.5 7.5 Q17 3.5 19.5 5"
            stroke={stroke}
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="19.5" cy="5" r="1.5" fill={stroke} />
        </svg>
      );
    default:
      return null;
  }
}

function SlideArt({ kind }: { kind: Slide["art"] }) {
  const c = "rgba(255,255,255,0.92)";
  const c2 = "rgba(255,255,255,0.55)";

  if (kind === "phone") {
    return (
      <svg
        width="260"
        height="260"
        viewBox="0 0 260 260"
        fill="none"
        className="relative"
      >
        {/* Main circular badge */}
        <circle
          cx="130"
          cy="130"
          r="70"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2.5"
        />
        <circle
          cx="130"
          cy="130"
          r="55"
          fill="rgba(255,255,255,0.95)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
        />

        {/* OPEN text */}
        <text
          x="130"
          y="140"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="#550000"
          letterSpacing="1"
        >
          OPEN
        </text>

        {/* Decorative X symbols */}
        <g opacity="0.6">
          <path
            d="M40 50 L50 60 M40 60 L50 50"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M200 70 L210 80 M200 80 L210 70"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M180 190 L190 200 M180 200 L190 190"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M60 200 L70 210 M60 210 L70 200"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Decorative + symbols */}
        <g opacity="0.6">
          <path
            d="M225 130 L235 130 M230 125 L230 135"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M25 130 L35 130 M30 125 L30 135"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Small circles */}
        <circle cx="90" cy="40" r="3" fill="rgba(255,255,255,0.6)" />
        <circle cx="170" cy="220" r="3" fill="rgba(255,255,255,0.6)" />
      </svg>
    );
  }
  if (kind === "phone3d") {
    return (
      <svg
        width="450"
        height="320"
        viewBox="0 0 450 320"
        fill="none"
        className="relative"
      >
        {/* Cityscape silhouette (background) */}
        <g opacity="0.15">
          <rect x="30" y="240" width="28" height="70" fill="rgba(255,255,255,0.8)" rx="2" />
          <rect x="63" y="215" width="32" height="95" fill="rgba(255,255,255,0.8)" rx="2" />
          <rect x="100" y="230" width="26" height="80" fill="rgba(255,255,255,0.8)" rx="2" />
          <rect x="131" y="205" width="35" height="105" fill="rgba(255,255,255,0.8)" rx="2" />
          <rect x="171" y="220" width="30" height="90" fill="rgba(255,255,255,0.8)" rx="2" />
          <rect x="285" y="225" width="29" height="85" fill="rgba(255,255,255,0.8)" rx="2" />
          <rect x="319" y="210" width="38" height="100" fill="rgba(255,255,255,0.8)" rx="2" />
          <rect x="362" y="235" width="27" height="75" fill="rgba(255,255,255,0.8)" rx="2" />
          <rect x="394" y="220" width="32" height="90" fill="rgba(255,255,255,0.8)" rx="2" />
        </g>

        {/* WiFi Icon (left side, orange) */}
        <g transform="translate(60, 80)" opacity="0.9">
          <path
            d="M30 50 Q45 28 60 50"
            stroke="#FF9500"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M18 62 Q45 18 72 62"
            stroke="#FF9500"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M6 74 Q45 8 84 74"
            stroke="#FF9500"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <circle cx="45" cy="56" r="5" fill="#FF9500" />
        </g>

        {/* Platform/Podium */}
        <g transform="translate(170, 230)">
          {/* Shadow */}
          <ellipse
            cx="55"
            cy="75"
            rx="65"
            ry="10"
            fill="rgba(0,0,0,0.12)"
          />

          {/* Podium base */}
          <ellipse
            cx="55"
            cy="65"
            rx="60"
            ry="8"
            fill="rgba(255,255,255,0.3)"
          />
          <rect
            x="5"
            y="45"
            width="100"
            height="20"
            rx="4"
            fill="url(#podiumGrad)"
            opacity="0.25"
          />
          <ellipse
            cx="55"
            cy="45"
            rx="60"
            ry="8"
            fill="rgba(255,255,255,0.4)"
          />
        </g>

        {/* 3D Phone mockup */}
        <g transform="translate(200, 50)">
          {/* Phone body with 3D effect */}
          <defs>
            <linearGradient id="phone3dGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F8F9FA" />
              <stop offset="100%" stopColor="#E9ECEF" />
            </linearGradient>
            <filter id="phoneShadow">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.2"/>
            </filter>
          </defs>

          {/* Phone back (3D depth) */}
          <rect
            x="5"
            y="5"
            width="90"
            height="180"
            rx="16"
            fill="rgba(200,200,200,0.3)"
            filter="url(#phoneShadow)"
          />

          {/* Phone front */}
          <rect
            x="0"
            y="0"
            width="90"
            height="180"
            rx="14"
            fill="url(#phone3dGrad)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
          />

          {/* Screen */}
          <rect
            x="5"
            y="12"
            width="80"
            height="156"
            rx="10"
            fill="#550000"
          />

          {/* Screen content - NBTC badge */}
          <circle cx="45" cy="55" r="20" fill="white" opacity="0.95" />
          <text
            x="45"
            y="52"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fill="#550000"
            letterSpacing="0.5"
          >
            กสทช.
          </text>

          {/* PRO CHECK badge */}
          <rect
            x="20"
            y="80"
            width="50"
            height="28"
            rx="5"
            fill="white"
          />
          <text
            x="45"
            y="91"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="#550000"
            letterSpacing="0.6"
          >
            PRO
          </text>
          <text
            x="45"
            y="102"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="#550000"
            letterSpacing="0.6"
          >
            CHECK
          </text>

          {/* Decorative screen elements */}
          <rect x="15" y="115" width="60" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
          <rect x="18" y="123" width="54" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
          <rect x="18" y="135" width="54" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
          <rect x="18" y="147" width="54" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
        </g>

        {/* WiFi Icon (right side, orange) */}
        <g transform="translate(320, 100)" opacity="0.9">
          <path
            d="M25 40 Q38 20 51 40"
            stroke="#FF9500"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M15 50 Q38 12 61 50"
            stroke="#FF9500"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M5 60 Q38 4 71 60"
            stroke="#FF9500"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <circle cx="38" cy="45" r="4.5" fill="#FF9500" />
        </g>

        {/* Gradient definition for podium */}
        <defs>
          <linearGradient id="podiumGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (kind === "shield") {
    return (
      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        fill="none"
      >
        <path
          d="M110 24 L180 50 L180 110 Q180 160 110 196 Q40 160 40 110 L40 50 Z"
          stroke={c}
          strokeWidth="2.5"
          fill="rgba(255,255,255,0.06)"
        />
        <path
          d="M76 110 L100 134 L150 84"
          stroke={c}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="50" cy="40" r="3" fill={c2} />
        <circle cx="170" cy="44" r="2.5" fill={c2} />
        <circle cx="180" cy="100" r="3" fill={c2} />
      </svg>
    );
  }
  return (
    <svg
      width="240"
      height="220"
      viewBox="0 0 240 220"
      fill="none"
    >
      <circle
        cx="120"
        cy="110"
        r="60"
        stroke={c}
        strokeWidth="2.5"
        fill="rgba(255,255,255,0.06)"
      />
      <circle
        cx="120"
        cy="110"
        r="44"
        stroke={c2}
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="74"
        y="98"
        width="92"
        height="28"
        rx="6"
        fill={c}
      />
      <text
        x="120"
        y="118"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        fill="#550000"
      >
        OPEN
      </text>
      <path
        d="M60 50 L70 60 M60 60 L70 50"
        stroke={c2}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M180 50 L190 60 M180 60 L190 50"
        stroke={c2}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M40 170 L50 180 M40 180 L50 170"
        stroke={c2}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M195 170 L205 180 M195 180 L205 170"
        stroke={c2}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="120" cy="32" r="3" fill={c2} />
      <circle cx="120" cy="190" r="3" fill={c2} />
    </svg>
  );
}

export function HeroBanner({
  variant = "mobile",
}: {
  variant?: HeroVariant;
}) {
  const slides = slidesByVariant[variant];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [docVisible, setDocVisible] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const onVis = () => setDocVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () =>
      document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (paused || !docVisible) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (intervalRef.current)
        window.clearInterval(intervalRef.current);
    };
  }, [paused, docVisible, slides.length]);

  const goTo = (i: number) => {
    setIndex(
      ((i % slides.length) + slides.length) % slides.length,
    );
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 flex flex-col">
      {/* Banner Carousel */}
      <div
        className="relative overflow-hidden"
        style={{
          height: "clamp(320px, 45vh, 480px)",
          background:
            "linear-gradient(135deg, #FFB8C8 0%, #E88BA0 30%, #B85770 60%, #8B3A50 85%, #550000 100%)",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex h-full"
          style={{
            width: `${slides.length * 100}%`,
            transform: `translateX(-${index * (100 / slides.length)}%)`,
            transition: "transform 400ms ease-in-out",
          }}
        >
          {slides.map((s, i) => {
            return (
              <div
                key={s.id}
                className="h-full flex items-center relative"
                style={{
                  width: `${100 / slides.length}%`,
                  ...(s.art === "heroimage" && {
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 45%",
                    backgroundRepeat: "no-repeat"
                  })
                }}
              >
                <div
                  className="w-full h-full max-w-7xl mx-auto flex items-center justify-between relative z-10"
                  style={{
                    padding: "0 clamp(24px, 6vw, 80px)",
                    gap: s.art === "heroimage" ? "clamp(16px, 3vw, 32px)" : "32px"
                  }}
                >
                  {s.art !== "heroimage" && (
                    <div className="flex-1 max-w-xl">
                      <div
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.9)",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          marginBottom: 8,
                          fontWeight: 500,
                        }}
                      >
                        {s.eyebrow}
                      </div>
                      <h1
                        style={{
                          fontSize: "clamp(28px, 4.5vw, 42px)",
                          fontWeight: 700,
                          color: "#FFFFFF",
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {s.title}
                      </h1>
                      <p
                        style={{
                          fontSize: 14,
                          color: "rgba(255,255,255,0.85)",
                          margin: "12px 0 20px",
                          lineHeight: 1.6,
                          maxWidth: 380,
                        }}
                      >
                        {s.subtitle}
                      </p>
                      <NavLink
                        to={s.ctaHref}
                        className="inline-flex items-center gap-2 transition-all hero-cta"
                        style={{
                          background: "rgba(85, 0, 0, 0.9)",
                          color: "#FFFFFF",
                          padding: "11px 22px",
                          borderRadius: 9999,
                          fontSize: 13,
                          fontWeight: 500,
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        <Search className="w-4 h-4" />
                        {s.cta}
                      </NavLink>
                    </div>
                  )}
                  {s.art !== "heroimage" && (
                    <div
                      className="hidden md:flex flex-shrink-0 items-center justify-center"
                      style={{
                        width: s.art === "phone3d" ? 420 : 200
                      }}
                    >
                      <SlideArt kind={s.art} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        <button
          aria-label="Previous"
          onClick={() => goTo(index - 1)}
          className="absolute top-1/2 -translate-y-1/2 left-3 md:left-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          aria-label="Next"
          onClick={() => goTo(index + 1)}
          className="absolute top-1/2 -translate-y-1/2 right-3 md:right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide counter */}
        <div
          className="absolute top-4 right-4 px-2.5 py-1 text-xs"
          style={{
            background: "rgba(0,0,0,0.35)",
            color: "rgba(255,255,255,0.95)",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          {index + 1} / {slides.length}
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.25)" }}>
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                width: i === index ? 20 : 6,
                height: 6,
                borderRadius: 9999,
                background:
                  i === index
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                transition:
                  "width 250ms ease, background 250ms ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Service Navigator */}
      <div
        className="w-full overflow-x-auto md:overflow-visible no-scrollbar mt-4 z-9999"
        style={{
          padding: "0 clamp(24px, 16px, 80px)",
        }}
      >
        <div
          className="flex items-stretch justify-around min-w-max md:min-w-0 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.12)] py-1.5"
          style={{
            background: "#FFFFFF",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {services.map((s, idx) => (
            <Fragment key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 cursor-pointer py-3 px-3 md:px-5 rounded-lg hover:bg-[#FEF0F2] transition-colors duration-150"
                style={{ minWidth: 160 }}
              >
                <div className="flex-shrink-0 flex items-center justify-center text-[#550000] group-hover:text-[#3D0000] transition-colors duration-150" style={{ width: 28, height: 28 }}>
                  <ServiceIcon id={s.id} />
                </div>
                <div className="leading-tight">
                  <div
                    className="group-hover:text-[#550000] transition-colors duration-150"
                    style={{
                      fontSize: 12,
                      color: "#1A1A1A",
                      fontWeight: 600,
                    }}
                  >
                    {s.th}
                  </div>
                  <div
                    style={{ fontSize: 10, color: "#888888" }}
                  >
                    {s.en}
                  </div>
                </div>
              </a>
              {idx < services.length - 1 && (
                <div
                  style={{
                    width: 1,
                    background: "#E5E5E5",
                    margin: "10px 0",
                    flexShrink: 0,
                  }}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <style>{`
        .hero-cta:hover {
          background: rgba(61, 0, 0, 0.95) !important;
          border-color: rgba(255,255,255,0.3) !important;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </section>
  );
}