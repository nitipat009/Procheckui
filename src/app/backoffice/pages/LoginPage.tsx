import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../auth";
import { toast } from "sonner";
import logoImg from "../../../imports/image.png";

const DEMO = [
  { role: "Admin", username: "admin", password: "admin1234" },
  { role: "Editor", username: "editor", password: "editor1234" },
  { role: "Viewer", username: "viewer", password: "viewer1234" },
];

export function LoginPage() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as any)?.from || "/backoffice/dashboard";

  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (user) return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await login(u, p);
    setLoading(false);
    if (!res.ok) {
      setErr(res.error || "เข้าสู่ระบบไม่สำเร็จ");
      return;
    }
    toast.success("เข้าสู่ระบบสำเร็จ");
    nav(from, { replace: true });
  };

  return (
    <div className="min-h-screen nbtc-page nbtc-theme-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <img
              src={logoImg}
              alt="logo"
              className="h-12 w-auto mb-3"
              style={{
                borderRadius: "var(--radius)",
                background: "var(--clr-light)",
              }}
            />
            <h1 className="text-xl font-medium text-gray-900">Back Office</h1>
            <p className="text-sm text-gray-500 mt-1">
              เข้าสู่ระบบสำหรับเจ้าหน้าที่
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={u}
                onChange={(e) => setU(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]/30 focus:border-[#0B5ED7] text-sm"
                placeholder="กรอก username"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]/30 focus:border-[#0B5ED7] text-sm"
                  placeholder="กรอกรหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700"
                >
                  {show ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {err && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B5ED7] hover:bg-[#094fb8] disabled:opacity-60 text-white py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">
                Demo Account
              </span>
            </div>
            <p className="text-xs text-amber-700 mb-3">
              ⚠️ สำหรับการสาธิตเท่านั้น ห้ามใช้ในระบบ Production
            </p>
            <div className="space-y-2">
              {DEMO.map((d) => (
                <div
                  key={d.role}
                  className="flex items-center justify-between bg-white rounded-lg border border-amber-100 px-3 py-2"
                >
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">{d.role}</div>
                    <div className="text-gray-500 font-mono">
                      {d.username} / {d.password}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setU(d.username);
                      setP(d.password);
                      setErr(null);
                    }}
                    className="text-xs text-[#0B5ED7] hover:bg-blue-50 px-2.5 py-1.5 rounded-md whitespace-nowrap"
                  >
                    ใช้บัญชีนี้
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
