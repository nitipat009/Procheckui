import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { toast } from "sonner";

export type Role = "Admin" | "Editor" | "Viewer";
export type User = { username: string; name: string; role: Role };

const ACCOUNTS: Record<string, { password: string; user: User }> = {
  admin: { password: "admin1234", user: { username: "admin", name: "ผู้ดูแลระบบ", role: "Admin" } },
  editor: { password: "editor1234", user: { username: "editor", name: "บรรณาธิการ", role: "Editor" } },
  viewer: { password: "viewer1234", user: { username: "viewer", name: "ผู้อ่าน", role: "Viewer" } },
};

const STORAGE_KEY = "bo_auth_user_v1";

type AuthCtx = {
  user: User | null;
  login: (u: string, p: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  can: (mod: ModuleName, action?: "read" | "write") => boolean;
};

export type ModuleName =
  | "users"
  | "dashboard"
  | "cms"
  | "packages"
  | "verification"
  | "reports";

const PERMS: Record<ModuleName, Record<Role, "full" | "read" | "none">> = {
  users:        { Admin: "full", Editor: "none", Viewer: "none" },
  dashboard:    { Admin: "full", Editor: "full", Viewer: "full" },
  cms:          { Admin: "full", Editor: "full", Viewer: "read" },
  packages:     { Admin: "full", Editor: "full", Viewer: "read" },
  verification: { Admin: "full", Editor: "full", Viewer: "read" },
  reports:      { Admin: "full", Editor: "full", Viewer: "full" },
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v ? (JSON.parse(v) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login: AuthCtx["login"] = async (u, p) => {
    await new Promise((r) => setTimeout(r, 600));
    const acc = ACCOUNTS[u.trim().toLowerCase()];
    if (!acc) return { ok: false, error: "ไม่พบบัญชีผู้ใช้นี้ในระบบ" };
    if (acc.password !== p) return { ok: false, error: "รหัสผ่านไม่ถูกต้อง" };
    setUser(acc.user);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    toast.success("ออกจากระบบเรียบร้อย");
  };

  const can: AuthCtx["can"] = (mod, action = "read") => {
    if (!user) return false;
    const lvl = PERMS[mod][user.role];
    if (lvl === "none") return false;
    if (action === "read") return true;
    return lvl === "full";
  };

  return <Ctx.Provider value={{ user, login, logout, can }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/backoffice/login" state={{ from: loc.pathname }} replace />;
  return <>{children}</>;
}

export function RequireModule({
  module,
  action = "read",
  children,
}: {
  module: ModuleName;
  action?: "read" | "write";
  children: ReactNode;
}) {
  const { can } = useAuth();
  if (!can(module, action)) return <Navigate to="/backoffice/403" replace />;
  return <>{children}</>;
}
