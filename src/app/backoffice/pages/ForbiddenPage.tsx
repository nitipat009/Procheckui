import { Link } from "react-router";
import { ShieldX } from "lucide-react";

export function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <ShieldX className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">403 — Forbidden</h1>
        <p className="text-sm text-gray-600 mb-6">
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ
        </p>
        <Link to="/backoffice/dashboard" className="inline-block bg-[#0B5ED7] hover:bg-[#094fb8] text-white text-sm px-5 py-2.5 rounded-lg">
          กลับ Dashboard
        </Link>
      </div>
    </div>
  );
}
