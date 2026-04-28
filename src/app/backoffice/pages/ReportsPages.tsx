import { useMemo, useState } from "react";
import { FileDown, Printer } from "lucide-react";
import { PageHeader } from "../components/Shell";
import { Modal, Pager } from "./UsersPage";
import { useAuth } from "../auth";
import { toast } from "sonner";
import logoImg from "../../../imports/image.png";

// ─────────────────────────── User Activity ───────────────────────────
type Activity = {
  id: string;
  session: string;
  type: "search" | "view_pkg" | "compare" | "view_article";
  page: string;
  device: "Desktop" | "Mobile" | "Tablet";
  timestamp: string;
};

const ACT_LABEL: Record<Activity["type"], string> = {
  search: "การค้นหา",
  view_pkg: "ดูแพ็กเกจ",
  compare: "การเปรียบเทียบ",
  view_article: "ดูบทความ",
};

const ACT_SEED: Activity[] = Array.from({ length: 35 }, (_, i) => ({
  id: `a${i + 1}`,
  session: `sess_${(1000 + i).toString(16)}`,
  type: (["search", "view_pkg", "compare", "view_article"] as const)[i % 4],
  page: ["/search-result?q=5g", "/package-detail", "/compare", "/article/abc"][i % 4],
  device: (["Desktop", "Mobile", "Tablet"] as const)[i % 3],
  timestamp: `2026-04-${String((i % 26) + 1).padStart(2, "0")} ${String(8 + (i % 14)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
}));

export function ReportActivityPage() {
  const [from, setFrom] = useState("2026-04-01");
  const [to, setTo] = useState("2026-04-26");
  const [type, setType] = useState("all");
  const [device, setDevice] = useState("all");
  const [page, setPage] = useState(1);
  const [previewing, setPreviewing] = useState(false);
  const PER = 10;

  const filtered = useMemo(() => ACT_SEED.filter((r) =>
    (type === "all" || r.type === type) &&
    (device === "all" || r.device === device) &&
    r.timestamp >= from && r.timestamp <= to + " 23:59"
  ), [type, device, from, to]);

  const view = filtered.slice((page - 1) * PER, page * PER);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));

  return (
    <div>
      <PageHeader
        title="User Activity Report"
        description="พฤติกรรมผู้ใช้บน Public Site"
        actions={
          <button onClick={() => setPreviewing(true)} className="bg-[#0B5ED7] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5">
            <FileDown className="w-4 h-4" /> Export PDF
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="จาก"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" /></Field>
        <Field label="ถึง"><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" /></Field>
        <Field label="ประเภทกิจกรรม">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300">
            <option value="all">ทั้งหมด</option>
            {Object.entries(ACT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field label="Device">
          <select value={device} onChange={(e) => setDevice(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300">
            <option value="all">ทั้งหมด</option><option>Desktop</option><option>Mobile</option><option>Tablet</option>
          </select>
        </Field>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Session</th>
                <th className="text-left px-4 py-3 font-medium">กิจกรรม</th>
                <th className="text-left px-4 py-3 font-medium">หน้า</th>
                <th className="text-left px-4 py-3 font-medium">Device</th>
                <th className="text-left px-4 py-3 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {view.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">ไม่พบข้อมูล</td></tr>}
              {view.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.session}</td>
                  <td className="px-4 py-3 text-gray-900">{ACT_LABEL[r.type]}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{r.page}</td>
                  <td className="px-4 py-3 text-gray-600">{r.device}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 text-sm">
          <span className="text-gray-500">{filtered.length} รายการ</span>
          <Pager page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {previewing && (
        <PdfPreview
          title="User Activity Report"
          range={`${from} ถึง ${to}`}
          columns={["Session", "กิจกรรม", "หน้า", "Device", "Timestamp"]}
          rows={filtered.slice(0, 20).map((r) => [r.session, ACT_LABEL[r.type], r.page, r.device, r.timestamp])}
          totalCount={filtered.length}
          onClose={() => setPreviewing(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────── Verification Report ───────────────────────────
const VR_SEED = Array.from({ length: 22 }, (_, i) => {
  const provs = ["AIS", "True", "dtac", "NT"];
  const sts = ["Active", "Active", "Active", "Inactive", "Error"];
  return {
    id: `vr${i + 1}`,
    name: `${provs[i % 4]} Package ${100 + i}`,
    provider: provs[i % 4],
    url: `https://www.${provs[i % 4].toLowerCase()}.co.th/p/${100 + i}`,
    result: sts[i % 5],
    checkedAt: `2026-04-${String((i % 26) + 1).padStart(2, "0")} 03:00`,
  };
});

export function ReportVerificationPage() {
  const [from, setFrom] = useState("2026-04-01");
  const [to, setTo] = useState("2026-04-26");
  const [prov, setProv] = useState("all");
  const [st, setSt] = useState("all");
  const [page, setPage] = useState(1);
  const [previewing, setPreviewing] = useState(false);
  const PER = 10;

  const filtered = useMemo(() => VR_SEED.filter((r) =>
    (prov === "all" || r.provider === prov) &&
    (st === "all" || r.result === st)
  ), [prov, st]);

  const view = filtered.slice((page - 1) * PER, page * PER);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));

  return (
    <div>
      <PageHeader
        title="Package Verification Report"
        description="ผลการตรวจสอบแพ็กเกจสะสม"
        actions={
          <button onClick={() => setPreviewing(true)} className="bg-[#0B5ED7] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5">
            <FileDown className="w-4 h-4" /> Export PDF
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="จาก"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" /></Field>
        <Field label="ถึง"><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" /></Field>
        <Field label="Provider">
          <select value={prov} onChange={(e) => setProv(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300">
            <option value="all">ทั้งหมด</option><option>AIS</option><option>True</option><option>dtac</option><option>NT</option>
          </select>
        </Field>
        <Field label="ผล">
          <select value={st} onChange={(e) => setSt(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300">
            <option value="all">ทั้งหมด</option><option>Active</option><option>Inactive</option><option>Error</option>
          </select>
        </Field>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">แพ็กเกจ</th>
              <th className="text-left px-4 py-3 font-medium">Provider</th>
              <th className="text-left px-4 py-3 font-medium">URL</th>
              <th className="text-left px-4 py-3 font-medium">ผล</th>
              <th className="text-left px-4 py-3 font-medium">ตรวจสอบเมื่อ</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{r.name}</td>
                <td className="px-4 py-3 text-gray-700">{r.provider}</td>
                <td className="px-4 py-3 text-blue-600 truncate max-w-[200px] font-mono text-xs">{r.url}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.result === "Active" ? "bg-emerald-50 text-emerald-700" : r.result === "Error" ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-600"}`}>{r.result}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{r.checkedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 text-sm">
          <span className="text-gray-500">{filtered.length} รายการ</span>
          <Pager page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {previewing && (
        <PdfPreview
          title="Package Verification Report"
          range={`${from} ถึง ${to}`}
          columns={["แพ็กเกจ", "Provider", "URL", "ผล", "ตรวจสอบเมื่อ"]}
          rows={filtered.slice(0, 20).map((r) => [r.name, r.provider, r.url, r.result, r.checkedAt])}
          totalCount={filtered.length}
          onClose={() => setPreviewing(false)}
        />
      )}
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function PdfPreview({
  title, range, columns, rows, totalCount, onClose,
}: {
  title: string; range: string; columns: string[]; rows: (string | number)[][]; totalCount: number; onClose: () => void;
}) {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("th-TH");

  const download = () => {
    toast.success("กำลังดาวน์โหลด PDF... (mock)");
    setTimeout(() => onClose(), 600);
  };

  return (
    <Modal title="Preview รายงาน PDF" onClose={onClose} wide>
      <div className="bg-gray-100 p-4 rounded-lg max-h-[70vh] overflow-auto">
        <div className="bg-white shadow-md mx-auto max-w-3xl p-8 text-sm" style={{ aspectRatio: "210/297", minHeight: "auto" }}>
          {/* PDF Header */}
          <div className="flex items-start justify-between border-b-2 border-[#0B5ED7] pb-3 mb-5">
            <div>
              <img src={logoImg} alt="" className="h-8 mb-2 mix-blend-multiply" />
              <h2 className="text-lg font-medium text-gray-900">{title}</h2>
              <div className="text-xs text-gray-600 mt-1">ช่วงวันที่: {range}</div>
            </div>
            <div className="text-xs text-gray-600 text-right">
              <div>วันที่ Export: {today}</div>
              <div>ผู้ Export: {user?.name}</div>
              <div>ทั้งหมด: {totalCount} รายการ</div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="text-left px-2 py-1.5 border border-gray-200 font-medium text-gray-700">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-2 py-1.5 border border-gray-200 text-gray-800 truncate max-w-[140px]">{String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length < totalCount && (
            <div className="text-xs text-gray-500 mt-2 italic">แสดง {rows.length} จาก {totalCount} รายการ — ฉบับเต็มจะอยู่ใน PDF</div>
          )}

          {/* PDF Footer */}
          <div className="border-t border-gray-200 mt-6 pt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Export: {today} • โดย {user?.name}</span>
            <span>หน้า 1 / 1</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300">ยกเลิก</button>
        <button onClick={download} className="px-4 py-2 text-sm rounded-lg bg-[#0B5ED7] text-white hover:bg-[#094fb8] flex items-center gap-1.5">
          <Printer className="w-4 h-4" /> ดาวน์โหลด PDF
        </button>
      </div>
    </Modal>
  );
}
