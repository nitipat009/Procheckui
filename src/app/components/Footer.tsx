import { ArrowRight } from "lucide-react";
import logoImg from "../../imports/image.png";

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--clr-bg-primary)",
        borderTop: "0.5px solid rgba(246,243,228,0.12)",
        color: "rgba(246,243,228,0.65)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logoImg} alt="Pro Check Logo" className="h-9 w-auto object-contain"
              style={{
                borderRadius: "var(--radius)",
                background: "var(--clr-light)"
              }}/>
          </div>
          <p className="text-sm" style={{ color: "var(--clr-light)", fontWeight: 500 }}>สำนักงาน กสทช.</p>
          <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(246,243,228,0.55)" }}>
            สำนักงานคณะกรรมการกิจการกระจายเสียง กิจการโทรทัศน์ และกิจการโทรคมนาคมแห่งชาติ
          </p>
          <p className="text-xs mt-4" style={{ color: "rgba(246,243,228,0.4)" }}>© 2567 PRO CHECK. สงวนลิขสิทธิ์.</p>
        </div>
        <div className="md:justify-self-end w-full md:max-w-sm">
          <label className="text-sm" style={{ color: "var(--clr-light)", fontWeight: 500 }}>สมัครรับข่าวสาร</label>
          <div
            className="mt-3 flex items-center gap-2 rounded-xl p-1.5"
            style={{
              background: "rgba(246,243,228,0.06)",
              border: "0.5px solid rgba(246,243,228,0.20)",
            }}
          >
            <input
              type="email"
              placeholder="อีเมลของคุณ"
              className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none min-w-0"
               style={{ color: "var(--clr-light)" }}
            />
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 nbtc-primary-btn"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-5 md:mt-6 flex items-center gap-4 md:gap-6 md:justify-end text-xs flex-wrap" style={{ color: "rgba(246,243,228,0.55)" }}>
            <a className="cursor-pointer hover:text-[#F6F3E4]">ข้อกำหนดการใช้งาน</a>
            <a className="cursor-pointer hover:text-[#F6F3E4]">นโยบายความเป็นส่วนตัว</a>
          </div>
        </div>
      </div>
      <style>{`
        footer input::placeholder { color: rgba(246,243,228,0.40); }
      `}</style>
    </footer>
  );
}
