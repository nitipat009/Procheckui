import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router";

const faqs = [
  {
    q: "โปรเช็ค (Procheck) ทำอะไรได้บ้าง?",
    a: "โปรเช็คเป็นบริการเปรียบเทียบโปรโมชั่นและแพ็กเกจจากผู้ให้บริการโทรคมนาคมชั้นนำ ช่วยให้คุณค้นหาแพ็กเกจที่เหมาะสมที่สุดได้อย่างรวดเร็ว",
  },
  { q: "ใช้งานโปรเช็คมีค่าใช้จ่ายหรือไม่?", a: "บริการของโปรเช็คเปิดให้ใช้งานฟรี ไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น" },
  { q: "ข้อมูลโปรโมชั่นอัปเดตบ่อยแค่ไหน?", a: "ข้อมูลโปรโมชั่นถูกอัปเดตโดยผู้ให้บริการโดยตรงและตรวจสอบความถูกต้องอย่างสม่ำเสมอ" },
  { q: "สมัครโปรโมชั่นผ่านโปรเช็คได้ไหม?", a: "สามารถดูรายละเอียดและคลิกไปยังหน้าสมัครของผู้ให้บริการได้โดยตรง" },
];

const articles = [
  {
    id: "a2",
    title: "วิธีเลือกแพ็กเกจมือถือให้เหมาะกับไลฟ์สไตล์",
    tag: "คู่มือ",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=80",
  },
  {
    id: "a5",
    title: "รู้จัก 5G แบบเจาะลึก ความเร็วและการใช้งาน",
    tag: "เทคโนโลยี",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=80",
  },
  {
    id: "a3",
    title: "เปรียบเทียบแพ็กเกจเน็ตไม่อั้น แบบไหนคุ้มที่สุด",
    tag: "เปรียบเทียบ",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=300&q=80",
  },
  {
    id: "a1",
    title: "สิทธิผู้บริโภคในบริการโทรคมนาคมที่ควรรู้",
    tag: "สิทธิ์",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&q=80",
  },
  {
    id: "a4",
    title: "โรมมิ่งต่างประเทศ เลือกแพ็กเกจไหนดี?",
    tag: "โรมมิ่ง",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&q=80",
  },
  {
    id: "a6",
    title: "แพ็กเกจอินเทอร์เน็ตบ้าน ใครให้ความเร็วสูงสุด",
    tag: "อินเทอร์เน็ต",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&q=80",
  },
];

const tagColor: Record<string, string> = {
  คู่มือ: "bg-blue-100 text-[#0B5ED7]",
  เทคโนโลยี: "bg-purple-100 text-purple-700",
  เปรียบเทียบ: "bg-green-100 text-green-700",
  สิทธิ์: "bg-orange-100 text-orange-700",
  โรมมิ่ง: "bg-teal-100 text-teal-700",
  อินเทอร์เน็ต: "bg-red-100 text-red-700",
};

// Group articles into pairs (each carousel slide = 2 articles stacked)
const articlePairs = [
  articles.slice(0, 2),
  articles.slice(2, 4),
  articles.slice(4, 6),
];

function FaqItem({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-gray-100 py-5">
      <button onClick={onClick} className="w-full flex items-center justify-between text-left gap-4">
        <span className={`font-medium transition-colors ${open ? "text-[#0B5ED7]" : "text-gray-900"}`}>{q}</span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            open ? "bg-[#0B5ED7] text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      {open && <p className="mt-3 text-sm text-gray-500 leading-relaxed pr-12">{a}</p>}
    </div>
  );
}

export function FaqArticles() {
  const [open, setOpen] = useState(0);

  const [articleEmblaRef, articleEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onSelect = useCallback(() => {
    if (!articleEmblaApi) return;
    setSelectedIndex(articleEmblaApi.selectedScrollSnap());
  }, [articleEmblaApi]);

  useEffect(() => {
    if (!articleEmblaApi) return;
    onSelect();
    articleEmblaApi.on("select", onSelect);
    articleEmblaApi.on("reInit", onSelect);
    return () => {
      articleEmblaApi.off("select", onSelect);
      articleEmblaApi.off("reInit", onSelect);
    };
  }, [articleEmblaApi, onSelect]);

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      articleEmblaApi?.scrollNext();
    }, 4000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [articleEmblaApi]);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
        {/* FAQ */}
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6 md:mb-8">คำถามที่พบบ่อย</h2>
          <div>
            {faqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                open={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </div>

        {/* Articles Carousel */}
        <div>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">บทความน่ารู้</h2>
            <a className="text-sm text-[#0B5ED7] hover:text-[#094fb8] font-medium inline-flex items-center gap-1 cursor-pointer flex-shrink-0">
              ดูทั้งหมด <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Carousel — each slide = 2 articles stacked */}
          <div className="overflow-hidden -mx-1" ref={articleEmblaRef}>
            <div className="flex">
              {articlePairs.map((pair, pairIdx) => (
                <div key={pairIdx} className="flex-none w-full px-1 space-y-1">
                  {pair.map((a) => (
                    <Link
                      key={a.id}
                      to={`/article?id=${a.id}`}
                      draggable={false}
                      className="flex items-center gap-4 group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <ImageWithFallback
                          src={a.image}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1.5 font-medium ${tagColor[a.tag] ?? "bg-gray-100 text-gray-600"}`}>
                          {a.tag}
                        </span>
                        <h3 className="font-medium text-gray-900 leading-snug group-hover:text-[#0B5ED7] transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#0B5ED7] flex-shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {articlePairs.map((_, i) => (
              <button
                key={i}
                onClick={() => articleEmblaApi?.scrollTo(i)}
                className={`rounded-full transition-all ${
                  i === selectedIndex
                    ? "w-5 h-2 bg-[#0B5ED7]"
                    : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}