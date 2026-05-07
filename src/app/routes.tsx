import { createBrowserRouter, Navigate } from "react-router";
import { Header } from "./components/Header";
import { MobilePage } from "./pages/MobilePage";
import { InternetBanPage } from "./pages/InternetBanPage";
import { RoamingPage } from "./pages/RoamingPage";
import { SearchResultPage } from "./pages/SearchResultPage";
import { PackageDetailPage } from "./pages/PackageDetailPage";
import { ComparePage } from "./pages/ComparePage";
import { ArticlePage } from "./pages/ArticlePage";

import { LoginPage } from "./backoffice/pages/LoginPage";
import { Shell } from "./backoffice/components/Shell";
import { RequireAuth, RequireModule } from "./backoffice/auth";
import { DashboardPage } from "./backoffice/pages/DashboardPage";
import { UsersPage } from "./backoffice/pages/UsersPage";
import { CmsInformationPage, CmsBlogsPage, CmsFaqPage } from "./backoffice/pages/CmsPages";
import { PackageListPage, VerificationPage } from "./backoffice/pages/PackagesPages";
import { ReportActivityPage, ReportVerificationPage } from "./backoffice/pages/ReportsPages";
import { ForbiddenPage } from "./backoffice/pages/ForbiddenPage";

function WithHeader({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

const wrap = (C: React.ComponentType) => () => <WithHeader><C /></WithHeader>;

const guard = (mod: any, C: React.ComponentType) => () => (
  <RequireAuth>
    <RequireModule module={mod}>
      <C />
    </RequireModule>
  </RequireAuth>
);

function ShellGuarded() {
  return (
    <RequireAuth>
      <Shell />
    </RequireAuth>
  );
}

export const router = createBrowserRouter([
  { path: "/",              Component: wrap(MobilePage) },
  { path: "/internet-ban",  Component: wrap(InternetBanPage) },
  { path: "/roaming",       Component: wrap(RoamingPage) },
  { path: "/search-result", Component: wrap(SearchResultPage) },
  { path: "/package-detail", Component: wrap(PackageDetailPage) },
  { path: "/compare", Component: wrap(ComparePage) },
  { path: "/article", Component: wrap(ArticlePage) },
  { path: "/article/:slug", Component: wrap(ArticlePage) },

  { path: "/backoffice/login", Component: LoginPage },
  {
    path: "/backoffice",
    Component: ShellGuarded,
    children: [
      { index: true, element: <Navigate to="/backoffice/dashboard" replace /> },
      { path: "dashboard", Component: guard("dashboard", DashboardPage) },
      { path: "users", Component: guard("users", UsersPage) },
      { path: "cms", element: <Navigate to="/backoffice/cms/information" replace /> },
      { path: "cms/information", Component: guard("cms", CmsInformationPage) },
      { path: "cms/blogs", Component: guard("cms", CmsBlogsPage) },
      { path: "cms/faq", Component: guard("cms", CmsFaqPage) },
      { path: "packages", Component: guard("packages", PackageListPage) },
      { path: "packages/verification", Component: guard("verification", VerificationPage) },
      { path: "reports", element: <Navigate to="/backoffice/reports/activity" replace /> },
      { path: "reports/activity", Component: guard("reports", ReportActivityPage) },
      { path: "reports/verification", Component: guard("reports", ReportVerificationPage) },
      { path: "403", Component: ForbiddenPage },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
