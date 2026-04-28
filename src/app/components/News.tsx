import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router";

const news = [
  {
    id: "a1",
    date: "16 มกราคม 2567",
    category: "ประกาศ",
    title: "กสทช. ประกาศมาตรการคุ้มครองผู้บริโภคด้านโทรคมนาคมฉบับใหม่",
    image: "https://images.unsplash.com/photo-1706517212972-18a1e840989d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdW1lciUyMHByb3RlY3Rpb24lMjByZWd1bGF0aW9uJTIwcG9saWN5fGVufDF8fHx8MTc3Njg1NDY1OXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "a2",
    date: "10 มกราคม 2567",
    category: "ข่าวสาร",
    title: "เปิดตัวบริการเปรียบเทียบโปรโมชั่นมือถือออนไลน์ครบวงจร",
    image: "https://images.unsplash.com/photo-1760013767150-da8e4ded6286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBuZXR3b3JrJTIwdGVsZWNvbSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzc2ODU0NjUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "a3",
    date: "02 มกราคม 2567",
    category: "วิเคราะห์",
    title: "แนวโน้มตลาดโทรคมนาคมไทยปี 2567 และทิศทางการแข่งขัน",
    image: "https://images.unsplash.com/photo-1761039232971-bb55a290762c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw1RyUyMHRlY2hub2xvZ3klMjBmdXR1cmUlMjBuZXR3b3JrfGVufDF8fHx8MTc3Njg1NDY1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "a4",
    date: "28 ธันวาคม 2566",
    category: "ประกาศ",
    title: "กสทช. เตรียมจัดสรรคลื่นความถี่เพิ่มเติมเพื่อรองรับ 5G",
    image: "https://images.unsplash.com/photo-1767797852518-d3c8bc6088eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZGlnaXRhbCUyMGNvbm5lY3Rpdml0eXxlbnwxfHx8fDE3NzY4NTQ2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "a5",
    date: "20 ธันวาคม 2566",
    category: "ข่าวสาร",
    title: "ไทยพร้อมก้าวสู่ยุค 5G ผู้ให้บริการเร่งขยายโครงข่าย",
    image: "https://images.unsplash.com/photo-1773773207750-6e9208f34a83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpbGFuZCUyMHRlY2glMjBzdGFydHVwJTIwb2ZmaWNlfGVufDF8fHx8MTc3Njg1NDY1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const categoryColor: Record<string, string> = {
  ประกาศ: "nbtc-badge",
  ข่าวสาร: "nbtc-badge",
  วิเคราะห์: "nbtc-badge",
};

export function News() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      emblaApi?.scrollNext();
    }, 3500);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi]);

  return (
    <section className="py-12 md:py-16" style={{ background: "var(--clr-bg-primary)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--clr-light)" }}>ข่าวประชาสัมพันธ์</h2>
          <div className="flex items-center justify-center gap-3 mt-2">
            <p className="text-sm" style={{ color: "rgba(246,243,228,0.65)" }}>อัปเดตข่าวสารและประกาศล่าสุด</p>
            <Link
              to="/article"
              className="text-sm font-medium inline-flex items-center gap-1 hover:opacity-80"
              style={{ color: "var(--clr-light)" }}
            >
              ดูทั้งหมด <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Full-bleed carousel */}
      <div className="max-w-6xl mx-auto overflow-hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 pl-4 md:gap-5 md:pl-5">
            {news.map((n) => (
              <div
                key={n.id}
                className="flex-none w-[280px] sm:w-[320px] md:w-[360px]"
              >
                <Link
                  to={`/article?id=${n.id}`}
                  className="block h-full"
                  draggable={false}
                >
                  <article className="nbtc-panel rounded-2xl overflow-hidden hover:border-[rgba(246,243,228,0.28)] hover:shadow-md transition-all cursor-pointer group h-full flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden flex-shrink-0" style={{ background: "rgba(246,243,228,0.06)" }}>
                      <ImageWithFallback
                        src={n.image}
                        alt={n.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${categoryColor[n.category] ?? "nbtc-badge"}`}>
                            {n.category}
                          </span>
                        <span className="text-xs" style={{ color: "rgba(246,243,228,0.45)" }}>{n.date}</span>
                      </div>
                      <h3 className="font-semibold leading-snug line-clamp-3 transition-colors flex-1 group-hover:opacity-90" style={{ color: "var(--clr-light)" }}>
                        {n.title}
                      </h3>
                      <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: "var(--clr-light)" }}>
                        อ่านต่อ <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {news.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all ${
              i === selectedIndex
                ? "w-5 h-2"
                : "w-2 h-2"
            }`}
            style={{ background: i === selectedIndex ? "var(--clr-light)" : "rgba(246,243,228,0.22)" }}
          />
        ))}
      </div>
    </section>
  );
}
