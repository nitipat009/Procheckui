import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { PageHeader } from "../components/Shell";
import { Modal, Pager } from "./UsersPage";
import { useAuth } from "../auth";
import { toast } from "sonner";

type Status = "Draft" | "Published" | "Archived";

// ─────────────────────────── Information ───────────────────────────
type Info = { id: string; title: string; published: boolean; updatedAt: string; content: string };
const INFO_SEED: Info[] = [
  { id: "i1", title: "เกี่ยวกับเรา", published: true, updatedAt: "2026-04-12", content: "Pro Check เป็นแพลตฟอร์ม..." },
  { id: "i2", title: "นโยบายความเป็นส่วนตัว", published: true, updatedAt: "2026-03-20", content: "เราเคารพความเป็นส่วนตัว..." },
  { id: "i3", title: "ข้อกำหนดการใช้งาน", published: true, updatedAt: "2026-02-15", content: "การใช้งาน..." },
  { id: "i4", title: "ติดต่อเรา", published: false, updatedAt: "2026-04-21", content: "อีเมล: contact@procheck.co.th" },
];

export function CmsInformationPage() {
  const { can } = useAuth();
  const writable = can("cms", "write");
  const [rows, setRows] = useState<Info[]>(INFO_SEED);
  const [editing, setEditing] = useState<Info | null>(null);

  const save = (r: Info) => {
    setRows((p) => p.map((x) => (x.id === r.id ? r : x)));
    toast.success("บันทึกสำเร็จ");
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Information" description="จัดการหน้าข้อมูลคงที่ของเว็บไซต์" />
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">ชื่อหน้า</th>
              <th className="text-left px-4 py-3 font-medium">สถานะ</th>
              <th className="text-left px-4 py-3 font-medium">แก้ไขล่าสุด</th>
              <th className="text-right px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{r.title}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${r.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                    {r.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{r.updatedAt}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => writable && setEditing(r)}
                    disabled={!writable}
                    className="text-[#0B5ED7] hover:underline text-sm disabled:opacity-40"
                  >
                    {writable ? "แก้ไข" : "ดู"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <InfoEditor item={editing} onCancel={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function InfoEditor({ item, onCancel, onSave }: { item: Info; onCancel: () => void; onSave: (i: Info) => void }) {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [published, setPublished] = useState(item.published);

  const finish = (asPub: boolean) => {
    onSave({ ...item, title, content, published: asPub, updatedAt: new Date().toISOString().slice(0, 10) });
  };

  return (
    <Modal title={`แก้ไข: ${item.title}`} onClose={onCancel} wide>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1.5">ชื่อหน้า</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" />
        </div>
        <RichTextEditor value={content} onChange={setContent} />
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            แสดงผลบนเว็บไซต์
          </label>
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300">ยกเลิก</button>
            <button onClick={() => finish(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300">Save Draft</button>
            <button onClick={() => finish(true)} className="px-4 py-2 text-sm rounded-lg bg-[#0B5ED7] text-white hover:bg-[#094fb8]">Publish</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200 text-xs">
        {["B", "I", "U", "H2", "H3", "•", "❝", "🖼"].map((t) => (
          <button key={t} type="button" className="w-7 h-7 rounded hover:bg-white text-gray-700">{t}</button>
        ))}
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full min-h-[180px] px-3 py-2 text-sm focus:outline-none" />
    </div>
  );
}

// ─────────────────────────── Blogs ───────────────────────────
type Blog = {
  id: string; title: string; slug: string; category: string; tags: string[];
  status: Status; publishAt: string; hero?: string; content: string;
};

const CATEGORIES = ["ข่าวสาร", "บทความ", "โปรโมชั่น", "รีวิว"];

const BLOG_SEED: Blog[] = Array.from({ length: 12 }, (_, i) => ({
  id: `b${i + 1}`,
  title: ["เปรียบเทียบแพ็กเกจ 5G ปี 2026", "เลือก Fiber ให้เหมาะกับครอบครัว", "Roaming ญี่ปุ่นค่ายไหนดี", "วิธีลด bill ค่ามือถือ"][i % 4] + ` #${i + 1}`,
  slug: `blog-post-${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  tags: ["5G", "AIS", "True"].slice(0, (i % 3) + 1),
  status: (["Draft", "Published", "Archived"] as Status[])[i % 3],
  publishAt: `2026-0${(i % 4) + 1}-1${(i % 9) + 1}`,
  content: "เนื้อหาบทความ...",
}));

export function CmsBlogsPage() {
  const { can } = useAuth();
  const writable = can("cms", "write");
  const [rows, setRows] = useState<Blog[]>(BLOG_SEED);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [st, setSt] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Blog | "new" | null>(null);
  const [delTarget, setDelTarget] = useState<Blog | null>(null);
  const PER = 6;

  const filtered = useMemo(() => rows.filter((r) =>
    (!q || r.title.toLowerCase().includes(q.toLowerCase())) &&
    (cat === "all" || r.category === cat) &&
    (st === "all" || r.status === st)
  ), [rows, q, cat, st]);

  const view = filtered.slice((page - 1) * PER, page * PER);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));

  const save = (b: Blog) => {
    setRows((p) => (p.some((x) => x.id === b.id) ? p.map((x) => (x.id === b.id ? b : x)) : [b, ...p]));
    toast.success("บันทึกสำเร็จ");
    setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Blogs"
        description="บทความและข่าวสาร"
        actions={writable && (
          <button onClick={() => setEditing("new")} className="bg-[#0B5ED7] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> สร้างบทความ
          </button>
        )}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="ค้นหาตามหัวข้อ" className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-gray-300">
          <option value="all">ทุกหมวด</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={st} onChange={(e) => setSt(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-gray-300">
          <option value="all">ทุกสถานะ</option>
          <option>Draft</option><option>Published</option><option>Archived</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">หัวข้อ</th>
                <th className="text-left px-4 py-3 font-medium">หมวด</th>
                <th className="text-left px-4 py-3 font-medium">สถานะ</th>
                <th className="text-left px-4 py-3 font-medium">เผยแพร่</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {view.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">ไม่พบข้อมูล</td></tr>}
              {view.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{r.title}</td>
                  <td className="px-4 py-3 text-gray-600">{r.category}</td>
                  <td className="px-4 py-3">
                    <StatusPill s={r.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.publishAt}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(r)} className="text-[#0B5ED7] hover:bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center"><Pencil className="w-4 h-4" /></button>
                      {writable && <button onClick={() => setDelTarget(r)} className="text-red-600 hover:bg-red-50 w-8 h-8 rounded-lg flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>}
                    </div>
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

      {editing && <BlogEditor initial={editing === "new" ? null : editing} onCancel={() => setEditing(null)} onSave={save} readOnly={!writable} />}
      {delTarget && (
        <Modal title="ยืนยันการลบ" onClose={() => setDelTarget(null)}>
          <p className="text-sm">ลบบทความ "{delTarget.title}"?</p>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setDelTarget(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-300">ยกเลิก</button>
            <button onClick={() => { setRows((p) => p.filter((x) => x.id !== delTarget.id)); setDelTarget(null); toast.success("ลบสำเร็จ"); }} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white">ลบ</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatusPill({ s }: { s: Status }) {
  const c = s === "Published" ? "bg-emerald-50 text-emerald-700"
    : s === "Draft" ? "bg-amber-50 text-amber-700"
    : "bg-gray-100 text-gray-600";
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${c}`}>{s}</span>;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9ก-๙\s-]/g, "").replace(/\s+/g, "-");
}

function BlogEditor({ initial, onCancel, onSave, readOnly }: { initial: Blog | null; onCancel: () => void; onSave: (b: Blog) => void; readOnly: boolean }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [hero, setHero] = useState(initial?.hero || "");
  const [content, setContent] = useState(initial?.content || "");
  const [status, setStatus] = useState<Status>(initial?.status || "Draft");
  const [publishAt, setPublishAt] = useState(initial?.publishAt || new Date().toISOString().slice(0, 10));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initial?.id || `b_${Date.now()}`,
      title, slug: slug || slugify(title), category, tags, hero, content, status, publishAt,
    });
  };

  return (
    <Modal title={initial ? "แก้ไขบทความ" : "สร้างบทความใหม่"} onClose={onCancel} wide>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">หัวข้อ</label>
            <input disabled={readOnly} value={title} onChange={(e) => { setTitle(e.target.value); if (!initial) setSlug(slugify(e.target.value)); }} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Slug (URL)</label>
            <input disabled={readOnly} value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 font-mono" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">หมวดหมู่</label>
            <select disabled={readOnly} value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">วันที่เผยแพร่</label>
            <input type="date" disabled={readOnly} value={publishAt} onChange={(e) => setPublishAt(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5">แท็ก</label>
          <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-lg">
            {tags.map((t) => (
              <span key={t} className="bg-blue-50 text-[#0B5ED7] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                {t}
                {!readOnly && <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} className="hover:text-red-600">×</button>}
              </span>
            ))}
            {!readOnly && (
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    setTags([...new Set([...tags, tagInput.trim()])]);
                    setTagInput("");
                  }
                }}
                placeholder="พิมพ์แท็กแล้วกด Enter"
                className="flex-1 min-w-[120px] outline-none text-sm px-1"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5">Hero Image (URL)</label>
          <input disabled={readOnly} value={hero} onChange={(e) => setHero(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" />
          {hero && <img src={hero} alt="" className="mt-2 h-32 rounded-lg object-cover" />}
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5">เนื้อหา</label>
          <RichTextEditor value={content} onChange={readOnly ? () => {} : setContent} />
        </div>

        <div className="flex items-center justify-between pt-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} disabled={readOnly} className="px-3 py-2 text-sm rounded-lg border border-gray-300">
            <option>Draft</option><option>Published</option><option>Archived</option>
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300">ปิด</button>
            {!readOnly && <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-[#0B5ED7] text-white hover:bg-[#094fb8]">บันทึก</button>}
          </div>
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────── FAQ ───────────────────────────
type Faq = { id: string; category: string; question: string; answer: string; order: number; active: boolean };

const FAQ_CATS = ["การใช้งาน", "การเปรียบเทียบ", "บัญชี", "อื่นๆ"];
const FAQ_SEED: Faq[] = [
  { id: "f1", category: "การใช้งาน", question: "ใช้งานเว็บไซต์อย่างไร?", answer: "ค้นหาแพ็กเกจที่ต้องการ...", order: 1, active: true },
  { id: "f2", category: "การเปรียบเทียบ", question: "เปรียบเทียบได้สูงสุดกี่แพ็กเกจ?", answer: "Desktop 3, Mobile 2", order: 2, active: true },
  { id: "f3", category: "บัญชี", question: "ต้องสมัครสมาชิกหรือไม่?", answer: "ไม่จำเป็น", order: 3, active: false },
];

export function CmsFaqPage() {
  const { can } = useAuth();
  const writable = can("cms", "write");
  const [rows, setRows] = useState<Faq[]>(FAQ_SEED);
  const [editing, setEditing] = useState<Faq | "new" | null>(null);

  const save = (f: Faq) => {
    setRows((p) => (p.some((x) => x.id === f.id) ? p.map((x) => x.id === f.id ? f : x) : [...p, f]));
    toast.success("บันทึกสำเร็จ");
    setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="คำถามที่พบบ่อย"
        actions={writable && (
          <button onClick={() => setEditing("new")} className="bg-[#0B5ED7] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> เพิ่ม FAQ
          </button>
        )}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium w-16">ลำดับ</th>
              <th className="text-left px-4 py-3 font-medium">คำถาม</th>
              <th className="text-left px-4 py-3 font-medium">หมวด</th>
              <th className="text-left px-4 py-3 font-medium">สถานะ</th>
              <th className="text-right px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.sort((a, b) => a.order - b.order).map((r) => (
              <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">#{r.order}</td>
                <td className="px-4 py-3 text-gray-900">{r.question}</td>
                <td className="px-4 py-3 text-gray-600">{r.category}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${r.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                    {r.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(r)} className="text-[#0B5ED7] hover:underline">{writable ? "แก้ไข" : "ดู"}</button>
                  {writable && (
                    <button onClick={() => { setRows((p) => p.filter((x) => x.id !== r.id)); toast.success("ลบสำเร็จ"); }} className="ml-3 text-red-600 hover:underline">ลบ</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <FaqEditor initial={editing === "new" ? null : editing} onCancel={() => setEditing(null)} onSave={save} readOnly={!writable} maxOrder={rows.length} />
      )}
    </div>
  );
}

function FaqEditor({ initial, onCancel, onSave, readOnly, maxOrder }: any) {
  const [q, setQ] = useState(initial?.question || "");
  const [a, setA] = useState(initial?.answer || "");
  const [cat, setCat] = useState(initial?.category || FAQ_CATS[0]);
  const [order, setOrder] = useState(initial?.order || maxOrder + 1);
  const [active, setActive] = useState(initial?.active ?? true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: initial?.id || `f_${Date.now()}`, question: q, answer: a, category: cat, order, active });
  };

  return (
    <Modal title={initial ? "แก้ไข FAQ" : "เพิ่ม FAQ"} onClose={onCancel} wide>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">หมวดหมู่</label>
            <select disabled={readOnly} value={cat} onChange={(e) => setCat(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300">
              {FAQ_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">ลำดับการแสดง</label>
            <input type="number" disabled={readOnly} value={order} onChange={(e) => setOrder(+e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1.5">คำถาม</label>
          <input disabled={readOnly} value={q} onChange={(e) => setQ(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1.5">คำตอบ</label>
          <RichTextEditor value={a} onChange={readOnly ? () => {} : setA} />
        </div>
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" disabled={readOnly} checked={active} onChange={(e) => setActive(e.target.checked)} /> Active
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300">ปิด</button>
            {!readOnly && <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-[#0B5ED7] text-white">บันทึก</button>}
          </div>
        </div>
      </form>
    </Modal>
  );
}
