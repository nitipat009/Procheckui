import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, KeyRound, Search, X } from "lucide-react";
import { PageHeader } from "../components/Shell";
import { toast } from "sonner";

type Row = {
  id: string;
  name: string;
  username: string;
  role: "Admin" | "Editor" | "Viewer";
  active: boolean;
  createdAt: string;
};

const SEED: Row[] = [
  { id: "u1", name: "สมชาย ใจดี", username: "admin", role: "Admin", active: true, createdAt: "2025-12-01" },
  { id: "u2", name: "สมหญิง บรรณาธิการ", username: "editor", role: "Editor", active: true, createdAt: "2026-01-12" },
  { id: "u3", name: "ผู้ดูข้อมูล", username: "viewer", role: "Viewer", active: true, createdAt: "2026-02-08" },
  { id: "u4", name: "พนักงาน A", username: "staff_a", role: "Editor", active: false, createdAt: "2026-03-01" },
  { id: "u5", name: "พนักงาน B", username: "staff_b", role: "Viewer", active: true, createdAt: "2026-03-21" },
  { id: "u6", name: "เจ้าหน้าที่ตรวจสอบ", username: "qa_lead", role: "Editor", active: true, createdAt: "2026-04-02" },
];

export function UsersPage() {
  const [rows, setRows] = useState<Row[]>(SEED);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const PER = 5;

  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [confirmDel, setConfirmDel] = useState<Row | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (q && !(`${r.name} ${r.username}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (role !== "all" && r.role !== role) return false;
      if (status !== "all" && r.active !== (status === "active")) return false;
      return true;
    });
  }, [rows, q, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const view = filtered.slice((page - 1) * PER, page * PER);

  const upsert = (r: Row) => {
    setRows((prev) => {
      if (prev.some((x) => x.id === r.id)) return prev.map((x) => (x.id === r.id ? r : x));
      return [r, ...prev];
    });
    toast.success("บันทึกสำเร็จ");
    setEditing(null);
  };

  const remove = (r: Row) => {
    setRows((prev) => prev.filter((x) => x.id !== r.id));
    toast.success(`ลบ ${r.username} สำเร็จ`);
    setConfirmDel(null);
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        description="จัดการผู้ใช้งานและสิทธิ์เข้าถึง"
        actions={
          <button
            onClick={() => setEditing("new")}
            className="bg-[#0B5ED7] hover:bg-[#094fb8] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> สร้าง User
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="ค้นหาชื่อหรือ username"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]/30"
          />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-gray-300">
          <option value="all">ทุก Role</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-gray-300">
          <option value="all">ทุกสถานะ</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ชื่อ-นามสกุล</th>
                <th className="text-left px-4 py-3 font-medium">Username</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">สถานะ</th>
                <th className="text-left px-4 py-3 font-medium">วันที่สร้าง</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {view.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">ไม่พบข้อมูล</td></tr>
              )}
              {view.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">{r.username}</td>
                  <td className="px-4 py-3"><RoleBadge role={r.role} /></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${r.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${r.active ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {r.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <IconBtn onClick={() => setEditing(r)} title="แก้ไข"><Pencil className="w-4 h-4" /></IconBtn>
                      <IconBtn onClick={() => toast.success(`ส่ง reset password ให้ ${r.username}`)} title="Reset Password"><KeyRound className="w-4 h-4" /></IconBtn>
                      <IconBtn onClick={() => setConfirmDel(r)} title="ลบ" danger><Trash2 className="w-4 h-4" /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
          <div className="text-gray-500">{filtered.length} รายการ</div>
          <Pager page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {editing && (
        <UserForm
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={upsert}
        />
      )}
      {confirmDel && (
        <ConfirmDelete
          name={confirmDel.username}
          onCancel={() => setConfirmDel(null)}
          onConfirm={() => remove(confirmDel)}
        />
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const c = role === "Admin" ? "bg-violet-50 text-violet-700"
    : role === "Editor" ? "bg-blue-50 text-[#0B5ED7]"
    : "bg-gray-100 text-gray-600";
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${c}`}>{role}</span>;
}

function IconBtn({ children, onClick, title, danger }: any) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? "text-red-600 hover:bg-red-50" : "text-gray-500 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );
}

export function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="px-3 py-1.5 rounded-md border border-gray-200 disabled:opacity-40">ก่อนหน้า</button>
      <span className="px-3 text-gray-600">{page} / {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="px-3 py-1.5 rounded-md border border-gray-200 disabled:opacity-40">ถัดไป</button>
    </div>
  );
}

function UserForm({ initial, onCancel, onSave }: { initial: Row | null; onCancel: () => void; onSave: (r: Row) => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [username, setUsername] = useState(initial?.username || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Row["role"]>(initial?.role || "Viewer");
  const [active, setActive] = useState(initial?.active ?? true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;
    if (!initial && !password) {
      toast.error("กรุณากรอกรหัสผ่านสำหรับผู้ใช้ใหม่");
      return;
    }
    onSave({
      id: initial?.id || `u_${Date.now()}`,
      name: name.trim(),
      username: username.trim(),
      role,
      active,
      createdAt: initial?.createdAt || new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <Modal title={initial ? "แก้ไข User" : "สร้าง User ใหม่"} onClose={onCancel}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="ชื่อ-นามสกุล"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
        <Field label="Username"><input value={username} onChange={(e) => setUsername(e.target.value)} className={inputCls} /></Field>
        <Field label={initial ? "Password (เว้นว่างถ้าไม่เปลี่ยน)" : "Password"}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Role">
          <select value={role} onChange={(e) => setRole(e.target.value as any)} className={inputCls}>
            <option>Admin</option><option>Editor</option><option>Viewer</option>
          </select>
        </Field>
        <Field label="สถานะ">
          <button type="button" onClick={() => setActive(!active)} className={`relative w-12 h-6 rounded-full transition-colors ${active ? "bg-[#0B5ED7]" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 ${active ? "left-6" : "left-0.5"} w-5 h-5 bg-white rounded-full transition-all`} />
          </button>
          <span className="ml-3 text-sm text-gray-600">{active ? "Active" : "Inactive"}</span>
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300">ยกเลิก</button>
          <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-[#0B5ED7] text-white hover:bg-[#094fb8]">บันทึก</button>
        </div>
      </form>
    </Modal>
  );
}

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]/30";

function Field({ label, children }: any) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function Modal({ title, onClose, children, wide }: any) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl shadow-xl w-full ${wide ? "max-w-4xl" : "max-w-md"} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDelete({ name, onCancel, onConfirm }: any) {
  return (
    <Modal title="ยืนยันการลบ" onClose={onCancel}>
      <p className="text-sm text-gray-700">คุณต้องการลบ <span className="font-medium">{name}</span> ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
      <div className="flex justify-end gap-2 pt-5">
        <button onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300">ยกเลิก</button>
        <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white">ลบ</button>
      </div>
    </Modal>
  );
}
