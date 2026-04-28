## Feature: Back Office System (/backoffice)

### Access Control & Entry Point
- ปุ่ม "เข้าสู่ระบบ" บน Header ของ public site → redirect ไปยัง `/backoffice/login`
- เฉพาะ **เจ้าหน้าที่ที่ได้รับสิทธิ์** เท่านั้นที่เข้าถึงได้
- User ทั่วไปที่พยายามเข้า URL โดยตรง → redirect กลับ `/` (public site)
- Session หมดอายุ → redirect กลับ `/backoffice/login` พร้อม toast แจ้งเตือน

---

### Authentication — Login Page (/backoffice/login)

**Layout**: หน้าแยกต่างหาก ไม่ใช้ Header/Footer ของ public site

**Login Form:**
| Field | Type | Validation |
|---|---|---|
| Username | text input | required |
| Password | password input | required, toggle show/hide |
| ปุ่ม "เข้าสู่ระบบ" | submit button | disabled ขณะ loading |

**Demo Credentials Block:**
แสดงใต้ form เพื่อใช้ในการ demo — จัดเป็น card/box สีอ่อน
มี label กำกับชัดเจนว่า "Demo Account"

| Role | Username | Password |
|---|---|---|
| Admin | admin | admin1234 |
| Editor | editor | editor1234 |
| Viewer | viewer | viewer1234 |

- แต่ละแถวมีปุ่ม "ใช้บัญชีนี้" → กดแล้ว auto-fill username และ password
  ลงใน form ทันที (ไม่ต้อง submit อัตโนมัติ ให้ผู้ใช้กดเข้าสู่ระบบเอง)
- แสดง badge หรือ label เตือนว่า
  `"⚠️ สำหรับการสาธิตเท่านั้น ห้ามใช้ในระบบ Production"`

**States:**
| State | การแสดงผล |
|---|---|
| Loading | ปุ่ม disabled + spinner |
| Error (credentials ผิด) | inline error message ใต้ form |
| Success | redirect ไป `/backoffice/dashboard` |
| Locked account | แสดงข้อความติดต่อ admin |

---

### Back Office Layout (หลัง Login)

- **Shell**: Sidebar navigation (ซ้าย) + Top bar + Main content area (ขวา)
- **Top bar**: Logo / ชื่อระบบ, ชื่อผู้ใช้ที่ login, ปุ่ม Logout
- **Sidebar**: เมนูหลักทุก module เรียงแนวตั้ง, highlight เมนูที่ active
- **Mobile**: Sidebar พับซ่อน เปิดด้วย hamburger button

---

### Module 1 — User Management (/backoffice/users)

**หน้ารายการ (List):**
- ตารางแสดง user ทั้งหมด
- Columns: ชื่อ-นามสกุล, Username, Role, สถานะ (Active/Inactive), วันที่สร้าง, Action
- Features: ค้นหา, filter ตาม Role และ Status, Pagination

**หน้าสร้าง/แก้ไข User:**
| Field | Type |
|---|---|
| ชื่อ-นามสกุล | text |
| Username | text (unique) |
| Password | password (required เฉพาะสร้างใหม่) |
| Role | dropdown (Admin / Editor / Viewer หรือตามที่กำหนด) |
| สถานะ | toggle Active/Inactive |

**Actions:**
- สร้าง User ใหม่
- แก้ไขข้อมูล User
- Reset Password
- เปิด/ปิดสถานะ User
- ลบ User (ต้อง confirm dialog ก่อน)

---

### Module 2 — Dashboard (/backoffice/dashboard)

ภาพรวมการใช้งาน platform แบบ real-time และ historical

**Date Range Filter**: เลือกช่วงเวลา (วันนี้ / 7 วัน / 30 วัน / custom range)

**Metric Cards (KPI row):**
| Metric | รายละเอียด |
|---|---|
| ผู้เข้าชมทั้งหมด | Total visits ในช่วงที่เลือก |
| Unique Visitors | จำนวน user ไม่ซ้ำ |
| การค้นหาทั้งหมด | จำนวน search ที่เกิดขึ้น |
| หน้าที่เข้าชมมากสุด | Top page |

**Charts:**
| Chart | ประเภท | ข้อมูล |
|---|---|---|
| Traffic Overview | Line chart | จำนวน visitor รายวัน |
| Search Keywords | Bar chart / Table | คำค้นหายอดนิยม + จำนวนครั้ง |
| แพ็กเกจยอดนิยม | Bar chart / Table | แพ็กเกจที่ถูกดูมากสุด |
| Device / Browser | Pie chart | สัดส่วน device ที่ใช้งาน |
| Traffic by Source | Pie chart | organic / direct / referral |

---

### Module 3 — CMS (/backoffice/cms)

Sidebar sub-menu แยก 3 หมวด: Information / Blogs / FAQ

#### 3.1 Information (/backoffice/cms/information)
จัดการหน้าข้อมูลคงที่ของเว็บไซต์ (เช่น เกี่ยวกับเรา, นโยบาย, ติดต่อ)

**หน้ารายการ:** ตาราง — ชื่อหน้า, สถานะ Publish, วันที่แก้ไขล่าสุด, Action
**หน้าแก้ไข:** Rich text editor (WYSIWYG) + ปุ่ม Save Draft / Publish

#### 3.2 Blogs (/backoffice/cms/blogs)
จัดการบทความและข่าวสาร

**หน้ารายการ:**
- Columns: หัวข้อ, หมวดหมู่, สถานะ (Draft/Published/Archived), วันที่เผยแพร่, Action
- Filter: หมวดหมู่, สถานะ, ช่วงวันที่
- ค้นหา: ตามหัวข้อ

**หน้าสร้าง/แก้ไขบทความ:**
| Field | Type |
|---|---|
| หัวข้อ | text |
| Slug (URL) | text (auto-generate จาก title, แก้ไขได้) |
| หมวดหมู่ | dropdown |
| แท็ก | multi-select / tag input |
| Hero Image | image upload + preview |
| เนื้อหา | Rich text editor (WYSIWYG) รองรับ h2, h3, list, blockquote, image, table |
| สถานะ | Draft / Published / Archived |
| วันที่เผยแพร่ | date-time picker (รองรับ schedule publish) |

#### 3.3 FAQ (/backoffice/cms/faq)
จัดการคำถามที่พบบ่อย

**หน้ารายการ:** ตาราง — คำถาม, หมวดหมู่, ลำดับ, สถานะ, Action
**หน้าสร้าง/แก้ไข:**
| Field | Type |
|---|---|
| หมวดหมู่ | dropdown |
| คำถาม | text |
| คำตอบ | Rich text editor |
| ลำดับการแสดง | number input (drag-to-reorder ถ้าทำได้) |
| สถานะ | toggle Active/Inactive |

---

### Module 4 — Package Management (/backoffice/packages)

#### 4.1 Package List
- ตารางแพ็กเกจทั้งหมดในระบบ
- Columns: ชื่อแพ็กเกจ, Provider, ราคา, สถานะ Verification, วันที่ตรวจสอบล่าสุด, Action
- Filter: Provider, ประเภทแพ็กเกจ, สถานะ Verification

#### 4.2 Verification Management (/backoffice/packages/verification)

**วัตถุประสงค์:** ตรวจสอบว่าแพ็กเกจที่มีในระบบยังคงขายอยู่บน platform ของ Provider จริงหรือไม่
โดยใช้ **Web Scraping** เป็น mechanism หลักในการตรวจสอบ ผ่าน Cron Job ที่ทำงานอัตโนมัติ

**ข้อมูลที่ต้องการต่อ Package:**
| Field | รายละเอียด |
|---|---|
| Provider URL | URL หน้าขายแพ็กเกจบนเว็บ Provider (กรอกโดยเจ้าหน้าที่) |
| สถานะ Verification | Active / Inactive / Pending / Error |
| วันที่ตรวจสอบล่าสุด | timestamp ล่าสุดที่ cron รัน |
| ผลการตรวจสอบ | พบ / ไม่พบ / Error (scraping ล้มเหลว) |
| รายละเอียด Error | log ข้อผิดพลาด (ถ้ามี) |

**หน้า Verification Dashboard:**
- Summary cards: จำนวนแพ็กเกจ Active / Inactive / Error / Pending
- ตาราง log การตรวจสอบรายแพ็กเกจ พร้อม filter ตามสถานะ
- ปุ่ม "Run Verification ทันที" (manual trigger สำหรับ cron)
- ปุ่ม "ดู Log" ต่อแพ็กเกจ → modal/drawer แสดง history log การตรวจสอบ

**Cron Schedule Setting:**
- กำหนดความถี่การรัน Verification (เช่น ทุก 24 ชั่วโมง)
- แสดงเวลา Cron รันครั้งถัดไป

---

### Module 5 — Report (/backoffice/reports)

Sidebar sub-menu แยก 2 ประเภท

#### 5.1 User Activity Report
ข้อมูลพฤติกรรมการใช้งานของ user บน public site

**Filter:**
| Filter | Options |
|---|---|
| ช่วงวันที่ | date range picker |
| ประเภทกิจกรรม | การค้นหา / การดูแพ็กเกจ / การเปรียบเทียบ / การดูบทความ |
| Device | All / Desktop / Mobile / Tablet |

**ตารางข้อมูล:** user session, กิจกรรม, timestamp, device, หน้าที่เข้าชม

#### 5.2 Package Verification Report
ผลการตรวจสอบแพ็กเกจสะสม

**Filter:** ช่วงวันที่, Provider, สถานะ Verification

**ตารางข้อมูล:** ชื่อแพ็กเกจ, Provider, URL, ผลการตรวจสอบ, วันที่ตรวจสอบ

---

### Export to PDF (ทั้ง 2 Report)

**Flow:**
1. ผู้ใช้กด "Export PDF"
2. เปิด **Preview Modal** แสดง layout ของ PDF ก่อน export
   - แสดง header รายงาน: ชื่อรายงาน, ช่วงวันที่, วันที่ export, ชื่อผู้ export
   - Preview ตารางข้อมูล
3. ปุ่ม "ดาวน์โหลด PDF" → generate และ download ไฟล์
4. ปุ่ม "ยกเลิก" → ปิด modal

**PDF Content:**
- Header: ชื่อรายงาน, ช่วงวันที่, logo หน่วยงาน
- ตารางข้อมูลตาม filter ที่เลือก
- Footer: วันที่ export, ชื่อเจ้าหน้าที่, เลขหน้า

---

### Permission Matrix (Role-based Access)

| Module | Admin | Editor | Viewer |
|---|---|---|---|
| User Management | ✅ Full | ❌ | ❌ |
| Dashboard | ✅ | ✅ | ✅ |
| CMS | ✅ Full | ✅ Full | 👁 Read only |
| Package Management | ✅ Full | ✅ Full | 👁 Read only |
| Verification Management | ✅ Full | ✅ Full | 👁 Read only |
| Report & Export | ✅ | ✅ | ✅ |

- Route ที่ไม่มีสิทธิ์ → redirect ไปหน้า 403 Forbidden พร้อมปุ่มกลับ Dashboard

---

### States to Handle (Global)

| State | การแสดงผล |
|---|---|
| Loading (table/chart) | Skeleton loader |
| Empty state (ไม่มีข้อมูล) | ภาพ + ข้อความ "ไม่พบข้อมูล" |
| API Error | Toast error + ปุ่ม Retry |
| Save success | Toast "บันทึกสำเร็จ" หายใน 3 วินาที |
| Delete confirm | Dialog ยืนยันก่อนลบทุกครั้ง |
| Session expired | Redirect login + toast แจ้งเตือน |
| Unauthorized (403) | หน้า error พร้อมปุ่มกลับ Dashboard |