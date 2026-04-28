import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router";
import {
  ChevronRight,
  Facebook,
  Twitter,
  Link2,
  Printer,
  ChevronLeft,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { AiChat } from "../components/AiChat";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type Article = {
  id: string;
  category: "โปรโมชั่น" | "ข่าวสาร" | "บทความ";
  title: string;
  slug: string;
  date: string;
  readMinutes: number;
  views: number;
  heroImage?: string;
  heroAlt?: string;
  heroCaption?: string;
  bodyHtml: string;
  tags: string[];
  prevId?: string;
  nextId?: string;
  thumb: string;
};

const articles: Article[] = [
  {
    id: "a1",
    category: "ข่าวสาร",
    title: "กสทช. ประกาศมาตรการคุ้มครองผู้บริโภคด้านโทรคมนาคมฉบับใหม่",
    slug: "nbtc-consumer-protection-2026",
    date: "16 มกราคม 2569",
    readMinutes: 5,
    views: 1240,
    heroImage:
      "https://images.unsplash.com/photo-1706517212972-18a1e840989d?w=1200&q=80",
    heroAlt: "การประชุมเชิงนโยบายด้านโทรคมนาคม",
    heroCaption: "ภาพ: การแถลงข่าวมาตรการคุ้มครองผู้บริโภคฉบับใหม่",
    bodyHtml: `
      <p>คณะกรรมการกิจการกระจายเสียง กิจการโทรทัศน์ และกิจการโทรคมนาคมแห่งชาติ (กสทช.) ได้ประกาศมาตรการคุ้มครองผู้บริโภคด้านโทรคมนาคมฉบับใหม่ โดยมีเป้าหมายเพื่อยกระดับความโปร่งใสในการให้บริการของผู้ประกอบการมือถือและอินเทอร์เน็ตบ้าน</p>
      <h2 id="overview">ภาพรวมของมาตรการ</h2>
      <p>มาตรการใหม่ครอบคลุมหลายประเด็นสำคัญ ตั้งแต่การแสดงราคาให้ชัดเจน ไปจนถึงการให้สิทธิยกเลิกสัญญาก่อนกำหนดในกรณีที่ผู้ให้บริการไม่สามารถส่งมอบคุณภาพตามที่โฆษณาได้</p>
      <ul>
        <li>แสดงราคาสุทธิรวมภาษีในทุกช่องทางสื่อสาร</li>
        <li>เปิดเผยความเร็วเฉลี่ยจริงของแพ็กเกจอินเทอร์เน็ตบ้าน</li>
        <li>ระยะเวลาผูกมัดสัญญาต้องไม่เกิน 12 เดือน</li>
      </ul>
      <h2 id="impact">ผลกระทบต่อผู้บริโภค</h2>
      <p>ผู้บริโภคจะสามารถเปรียบเทียบแพ็กเกจได้ง่ายขึ้น และมีอำนาจต่อรองมากขึ้นเมื่อพบว่าบริการไม่ตรงตามคำโฆษณา</p>
      <blockquote>“ผู้บริโภคควรได้รับข้อมูลที่ครบถ้วนและถูกต้องก่อนตัดสินใจ” — เลขาธิการ กสทช.</blockquote>
      <h3 id="next">สิ่งที่ผู้ใช้ควรทำ</h3>
      <p>ตรวจสอบสัญญาปัจจุบันของคุณ และเปรียบเทียบกับแพ็กเกจในตลาดผ่านบริการ Pro Check เพื่อหาตัวเลือกที่คุ้มที่สุด</p>
      <ol>
        <li>ตรวจสอบยอดบิลย้อนหลัง 3 เดือน</li>
        <li>ดูระยะเวลาสัญญาคงเหลือ</li>
        <li>ใช้ตัวกรองในหน้า <a href="/search-result">ค้นหาแพ็กเกจ</a> เพื่อเปรียบเทียบ</li>
      </ol>
    `,
    tags: ["กสทช.", "ผู้บริโภค", "นโยบาย", "โทรคมนาคม"],
    prevId: undefined,
    nextId: "a2",
    thumb:
      "https://images.unsplash.com/photo-1706517212972-18a1e840989d?w=400&q=80",
  },
  {
    id: "a2",
    category: "บทความ",
    title: "เปิดตัวบริการเปรียบเทียบโปรโมชั่นมือถือออนไลน์ครบวงจร",
    slug: "compare-mobile-promotion",
    date: "10 มกราคม 2569",
    readMinutes: 4,
    views: 980,
    heroImage:
      "https://images.unsplash.com/photo-1760013767150-da8e4ded6286?w=1200&q=80",
    heroAlt: "ผู้ใช้งานเปรียบเทียบแพ็กเกจมือถือบนหน้าจอ",
    bodyHtml: `
      <p>บริการเปรียบเทียบโปรโมชั่นมือถือออนไลน์ครบวงจรเปิดตัวอย่างเป็นทางการ ผู้ใช้สามารถเปรียบเทียบราคา ข้อกำหนด และคุณสมบัติของแพ็กเกจจากผู้ให้บริการชั้นนำได้ในที่เดียว</p>
      <h2 id="features">ฟีเจอร์เด่น</h2>
      <p>ระบบรองรับการเปรียบเทียบแบบ side-by-side สูงสุด 3 แพ็กเกจในเวลาเดียว และมีตัวกรองตามค่าโทร, ดาต้า และระยะสัญญา</p>
    `,
    tags: ["บริการ", "เปรียบเทียบ", "แพ็กเกจ"],
    prevId: "a1",
    nextId: "a3",
    thumb:
      "https://images.unsplash.com/photo-1760013767150-da8e4ded6286?w=400&q=80",
  },
  {
    id: "a3",
    category: "บทความ",
    title: "แนวโน้มตลาดโทรคมนาคมไทยปี 2569 และทิศทางการแข่งขัน",
    slug: "thailand-telecom-trend-2026",
    date: "02 มกราคม 2569",
    readMinutes: 7,
    views: 2150,
    heroImage:
      "https://images.unsplash.com/photo-1761039232971-bb55a290762c?w=1200&q=80",
    bodyHtml: `<p>ตลาดโทรคมนาคมไทยในปี 2569 มีการแข่งขันที่เข้มข้นขึ้น โดยเฉพาะในกลุ่ม 5G และอินเทอร์เน็ตบ้านความเร็วสูง</p>`,
    tags: ["5G", "ตลาด", "วิเคราะห์"],
    prevId: "a2",
    nextId: "a4",
    thumb:
      "https://images.unsplash.com/photo-1761039232971-bb55a290762c?w=400&q=80",
  },
  {
    id: "a4",
    category: "โปรโมชั่น",
    title: "โปรโมชั่นพิเศษ: แพ็กเกจ 5G ลดสูงสุด 30% เฉพาะลูกค้าใหม่",
    slug: "5g-promo-30-off",
    date: "28 ธันวาคม 2568",
    readMinutes: 3,
    views: 3400,
    heroImage:
      "https://images.unsplash.com/photo-1767797852518-d3c8bc6088eb?w=1200&q=80",
    bodyHtml: `<p>โปรโมชั่น 5G สำหรับลูกค้าใหม่ ลดสูงสุด 30% เป็นเวลา 6 เดือน</p>`,
    tags: ["โปรโมชั่น", "5G", "ลูกค้าใหม่"],
    prevId: "a3",
    nextId: "a5",
    thumb:
      "https://images.unsplash.com/photo-1767797852518-d3c8bc6088eb?w=400&q=80",
  },
  {
    id: "a5",
    category: "ข่าวสาร",
    title: "ไทยพร้อมก้าวสู่ยุค 5G ผู้ให้บริการเร่งขยายโครงข่าย",
    slug: "thailand-5g-rollout",
    date: "20 ธันวาคม 2568",
    readMinutes: 6,
    views: 1820,
    heroImage:
      "https://images.unsplash.com/photo-1773773207750-6e9208f34a83?w=1200&q=80",
    bodyHtml: `<p>ผู้ให้บริการรายใหญ่ทั้งสามรายเร่งขยายโครงข่าย 5G ครอบคลุม 77 จังหวัดภายในสิ้นปี</p>`,
    tags: ["5G", "โครงข่าย"],
    prevId: "a4",
    nextId: "a6",
    thumb:
      "https://images.unsplash.com/photo-1773773207750-6e9208f34a83?w=400&q=80",
  },
  {
    id: "a6",
    category: "บทความ",
    title: "วิธีเลือกแพ็กเกจอินเทอร์เน็ตบ้านที่เหมาะกับครอบครัว",
    slug: "choose-home-internet",
    date: "15 ธันวาคม 2568",
    readMinutes: 5,
    views: 760,
    bodyHtml: `<p>เลือกแพ็กเกจให้เหมาะกับจำนวนสมาชิกและพฤติกรรมการใช้งาน</p>`,
    tags: ["อินเทอร์เน็ตบ้าน", "ครอบครัว"],
    prevId: "a5",
    thumb:
      "https://images.unsplash.com/photo-1706517212972-18a1e840989d?w=400&q=80",
  },
];

const categoryColor: Record<string, string> = {
  โปรโมชั่น: "nbtc-badge",
  ข่าวสาร: "nbtc-badge",
  บทความ: "nbtc-badge",
};

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
      {message}
    </div>
  );
}

function ShareButtons({
  url,
  title,
  vertical = false,
  onCopied,
}: {
  url: string;
  title: string;
  vertical?: boolean;
  onCopied: () => void;
}) {
  const enc = encodeURIComponent(url);
  const encT = encodeURIComponent(title);
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc}`;
  const tw = `https://twitter.com/intent/tweet?url=${enc}&text=${encT}`;

  const open = (u: string) =>
    window.open(u, "_blank", "noopener,noreferrer,width=600,height=600");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
    onCopied();
  };

  const btn =
    "inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 transition-colors";

  return (
    <div
      className={`flex ${vertical ? "flex-col" : "flex-row flex-wrap"} gap-2`}
    >
      <button onClick={() => open(fb)} className={btn} aria-label="แชร์ Facebook">
        <Facebook className="w-4 h-4" />
      </button>
      <button onClick={() => open(tw)} className={btn} aria-label="แชร์ X">
        <Twitter className="w-4 h-4" />
      </button>
      <button onClick={copy} className={btn} aria-label="คัดลอกลิงก์">
        <Link2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => window.print()}
        className={btn}
        aria-label="พิมพ์"
      >
        <Printer className="w-4 h-4" />
      </button>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="aspect-[16/9] bg-gray-200 rounded-xl" />
      <div className="space-y-2 pt-4">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

export function ArticlePage() {
  const [params] = useSearchParams();
  const id = params.get("id") ?? articles[0].id;

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const article = useMemo(() => articles.find((a) => a.id === id), [id]);
  const prev = article?.prevId
    ? articles.find((a) => a.id === article.prevId)
    : undefined;
  const next = article?.nextId
    ? articles.find((a) => a.id === article.nextId)
    : undefined;
  const related = useMemo(
    () => articles.filter((a) => a.id !== id).slice(0, 5),
    [id]
  );

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  if (!loading && !article) {
    return (
      <div className="min-h-screen nbtc-page nbtc-theme-surface">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            ไม่พบบทความที่คุณค้นหา
          </h1>
          <p className="text-gray-500 mb-6">
            บทความอาจถูกย้ายหรือไม่มีอยู่ในระบบแล้ว
          </p>
          <Link to="/home" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full nbtc-primary-btn">
            กลับหน้ารายการบทความ
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `https://procheck.example/article?id=${id}`;

  return (
    <div className="min-h-screen nbtc-page nbtc-theme-surface">
      <article className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {loading || !article ? (
          <div className="max-w-[720px]">
            <Skeleton />
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
              <Link to="/home" className="hover:opacity-80">
                ข่าวสาร
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                to={`/article?category=${article.category}`}
                className="hover:opacity-80"
              >
                {article.category}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-700">
                {truncate(article.title, 40)}
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10">
              {/* Main content */}
              <div className="max-w-[720px] w-full mx-auto lg:mx-0">
                {/* Header */}
                <header className="mb-6">
                  <span
                    className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium mb-4 ${
                      categoryColor[article.category]
                    }`}
                  >
                    {article.category}
                  </span>
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
                    {article.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>อ่าน {article.readMinutes} นาที</span>
                    <span>·</span>
                    <span>{article.views.toLocaleString()} ครั้ง</span>
                  </div>
                </header>

                {/* Hero */}
                {article.heroImage && (
                  <figure className="mb-8">
                    <div className="aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
                      <ImageWithFallback
                        src={article.heroImage}
                        alt={article.heroAlt ?? article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {article.heroCaption && (
                      <figcaption className="text-xs text-gray-400 mt-2 text-center">
                        {article.heroCaption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* Body */}
                <div
                  className="article-body text-gray-800 leading-[1.85]"
                  dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
                />

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mt-10 pt-6 border-t border-gray-100">
                    <span className="text-sm text-gray-500">แท็ก:</span>
                    {article.tags.map((t) => (
                      <Link
                        key={t}
                        to={`/article?tag=${encodeURIComponent(t)}`}
                        className="text-xs px-3 py-1 rounded-full nbtc-badge transition-colors"
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Prev / Next */}
                {(prev || next) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {prev ? (
                      <Link
                        to={`/article?id=${prev.id}`}
                        className="group rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all"
                      >
                        <div className="text-xs text-gray-500 inline-flex items-center gap-1 mb-1">
                          <ChevronLeft className="w-3 h-3" /> บทความก่อนหน้า
                        </div>
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {prev.title}
                        </div>
                      </Link>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                    {next ? (
                      <Link
                        to={`/article?id=${next.id}`}
                        className="group rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all md:text-right"
                      >
                        <div className="text-xs text-gray-500 inline-flex items-center gap-1 mb-1 md:justify-end md:w-full">
                          บทความถัดไป <ChevronRight className="w-3 h-3" />
                        </div>
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {next.title}
                        </div>
                      </Link>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>
                )}

                {/* Related */}
                {related.length > 0 && (
                  <section className="mt-12 pt-8 border-t border-gray-100">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                      บทความที่เกี่ยวข้อง
                    </h2>
                    <ul className="space-y-3">
                      {related.map((r) => (
                        <li key={r.id}>
                          <Link
                            to={`/article?id=${r.id}`}
                            className="flex gap-3 p-2 rounded-lg transition-colors group"
                          >
                            <div className="aspect-[4/3] w-24 sm:w-28 flex-none overflow-hidden rounded-md bg-gray-100">
                              <ImageWithFallback
                                src={r.thumb}
                                alt={r.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                              <h3 className="text-sm text-gray-900 line-clamp-2">
                                {r.title}
                              </h3>
                              <span className="text-xs text-gray-400 mt-1">
                                {r.date}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <div className="h-20 md:h-0" />
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <ShareButtons
                    url={url}
                    title={article.title}
                    vertical
                    onCopied={() => showToast("คัดลอกลิงก์แล้ว")}
                  />
                </div>
              </aside>
            </div>
          </>
        )}
      </article>

      {/* Floating share bar (mobile) */}
      {!loading && article && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">แชร์</span>
          <ShareButtons
            url={url}
            title={article.title}
            onCopied={() => showToast("คัดลอกลิงก์แล้ว")}
          />
        </div>
      )}

      {toast && <Toast message={toast} />}

      <Footer />
      <AiChat />

      <style>{`
        .article-body h2 { font-size: 1.5rem; font-weight: 700; color: #F6F3E4; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.3; scroll-margin-top: 96px; }
        .article-body h3 { font-size: 1.2rem; font-weight: 600; color: #F6F3E4; margin-top: 1.5rem; margin-bottom: 0.5rem; scroll-margin-top: 96px; }
        .article-body p { margin-bottom: 1rem; }
        .article-body ul, .article-body ol { margin: 1rem 0 1rem 1.5rem; padding-left: 0.5rem; }
        .article-body ul { list-style: disc; }
        .article-body ol { list-style: decimal; }
        .article-body li { margin-bottom: 0.4rem; }
        .article-body blockquote { border-left: 3px solid #F6F3E4; background: #30050E; padding: 0.75rem 1rem; margin: 1.25rem 0; color: rgba(246,243,228,0.75); border-radius: 0 8px 8px 0; }
        .article-body a { color: #F6F3E4; text-decoration: underline; text-underline-offset: 2px; }
        .article-body img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
        .article-body code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; background: rgba(246,243,228,0.08); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
        .article-body pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; }
        .article-body pre code { background: transparent; color: inherit; padding: 0; }
        .article-body .table-wrap, .article-body table { display: block; max-width: 100%; overflow-x: auto; }
        .article-body table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
        .article-body th, .article-body td { border: 1px solid rgba(246,243,228,0.2); padding: 0.5rem 0.75rem; text-align: left; }
        .article-body th { background: rgba(246,243,228,0.08); }
      `}</style>
    </div>
  );
}
