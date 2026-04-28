export interface MobilePackage {
  id: number;
  type: "mobile";
  provider: string;
  providerColor: string;
  providerBg: string;
  name: string;
  price: number;
  data: string;
  dataGb: number;        // 9999 = unlimited
  speed: string;
  speedMbps: number;
  calls: string;
  callsMin: number;      // 9999 = unlimited
  sms: number;           // 9999 = unlimited
  mms: number;
  category: string;
  categoryColor: string;
  categoryBg: string;
}

export interface InternetPackage {
  id: number;
  type: "internet";
  provider: string;
  providerColor: string;
  providerBg: string;
  name: string;
  price: number;
  download: string;
  downloadMbps: number;
  upload: string;
  uploadMbps: number;
  contract: string;
  contractMonths: number; // 0 = no contract
  category: string;
  categoryColor: string;
  categoryBg: string;
}

export type AnyPackage = MobilePackage | InternetPackage;

// ── Provider styles ──────────────────────────────────────────────────────────
const P = {
  AIS:  { color: "#009B3A", bg: "#E6F5EC" },
  True: { color: "#E30613", bg: "#FDEAEB" },
  DTAC: { color: "#005BAA", bg: "#E5EDF8" },
  NT:   { color: "#1A56A0", bg: "#E5EDF8" },
  FIN:  { color: "#F59E0B", bg: "#FEF7E5" },
};

const PI = {
  "AIS Fiber":   { color: "#009B3A", bg: "#E6F5EC" },
  "True Online": { color: "#E30613", bg: "#FDEAEB" },
  "3BB":         { color: "#1A56A0", bg: "#E5EDF8" },
  "NT":          { color: "#1A56A0", bg: "#E5EDF8" },
  "CAT":         { color: "#F59E0B", bg: "#FEF7E5" },
};

// ── Category styles ──────────────────────────────────────────────────────────
const C = {
  บันเทิง:  { color: "#7C3AED", bg: "#EDE9FB" },
  กีฬา:    { color: "#0B5ED7", bg: "#EBF2FF" },
  เกม:     { color: "#E30613", bg: "#FDEAEB" },
  ช้อปปิ้ง: { color: "#F59E0B", bg: "#FEF7E5" },
  อาหาร:   { color: "#10B981", bg: "#D1FAE5" },
};

const CI = {
  ดูทีวี:      { color: "#7C3AED", bg: "#EDE9FB" },
  ความปลอดภัย: { color: "#0EA5E9", bg: "#E0F2FE" },
  เกม:         { color: "#E30613", bg: "#FDEAEB" },
  โทรฟรี:      { color: "#F59E0B", bg: "#FEF7E5" },
  ความเร็วสูง: { color: "#10B981", bg: "#D1FAE5" },
};

// ── Mobile packages (30 items) ───────────────────────────────────────────────
function mp(
  id: number, provider: keyof typeof P, name: string, price: number,
  dataGb: number, speedMbps: number, callsMin: number, sms: number, mms: number,
  cat: keyof typeof C
): MobilePackage {
  return {
    id, type: "mobile",
    provider, providerColor: P[provider].color, providerBg: P[provider].bg,
    name, price,
    data: dataGb >= 9999 ? "ไม่อั้น" : `${dataGb} GB`,
    dataGb,
    speed: speedMbps >= 1000 ? `${speedMbps / 1000} Gbps` : `${speedMbps} Mbps`,
    speedMbps,
    calls: callsMin >= 9999 ? "ไม่อั้น" : `${callsMin} นาที`,
    callsMin,
    sms, mms,
    category: cat, categoryColor: C[cat].color, categoryBg: C[cat].bg,
  };
}

export const mobilePackages: MobilePackage[] = [
  mp(101, "AIS",  "AIS Happy Max 5G",        899, 9999, 1000, 9999, 9999, 9999, "บันเทิง"),
  mp(102, "AIS",  "AIS Super Unlimited 5G",   699, 9999, 1000, 9999, 9999, 9999, "กีฬา"),
  mp(103, "AIS",  "AIS 5G Plus 100GB",        599, 100,  1000, 9999, 500,  100,  "บันเทิง"),
  mp(104, "AIS",  "AIS Happy Together 4G",    399, 60,   300,  300,  300,  50,   "ช้อปปิ้ง"),
  mp(105, "AIS",  "AIS Starter 30GB",         249, 30,   100,  200,  200,  30,   "อาหาร"),
  mp(106, "AIS",  "AIS Lite 15GB",            149, 15,   50,   100,  100,  20,   "บันเทิง"),

  mp(107, "True", "True 5G Ultra Max",        999, 9999, 1000, 9999, 9999, 9999, "กีฬา"),
  mp(108, "True", "True 5G Turbo 200GB",      799, 200,  1000, 500,  500,  100,  "กีฬา"),
  mp(109, "True", "True 5G Turbo 100GB",      599, 100,  1000, 500,  300,  50,   "เกม"),
  mp(110, "True", "True Move H 4G 60GB",      399, 60,   300,  200,  200,  30,   "บันเทิง"),
  mp(111, "True", "True Move 4G Plus 40GB",   299, 40,   100,  100,  100,  20,   "ช้อปปิ้ง"),
  mp(112, "True", "True Easy 20GB",           199, 20,   50,   60,   60,   10,   "อาหาร"),

  mp(113, "DTAC", "DTAC Go No Limit 5G",      799, 9999, 1000, 9999, 9999, 9999, "เกม"),
  mp(114, "DTAC", "DTAC 5G Unlimited",        699, 9999, 1000, 9999, 9999, 9999, "กีฬา"),
  mp(115, "DTAC", "DTAC Smart 100GB",         499, 100,  300,  300,  300,  50,   "บันเทิง"),
  mp(116, "DTAC", "DTAC Classic 50GB",        349, 50,   150,  200,  200,  30,   "เกม"),
  mp(117, "DTAC", "DTAC Smart 30GB",          249, 30,   100,  9999, 9999, 9999, "บันเทิง"),
  mp(118, "DTAC", "DTAC Mini 10GB",           149, 10,   50,   60,   60,   10,   "ช้อปปิ้ง"),

  mp(119, "NT",   "NT Mobile 5G Unlimited",   599, 9999, 1000, 9999, 9999, 9999, "บันเทิง"),
  mp(120, "NT",   "NT Pro 80GB",              399, 80,   300,  300,  300,  50,   "กีฬา"),
  mp(121, "NT",   "NT Smart 40GB",            299, 40,   100,  200,  200,  30,   "เกม"),
  mp(122, "NT",   "NT Basic 20GB",            199, 20,   50,   100,  100,  20,   "ช้อปปิ้ง"),
  mp(123, "NT",   "NT Starter 10GB",          149, 10,   30,   60,   60,   10,   "อาหาร"),
  mp(124, "NT",   "NT Lite 5GB",               99, 5,    30,   30,   30,   5,    "อาหาร"),

  mp(125, "FIN",  "FIN 5G Unlimited",         499, 9999, 1000, 9999, 9999, 9999, "เกม"),
  mp(126, "FIN",  "FIN Super 100GB",          349, 100,  300,  300,  300,  50,   "บันเทิง"),
  mp(127, "FIN",  "FIN Smart 50GB",           249, 50,   100,  200,  200,  30,   "กีฬา"),
  mp(128, "FIN",  "FIN Value 30GB",           199, 30,   100,  150,  150,  20,   "ช้อปปิ้ง"),
  mp(129, "FIN",  "FIN Starter Pack 10GB",    149, 10,   30,   60,   60,   10,   "อาหาร"),
  mp(130, "FIN",  "FIN Mini 5GB",              99, 5,    30,   30,   30,   5,    "เกม"),
];

// ── Internet packages (30 items) ─────────────────────────────────────────────
function ip(
  id: number, provider: keyof typeof PI, name: string, price: number,
  downloadMbps: number, uploadMbps: number, contractMonths: number,
  cat: keyof typeof CI
): InternetPackage {
  return {
    id, type: "internet",
    provider, providerColor: PI[provider].color, providerBg: PI[provider].bg,
    name, price,
    download: downloadMbps >= 1000 ? `${downloadMbps / 1000} Gbps` : `${downloadMbps} Mbps`,
    downloadMbps,
    upload: uploadMbps >= 1000 ? `${uploadMbps / 1000} Gbps` : `${uploadMbps} Mbps`,
    uploadMbps,
    contract: contractMonths === 0 ? "ไม่ผูกสัญญา" : `${contractMonths} เดือน`,
    contractMonths,
    category: cat, categoryColor: CI[cat].color, categoryBg: CI[cat].bg,
  };
}

export const internetPackages: InternetPackage[] = [
  ip(201, "AIS Fiber",   "AIS Fiber 2 Gbps Premium",    999, 2000, 1000, 0,  "ความเร็วสูง"),
  ip(202, "AIS Fiber",   "AIS Fiber 1 Gbps Unlimited",  799, 1000, 500,  0,  "ความเร็วสูง"),
  ip(203, "AIS Fiber",   "AIS Fiber 1 Gbps",            699, 1000, 500,  12, "ดูทีวี"),
  ip(204, "AIS Fiber",   "AIS Fiber 500 Mbps",          499, 500,  250,  0,  "ดูทีวี"),
  ip(205, "AIS Fiber",   "AIS Fiber 300 Mbps",          399, 300,  150,  0,  "ความปลอดภัย"),
  ip(206, "AIS Fiber",   "AIS Fiber 100 Mbps",          299, 100,  50,   0,  "โทรฟรี"),

  ip(207, "True Online", "True Gigatex 2G Fiber",       999, 2000, 1000, 12, "ความเร็วสูง"),
  ip(208, "True Online", "True Gigatex 1G Fiber",       799, 1000, 500,  12, "ดูทีวี"),
  ip(209, "True Online", "True Fiber 500M",             599, 500,  250,  12, "ดูทีวี"),
  ip(210, "True Online", "True Fiber 300M",             499, 300,  150,  12, "เกม"),
  ip(211, "True Online", "True Online 200M",            349, 200,  100,  12, "โทรฟรี"),
  ip(212, "True Online", "True Online 100M Basic",      249, 100,  50,   12, "ความปลอดภัย"),

  ip(213, "3BB",         "3BB Fiber 1 Gbps",            699, 1000, 500,  0,  "ความเร็วสูง"),
  ip(214, "3BB",         "3BB Fiber 500M",              499, 500,  250,  0,  "เกม"),
  ip(215, "3BB",         "3BB Home Office 300M",        399, 300,  150,  0,  "ความปลอดภัย"),
  ip(216, "3BB",         "3BB Smart 200M",              299, 200,  100,  0,  "ดูทีวี"),
  ip(217, "3BB",         "3BB Value 100M",              199, 100,  50,   0,  "โทรฟรี"),
  ip(218, "3BB",         "3BB Lite 30M",                149, 30,   15,   0,  "โทรฟรี"),

  ip(219, "NT",          "NT Fiber 1 Gbps",             599, 1000, 500,  12, "ความเร็วสูง"),
  ip(220, "NT",          "NT Fiber 500M",               449, 500,  250,  12, "เกม"),
  ip(221, "NT",          "NT Fiber 300M",               349, 300,  150,  12, "ดูทีวี"),
  ip(222, "NT",          "NT Fiber 100M",               249, 100,  50,   0,  "ความปลอดภัย"),
  ip(223, "NT",          "NT ADSL 50M",                 199, 50,   25,   0,  "โทรฟรี"),
  ip(224, "NT",          "NT ADSL 30M",                 149, 30,   15,   0,  "โทรฟรี"),

  ip(225, "CAT",         "CAT Fiber 1 Gbps",            599, 1000, 500,  24, "ความเร็วสูง"),
  ip(226, "CAT",         "CAT Fiber 500M",              449, 500,  250,  24, "เกม"),
  ip(227, "CAT",         "CAT Smart 300M",              349, 300,  150,  24, "ความปลอดภัย"),
  ip(228, "CAT",         "CAT Home 100M",               249, 100,  50,   24, "ดูทีวี"),
  ip(229, "CAT",         "CAT Basic 50M",               199, 50,   25,   12, "โทรฟรี"),
  ip(230, "CAT",         "CAT Starter 30M",             149, 30,   15,   12, "โทรฟรี"),
];
