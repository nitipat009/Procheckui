import { useState, useRef, useCallback } from "react";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  Upload, X, ImageIcon, ExternalLink, Eye, EyeOff,
} from "lucide-react";
import { PageHeader } from "../components/Shell";
import { Modal } from "./UsersPage";
import { useAuth } from "../auth";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type BannerStatus = "published" | "draft";
type BannerTarget = "_self" | "_blank";

type Banner = {
  id: string;
  name: string;
  image_url: string;
  href: string;
  target: BannerTarget;
  status: BannerStatus;
  order: number;
  updated_at: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const BANNER_SEED: Banner[] = [
  {
    id: "banner001",
    name: "โปรโมชั่นพิเศษ กสทช. (Slide 1)",
    image_url: "https://images.unsplash.com/photo-1616196335061-0a136e440ddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    href: "/promotions/special",
    target: "_self",
    status: "published",
    order: 1,
    updated_at: "2025-04-25T10:00:00Z",
  },
  {
    id: "banner002",
    name: "ทำไมต้องใช้ Pro Check (Slide 2)",
    image_url: "https://images.unsplash.com/photo-1725983292053-6cd7449e228e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    href: "/about",
    target: "_self",
    status: "published",
    order: 2,
    updated_at: "2025-04-24T09:00:00Z",
  },
  {
    id: "banner003",
    name: "Draft Banner (ยังไม่ publish)",
    image_url: "https://images.unsplash.com/photo-1512699126689-b59fb4e97c92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    href: "https://nbtc.go.th",
    target: "_blank",
    status: "draft",
    order: 3,
    updated_at: "2025-04-23T08:00:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
}

function isExternal(url: string) {
  return /^https?:\/\//i.test(url);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BannerStatus }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      Draft
    </span>
  );
}

// ─── Skeleton Rows ────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-t border-gray-100 animate-pulse">
      <td className="px-4 py-3"><div className="w-6 h-4 bg-gray-200 rounded" /></td>
      <td className="px-4 py-3"><div className="w-24 h-14 bg-gray-200 rounded-lg" /></td>
      <td className="px-4 py-3"><div className="w-40 h-4 bg-gray-200 rounded" /></td>
      <td className="px-4 py-3"><div className="w-32 h-4 bg-gray-200 rounded" /></td>
      <td className="px-4 py-3"><div className="w-16 h-5 bg-gray-200 rounded-full" /></td>
      <td className="px-4 py-3"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
      <td className="px-4 py-3"><div className="w-16 h-7 bg-gray-200 rounded-lg ml-auto" /></td>
    </tr>
  );
}

// ─── Image Upload Zone ────────────────────────────────────────────────────────

function ImageUploadZone({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error("รองรับเฉพาะไฟล์ JPG, PNG, WebP เท่านั้น");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        onChange(e.target?.result as string);
        setUploading(false);
      }, 600); // simulate upload
    };
    reader.onerror = () => {
      toast.error("ไม่สามารถอัปโหลดได้ กรุณาลองใหม่");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="space-y-2">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={!disabled ? handleDrop : undefined}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
          ${disabled ? "cursor-not-allowed opacity-60" : ""}
          ${dragging ? "border-[#550000] bg-[#FEF0F2]" : "border-gray-300 bg-gray-50 hover:border-[#550000] hover:bg-[#FEF0F2]/30"}`}
        style={{ aspectRatio: "16/9" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        />

        {uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80">
            <div className="w-8 h-8 border-2 border-[#550000] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">กำลังอัปโหลด...</span>
            <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#550000] rounded-full animate-[progress_0.6s_ease-in-out_forwards]" style={{ width: "70%" }} />
            </div>
          </div>
        ) : value ? (
          <>
            {/* Preview */}
            <img src={value} alt="banner preview" className="absolute inset-0 w-full h-full object-cover" />
            {/* 16:9 overlay guide */}
            <div className="absolute inset-0 border-4 border-white/30 pointer-events-none">
              <div className="absolute inset-0 border border-white/60 m-2 rounded" />
              <div className="absolute top-2 left-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded">
                16 : 9
              </div>
            </div>
            {/* Change overlay */}
            {!disabled && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                <span className="bg-white text-gray-800 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                  <Upload className="w-3.5 h-3.5" /> เปลี่ยนรูป
                </span>
              </div>
            )}
            {/* Remove btn */}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-600">คลิกหรือลากไฟล์มาวาง</span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">แนะนำ</span>
        ขนาด 1440 × 810 px ขึ้นไป (อัตราส่วน 16:9)
      </p>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? "bg-[#550000]" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
          ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

// ─── Banner Form Modal ────────────────────────────────────────────────────────

function BannerForm({
  initial,
  onCancel,
  onSave,
  readOnly,
}: {
  initial: Banner | null;
  onCancel: () => void;
  onSave: (b: Banner, asDraft: boolean) => void;
  readOnly: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [href, setHref] = useState(initial?.href ?? "");
  const [target, setTarget] = useState<BannerTarget>(initial?.target ?? "_self");
  const [published, setPublished] = useState(initial?.status === "published");
  const [isDirty, setIsDirty] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const markDirty = () => setIsDirty(true);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "กรุณากรอกชื่อ Banner";
    if (!imageUrl) e.imageUrl = "กรุณาอัปโหลดรูป Banner";
    if (!href.trim()) e.href = "กรุณากรอก href Link";
    return e;
  };

  const handleSave = (asDraft: boolean) => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const finalTarget: BannerTarget = isExternal(href) ? "_blank" : target;
    onSave({
      id: initial?.id ?? `banner_${Date.now()}`,
      name: name.trim(),
      image_url: imageUrl,
      href: href.trim(),
      target: finalTarget,
      status: asDraft ? "draft" : "published",
      order: initial?.order ?? 999,
      updated_at: new Date().toISOString(),
    }, asDraft);
  };

  const handleCancel = () => {
    if (isDirty) setConfirmCancel(true);
    else onCancel();
  };

  const field = (label: string, key: string, node: React.ReactNode) => (
    <div>
      <label className="block text-sm text-gray-700 mb-1.5">{label}</label>
      {node}
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <>
      <Modal title={initial ? "แก้ไข Banner" : "เพิ่ม Banner ใหม่"} onClose={handleCancel} wide>
        <div className="space-y-5">

          {/* ชื่อ Banner */}
          {field("ชื่อ Banner", "name",
            <input
              value={name}
              disabled={readOnly}
              onChange={(e) => { setName(e.target.value); markDirty(); setErrors((p) => ({ ...p, name: "" })); }}
              placeholder="ชื่อสำหรับระบุใน Backoffice (ไม่แสดงบน Frontend)"
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:border-[#550000]
                ${errors.name ? "border-red-400" : "border-gray-300"} ${readOnly ? "bg-gray-50" : ""}`}
            />
          )}

          {/* Banner Image */}
          {field("รูป Banner", "imageUrl",
            <ImageUploadZone value={imageUrl} onChange={(v) => { setImageUrl(v); markDirty(); setErrors((p) => ({ ...p, imageUrl: "" })); }} disabled={readOnly} />
          )}

          {/* href Link */}
          {field("href Link", "href",
            <div>
              <input
                value={href}
                disabled={readOnly}
                onChange={(e) => { setHref(e.target.value); markDirty(); setErrors((p) => ({ ...p, href: "" })); }}
                placeholder="เช่น /promotions หรือ https://example.com"
                className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:border-[#550000]
                  ${errors.href ? "border-red-400" : "border-gray-300"} ${readOnly ? "bg-gray-50" : ""}`}
              />
              {isExternal(href) && (
                <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  External URL — จะเปิดในแท็บใหม่โดยอัตโนมัติ
                </p>
              )}
            </div>
          )}

          {/* เปิดใน + สถานะ */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">เปิดใน</label>
              <div className="flex gap-4">
                {([["_self", "หน้าเดิม"], ["_blank", "แท็บใหม่"]] as [BannerTarget, string][]).map(([val, label]) => (
                  <label key={val} className={`flex items-center gap-2 text-sm cursor-pointer ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}>
                    <input
                      type="radio"
                      name="target"
                      value={val}
                      disabled={readOnly || isExternal(href)}
                      checked={isExternal(href) ? val === "_blank" : target === val}
                      onChange={() => { setTarget(val); markDirty(); }}
                      className="accent-[#550000]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">สถานะ</label>
              <div className="flex items-center gap-3">
                <Toggle checked={published} onChange={(v) => { setPublished(v); markDirty(); }} disabled={readOnly} />
                <span className={`text-sm ${published ? "text-emerald-700" : "text-gray-500"}`}>
                  {published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!readOnly ? (
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button type="button" onClick={handleCancel}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                ยกเลิก
              </button>
              <button type="button" onClick={() => handleSave(true)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                บันทึก Draft
              </button>
              <button type="button" onClick={() => handleSave(false)}
                className="px-5 py-2 text-sm rounded-lg bg-[#550000] text-white hover:bg-[#3D0000] transition-colors">
                Publish
              </button>
            </div>
          ) : (
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={onCancel}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300">ปิด</button>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirm cancel */}
      {confirmCancel && (
        <Modal title="ยืนยันการยกเลิก" onClose={() => setConfirmCancel(false)}>
          <p className="text-sm text-gray-700">มีการแก้ไขที่ยังไม่ได้บันทึก ต้องการออกโดยไม่บันทึกใช่หรือไม่?</p>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setConfirmCancel(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300">กลับ</button>
            <button onClick={onCancel}
              className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">ออกโดยไม่บันทึก</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ banner, onConfirm, onClose }: { banner: Banner; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal title="ยืนยันการลบ" onClose={onClose}>
      <p className="text-sm text-gray-700">
        ต้องการลบ Banner <span className="font-medium text-gray-900">"{banner.name}"</span> ใช่หรือไม่?
      </p>
      <p className="text-xs text-red-500 mt-1">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
      <div className="flex justify-end gap-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">ยกเลิก</button>
        <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">ลบ</button>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type FilterTab = "all" | "published" | "draft";

export function CmsBannerPage() {
  const { can } = useAuth();
  const writable = can("cms", "write");

  const [rows, setRows] = useState<Banner[]>(() =>
    [...BANNER_SEED].sort((a, b) => a.order - b.order)
  );
  const [filter, setFilter] = useState<FilterTab>("all");
  const [editing, setEditing] = useState<Banner | "new" | null>(null);
  const [delTarget, setDelTarget] = useState<Banner | null>(null);
  const [loading] = useState(false);

  const publishedCount = rows.filter((r) => r.status === "published").length;

  const filtered = rows.filter((r) => {
    if (filter === "published") return r.status === "published";
    if (filter === "draft") return r.status === "draft";
    return true;
  });

  // ── Reorder ──
  const move = (id: string, dir: "up" | "down") => {
    setRows((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((r) => r.id === id);
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const next = [...sorted];
      [next[idx].order, next[swapIdx].order] = [next[swapIdx].order, next[idx].order];
      return next;
    });
  };

  // ── Save ──
  const save = (b: Banner, asDraft: boolean) => {
    const finalStatus = asDraft ? "draft" : "published";
    const toSave = { ...b, status: finalStatus as BannerStatus };

    setRows((prev) => {
      if (prev.some((x) => x.id === toSave.id)) {
        return prev.map((x) => (x.id === toSave.id ? toSave : x));
      }
      const maxOrder = Math.max(0, ...prev.map((x) => x.order));
      return [...prev, { ...toSave, order: maxOrder + 1 }];
    });

    toast.success(asDraft ? "บันทึก Draft แล้ว" : "เผยแพร่ Banner แล้ว", {
      duration: 3000,
    });
    setEditing(null);
  };

  // ── Delete ──
  const confirmDelete = () => {
    if (!delTarget) return;
    setRows((prev) => {
      const next = prev.filter((x) => x.id !== delTarget.id);
      return next.map((r, i) => ({ ...r, order: i + 1 }));
    });
    toast.success("ลบ Banner แล้ว");
    setDelTarget(null);
  };

  const TABS: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "ทั้งหมด", count: rows.length },
    { key: "published", label: "Published", count: rows.filter((r) => r.status === "published").length },
    { key: "draft", label: "Draft", count: rows.filter((r) => r.status === "draft").length },
  ];

  const sortedFiltered = [...filtered].sort((a, b) => a.order - b.order);

  return (
    <div>
      <PageHeader
        title="Banner"
        description="จัดการ Hero Banner ใน carousel บนหน้าเว็บไซต์"
        actions={
          writable ? (
            <button
              onClick={() => setEditing("new")}
              className="bg-[#550000] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-[#3D0000] transition-colors"
            >
              <Plus className="w-4 h-4" /> เพิ่ม Banner
            </button>
          ) : undefined
        }
      />

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <Eye className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-gray-700">
            Published ใน Carousel:
            <span className="font-semibold text-emerald-700 ml-1">{publishedCount} Slide</span>
          </span>
          {publishedCount === 0 && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-1">
              ไม่แสดง Carousel
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1.5
              ${filter === t.key ? "bg-[#550000] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full
                ${filter === t.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium w-20">ลำดับ</th>
                <th className="text-left px-4 py-3 font-medium w-28">ภาพ Preview</th>
                <th className="text-left px-4 py-3 font-medium">ชื่อ Banner</th>
                <th className="text-left px-4 py-3 font-medium">href Link</th>
                <th className="text-left px-4 py-3 font-medium w-28">สถานะ</th>
                <th className="text-left px-4 py-3 font-medium w-32">วันที่แก้ไขล่าสุด</th>
                <th className="text-right px-4 py-3 font-medium w-28">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}

              {!loading && sortedFiltered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">ยังไม่มี Banner</p>
                        <p className="text-gray-400 text-xs mt-0.5">สร้าง Banner แรกเพื่อแสดงใน Carousel</p>
                      </div>
                      {writable && (
                        <button
                          onClick={() => setEditing("new")}
                          className="mt-1 bg-[#550000] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-[#3D0000]"
                        >
                          <Plus className="w-4 h-4" /> เพิ่ม Banner แรก
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {!loading && sortedFiltered.map((row, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === sortedFiltered.length - 1;
                return (
                  <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* ลำดับ */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="w-7 text-center text-gray-700 font-medium tabular-nums">
                          {row.order}
                        </span>
                        {writable && (
                          <div className="flex flex-col">
                            <button
                              disabled={isFirst}
                              onClick={() => move(row.id, "up")}
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-25 transition-all"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={isLast}
                              onClick={() => move(row.id, "down")}
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-25 transition-all"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="w-24 rounded-lg overflow-hidden border border-gray-100" style={{ aspectRatio: "16/9" }}>
                        {row.image_url ? (
                          <img src={row.image_url} alt={row.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ชื่อ */}
                    <td className="px-4 py-3">
                      <span className="text-gray-900 font-medium">{row.name}</span>
                    </td>

                    {/* href */}
                    <td className="px-4 py-3">
                      <span className="text-gray-600 font-mono text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-flex items-center gap-1">
                        {row.href}
                        {row.target === "_blank" && <ExternalLink className="w-3 h-3 text-gray-400" />}
                      </span>
                    </td>

                    {/* สถานะ */}
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>

                    {/* วันที่ */}
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {fmtDate(row.updated_at)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing(row)}
                          title={writable ? "แก้ไข" : "ดู"}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#550000] hover:bg-[#FEF0F2] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {writable && (
                          <button
                            onClick={() => setDelTarget(row)}
                            title="ลบ"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        {sortedFiltered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>{sortedFiltered.length} Banner{filter !== "all" && ` (${filter})`}</span>
            <span className="flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              Banner สถานะ Draft จะไม่แสดงบนเว็บไซต์
            </span>
          </div>
        )}
      </div>

      {/* Banner Form Modal */}
      {editing && (
        <BannerForm
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={save}
          readOnly={!writable}
        />
      )}

      {/* Delete Confirm */}
      {delTarget && (
        <DeleteConfirm banner={delTarget} onConfirm={confirmDelete} onClose={() => setDelTarget(null)} />
      )}
    </div>
  );
}
