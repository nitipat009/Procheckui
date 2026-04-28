import { useState, type ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  ShieldCheck,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth, type ModuleName } from "../auth";
import logoImg from "../../../imports/image.png";

type Item = {
  label: string;
  to?: string;
  icon: any;
  module: ModuleName;
  children?: { label: string; to: string }[];
};

const NAV: Item[] = [
  { label: "Dashboard", to: "/backoffice/dashboard", icon: LayoutDashboard, module: "dashboard" },
  { label: "User Management", to: "/backoffice/users", icon: Users, module: "users" },
  {
    label: "CMS",
    icon: FileText,
    module: "cms",
    children: [
      { label: "Information", to: "/backoffice/cms/information" },
      { label: "Blogs", to: "/backoffice/cms/blogs" },
      { label: "FAQ", to: "/backoffice/cms/faq" },
    ],
  },
  {
    label: "Package Management",
    icon: Package,
    module: "packages",
    children: [
      { label: "Package List", to: "/backoffice/packages" },
      { label: "Verification", to: "/backoffice/packages/verification" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    module: "reports",
    children: [
      { label: "User Activity", to: "/backoffice/reports/activity" },
      { label: "Package Verification", to: "/backoffice/reports/verification" },
    ],
  },
];

export function Shell() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <ShellInner>
        <Outlet />
      </ShellInner>
    </div>
  );
}

function ShellInner({ children }: { children: ReactNode }) {
  const { user, logout, can } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const visible = NAV.filter((n) => can(n.module, "read"));

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-3">
        <button
          className="md:hidden w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="logo" className="h-7 w-auto mix-blend-multiply" />
          <span className="text-sm font-medium text-gray-900 hidden sm:inline">Back Office</span>
        </div>
        <div className="flex-1" />
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="text-right">
            <div className="text-gray-900 font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            nav("/backoffice/login");
          }}
          className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-[#0B5ED7] px-3 py-2 rounded-lg hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">ออกจากระบบ</span>
        </button>
      </header>

      <div className="flex flex-1">
        <aside
          className={`${
            open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:sticky top-14 left-0 z-20 w-64 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 transition-transform overflow-y-auto`}
        >
          <nav className="p-3 space-y-1">
            {visible.map((item) => (
              <NavGroup key={item.label} item={item} pathname={loc.pathname} onNavigate={() => setOpen(false)} />
            ))}
          </nav>
        </aside>

        {open && (
          <div className="md:hidden fixed inset-0 top-14 bg-black/30 z-10" onClick={() => setOpen(false)} />
        )}

        <main className="flex-1 min-w-0 p-4 md:p-6">{children}</main>
      </div>
    </>
  );
}

function NavGroup({
  item,
  pathname,
  onNavigate,
}: {
  item: Item;
  pathname: string;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const hasChildren = !!item.children?.length;
  const childActive = hasChildren && item.children!.some((c) => pathname.startsWith(c.to));
  const [expanded, setExpanded] = useState(childActive);

  if (!hasChildren && item.to) {
    return (
      <NavLink
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            isActive
              ? "bg-[#0B5ED7] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        <Icon className="w-4 h-4" />
        {item.label}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
          childActive ? "text-[#0B5ED7] bg-blue-50" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Icon className="w-4 h-4" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="mt-1 ml-4 pl-3 border-l border-gray-200 space-y-1">
          {item.children!.map((c) => (
            <NavLink
              key={c.to}
              to={c.to}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-[#0B5ED7] text-white" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl md:text-2xl font-medium text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}