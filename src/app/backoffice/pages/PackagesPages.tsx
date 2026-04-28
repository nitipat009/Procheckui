import { useMemo, useState } from "react";
import { Search, Play, FileText, Pencil, RefreshCw, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { PageHeader } from "../components/Shell";
import { Modal, Pager } from "./UsersPage";
import { useAuth } from "../auth";
import { toast } from "sonner";

type VerifStatus = "Active" | "Inactive" | "Pending" | "Error";

type Pkg = {
  id: string;
  name: string;
  provider: string;
  type: "Mobile" | "Internet" | "Roaming";
  price: number;
  providerUrl: string;
  status: VerifStatus;
  lastChecked: string;
  result: string;
  error?: string;
};

const PROVIDERS = ["AIS", "True", "dtac", "NT"];

const SEED: Pkg[] = Array.from({ length: 18 }, (_, i) => {
  const status = (["Active", "Active", "Active", "Inactive", "Pending", "Error"] as VerifStatus[])[i % 6];
  return {
    id: `p${i + 1}`,
    name: `${PROVIDERS[i % 4]} Package ${100 + i}`,
    provider: PROVIDERS[i % 4],
    type: (["Mobile", "Internet", "Roaming"] as const)[i % 3],
    price: 299 + (i * 50),
    providerUrl: `https://www.${PROVIDERS[i % 4].toLowerCase()}.co.th/packages/${100 + i}`,
    status,
    lastChecked: `2026-04-${String((i % 25) + 1).padStart(2, "0")} 03:00`,
    result: status === "Active" ? "พบ" : status === "Inactive" ? "ไม่พบ" : status === "Error" ? "Error" : "รอตรวจ",
    error: status === "Error" ? "Connection timeout (30s)" : undefined,
  };
});

export function PackageListPage() {
  const { can } = useAuth();
  const writable = can("packages", "write");
  const [rows, setRows] = useState<Pkg[]>(SEED);
  const [q, setQ] = useState("");
  const [prov, setProv] = useState("all");
  const [type, setType] = useState("all");
  const [st, setSt] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const PER = 8;

  const filtered = useMemo(() => rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q.toLowerCase())) &&
    (prov === "all" || r.provider === prov) &&
    (type === "all" || r.type === type) &&
    (st === "all" || r.status === st)
  ), [rows, q, prov, type, st]);

  const view = filtered.slice((page - 1) * PER, page * PER);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));

  const save = (p: Pkg) => {
    setRows((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    toast.success("บันทึกสำเร็จ");
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Package List" description="แพ็กเกจทั้งหมดในระบบ" />

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="ค้นหาแพ็กเกจ" className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300" />
        </div>
        <select value={prov} onChange={(e) => setProv(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-gray-300">
          <option value="all">ทุก Provider</option>
          {PROVIDERS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-gray-300">
          <option value="all">ทุกประเภท</option>
          <option>Mobile</option><option>Internet</option><option>Roaming</option>
        </select>
        <select value={st} onChange={(e) => setSt(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-gray-300">
          <option value="all">ทุกสถานะ</option>
          <option>Active</option><option>Inactive</option><option>Pending</option><option>Error</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ชื่อแพ็กเกจ</th>
                <th className="text-left px-4 py-3 font-medium">Provider</th>
                <th className="text-left px-4 py-3 font-medium">ราคา</th>
                <th className="text-left px-4 py-3 font-medium">Verification</th>
                <th className="text-left px-4 py-3 font-medium">ตรวจสอบล่าสุด</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {view.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-700">{r.provider}</td>
                  <td className="px-4 py-3 text-gray-900">฿{r.price.toLocaleString()}</td>
                  <td className="px-4 py-3"><VerifBadge s={r.status} /></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{r.lastChecked}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(r)} className="text-[#0B5ED7] hover:bg-blue-50 w-8 h-8 rounded-lg inline-flex items-center justify-center">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
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

      {editing && (
        <Modal title="แก้ไขแพ็กเกจ" onClose={() => setEditing(null)}>
          <PkgForm pkg={editing} onSave={save} onCancel={() => setEditing(null)} readOnly={!writable} />
        </Modal>
      )}
    </div>
  );
}

function PkgForm({ pkg, onSave, onCancel, readOnly }: { pkg: Pkg; onSave: (p: Pkg) => void; onCancel: () => void; readOnly: boolean }) {
  const [url, setUrl] = useState(pkg.providerUrl);
  const [price, setPrice] = useState(pkg.price);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...pkg, providerUrl: url, price }); }} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1.5">ชื่อแพ็กเกจ</label>
        <div className="px-3 py-2 text-sm bg-gray-50 rounded-lg">{pkg.name}</div>
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1.5">ราคา</label>
        <input type="number" disabled={readOnly} value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1.5">Provider URL (สำหรับ scraping)</label>
        <input disabled={readOnly} value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 font-mono" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300">ปิด</button>
        {!readOnly && <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-[#0B5ED7] text-white">บันทึก</button>}
      </div>
    </form>
  );
}

function VerifBadge({ s }: { s: VerifStatus }) {
  const map = {
    Active: { c: "bg-emerald-50 text-emerald-700", I: CheckCircle2 },
    Inactive: { c: "bg-gray-100 text-gray-600", I: XCircle },
    Pending: { c: "bg-amber-50 text-amber-700", I: Clock },
    Error: { c: "bg-red-50 text-red-700", I: AlertCircle },
  } as const;
  const { c, I } = map[s];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${c}`}>
      <I className="w-3 h-3" /> {s}
    </span>
  );
}

// ─────────────────────────── Verification Dashboard ───────────────────────────

const SEED_VERIF: Pkg[] = SEED;

export function VerificationPage() {
  const { can } = useAuth();
  const writable = can("verification", "write");
  const [rows, setRows] = useState<Pkg[]>(SEED_VERIF);
  const [running, setRunning] = useState(false);
  const [logFor, setLogFor] = useState<Pkg | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [intervalH, setIntervalH] = useState(24);

  const summary = useMemo(() => ({
    Active: rows.filter((r) => r.status === "Active").length,
    Inactive: rows.filter((r) => r.status === "Inactive").length,
    Error: rows.filter((r) => r.status === "Error").length,
    Pending: rows.filter((r) => r.status === "Pending").length,
  }), [rows]);

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  const runNow = async () => {
    setRunning(true);
    toast.info("กำลังรัน Verification...");
    await new Promise((r) => setTimeout(r, 1500));
    setRows((p) => p.map((x) => ({
      ...x,
      lastChecked: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: Math.random() > 0.85 ? "Error" : Math.random() > 0.1 ? "Active" : "Inactive",
    } as Pkg)));
    setRunning(false);
    toast.success("Verification เสร็จสิ้น");
  };

  const next = new Date(Date.now() + intervalH * 3600 * 1000);

  return (
    <div>
      <PageHeader
        title="Verification Management"
        description="ตรวจสอบแพ็กเกจบน Provider ผ่าน Web Scraping"
        actions={writable && (
          <button onClick={runNow} disabled={running} className="bg-[#0B5ED7] hover:bg-[#094fb8] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-60">
            {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run Verification ทันที
          </button>
        )}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Active" value={summary.Active} status="Active" />
        <SummaryCard label="Inactive" value={summary.Inactive} status="Inactive" />
        <SummaryCard label="Pending" value={summary.Pending} status="Pending" />
        <SummaryCard label="Error" value={summary.Error} status="Error" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-4">
        <div className="text-sm font-medium text-gray-900">Cron Schedule:</div>
        <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg font-mono">0 0 * * *</span>
        <span className="text-sm text-gray-500">รันทุกวันเวลา <span className="font-medium text-gray-700">00:00 น.</span></span>
        <span className="text-sm text-gray-400">|</span>
        <span className="text-sm text-gray-500">รันครั้งถัดไป: <span className="font-medium text-gray-700">{(() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(0, 0, 0, 0); return d.toLocaleString("th-TH"); })()}</span></span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="text-sm font-medium">ตาราง Log การตรวจสอบ</div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-300">
            <option value="all">ทุกสถานะ</option>
            <option>Active</option><option>Inactive</option><option>Pending</option><option>Error</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">แพ็กเกจ</th>
                <th className="text-left px-4 py-3 font-medium">Provider</th>
                <th className="text-left px-4 py-3 font-medium">URL</th>
                <th className="text-left px-4 py-3 font-medium">ผล</th>
                <th className="text-left px-4 py-3 font-medium">ตรวจสอบล่าสุด</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-700">{r.provider}</td>
                  <td className="px-4 py-3 text-blue-600 truncate max-w-[200px]">
                    <a href={r.providerUrl} target="_blank" rel="noreferrer" className="hover:underline">{r.providerUrl}</a>
                  </td>
                  <td className="px-4 py-3"><VerifBadge s={r.status} /></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{r.lastChecked}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setLogFor(r)} className="text-[#0B5ED7] hover:bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1 text-xs">
                      <FileText className="w-3.5 h-3.5" /> ดู Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {logFor && <LogDrawer pkg={logFor} onClose={() => setLogFor(null)} />}
    </div>
  );
}

function SummaryCard({ label, value, status }: { label: string; value: number; status: VerifStatus }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <VerifBadge s={status} />
      </div>
      <div className="text-2xl font-medium text-gray-900 mt-2">{value}</div>
    </div>
  );
}

function LogDrawer({ pkg, onClose }: { pkg: Pkg; onClose: () => void }) {
  const history = Array.from({ length: 8 }, (_, i) => ({
    time: `2026-04-${String(26 - i).padStart(2, "0")} 03:00`,
    status: (i === 0 ? pkg.status : (Math.random() > 0.2 ? "Active" : "Error")) as VerifStatus,
    note: i === 2 ? "Connection timeout (30s)" : i === 0 && pkg.error ? pkg.error : "OK",
  }));

  return (
    <Modal title={`Log: ${pkg.name}`} onClose={onClose} wide>
      <div className="text-sm text-gray-600 mb-3">URL: <span className="font-mono text-xs">{pkg.providerUrl}</span></div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left px-3 py-2 font-medium">เวลา</th>
            <th className="text-left px-3 py-2 font-medium">ผล</th>
            <th className="text-left px-3 py-2 font-medium">รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="px-3 py-2 text-xs text-gray-600">{h.time}</td>
              <td className="px-3 py-2"><VerifBadge s={h.status} /></td>
              <td className="px-3 py-2 text-gray-600">{h.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}