import {
  ArrowRight,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import logoImg from "../../imports/image.png";

export function Footer() {
  return (
    <footer
      style={{
        background: "#FFFFFF",
        color: "var(--nbtc-text)",
        borderTop: "1px solid var(--nbtc-border)",
      }}
    >
      <div className="mx-auto px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex">
          <div className="flex items-center gap-2 mb-4">
            <img
              src={logoImg}
              alt="Pro Check Logo"
              className="h-24 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h5>สำนักงาน กสทช.</h5>
            <p
              className="text-sm"
              style={{
                color: "var(--nbtc-text)",
                opacity: 0.6,
                lineHeight: 1.65,
              }}
            >
              แพลตฟอร์มเปรียบเทียบโปรโมชั่นและแพ็กเกจเครือข่ายมือถือ
              โดยสำนักงาน กสทช.
            </p>

            <p
              className="text-sm"
              style={{
                color: "var(--nbtc-text)",
                opacity: 0.6,
                lineHeight: 1.65,
              }}
            >
              © 2567 PRO CHECK. สงวนลิขสิทธิ์.
            </p>
          </div>

          {/* <div className="flex items-center gap-3 mt-4">
            {[Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  background: "var(--nbtc-bg-subtle)",
                  color: "var(--nbtc-text)",
                }}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div> */}
        </div>

        {/* <div>
          <h4
            style={{
              color: "var(--nbtc-text)",
              fontWeight: 500,
              marginBottom: 12,
            }}
          >
            เมนูหลัก
          </h4>
          <ul
            className="space-y-2 text-sm"
            style={{ color: "var(--nbtc-text)", opacity: 0.6 }}
          >
            <li
              className="cursor-pointer hover:opacity-100"
              style={{ transition: "opacity 0.15s" }}
            >
              หน้าแรก
            </li>
            <li
              className="cursor-pointer hover:opacity-100"
              style={{ transition: "opacity 0.15s" }}
            >
              อินเทอร์เน็ตบ้าน
            </li>
            <li
              className="cursor-pointer hover:opacity-100"
              style={{ transition: "opacity 0.15s" }}
            >
              โรมมิ่ง
            </li>
            <li
              className="cursor-pointer hover:opacity-100"
              style={{ transition: "opacity 0.15s" }}
            >
              ข่าวสาร
            </li>
            <li
              className="cursor-pointer hover:opacity-100"
              style={{ transition: "opacity 0.15s" }}
            >
              เปรียบเทียบ
            </li>
          </ul>
        </div> */}

        {/* <div>
          <h4 style={{ color: "var(--nbtc-text)", fontWeight: 500, marginBottom: 12 }}>ติดต่อเรา</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--nbtc-text)", opacity: 0.6, lineHeight: 1.6 }}>
            <li>87 ถนนพหลโยธิน 8 (ซอยสายลม) แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400</li>
            <li>โทร: 1200</li>
            <li>อีเมล: info@nbtc.go.th</li>
          </ul>
        </div> */}

        <div className="md:flex items-center justify-end gap-4">
          <div className="flex">
            <h4
              style={{
                color: "var(--nbtc-brand-red)",
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              สมัครรับข่าวสาร
            </h4>
          </div>

          <div className="flex-col">
            <div
              className="flex items-center gap-2 rounded-xl p-1.5"
              style={{
                background: "var(--nbtc-bg-subtle)",
                border: "1px solid var(--nbtc-border)",
              }}
            >
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none min-w-0"
                style={{ color: "var(--nbtc-text)" }}
              />
              <button
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 footer-cta"
                style={{
                  background: "var(--nbtc-brand-red)",
                  color: "#FFFFFF",
                }}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div
              className="flex items-center gap-5 text-sm pt-2"
              style={{
                color: "var(--nbtc-text)",
                opacity: 0.6,
                lineHeight: 1.65,
              }}
            >
              <a className="cursor-pointer footer-link">
                ข้อกำหนดการใช้งาน
              </a>
              <a className="cursor-pointer footer-link">
                นโยบายความเป็นส่วนตัว
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-cta:hover { background: var(--nbtc-deep-red) !important; }
        footer input::placeholder { color: rgba(26,26,26,0.35); }
        .footer-link:hover { opacity: 1; }
      `}</style>
    </footer>
  );
}