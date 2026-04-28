import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router";
import logoImg from "../../imports/image.png";

const links = [
  { label: "โทรศัพท์เคลื่อนที่", to: "/" },
  { label: "อินเทอร์เน็ตบ้าน", to: "/internet-ban" },
  { label: "โรมมิ่ง", to: "/roaming" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="w-full sticky top-0 z-40"
      style={{
        background: "#1E100F",
        borderBottom: "0.5px solid rgba(246,243,228,0.12)",
        color: "#F6F3E4",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors flex-shrink-0"
          style={{ color: "#F6F3E4" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="เมนู"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="md:hidden absolute left-1/2 -translate-x-1/2">
          <NavLink to="/">
            <img src={logoImg} alt="Pro Check Logo" className="h-9 w-auto object-contain" />
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <NavLink to="/">
            <img src={logoImg} alt="Pro Check Logo" className="h-10 w-auto object-contain" />
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              className="text-sm transition-colors relative pb-1 whitespace-nowrap"
              style={({ isActive }) => ({
                color: isActive ? "#F6F3E4" : "rgba(246,243,228,0.65)",
                fontWeight: isActive ? 500 : 400,
              })}
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 rounded-full"
                      style={{ height: 2, background: "#F6F3E4" }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <div className="hidden md:block text-sm" style={{ color: "rgba(246,243,228,0.65)" }}>
            <span style={{ color: "#F6F3E4", fontWeight: 500 }}>TH</span>
            <span className="mx-1" style={{ color: "rgba(246,243,228,0.3)" }}>|</span>
            <span className="cursor-pointer">EN</span>
          </div>
          <NavLink
            to="/backoffice/login"
            className="text-xs md:text-sm px-3 md:px-5 py-2 rounded-lg transition-colors whitespace-nowrap nbtc-cta"
            style={{ background: "#F6F3E4", color: "#1E100F", fontWeight: 500 }}
          >
            เข้าสู่ระบบ
          </NavLink>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="py-1" style={{ background: "#1E100F" }}>
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors"
              style={({ isActive }) => ({
                color: isActive ? "#F6F3E4" : "rgba(246,243,228,0.7)",
                fontWeight: isActive ? 500 : 400,
                background: isActive ? "rgba(246,243,228,0.06)" : "transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: isActive ? "#F6F3E4" : "transparent" }}
                  />
                  {l.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div
          className="px-5 py-3 flex items-center gap-3 text-sm"
          style={{
            borderTop: "0.5px solid rgba(246,243,228,0.12)",
            background: "#1E100F",
            color: "rgba(246,243,228,0.65)",
          }}
        >
          <span style={{ color: "#F6F3E4", fontWeight: 500 }} className="cursor-pointer">TH</span>
          <span style={{ color: "rgba(246,243,228,0.3)" }}>|</span>
          <span className="cursor-pointer">EN</span>
        </div>
      </div>

      <style>{`
        .nbtc-cta:hover { background: #4D0C12 !important; color: #F6F3E4 !important; }
      `}</style>
    </header>
  );
}
