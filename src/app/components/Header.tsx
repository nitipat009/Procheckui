import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router";
import logoImg from "../../imports/image.png";

const links = [
  { label: "หน้าแรก", to: "/" },
  { label: "อินเทอร์เน็ตบ้าน", to: "/internet-ban" },
  { label: "โรมมิ่ง", to: "/roaming" },
  { label: "ข่าวสาร", to: "/article" },
  { label: "เปรียบเทียบ", to: "/compare" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="w-full sticky top-0 z-40"
      style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}
    >
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="เมนู"
        >
          {menuOpen ? <X className="w-5 h-5" style={{ color: "#1A1A1A" }} /> : <Menu className="w-5 h-5" style={{ color: "#1A1A1A" }} />}
        </button>

        <div className="md:hidden absolute left-1/2 -translate-x-1/2">
          <NavLink to="/">
            <img src={logoImg} alt="Pro Check Logo" className="h-9 w-auto object-contain mix-blend-multiply" />
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <NavLink to="/">
            <img src={logoImg} alt="Pro Check Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-sm transition-colors relative pb-1 whitespace-nowrap ${
                  isActive ? "font-medium" : ""
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? "#550000" : "rgba(26,26,26,0.7)",
              })}
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 rounded-full" style={{ height: 2, background: "#550000" }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <div className="hidden md:flex items-center gap-1 text-sm">
            <span style={{ color: "#550000", fontWeight: 500 }}>TH</span>
            <span style={{ color: "#E5E5E5" }}>|</span>
            <span style={{ color: "#888888" }} className="cursor-pointer hover:text-[#550000] transition-colors">EN</span>
          </div>
          <NavLink
            to="/backoffice/login"
            className="text-xs md:text-sm px-4 md:px-5 py-2 transition-colors whitespace-nowrap nbtc-cta"
            style={{ background: "#550000", color: "#FFFFFF", borderRadius: 9999, fontWeight: 500 }}
          >
            เข้าสู่ระบบ
          </NavLink>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}
      >
        <nav className="py-1">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors"
              style={({ isActive }) => ({
                color: isActive ? "#550000" : "#1A1A1A",
                fontWeight: isActive ? 500 : 400,
                background: isActive ? "#FEF0F2" : "transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: isActive ? "#550000" : "transparent" }} />
                  {l.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-3 flex items-center gap-3 text-sm" style={{ borderTop: "1px solid #E5E5E5" }}>
          <span style={{ color: "#550000", fontWeight: 500 }} className="cursor-pointer">TH</span>
          <span style={{ color: "#E5E5E5" }}>|</span>
          <span style={{ color: "#888888" }} className="cursor-pointer">EN</span>
        </div>
      </div>

      <style>{`
        .nbtc-cta:hover { background: #3D0000 !important; }
      `}</style>
    </header>
  );
}
