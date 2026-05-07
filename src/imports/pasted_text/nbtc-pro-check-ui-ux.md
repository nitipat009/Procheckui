# กสทช. Pro Check — Full UI/UX Prompt
> Visual reference: รูปภาพ กสทช. Pro Check (แนบ)
> Framework: React / Next.js (หรือตามที่โปรเจกต์กำหนด)
> ใช้ prompt นี้เป็น single source of truth สำหรับทุกหน้าและทุก component

---

## 1. Global Design System

### 1.1 Color Tokens
> สกัดจากรูปภาพ reference โดยตรง — ยึดตามนี้เป็นหลัก

```css
/* Primary Palette */
--color-white:        #FFFFFF;   /* Header bg, body bg, card bg */
--color-brand-red:    #C8102E;   /* Logo, CTA, active nav, icon hover, price text */
--color-deep-red:     #7A0020;   /* Hero banner gradient (ฝั่งเข้ม) — เฉพาะ banner */
--color-hero-light:   #FAE8EA;   /* Hero banner gradient (ฝั่งอ่อน) */

/* Text */
--color-text:         #1A1A1A;   /* Body text, nav links, label ทั่วไป */
--color-text-muted:   #888888;   /* Subtitle, caption, placeholder, inactive */
--color-text-on-red:  #FFFFFF;   /* Text บน bg แดง (button, badge, hero) */

/* Structural */
--color-border:       #E5E5E5;   /* Card border, input border, divider */
--color-bg-subtle:    #F5F5F5;   /* Section bg รอง, input bg, table row hover */
--color-bg-overlay:   rgba(200,16,46,0.08); /* Hover tint สำหรับ card/item */
```

### 1.2 Color Application Rules
| Element | Color |
|---|---|
| Header bg / Footer bg / Card bg / Body bg | `#FFFFFF` |
| Logo, Primary button bg | `#C8102E` |
| Active nav link, hover state icon | `#C8102E` |
| Price / highlight number | `#C8102E` |
| Hero banner gradient start (ซ้าย) | `#FAE8EA` |
| Hero banner gradient end (ขวา) | `#7A0020` |
| Body text | `#1A1A1A` |
| Muted/secondary text | `#888888` |
| Text บน bg แดง | `#FFFFFF` |
| Input bg | `#F5F5F5` |
| Border ทั่วไป | `#E5E5E5` |

> ❌ ห้ามใช้ `#1E100F`, `#F6F3E4`, `#30050E`, `#4D0C12` เป็น structural color หลัก
> เพราะจะทำให้ระบบดู dark maroon ซึ่งไม่ตรงกับ reference

### 1.3 Typography
```css
font-family: 'Noto Sans Thai', 'Inter', sans-serif;

/* Scale */
--text-xs:   12px;   /* caption, label เล็ก */
--text-sm:   14px;   /* body รอง, meta */
--text-base: 16px;   /* body หลัก */
--text-lg:   18px;   /* subheading */
--text-xl:   24px;   /* section title */
--text-2xl:  32px;   /* hero subtitle */
--text-3xl:  48px;   /* hero title */

/* Weight: 400 (regular), 500 (medium), 700 (bold) */
```

### 1.4 Spacing & Radius
```css
--radius-sm:  4px;
--radius-md:  8px;
--radius-lg:  12px;
--radius-xl:  20px;
--radius-full: 9999px;  /* pill */

--shadow-card: 0 1px 4px rgba(0,0,0,0.08);
--shadow-hover: 0 4px 12px rgba(200,16,46,0.15);
```

### 1.5 Shared States
| State | Style |
|---|---|
| Hover (card) | `box-shadow: var(--shadow-hover)`, `border-color: #C8102E` |
| Hover (button) | darken bg 10% |
| Focus (input) | `outline: 2px solid #C8102E`, `outline-offset: 2px` |
| Disabled | opacity 40%, cursor not-allowed |
| Loading | Skeleton pulse animation, bg `#F0F0F0` |

---

## 2. Shared Components

### 2.1 Header (Sticky, ทุกหน้า)

**Layout:** แนวนอน เต็ม width, `position: sticky; top: 0; z-index: 100`
**Background:** `#FFFFFF`, `border-bottom: 1px solid #E5E5E5`
**Height:** 64px desktop / 56px mobile

**องค์ประกอบ (ซ้าย → ขวา):**

| ตำแหน่ง | Element | รายละเอียด |
|---|---|---|
| ซ้าย | Logo | icon box bg `#C8102E` (radius 6px) + text "กสทช. Pro Check" สี `#1A1A1A` |
| กลาง | Nav Links | หน้าแรก / เกี่ยวกับเรา / ข่าวสาร / โปรโมชัน / เครื่องมือ / ติดต่อเรา |
| ขวา | Language Toggle | `TH` \| `EN` — active: `#C8102E` font-weight 500, inactive: `#888` |
| ขวาสุด | ปุ่มเข้าสู่ระบบ | bg `#C8102E`, text `#FFFFFF`, border-radius pill → navigate `/backoffice/login` |

**Nav Link States:**
- Default: `#1A1A1A`, opacity 70%
- Active (หน้าปัจจุบัน): `#C8102E`, opacity 100%, underline สี `#C8102E`
- Hover: `#C8102E`, opacity 100%

**Mobile (< 768px):**
- ซ่อน nav links ทั้งหมด
- แสดง hamburger icon (3 เส้น สี `#1A1A1A`)
- เมื่อกด → Drawer slide-down overlay แสดง nav links แนวตั้ง
- drawer bg `#FFFFFF`, border-bottom `#E5E5E5`

---

### 2.2 Footer (ทุกหน้า)

**Background:** `#1A1A1A`
**Text:** `#FFFFFF`, muted `#888888`
**Layout:** 3–4 column grid

**Columns:**
- col 1: Logo + คำอธิบายสั้น + social icons
- col 2: เมนูหลัก (links)
- col 3: ติดต่อเรา (address, phone, email)
- col 4: QR code / app download (ถ้ามี)

**Bottom bar:** `border-top: 1px solid #333`, copyright text, ลิขสิทธิ์ © 2567 PRO CHECK

---

## 3. Hero Section (หน้า /home และ /internet-ban)

Hero section เต็ม viewport width แบ่งแนวตั้ง 2 ส่วน:
**70% Banner Carousel + 30% Service Navigator**
ไม่มี padding/margin รอบนอก (full bleed)

---

### 3.1 Banner Carousel (height 70%)

**Container:**
- width: 100vw (full bleed)
- background: gradient `#FAE8EA 0% → #F5C0C8 35% → #A0001A 65% → #7A0020 100%` (110deg)
- overflow: hidden

**Slides — สร้าง 3 slides + illustration ประกอบแต่ละ slide:**

| Slide | Eyebrow | Title | Subtitle | CTA | Illustration |
|---|---|---|---|---|---|
| 1 | "เปิดให้บริการแล้ว" | **PRO CHECK** | เปรียบเทียบโปรโมชั่นโทรศัพท์เคลื่อนที่ ค้นหาโปรที่ใช่ เปรียบเทียบง่าย จบในที่เดียว | "เริ่มค้นหาโปรโมชั่น" | smartphone + signal wave + กสทช. PRO CHECK branding |
| 2 | "ทำไมต้องใช้" | **กสทช. Pro Check** | ข้อมูลแพ็กเกจครบ อัปเดตตรง เปรียบเทียบได้ทุกค่าย ไม่มีค่าใช้จ่าย | "ดูข้อมูลเพิ่มเติม" | shield + checkmark + data icons |
| 3 | "กสทช. Pro Check" | **เปิดให้บริการแล้ว** | เข้าใช้งานได้ฟรี ไม่ต้องสมัครสมาชิก ครอบคลุมทุกผู้ให้บริการ | "เริ่มใช้งาน" | celebration / launch visual |

**Text Layout (ฝั่งซ้าย):**
- Eyebrow: 13px, `#7A0020`, uppercase, letter-spacing 0.8px
- Title: 40–48px, font-weight 700, `#1A1A1A` (บน bg อ่อน) หรือ `#FFFFFF` (บน bg เข้ม)
- Subtitle: 15px, `#4A4A4A` (bg อ่อน) / `rgba(255,255,255,0.8)` (bg เข้ม), max-width 360px
- CTA Button: pill shape, bg `#C8102E`, text `#FFFFFF`, icon ค้นหา, hover: darken 10%

**Illustration (ฝั่งขวา):**
- Style: flat minimal illustration สี `#FFFFFF` / `rgba(255,255,255,0.7)` บน bg gradient เข้ม
- ขนาด: ~40% height ของ banner, จัดชิดขวา-กึ่งกลางสูง
- ห้ามใช้ photo หรือ gradient ซ้อนบน illustration

**Controls:**
| Element | รายละเอียด |
|---|---|
| Autoplay | เลื่อนซ้าย → ขวา ทุก 5 วินาที, หยุดเมื่อ hover/touch |
| Arrow `‹` `›` | ซ้าย-ขวาของ slide, bg `rgba(255,255,255,0.2)`, icon `#FFFFFF` |
| Dot indicators | ล่างกลาง, active: pill shape สี `#C8102E`, inactive: `rgba(200,16,46,0.3)` |
| Slide counter | `1 / 3` มุมบนขวา, bg `rgba(26,0,10,0.45)`, text `#FFFFFF` |
| Transition | slide หรือ fade 400ms ease-in-out |

---

### 3.2 Service Navigator (height 30%)

**Container:**
- width: 100%, bg `#FFFFFF`
- border-top: `1px solid #E5E5E5`
- padding: 12px 24px
- display: flex, justify-content: space-around, align-items: center

**4 Service Items:**

| ลำดับ | ชื่อไทย | ชื่ออังกฤษ | href | Icon |
|---|---|---|---|---|
| 1 | โทรศัพท์เคลื่อนที่ | Mobile | external NBTC Telecom URL | signal tower outline |
| 2 | กระจายเสียง | Broadcasting | external Broadcasting URL | broadcast wave outline |
| 3 | บริการสัมปทาน | Spectrum Management | external Spectrum URL | spectrum bars outline |
| 4 | ดาวเทียมและอวกาศ | Satellite and Orbit | external Satellite URL | satellite orbit outline |

**Item Layout (แต่ละ service):**
- Icon container: 48px × 48px, border-radius 50%, border `1.5px solid #E5E5E5`, bg `#FFFFFF`
  - Icon color default: `#555555` (outline SVG)
  - Icon color hover: `#C8102E`
  - Border color hover: `#C8102E`
  - bg hover: `#FEF0F2`
- ชื่อไทย: 12px, `#1A1A1A`, font-weight 500, text-align center
- ชื่ออังกฤษ: 11px, `#888888`, text-align center
- ทุก item: `target="_blank" rel="noopener"` (เปิด tab ใหม่)
- Transition: `border-color`, `background`, `color` — 150ms ease

**Mobile:**
- `overflow-x: auto`, scroll แนวนอน, hide scrollbar
- แต่ละ item: `min-width: 80px`, ไม่ wrap

---

## 4. Pages

### 4.1 หน้าหลัก (/home)

**Sections (เรียงจากบนลงล่าง):**
1. Header (sticky)
2. **Hero Section** (Banner Carousel 70% + Service Navigator 30%) — ดู Section 3
3. Search Panel — ค้นหาแพ็กเกจโทรศัพท์
4. Popular Packages — แพ็กเกจยอดนิยม (carousel)
5. Provider Logos — ผู้ให้บริการ
6. News Section — ข่าวประชาสัมพันธ์ (3 cards)
7. FAQ + บทความ (2 column)
8. Footer

---

### 4.2 หน้าอินเทอร์เน็ตบ้าน (/internet-ban)

**Sections:**
1. Header (sticky)
2. **Hero Section** (Banner Carousel 70% + Service Navigator 30%)
   - Banner title ปรับเป็น `"แพ็กเกจอินเทอร์เน็ตบ้าน"` (slide 1)
   - Slides ปรับ content ให้ตรงกับบริบท internet บ้าน
3. Search Panel — ค้นหาแพ็กเกจอินเทอร์เน็ตบ้าน
4. Popular Internet Packages
5. Provider Logos
6. Footer

---

### 4.3 Search Panel (shared component, /home และ /internet-ban)

**Container:** bg `#FFFFFF`, border `1px solid #E5E5E5`, border-radius 12px, padding 20px 24px, shadow-card

**Title:** `"ค้นหาโปรโมชั่นโทรศัพท์เคลื่อนที่"` (หรือ `"อินเทอร์เน็ตบ้าน"`) — 16px, font-weight 500
**Subtitle:** เปรียบเทียบโปรโมชั่นและแพ็กเกจจากผู้ให้บริการที่คุณสนใจได้ที่นี่ — 13px, `#888`

**Basic Fields:**
| Field | Type | รายละเอียด |
|---|---|---|
| ประเภทผู้ให้บริการ | dropdown | เลือกประเภท |
| ผู้ให้บริการ | dropdown | ทั้งหมด / AIS / DTAC / True / NT ฯลฯ |
| ราคา (บาท/เดือน) | range slider | 80 – 62,000+ |
| สิทธิประโยชน์ | chip multi-select | เน็ตไม่จำกัด / โทรฟรี / 5G / Roaming / ดูทีวี / WiFi ฟรี |

**CTA:** ปุ่ม `"ค้นหาโปรโมชั่น"` — bg `#C8102E`, text `#FFFFFF`, full-width, height 48px, border-radius pill, icon แว่นขยาย

**Advanced Search:** link `"ค้นหาขั้นสูง"` — เมื่อกดขยาย accordion แสดง fields เพิ่มเติม

---

### 4.4 Search Result Page (/search-result)

**Trigger:** กดปุ่มค้นหาจาก Search Panel → navigate พร้อม query params

**Layout:** 2-column `[Filter Sidebar 280px] + [Results]`

**Top Bar:**
- ซ้าย: Title (`"รายการแพ็กเกจโทรศัพท์"` / `"รายการแพ็กเกจอินเทอร์เน็ตบ้าน"`) + Subtitle `"จำนวน {n} รายการ"`
- ขวา: 2 dropdowns — Sort By + Sort Order

**Sort By options:** ราคา / ปริมาณการโทรออก / ปริมาณอินเทอร์เน็ต / ความเร็วอินเทอร์เน็ต / ปริมาณ SMS / ปริมาณ MMS / อัตราค่าบริการเสียงเฉลี่ย / อัตราค่าบริการ SMS / อัตราค่าบริการ MMS / อัตราค่าบริการอินเทอร์เน็ต

**Sort Order:** น้อย → มาก / มาก → น้อย

**Filter Sidebar:**
- ใช้ layout จาก Search Panel แนวตั้ง (vertical stack)
- ลบปุ่ม "ค้นหาขั้นสูง" ออก → แสดง advanced filters ตลอด
- Sticky เมื่อ scroll
- Mobile: ซ่อน → ปุ่ม Filter ข้าง sort → Drawer slide-in จากซ้าย

**Package Cards:** grid, ใช้ component เดิมจาก Popular Section

**Pagination:**
- Arrow ‹ › + หมายเลขหน้า + ellipsis
- Dropdown: items per page (10 / 20 / 50)
- Input: jump to page

---

### 4.5 Package Detail Page (/package-detail)

**Trigger:** กด card ใดก็ตาม → `/package-detail?id={packageId}`

**Section 1 — Breadcrumb:** ข่าวสาร › ประเภท › ชื่อแพ็กเกจ

**Section 2 — Package Header Bar:**
| ตำแหน่ง | Element |
|---|---|
| ซ้าย | Operator Logo |
| กลาง | ชื่อแพ็กเกจ |
| ขวา | ปุ่ม Export PDF + ปุ่ม Bookmark (star) |

**Section 3 — Package Info (2-column):**

*คอลัมน์ซ้าย — ตาราง:*
| Icon | Label | หมายเหตุ |
|---|---|---|
| บาท | ราคา | — |
| โทรศัพท์ | โทร | expandable ▾ |
| SMS | SMS | ค่า null → `"–"` |
| MMS | MMS | ค่า null → `"–"` |
| โลก | อินเทอร์เน็ต | expandable ▾ |
| ความเร็ว | ความเร็วอินเทอร์เน็ต | — |
| WiFi | WiFi | — |
| แอป | สิทธิการใช้งานอื่น ๆ | — |
| ปฏิทิน | ระยะเวลาการใช้งาน | — |

*คอลัมน์ขวา:*
- Block 1: สิทธิพิเศษ (expandable list)
- Block 2: ข้อกำหนดและเงื่อนไข (scrollable text) + หมายเหตุ

**Section 4 — โปรโมชั่นล่าสุด:** Carousel แนวนอน, Package Cards เดิม, ลูกศร ‹ ›

**Section 5 — Compare CTA:** ปุ่ม `"เปรียบเทียบแพ็กเกจ"` กึ่งกลาง ใต้ section โปรโมชั่น

---

### 4.6 Package Compare Page (/compare)

**Concept:** Side-by-side comparison (อ้าง UX pattern apple.com/th/iphone/compare)
**Max columns:** 3 แพ็กเกจพร้อมกัน
**URL:** `/compare?ids=pkg001,pkg002,pkg003`

**Section 1 — Package Selector Header (sticky):**
- Grid: `[label col] + [slot 1] + [slot 2] + [slot 3]`
- Filled slot: logo + ชื่อ + ราคา + ปุ่ม `✕`
- Empty slot: `"+ เพิ่มแพ็กเกจ"` → เปิด Modal ค้นหา

**Section 2 — Comparison Table:**

Groups: ค่าบริการ / การโทร & ข้อความ / อินเทอร์เน็ต / สิทธิพิเศษ

- Row ที่ค่าต่างกัน → highlight bg + badge `"ต่างกัน"` สี `#C8102E`
- Best value → icon/text สี `#C8102E`
- ค่า null → `"–"` เสมอ

**Filter Toggle:** checkbox `"แสดงเฉพาะหัวข้อที่ต่างกัน"`

**Action Bar:** ปุ่ม `"ดูรายละเอียด"` (ต่อ package) + ปุ่ม `"ล้างการเปรียบเทียบ"`

**Mobile:** label column sticky left, table scroll แนวนอน

**Add Package Modal:** search input + filter chips + result list (disabled ถ้าเพิ่มแล้ว)

---

### 4.7 Roaming Page (/roaming)

**Body:** ไม่มี padding — `<iframe>` เต็มพื้นที่ระหว่าง Header กับ Footer

```
src: https://public.tableau.com/views/_16678808144210/IMRITS
     ?:embed=y&:showVizHome=no&:toolbar=yes&:animate_transition=yes
     &:display_count=yes&:language=en-US
width: 100%
height: calc(100vh - header_height - footer_height)
frameborder: 0
allowfullscreen: true
```

- Loading state: spinner กึ่งกลาง
- Error state: ข้อความ + ปุ่ม Reload
- Mobile: height 80vh, `-webkit-overflow-scrolling: touch`

---

### 4.8 Article Detail Page (/article)

**URL:** `/article?id={articleId}` หรือ `/article/{slug}`
**Layout:** 2-column `[main ~720px] + [sidebar ~280px sticky]`

**Sections:**
1. Breadcrumb: ข่าวสาร › หมวดหมู่ › ชื่อบทความ
2. Article Header: Category Badge + Title (h1) + Meta row (วันที่ · เวลาอ่าน · จำนวนผู้ชม)
3. Share Bar: Facebook / X / Copy link (toast) / พิมพ์
4. Hero Image: 16:9, caption ใต้รูป, ซ่อนถ้าไม่มีรูป
5. Article Body: rich text รองรับ h2/h3/p/ul/ol/blockquote/img/table/a/code
6. Tags: pill chips ที่กดได้ → filter รายการบทความ
7. Prev/Next Navigation: 2-column grid
8. Related Articles: compact cards สูงสุด 5 รายการ

**Sidebar (desktop only, sticky):**
- แชร์บทความ (ปุ่มเดียวกับ Section 3 จัดแนวตั้ง)

**Mobile:**
- ซ่อน sidebar
- Share bar → floating bar ติดด้านล่าง viewport

---

## 5. Back Office System (/backoffice)

### 5.1 Login Page (/backoffice/login)

**Layout:** หน้าแยก ไม่ใช้ Header/Footer ของ public site
**Theme:** ยังคงใช้ color palette เดิม (`#C8102E` เป็น accent)

**Login Form:**
| Field | Type | Validation |
|---|---|---|
| Username | text | required |
| Password | password + toggle show/hide | required |
| ปุ่ม "เข้าสู่ระบบ" | submit | disabled ขณะ loading |

**Demo Credentials Block** (แสดงใต้ form — สำหรับ demo เท่านั้น):

| Role | Username | Password |
|---|---|---|
| Admin | admin | admin1234 |
| Editor | editor | editor1234 |
| Viewer | viewer | viewer1234 |

- Style: card bg `#FEF0F2`, border `1px solid #F5C0C8`, border-radius 8px
- แต่ละแถวมีปุ่ม `"ใช้บัญชีนี้"` → auto-fill form (ไม่ submit อัตโนมัติ)
- Warning label: `"⚠️ สำหรับการสาธิตเท่านั้น ห้ามใช้ใน Production"` — สี `#C8102E`, 12px

**Login States:**
| State | การแสดงผล |
|---|---|
| Loading | ปุ่ม disabled + spinner สี `#C8102E` |
| Error | inline error ใต้ form สี `#C8102E` |
| Success | redirect `/backoffice/dashboard` |
| Locked | ข้อความติดต่อ admin |

---

### 5.2 Back Office Layout (หลัง Login)

- **Shell:** Sidebar ซ้าย (240px) + Top bar + Main content
- **Top bar:** Logo, ชื่อผู้ใช้, ปุ่ม Logout
- **Sidebar:** เมนูทุก module, active state bg `#FEF0F2` text `#C8102E`
- **Mobile:** Sidebar พับ → hamburger

---

### 5.3 Module: User Management (/backoffice/users)

**List:** ตาราง — ชื่อ-นามสกุล, Username, Role, สถานะ, วันที่, Action
**Features:** ค้นหา, filter Role/Status, Pagination

**Create/Edit User:**
| Field | Type |
|---|---|
| ชื่อ-นามสกุล | text |
| Username | text (unique) |
| Password | password (required เฉพาะสร้างใหม่) |
| Role | dropdown: Admin / Editor / Viewer |
| สถานะ | toggle Active/Inactive |

**Actions:** สร้าง / แก้ไข / Reset Password / เปิด-ปิดสถานะ / ลบ (confirm dialog)

---

### 5.4 Module: Dashboard (/backoffice/dashboard)

**Filter:** Date range (วันนี้ / 7 วัน / 30 วัน / custom)

**KPI Cards:**
| Metric | รายละเอียด |
|---|---|
| ผู้เข้าชมทั้งหมด | Total visits |
| Unique Visitors | ไม่ซ้ำ |
| การค้นหาทั้งหมด | จำนวน search |
| หน้าที่เข้าชมมากสุด | Top page |

**Charts:**
| Chart | ประเภท | ข้อมูล |
|---|---|---|
| Traffic Overview | Line chart | visitor รายวัน |
| Search Keywords | Bar chart / Table | คำค้นหา + จำนวน |
| แพ็กเกจยอดนิยม | Bar chart / Table | แพ็กเกจที่ดูมากสุด |
| Device/Browser | Pie chart | สัดส่วน device |
| Traffic Source | Pie chart | organic/direct/referral |

---

### 5.5 Module: CMS (/backoffice/cms)

**Sub-menus:** Information / Blogs / FAQ

#### Information
- List: ชื่อหน้า, สถานะ Publish, วันแก้ไขล่าสุด, Action
- Edit: Rich text editor (WYSIWYG) + Save Draft / Publish

#### Blogs
**List columns:** หัวข้อ, หมวดหมู่, สถานะ (Draft/Published/Archived), วันเผยแพร่
**Filter:** หมวดหมู่, สถานะ, ช่วงวันที่

**Create/Edit fields:**
| Field | Type |
|---|---|
| หัวข้อ | text |
| Slug | text (auto-gen, แก้ไขได้) |
| หมวดหมู่ | dropdown |
| แท็ก | multi-select tag input |
| Hero Image | upload + preview |
| เนื้อหา | WYSIWYG rich text |
| สถานะ | Draft / Published / Archived |
| วันที่เผยแพร่ | datetime picker (รองรับ schedule) |

#### FAQ
**List columns:** คำถาม, หมวดหมู่, ลำดับ, สถานะ, Action
**Create/Edit:** หมวดหมู่ + คำถาม + คำตอบ (rich text) + ลำดับ + toggle Active

---

### 5.6 Module: Package Verification (/backoffice/packages/verification)

**วัตถุประสงค์:** ตรวจสอบแพ็กเกจในระบบว่ายังขายบน platform ของ Provider จริงหรือไม่
**Mechanism:** Web Scraping ผ่าน Cron Job อัตโนมัติ

**Fields ต่อ Package:**
| Field | รายละเอียด |
|---|---|
| Provider URL | URL หน้าขายแพ็กเกจ (กรอกโดยเจ้าหน้าที่) |
| สถานะ | Active / Inactive / Pending / Error |
| วันที่ตรวจสอบล่าสุด | timestamp |
| ผลการตรวจสอบ | พบ / ไม่พบ / Error |
| รายละเอียด Error | scraping log |

**Dashboard:**
- Summary cards: Active / Inactive / Error / Pending count
- ตาราง log รายแพ็กเกจ + filter ตามสถานะ
- ปุ่ม "Run Verification ทันที" (manual trigger)
- ปุ่ม "ดู Log" → modal history log ต่อแพ็กเกจ
- Cron schedule setting + แสดงเวลา run ครั้งถัดไป

---

### 5.7 Module: Report (/backoffice/reports)

**Sub-menus:** User Activity Report / Package Verification Report

**Export PDF Flow:**
1. กด "Export PDF"
2. เปิด Preview Modal: header รายงาน + ตารางข้อมูล
3. ปุ่ม "ดาวน์โหลด PDF" → generate + download
4. ปุ่ม "ยกเลิก" → ปิด modal

**PDF Content:** header (ชื่อรายงาน, ช่วงวันที่, logo) + ตาราง + footer (วันที่, ชื่อเจ้าหน้าที่, เลขหน้า)

---

### 5.8 Permission Matrix

| Module | Admin | Editor | Viewer |
|---|---|---|---|
| User Management | ✅ Full | ❌ | ❌ |
| Dashboard | ✅ | ✅ | ✅ |
| CMS | ✅ Full | ✅ Full | 👁 Read only |
| Package Management | ✅ Full | ✅ Full | 👁 Read only |
| Verification | ✅ Full | ✅ Full | 👁 Read only |
| Report & Export | ✅ | ✅ | ✅ |

Route ที่ไม่มีสิทธิ์ → redirect หน้า 403 + ปุ่มกลับ Dashboard

---

## 6. Global States (ทุกหน้า)

| State | การแสดงผล |
|---|---|
| Loading | Skeleton pulse animation, bg `#F0F0F0` |
| Empty | รูป + ข้อความ "ไม่พบข้อมูล" |
| API Error | Toast สี `#C8102E` + ปุ่ม Retry |
| Save success | Toast สีเขียว "บันทึกสำเร็จ" หายใน 3 วินาที |
| Delete confirm | Modal dialog ยืนยันทุกครั้ง |
| Session expired | Redirect `/backoffice/login` + toast แจ้งเตือน |
| Unauthorized 403 | หน้า error + ปุ่มกลับ Dashboard |
| Copy link success | Toast "คัดลอกลิงก์แล้ว" หายใน 2 วินาที |
| Null/undefined value | แสดง `"–"` เสมอ ห้ามแสดง null |

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | < 768px | 1 column, hamburger nav, drawer filter, floating share bar |
| Tablet | 768–1023px | 2 column บางหน้า, full nav links |
| Desktop | ≥ 1024px | Full layout, sticky sidebars |

---

## 8. Mock Data Reference

```json
{
  "package": {
    "id": "pkg001",
    "operator": "dtac",
    "name": "5G MaxSpeed VIU 439B(200min net90GB)",
    "price": 439,
    "duration_days": 30,
    "call_minutes": 200,
    "sms": null,
    "mms": null,
    "internet_gb": 90,
    "internet_speed": null,
    "wifi": null,
    "privileges": ["ความบันเทิง"],
    "terms": "ข้อกำหนดและเงื่อนไขแพ็กเกจ...",
    "provider_url": "https://www.dtac.co.th/packages/pkg001"
  },
  "article": {
    "id": "art001",
    "slug": "dtac-5g-discount-2025",
    "category": "โปรโมชั่น",
    "title": "DTAC ลดราคาแพ็กเกจ 5G สูงสุด 30%",
    "published_at": "2025-04-25",
    "reading_time_min": 5,
    "view_count": 1240,
    "tags": ["5G", "dtac", "โปรโมชั่น"]
  }
}
```