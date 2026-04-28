import { useState, useRef, useCallback } from "react";
import { RefreshCw, Loader2, WifiOff } from "lucide-react";
import { Footer } from "../components/Footer";
import { AiChat } from "../components/AiChat";
import { useIsMobile } from "../components/ui/use-mobile";

const TABLEAU_URL =
  "https://public.tableau.com/views/_16678808144210/IMRITS" +
  "?:embed=y&:showVizHome=no" +
  "&:host_url=https%3A%2F%2Fpublic.tableau.com%2F" +
  "&:embed_code_version=3&:tabs=no&:toolbar=yes" +
  "&:animate_transition=yes&:display_static_image=no" +
  "&:display_spinner=no&:display_overlay=yes" +
  "&:display_count=yes&:language=en-US&:loadOrderID=0";

type Status = "loading" | "loaded" | "error";

export function RoamingPage() {
  const [status, setStatus] = useState<Status>("loading");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();

  const handleLoad = useCallback(() => setStatus("loaded"), []);
  const handleError = useCallback(() => setStatus("error"), []);

  const reload = useCallback(() => {
    setStatus("loading");
    if (iframeRef.current) {
      // Re-assign src to force reload
      iframeRef.current.src = "";
      requestAnimationFrame(() => {
        if (iframeRef.current) iframeRef.current.src = TABLEAU_URL;
      });
    }
  }, []);

  // ── Layout heights ─────────────────────────────────────────────────────────
  // Header is h-16 = 64px (sticky, so always visible)
  const pageStyle: React.CSSProperties = isMobile
    ? { /* natural scroll on mobile */ }
    : {
        height: "calc(100vh - 64px)",  // fill exactly the space below the sticky header
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      };

  const iframeContainerStyle: React.CSSProperties = isMobile
    ? { height: "80vh", WebkitOverflowScrolling: "touch" as "touch" }
    : { flex: 1, minHeight: 0 };  // flex-1 inside the fixed-height page

  return (
    <div className="nbtc-page nbtc-theme-surface" style={pageStyle}>
      {/* ── iframe area ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-x-hidden"
        style={{ ...iframeContainerStyle, background: "var(--clr-bg-primary)" }}
      >
        {/* Loading skeleton */}
        {status === "loading" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4" style={{ background: "var(--clr-bg-primary)" }}>
            {/* Skeleton shimmer rows */}
            <div className="w-full max-w-4xl px-6 space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded-xl w-1/3" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-gray-200 rounded-2xl" />
                <div className="h-40 bg-gray-200 rounded-2xl" />
              </div>
            </div>
            {/* Spinner + label */}
            <div className="flex items-center gap-2.5 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--clr-light)" }} />
              กำลังโหลด Dashboard...
            </div>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-4 text-center" style={{ background: "var(--clr-bg-primary)" }}>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <WifiOff className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">ไม่สามารถโหลด Dashboard ได้ในขณะนี้</p>
              <p className="text-sm text-gray-500 mt-1.5">
                กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่อีกครั้ง
              </p>
            </div>
            <button
              onClick={reload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium nbtc-primary-btn"
            >
              <RefreshCw className="w-4 h-4" />
              โหลดใหม่อีกครั้ง
            </button>
          </div>
        )}

        {/* The iframe — always rendered so onLoad fires */}
        <iframe
          ref={iframeRef}
          src={TABLEAU_URL}
          title="Roaming Dashboard — Tableau"
          width="100%"
          frameBorder={0}
          scrolling="auto"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: "block",
            width: "100%",
            height: "1400px",
            border: "none",
            /* Fade-in once loaded */
            opacity: status === "loaded" ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: status === "loaded" ? "auto" : "none",
          }}
        />
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <Footer />
      <AiChat />
    </div>
  );
}
