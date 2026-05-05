import styled from "styled-components";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Dialog } from "@mui/material";

/* =========================================================
APPLE + HOSPITAL ENTERPRISE
อัปเกรดให้ “เหมือน mockup จริง”
โทน: Apple glass / Enterprise / Ultra clean / Premium form
ใช้แทน OccurrenceStyle เดิมได้เลย
========================================================= */

export const OccurrenceStyle = styled(Box)`
  width: 1280px;
  max-width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  color: #0f172a;
  font-family: "Sarabun", sans-serif;

/* =========================
GLOBAL PAGE
========================= */
.MainContainer {
  width: 100%;
  padding: 34px;
  border-radius: 0 0 32px 32px;

  background: #F3F6FE;

}

/* =========================
TOP HEADER
========================= */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 26px;

}

.page-header-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.page-icon {
  width: 62px;
  height: 62px;
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;
  color: white;

  background:
    linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);

  box-shadow:
    0 12px 24px rgba(37,99,235,0.28);
}

.page-header h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.page-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.98rem;
}

/* =========================
DRAFT BUTTON
========================= */
.draft-btn {
  border: none !important;
  border-radius: 18px !important;
  padding: 14px 24px !important;
  font-weight: 700 !important;

  color: #1d4ed8 !important;
  background: rgba(37,99,235,0.08) !important;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.8);

  transition: all 0.25s ease !important;
}

.draft-btn:hover {
  background: rgba(37,99,235,0.14) !important;
  transform: translateY(-2px);
}
.section-main {
  position: relative;
  overflow: visible;

  margin-top: 24px;
  padding: 28px;

  border-radius: 32px !important;

  /* ขาวจริง */
  background: #ffffff !important;

  /* กัน gradient parent ทะลุ */
  background-image: none !important;

  /* card ชัดแบบ mockup */
  border: 1px solid rgba(226, 232, 240, 0.9);

  box-shadow:
    0 20px 45px rgba(15, 23, 42, 0.08),
    0 8px 20px rgba(15, 23, 42, 0.04),
    inset 0 1px 0 rgba(255,255,255,0.95);

  backdrop-filter: none !important;

  z-index: 2;
}

/* ถ้า parent ยังฟ้าจัด ลดลง */
.MainContainer {
  background: #f8fafc !important;
}

/* mobile */
@media (max-width: 992px) {
  .section-main {
    padding: 18px;
    border-radius: 24px !important;
  }
}

.section-card {
  position: relative;
  overflow: hidden;

  margin-top: 24px;
  padding: 28px;

  border-radius: 30px;

  background:
    linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82));



  box-shadow:
    0 18px 40px rgba(10, 21, 48, 0.06),
    0 8px 18px rgba(26, 110, 245, 0.06),
    inset 0 1px 0 rgba(255,255,255,0.95);

  backdrop-filter: blur(18px);

  transition: all 0.28s ease;
     border: 1px solid rgba(255,255,255,0.65);
  border-left: 4px solid #2563eb;
}

.section-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 24px 50px rgba(37,99,235,0.10),
    0 10px 24px rgba(15,23,42,0.08);
}
.section-action {
  display: flex;
  justify-content: flex-start; /* จัดไปทางซ้าย */
  width: 100%;                /* มั่นใจว่ากินพื้นที่เต็มความกว้าง */
}


/* =========================
SECTION HEADER
========================= */
.section-header.modern {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 22px;
}

.step-circle {
  min-width: 46px;
  height: 46px;
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.05rem;
  font-weight: 800;
  color: white;

  background:
    linear-gradient(135deg, #2563eb, #4f46e5);

  box-shadow:
    0 10px 22px rgba(37,99,235,0.22);
}

.section-header h4 {
  margin: 0;
  font-size: 1.28rem;
  font-weight: 800;
}

.section-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.92rem;
 
}
  .read-only{
  text-align:left;
  }

/* =========================
ADD BUTTON
========================= */
.add-doc-btn {
  border: none !important;
  border-radius: 18px !important;

  padding: 14px 24px !important;

  font-weight: 700 !important;
  color: white !important;

  background:
    linear-gradient(135deg, #2563eb, #1d4ed8) !important;

  box-shadow:
    0 12px 24px rgba(37,99,235,0.24) !important;

  transition: all 0.25s ease !important;
}

.add-doc-btn:hover {
  transform: translateY(-3px);
}

/* =========================================
PRIORITY MODERN CARD
========================================= */

.priority-modern-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  gap: 18px;
  width: 100%;
}

/* CARD */
.priority-modern-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 18px 22px;
  min-height: 92px;

  border-radius: 18px;
  border: 1.5px solid #e2e8f0;

  background: rgba(255,255,255,0.88);

  cursor: pointer;
  transition: all 0.28s ease;

  box-shadow:
    0 4px 14px rgba(15,23,42,0.04),
    inset 0 1px 0 rgba(255,255,255,0.9);
}

.priority-modern-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 24px rgba(15,23,42,0.06);
}

/* hide radio */
.priority-modern-card input {
  display: none;
}

/* LEFT */
.priority-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ICON */
.priority-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
  font-weight: bold;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 4px 10px rgba(0,0,0,0.06);
}

/* urgent icon */
.urgent-icon {
  color: white;
  background: linear-gradient(135deg, #fab4b45e, #ed89896f);
}

/* normal icon */
.normal-icon {
  color: #64748b;
  background: linear-gradient(135deg, #f1f5f9, #dbeafe);
}

/* TEXT */
.priority-text h4 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.2;
}

.priority-text p {
  margin: 4px 0 0;
  font-size: 0.88rem;
  color: #64748b;
}

/* custom radio */
.custom-radio {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  position: relative;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

/* active dot */
.custom-radio::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.25s ease;
}

/* =========================================
URGENT ACTIVE
========================================= */
.priority-modern-card.urgent.active {
  background:
    linear-gradient(135deg, rgba(255,240,240,0.95), rgba(255,248,248,0.92));

  border-color: rgba(239,68,68,0.28);

  box-shadow:
    0 8px 24px rgba(239,68,68,0.10);
}

.priority-modern-card.urgent.active h4 {
  color: #ef4444;
}

.priority-modern-card.urgent.active .custom-radio {
  border-color: #ef4444;
}

.priority-modern-card.urgent.active .custom-radio::after {
  background: #ef4444;
  transform: translate(-50%, -50%) scale(1);
}

/* =========================================
NORMAL ACTIVE
========================================= */
.priority-modern-card.normal.active {
  background:
    linear-gradient(135deg, rgba(248,250,252,0.96), rgba(255,255,255,0.92));

  border-color: rgba(148,163,184,0.28);

  box-shadow:
    0 8px 24px rgba(59,130,246,0.06);
}

.priority-modern-card.normal.active .custom-radio {
  border-color: #64748b;
}

.priority-modern-card.normal.active .custom-radio::after {
  background: #64748b;
  transform: translate(-50%, -50%) scale(1);
}

/* =========================================
MOBILE
========================================= */
@media (max-width: 992px) {
  .priority-modern-group {
    grid-template-columns: 1fr;
  }
}
/* =========================
TABLE
========================= */
.modern-table {
  border-collapse: separate !important;
  border-spacing: 0 16px !important;
}

.modern-table thead th {
  border: none !important;

  padding: 18px 14px !important;

  font-size: 0.88rem;
  font-weight: 800;
  color: #475569;

  background:
    linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.06));
}

.modern-table tbody tr {
  background: rgba(255,255,255,0.95);

  box-shadow:
    0 8px 20px rgba(15,23,42,0.05);

  transition: all 0.24s ease;
}

.modern-table tbody tr:hover {
  transform: scale(1.01);
}

.modern-table tbody td {
  border: none !important;
  padding: 16px 12px !important;
  vertical-align: middle !important;
}

.modern-table tbody tr td:first-child {
  border-radius: 18px 0 0 18px;
}

.modern-table tbody tr td:last-child {
  border-radius: 0 18px 18px 0;
}

/* =========================
INPUT
========================= */
.modern-input {
  height: 58px !important;
  border-radius: 18px !important;

  border: 1px solid #dbe4f0 !important;

  background: rgba(248,250,252,0.95) !important;

  padding-left: 16px !important;

  font-size: 0.95rem !important;

  transition: all 0.22s ease !important;
}

.modern-input:focus {
  border-color: #2563eb !important;

  box-shadow:
    0 0 0 5px rgba(37,99,235,0.12) !important;
}

/* =========================
DELETE BUTTON
========================= */
.delete-btn {
  border: none !important;
  background: rgba(239,68,68,0.08) !important;

  width: 48px;
  height: 48px;

  border-radius: 16px !important;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ef4444 !important;

  transition: all 0.25s ease !important;
}

.delete-btn:hover {
  background: rgba(239,68,68,0.16) !important;
  transform: scale(1.08);
}

/* =========================
RADIO CARDS
========================= */
.card-radio-group,
.priority-group {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}
/* =========================================
FIX จริง: ข้อความ "ส่งเอกสาร" ไม่ชิดซ้าย
ปัญหาเกิดจาก h2 / p ถูก .page-header h2 และ p override
และ parent มี text-align center จากที่อื่น
========================================= */

/* HEADER หลัก */
.page-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  width: 100%;
  margin-bottom:40px;
}

/* ฝั่งซ้าย */
.page-header-left {
  display: flex !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  gap: 18px;
  flex: 1;
  width: 100%;
  text-align: left !important;
}

/* กล่องข้อความ */
.text-left {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: center !important;

  flex: 1;
  width: 100%;

  text-align: left !important;
}

/* บังคับทุก element ข้างใน */
.text-left * {
  width: 100%;
  text-align: left !important;
}

/* title */
.text-left h2 {
  margin: 0 !important;
  padding: 0 !important;

  font-size: 2rem !important;
  font-weight: 800 !important;
  line-height: 1.15 !important;

  color: #0f172a !important;

  display: block !important;
  text-align: left !important;
}

/* subtitle */
.text-left p {
  margin: 4px 0 0 0 !important;
  padding: 0 !important;

  font-size: 0.96rem !important;
  line-height: 1.4 !important;

  color: #64748b !important;

  display: block !important;
  text-align: left !important;
}

/* กัน bootstrap / mui override */
.page-header h2,
.page-header p {
  text-align: left !important;
}
/* =========================================
BOTTOM ACTION BAR
Apple / Enterprise / Hospital Premium
========================================= */

.bottom-action-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;

  margin-top: 26px;

  border-radius: 0 0 22px 22px;


}

/* ===== Cancel Button ===== */
.cancel-doc-btn {
  min-width: 118px !important;
  height: 52px;

  border-radius: 14px !important;
  border: 1px solid #dbe4f0 !important;

  background: linear-gradient(180deg, #ffffff, #f8fafc) !important;
  color: #475569 !important;

  font-size: 1rem !important;
  font-weight: 700 !important;

  display: flex !important;
  align-items: center;
  justify-content: center;

  box-shadow:
    0 4px 10px rgba(15,23,42,0.04),
    inset 0 1px 0 rgba(255,255,255,0.95);

  transition: all 0.25s ease !important;
}

.cancel-doc-btn:hover {
  background: #f1f5f9 !important;
  color: #0f172a !important;
  transform: translateY(-2px);
}

/* ===== Submit Button ===== */
.submit-doc-btn {
  min-width: 160px !important;
  height: 52px;

  border: none !important;
  border-radius: 14px !important;

  background: linear-gradient(135deg, #19a42aff 0%, #13d068ff 100%) !important;
  color: white !important;

  font-size: 1rem !important;
  font-weight: 800 !important;

  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 8px;

  box-shadow:
    0 12px 24px rgba(37,99,235,0.28),
    inset 0 1px 0 rgba(255,255,255,0.22);

  transition: all 0.25s ease !important;
}

.submit-doc-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 18px 30px rgba(37,99,235,0.34);
}

/* icon */
.submit-doc-btn svg {
  font-size: 18px;
}

.edit-doc-btn {
  min-width: 160px !important;
  height: 52px;

  border: none !important;
  border-radius: 14px !important;

  background: linear-gradient(135deg, #ebdb25ff 0%, #d8d51dff 100%) !important;
  color: white !important;

  font-size: 1rem !important;
  font-weight: 800 !important;

  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 8px;

  box-shadow:
    0 12px 24px rgba(229, 235, 37, 0.28),
    inset 0 1px 0 rgba(255,255,255,0.22);

  transition: all 0.25s ease !important;
}

.edit-doc-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 18px 30px rgba(209, 235, 37, 0.34);
}

/* icon */
.edit-doc-btn svg {
  font-size: 18px;
}
/* mobile */
@media (max-width: 992px) {
  .page-header {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  .page-header-left {
    width: 100%;
  }

  .text-left h2 {
    font-size: 1.5rem !important;
  }
}
.radio-card,
.priority-card {
  margin: 0 !important;

  padding: 14px 20px;

  border-radius: 18px;

  border: 1px solid #dbe4f0;

  background: rgba(255,255,255,0.88);

  transition: all 0.22s ease;
}

.radio-card:hover,
.priority-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 18px rgba(37,99,235,0.08);
}

.priority-card.urgent.active {
  background: rgba(239,68,68,0.10);
  border-color: rgba(239,68,68,0.30);
}

.priority-card.normal.active {
  background: rgba(34,197,94,0.10);
  border-color: rgba(34,197,94,0.30);
}

.MuiRadio-root.Mui-checked {
  color: #2563eb !important;
}


.receive-document-card {
  padding: 28px;
}

.receive-progress-guide {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin: 22px 0 30px;
  flex-wrap: wrap;
}

.receive-step {
  display: flex;
  align-items: center;
  gap: 10px;
}

.receive-step span {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.receive-step p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.receive-line {
  width: 34px;
  height: 2px;
  background: #cbd5e1;
}

.receive-input-block {
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.receive-input-label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}
/* READ ONLY SECTION */
.read-only-preview-card {
  border-radius: 28px;
  background: white;
}

.read-info-box {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #dbeafe;
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 88px;
}

.read-info-box label {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  margin: 0;
}

.read-info-box div {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.5;
  word-break: break-word;
}

.read-summary-card {
  background: white;
  border-radius: 20px;
  padding: 18px 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.read-summary-label {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
}

.read-summary-value {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.urgent-card {
  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
  border-color: #fecdd3;
}

.urgent-card .read-summary-value {
  color: #be123c;
}

.normal-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #bfdbfe;
}

.normal-card .read-summary-value {
  color: #1d4ed8;
}
.receive-number {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

.receive-input-body {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  text-align: left;
}

/* =========================
CONFIRM CARD
========================= */
.receive-confirm-card {
  width: 100%;
  max-width: 460px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  gap: 18px;
  padding: 22px 24px;
  border-radius: 24px;
  border: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #fff8e7 0%, #f4e4b8 100%);
  cursor: pointer;
  transition: all 0.3s ease;
}

.receive-confirm-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(212, 175, 55, 0.16);
}

.receive-confirm-card.checked {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: rgba(34, 197, 94, 0.25);
  box-shadow: 0 12px 26px rgba(34, 197, 94, 0.22);
}

.receive-confirm-icon {
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 12px;
  border: 2px solid #d6b86a;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.55);
  color: #7c5a10;
  font-weight: 900;
  font-size: 16px;
}

.receive-confirm-card.checked .receive-confirm-icon {
  background: white;
  color: #16a34a;
  border-color: white;
}

.receive-confirm-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  width: 100%;
}

.receive-confirm-title {
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
  text-align: left;
  width: 100%;
}

.receive-confirm-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-top: 4px;
  text-align: left;
  width: 100%;
}

.receive-confirm-card.checked .receive-confirm-title,
.receive-confirm-card.checked .receive-confirm-subtitle {
  color: white;
}
  /* =========================
   BACK BUTTON - MATCH HEADER UI
   Apple + Enterprise Style
========================= */
.back-btn-modern {
  width: 52px !important;
  height: 52px !important;
  border-radius: 18px !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  background: linear-gradient(135deg, #eef4ff 0%, #dbeafe 100%) !important;
  color: #1e3a8a !important;

  border: 1px solid rgba(59, 130, 246, 0.12) !important;

  box-shadow:
    0 4px 14px rgba(30, 58, 138, 0.08),
    inset 0 1px 0 rgba(255,255,255,0.9) !important;

  transition: all 0.25s ease !important;

  margin-right: 14px !important;
}

/* Hover */
.back-btn-modern:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
  color: #ffffff !important;

  transform: translateY(-2px) scale(1.03);

  box-shadow:
    0 10px 24px rgba(37, 99, 235, 0.28),
    0 4px 10px rgba(30, 64, 175, 0.18) !important;
}

/* Click */
.back-btn-modern:active {
  transform: scale(0.97);
}

/* Icon */
.back-btn-modern svg {
  font-size: 24px !important;
  transition: transform 0.25s ease;
}

.back-btn-modern:hover svg {
  transform: translateX(-2px);
}
/* =========================
RESPONSIVE
========================= */
@media (max-width: 992px) {
  .MainContainer {
    padding: 18px;
  }

  .page-header {
    flex-direction: column;
    gap: 18px;
    align-items: flex-start;
  }

  .section-card {
    padding: 20px;
    border-radius: 24px;

  }

  .page-header h2 {
    font-size: 1.5rem;
  }
    
}
`; 