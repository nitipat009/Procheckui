import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, ChevronDown, RotateCcw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const SUGGESTIONS = [
  "แพ็กเกจเน็ตไม่อั้นราคาถูกที่สุด?",
  "เปรียบเทียบ AIS กับ True Move H",
  "แพ็กเกจสำหรับคนใช้ TikTok เยอะ",
  "โปรโรมมิ่งไปญี่ปุ่น",
];

const BOT_REPLIES: Record<string, string> = {
  default:
    "ขอบคุณที่ถามนะครับ! กำลังค้นหาข้อมูลที่ดีที่สุดให้คุณ... สำหรับคำถามนี้ขอแนะนำให้ลองใช้ช่องค้นหาด้านบนเพื่อกรองแพ็กเกจตามความต้องการของคุณได้เลยครับ 😊",
  เน็ตไม่อั้น:
    "แพ็กเกจเน็ตไม่อั้นที่คุ้มค่าที่สุดตอนนี้ได้แก่\n\n• **AIS Unlimited** — 599 บาท/เดือน ความเร็วสูงสุด 100 Mbps\n• **True Move H MAX** — 549 บาท/เดือน ความเร็วสูงสุด 80 Mbps\n• **DTAC Full Speed** — 499 บาท/เดือน ความเร็วสูงสุด 60 Mbps\n\nแนะนำ AIS หากอยู่ในเมืองใหญ่ ครอบคลุมสัญญาณดีที่สุดครับ 📶",
  ais:
    "AIS และ True Move H ต่างกันอย่างไร?\n\n**AIS**\n✅ ครอบคลุมพื้นที่ทั่วประเทศดีที่สุด\n✅ 5G ครอบคลุมกว่า 77 จังหวัด\n💰 ราคาเริ่มต้น 299 บาท/เดือน\n\n**True Move H**\n✅ โปรโมชั่นรายเดือนน่าสนใจมาก\n✅ ฟรี Netflix / YouTube Premium บางแพ็กเกจ\n💰 ราคาเริ่มต้น 249 บาท/เดือน\n\nถ้าสัญญาณสำคัญ → AIS, ถ้าราคาและสิทธิพิเศษสำคัญ → True Move H ครับ 🎯",
  tiktok:
    "สำหรับคนใช้ TikTok เยอะ ขอแนะนำ\n\n🏆 **True Move H Social 299**\n• เน็ตไม่อั้น TikTok + YouTube\n• โทรฟรีทุกเครือข่าย 100 นาที\n• 299 บาท/เดือน\n\n🥈 **AIS Serenade Creator**\n• Speed สูงสุด 150 Mbps\n• Video streaming ลื่นไหล\n• 399 บาท/เดือน\n\nแนะนำ True Move H ตัวแรกสุดครับ คุ้มมาก! 🎵",
  โรมมิ่ง:
    "โปรโรมมิ่งไปญี่ปุ่น ตัวเลือกที่ดีที่สุด\n\n✈️ **AIS Japan Package**\n• 7 วัน 299 บาท / 15 วัน 499 บาท\n• ความเร็ว 4G/LTE ไม่จำกัด\n• โทรกลับไทยฟรี 30 นาที/วัน\n\n✈️ **True Move H Japan SIM**\n• 10 วัน 350 บาท\n• ใช้งานได้ทันทีที่ญี่ปุ่น\n\nแนะนำซื้อที่สนามบินก่อนเดินทางครับ หรือสั่งออนไลน์ล่วงหน้าจะได้ราคาถูกกว่า 🗾",
};

function getBotReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("เน็ตไม่อั้น") || lower.includes("unlimited") || lower.includes("ราคาถูก"))
    return BOT_REPLIES["เน็ตไม่อั้น"];
  if (lower.includes("ais") || lower.includes("true") || lower.includes("เปรียบเทียบ"))
    return BOT_REPLIES["ais"];
  if (lower.includes("tiktok") || lower.includes("โซเชียล") || lower.includes("youtube"))
    return BOT_REPLIES["tiktok"];
  if (lower.includes("โรมมิ่ง") || lower.includes("ญี่ปุ่น") || lower.includes("ต่างประเทศ"))
    return BOT_REPLIES["โรมมิ่ง"];
  return BOT_REPLIES["default"];
}

function now() {
  return new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

function formatMessage(text: string) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "assistant",
    text: "สวัสดีครับ! ผมคือ ProBot ผู้ช่วย AI สำหรับเปรียบเทียบแพ็กเกจมือถือ 🤖\n\nบอกความต้องการของคุณได้เลยครับ เช่น งบประมาณ, การใช้งาน หรือผู้ให้บริการที่สนใจ",
    time: now(),
  },
];

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [messages, open, minimized]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, minimized]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim(), time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", text: reply, time: now() },
      ]);
      setTyping(false);
    }, 1200 + Math.random() * 600);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => setMessages(INITIAL_MESSAGES);

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-4 md:right-6 z-50 transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={{ width: "min(360px, calc(100vw - 2rem))" }}
      >
        <div className="rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col bg-white"
          style={{ height: minimized ? "auto" : "min(520px, calc(100dvh - 8rem))" }}>

          {/* Header */}
          <div className="bg-[#0B5ED7] px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0B5ED7]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-tight">ProBot AI</p>
              <p className="text-blue-200 text-xs">ผู้ช่วยเปรียบเทียบแพ็กเกจ</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                title="เริ่มใหม่"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                onClick={() => setMinimized(!minimized)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronDown className={`w-4 h-4 text-white transition-transform ${minimized ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#F5F7FA]"
                style={{ scrollbarWidth: "none" }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-[#0B5ED7] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-[#0B5ED7] text-white rounded-tr-sm"
                            : "bg-white text-gray-800 rounded-tl-sm border border-gray-100 shadow-sm"
                        }`}
                      >
                        {formatMessage(msg.text)}
                      </div>
                      <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex gap-2.5 flex-row">
                    <div className="w-7 h-7 rounded-lg bg-[#0B5ED7] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pt-3 pb-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0"
                  style={{ scrollbarWidth: "none" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="flex-none text-xs px-3 py-1.5 rounded-full border border-[#0B5ED7] text-[#0B5ED7] hover:bg-[#0B5ED7] hover:text-white transition-colors whitespace-nowrap"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="พิมพ์ข้อความ..."
                  className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-[#F5F7FA] border border-gray-200 focus:outline-none focus:border-[#0B5ED7] focus:ring-2 focus:ring-[#0B5ED7]/10 transition-all"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 rounded-xl bg-[#0B5ED7] hover:bg-[#094fb8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => {
          setOpen(!open);
          setMinimized(false);
        }}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-2xl bg-[#0B5ED7] hover:bg-[#094fb8] shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group active:scale-95"
        style={{ boxShadow: "0 8px 32px rgba(11,94,215,0.35)" }}
      >
        <div className={`transition-all duration-200 ${open ? "rotate-90 scale-90" : "rotate-0 scale-100"}`}>
          {open ? (
            <ChevronDown className="w-6 h-6 text-white" />
          ) : (
            <Sparkles className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl animate-ping bg-[#0B5ED7] opacity-20 pointer-events-none" />
        )}

        {/* Tooltip */}
        <span className="absolute right-16 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          ถามผู้ช่วย AI
        </span>
      </button>
    </>
  );
}