# Prompt: Global Theme Update + Hero Section — /home & /internet-ban

---

## 1. Global Theme Color System

ปรับสีทั้งระบบให้ใช้ NBTC brand palette ดังนี้:

| CSS Variable | Hex | การใช้งาน |
|---|---|---|
| `--clr-bg-primary` | `#1E100F` | Main surface, navbar bg, footer bg, page bg |
| `--clr-bg-secondary` | `#30050E` | Card bg, section bg, dots bar, panel |
| `--clr-accent` | `#4D0C12` | CTA hover state, tag/badge bg, icon hover bg |
| `--clr-light` | `#F6F3E4` | Body text on dark, CTA button bg, icon fill |

### Mapping ของ Component หลัก

| Component | Property | Value |
|---|---|---|
| Header / Navbar | background | `#1E100F` |
| Header / Navbar | text / icon color | `#F6F3E4` |
| Footer | background | `#1E100F` |
| Footer | text color | `rgba(246,243,228,0.65)` |
| Primary Button (default) | background | `#F6F3E4` |
| Primary Button (default) | text color | `#1E100F` |
| Primary Button (hover) | background | `#4D0C12` |
| Primary Button (hover) | text color | `#F6F3E4` |
| Card / Panel | background | `#30050E` |
| Card / Panel | border | `0.5px solid rgba(246,243,228,0.15)` |
| Input / Search field | background | `rgba(246,243,228,0.06)` |
| Input / Search field | border | `rgba(246,243,228,0.20)` |
| Input / Search field | placeholder text | `rgba(246,243,228,0.40)` |
| Input / Search field | typed text | `#F6F3E4` |
| Divider / Separator | border | `0.5px solid rgba(246,243,228,0.12)` |
| Tag / Badge | background | `#4D0C12` |
| Tag / Badge | border | `0.5px solid rgba(246,243,228,0.25)` |
| Tag / Badge | text | `#F6F3E4` |

---

## 2. Feature: Hero Section (Full Viewport Width)

**Pages ที่ใช้งาน:** `/home`, `/internet-ban`
**Position:** แทรกก่อน Search Panel section ที่มีอยู่เดิม
**Width:** `100vw` full bleed (ไม่มี container padding)

### Layout Overview

```
┌─────────────────────────────────────────────────┐  ← 100vw
│                                                 │
│          Section A: Banner Carousel             │  70% of hero height
│          autoplay left → right, 5s interval     │
│                                                 │
├─────────────────────────────────────────────────┤
│          Section B: Service Quick Links         │  30% of hero height
│          icon button grid — 4 services          │
└─────────────────────────────────────────────────┘
                        ↓
          [Search Panel — existing, unchanged]
```

**Hero height:**
- Desktop: `100svh`
- Tablet: `auto`
- Mobile: `auto`

---

## 3. Section A — Banner Carousel (70% of hero height)

### Behavior

| Property | Value |
|---|---|
| Autoplay | เปิดใช้งาน, interval `5000ms` |
| Direction | Left → Right (slide ถัดไปเข้าจากขวา) |
| Transition | CSS `transform: translateX()`, `cubic-bezier(0.4, 0, 0.2, 1)`, duration `550ms` |
| Loop | Infinite |
| Pause | เมื่อ hover บน carousel |
| Resume | เมื่อ mouse leave carousel |
| Navigation | Dot indicator bar ด้านล่าง carousel |

### Dot Indicator Bar

- Background: `#30050E`
- Dot (inactive): `width: 5px; height: 5px; border-radius: 3px; background: rgba(246,243,228,0.22)`
- Dot (active): `width: 20px; height: 5px; border-radius: 3px; background: #F6F3E4`
- กด dot → jump ไป slide นั้น + reset interval

---

### Banner Layout (per slide)

```
┌──────────────────────────────────────────────────────┐
│  [BG color solid]  +  [SVG decorative overlay 4-6%]  │
│                                                      │
│   ┌─────────────────────┐    ┌──────────────────┐    │
│   │  [tag pill]         │    │                  │    │
│   │  [headline h2]      │    │   [SVG art]      │    │
│   │  [subtext p]        │    │   180×180px      │    │
│   │  [CTA button]       │    │                  │    │
│   └─────────────────────┘    └──────────────────┘    │
│   flex: 1                    flex: 0 0 180px         │
└──────────────────────────────────────────────────────┘
padding: 0 40px (desktop) / 0 24px (mobile)
```

---

### Banner 1 — โปรโมชั่นพิเศษสำหรับ กสทช.

| Field | Value |
|---|---|
| Slide background | `#30050E` |
| Tag text | `กสทช. พิเศษ` |
| Headline | `โปรโมชั่นพิเศษ สำหรับ กสทช.` |
| Subtext | `รับสิทธิประโยชน์และส่วนลดสุดพิเศษ สำหรับผู้ใช้งาน กสทช Pro Check` |
| CTA text | `ดูโปรโมชั่น →` |
| CTA href | `/promotions` |

**Background decoration (SVG overlay, opacity 0.04–0.06):**
- `<circle cx="590" cy="50%" r="130">` fill `#F6F3E4`
- `<circle cx="570" cy="25%" r="70">` fill `#F6F3E4`
- `<rect x="490" y="60%" width="90" height="90" rx="6" transform="rotate(20)">` fill `#F6F3E4`

**SVG Art (right side, 145×145):**
```
- วงกลมหลัก: cx=72 cy=72 r=68, fill="#4D0C12", stroke rgba(246,243,228,0.18)
- วงกลม dashed: r=55, fill="none", stroke-dasharray="4 3" rgba(246,243,228,0.1)
- ข้อความกลาง: "%" font-size=30 fill="#F6F3E4"
- ข้อความรอง: "สิทธิพิเศษ" font-size=11 fill rgba(246,243,228,0.8)
- ข้อความย่อย: "กสทช Pro Check" font-size=9 fill rgba(246,243,228,0.45)
- เส้น divider: rect opacity 0.15 ระหว่าง % กับข้อความ
```

---

### Banner 2 — ทำไมต้องใช้ กสทช Pro Check

| Field | Value |
|---|---|
| Slide background | `#1E100F` |
| Tag text | `เกี่ยวกับเรา` |
| Headline | `ทำไมต้องใช้ กสทช Pro Check?` |
| Subtext | `ตรวจสอบแพ็กเกจอย่างโปร่งใส ปลอดภัย และน่าเชื่อถือ` |
| CTA text | `เรียนรู้เพิ่มเติม →` |
| CTA href | `/about` |

**Background decoration (SVG overlay, opacity 0.03–0.05):**
- `<rect>` สองแท่ง `transform="rotate(18)"` fill `#F6F3E4` เพื่อสร้าง diagonal stripe
- `<circle cx="80" cy="80%" r="80">` fill `#F6F3E4` มุมล่างซ้าย

**SVG Art (right side, 150×145):**
```
- Shield path: M75 12 L122 34 L122 82 Q122 118 75 134 Q28 118 28 82 L28 34 Z
  fill="#4D0C12", stroke rgba(246,243,228,0.18)
- Checkmark path: M52 73 L67 88 L100 55
  stroke="#F6F3E4", stroke-width=3, stroke-linecap="round"
- ข้อความ "Verified": font-size=9 fill rgba(246,243,228,0.4)
- Decorative dots: 3 จุด บนและข้างของ shield opacity 0.35–0.5
```

---

### Banner 3 — กสทช Pro Check เปิดให้บริการแล้ว

| Field | Value |
|---|---|
| Slide background | `#4D0C12` |
| Tag text | `เปิดตัวแล้ว` |
| Headline | `กสทช Pro Check เปิดให้บริการแล้ว!` |
| Subtext | `เริ่มตรวจสอบแพ็กเกจของคุณ ได้เลยวันนี้ ฟรี ไม่มีค่าใช้จ่าย` |
| CTA text | `เริ่มต้นใช้งาน →` |
| CTA href | `/register` |

**Background decoration (SVG overlay):**
- วงกลมซ้อนกัน 3 ชั้น ทางขวา opacity 0.04–0.5
  - r=180 fill `#30050E`
  - r=130 fill `#F6F3E4`
  - r=80 fill `#30050E`

**SVG Art (right side, 145×145):**
```
- Outer ring: r=66 fill="none" stroke rgba(246,243,228,0.18)
- Inner circle: r=52 fill="#30050E" stroke rgba(246,243,228,0.12)
- "OPEN" badge: rect x=26 y=58 width=92 height=28 rx=5 fill="#F6F3E4"
  ข้อความ "OPEN": font-size=17 font-weight=500 fill="#1E100F"
- Decorative dots: 5 จุด รอบวงกลม opacity 0.35–0.55
```

---

### Banner Style Rules (ทุก slide)

| Element | Style |
|---|---|
| Tag pill | `font-size: 11px; font-weight: 500; color: #F6F3E4; background: #4D0C12; border: 0.5px solid rgba(246,243,228,0.28); padding: 3px 10px; border-radius: 20px; margin-bottom: 10px` |
| Headline h2 | `font-size: 20px; font-weight: 500; color: #F6F3E4; margin: 0 0 8px; line-height: 1.35` |
| Subtext p | `font-size: 13px; color: rgba(246,243,228,0.62); margin: 0 0 18px; line-height: 1.65` |
| CTA button | `display: inline-block; padding: 7px 18px; background: #F6F3E4; color: #1E100F; font-size: 12px; font-weight: 500; border-radius: 6px; cursor: pointer` |
| SVG BG overlay | `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0` |
| Text content | `position: relative; z-index: 1` |

---

## 4. Section B — Service Quick Links (30% of hero height)

### Layout

```css
display: flex;
justify-content: space-around;
align-items: center;
padding: 16px 12px;
background: #1E100F;
border-top: 0.5px solid rgba(246,243,228,0.10);
```

### Services

| Service | Icon Description | href |
|---|---|---|
| Telecom | เสาอากาศ + arc signal 2 ชั้น | `/services/telecom` |
| Broadcasting | หอกระจายสัญญาณ + คลื่นอากาศ | `/services/broadcasting` |
| Spectrum Management | 3 เส้นคลื่น sine ซ้อนกัน opacity ต่างกัน | `/services/spectrum` |
| Satellite and orbit management | ตัว satellite + solar panel + dish | `/services/satellite` |

### Button Style (per item)

```css
/* Container */
.service-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.service-btn:hover {
  transform: translateY(-2px);
}

/* Icon Box */
.service-icon {
  width: 46px;
  height: 46px;
  background: #30050E;
  border-radius: 12px;
  border: 0.5px solid rgba(246,243,228,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}
.service-btn:hover .service-icon {
  background: #4D0C12;
}

/* SVG Icon inside box */
/* width: 22px; height: 22px; fill/stroke: #F6F3E4 */

/* Label */
.service-label {
  font-size: 10px;
  color: rgba(246,243,228,0.68);
  text-align: center;
  line-height: 1.4;
  max-width: 72px;
}
```

### SVG Icon Specs

**Telecom:**
```svg
<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
  <rect x="9" y="13" width="4" height="8" rx="1" fill="#F6F3E4"/>
  <line x1="11" y1="2" x2="11" y2="13" stroke="#F6F3E4" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M5 5.5 Q11 2 17 5.5" stroke="#F6F3E4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M7.5 8.5 Q11 6 14.5 8.5" stroke="#F6F3E4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>
```

**Broadcasting:**
```svg
<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
  <rect x="9" y="9" width="4" height="11" rx="1" fill="#F6F3E4"/>
  <circle cx="11" cy="9" r="2.5" fill="#F6F3E4"/>
  <path d="M4 4.5 Q11 1 18 4.5" stroke="#F6F3E4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M6.5 7.5 Q11 5 15.5 7.5" stroke="#F6F3E4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>
```

**Spectrum Management:**
```svg
<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
  <path d="M1 13 Q5.5 7.5 11 11 Q16.5 14.5 21 9"
    stroke="#F6F3E4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M1 17 Q5.5 11.5 11 15 Q16.5 18.5 21 13"
    stroke="rgba(246,243,228,0.45)" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M1 9 Q5.5 3.5 11 7 Q16.5 10.5 21 5"
    stroke="rgba(246,243,228,0.28)" stroke-width="1" fill="none" stroke-linecap="round"/>
</svg>
```

**Satellite and orbit management:**
```svg
<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
  <rect x="8.5" y="8.5" width="5" height="5" rx="1" fill="#F6F3E4"/>
  <rect x="1" y="9.5" width="6.5" height="3" rx="1"
    fill="rgba(246,243,228,0.7)" stroke="#F6F3E4" stroke-width="0.5"/>
  <rect x="14.5" y="9.5" width="6.5" height="3" rx="1"
    fill="rgba(246,243,228,0.7)" stroke="#F6F3E4" stroke-width="0.5"/>
  <path d="M13.5 7.5 Q17 3.5 19.5 5"
    stroke="#F6F3E4" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <circle cx="19.5" cy="5" r="1.5" fill="#F6F3E4"/>
</svg>
```

---

## 5. States ที่ต้อง Handle

| State | การแสดงผล |
|---|---|
| Autoplay running | Slides เลื่อนทุก 5s, active dot animate width |
| Hover on carousel | `clearInterval` — หยุด autoplay |
| Mouse leave carousel | Restart autoplay interval ใหม่ |
| Dot click | Jump ไป slide นั้น + reset interval |
| Loading | Skeleton shimmer สีขาว opacity 0.08 บน bg `#30050E` |
| Mobile `< 640px` | Carousel height `200px`, ซ่อน art panel (`display: none`), text `text-align: center`, CMS content คงอยู่ |
| Tablet `640px–1024px` | Art panel `flex: 0 0 140px`, carousel height `220px` |

---

## 6. Responsive Breakpoints

| Breakpoint | Carousel height | Art panel | Padding |
|---|---|---|---|
| `≥ 1024px` | `70svh` | แสดง `flex: 0 0 180px` | `0 40px` |
| `640px – 1023px` | `220px` | แสดง `flex: 0 0 140px` | `0 28px` |
| `< 640px` | `200px` | ซ่อน | `0 24px`, text center |

Service quick links บน mobile: `gap` ลดลง, label font `9px`, icon box `40×40px`

---

## 7. Technical Notes

- Carousel ใช้ CSS `transform: translateX(-N * 100%)` — ห้ามใช้ `left` (performance)
- SVG overlay decoration: `position: absolute; pointer-events: none; z-index: 0` — content `z-index: 1`
- Service button href: ถ้าเป็น external URL ให้ใส่ `target="_blank" rel="noopener noreferrer"`
- Banner content (headline, tag, subtext, CTA text, CTA href, bg color) ต้อง configurable ผ่าน Back Office CMS
- Banner image/art: ใช้ inline SVG — ไม่ใช้ `<img>` เพื่อให้ responsive และ theme-consistent
- การ autoplay ต้อง pause เมื่อ tab ไม่ active (`document.addEventListener('visibilitychange', ...)`)
- ไม่ใช้ CSS gradient บน slide background — ใช้ solid color + SVG overlay shapes แทน

---

## 8. Mock Data (Banner — CMS configurable)

```json
{
  "banners": [
    {
      "id": "banner-1",
      "tag": "กสทช. พิเศษ",
      "headline": "โปรโมชั่นพิเศษ สำหรับ กสทช.",
      "subtext": "รับสิทธิประโยชน์และส่วนลดสุดพิเศษ สำหรับผู้ใช้งาน กสทช Pro Check",
      "cta_text": "ดูโปรโมชั่น →",
      "cta_href": "/promotions",
      "bg_color": "#30050E",
      "art_variant": "promo-badge"
    },
    {
      "id": "banner-2",
      "tag": "เกี่ยวกับเรา",
      "headline": "ทำไมต้องใช้ กสทช Pro Check?",
      "subtext": "ตรวจสอบแพ็กเกจอย่างโปร่งใส ปลอดภัย และน่าเชื่อถือ",
      "cta_text": "เรียนรู้เพิ่มเติม →",
      "cta_href": "/about",
      "bg_color": "#1E100F",
      "art_variant": "shield-check"
    },
    {
      "id": "banner-3",
      "tag": "เปิดตัวแล้ว",
      "headline": "กสทช Pro Check เปิดให้บริการแล้ว!",
      "subtext": "เริ่มตรวจสอบแพ็กเกจของคุณ ได้เลยวันนี้ ฟรี ไม่มีค่าใช้จ่าย",
      "cta_text": "เริ่มต้นใช้งาน →",
      "cta_href": "/register",
      "bg_color": "#4D0C12",
      "art_variant": "open-badge"
    }
  ],
  "services": [
    { "id": "telecom", "label": "Telecom", "icon": "telecom", "href": "/services/telecom" },
    { "id": "broadcasting", "label": "Broadcasting", "icon": "broadcasting", "href": "/services/broadcasting" },
    { "id": "spectrum", "label": "Spectrum Management", "icon": "spectrum", "href": "/services/spectrum" },
    { "id": "satellite", "label": "Satellite and orbit management", "icon": "satellite", "href": "/services/satellite" }
  ]
}
```