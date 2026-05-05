import { styled } from "styled-components";
import Box from "@mui/material/Box";

export const HomeBox = styled(Box)`

  width: 65vw;

.ItemBox {
  display: flex;
  justify-content: center;
  align-items: center; /* center แนวตั้งด้วย */
}
  .IBW80 {
    width:80% !important;
  }
.menu-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.LinkToMNG {
  width: 320px;
  cursor: pointer;
}
 .menu-card {
  display: flex;
  align-items: center;
  gap: 18px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 22px;
  padding: 20px 24px;
  height: 130px;
  transition: all 0.35s ease;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  position: relative;
  overflow: hidden;
}

/* glow effect */
.menu-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent, rgba(99,102,241,0.15), transparent);
  opacity: 0;
  transition: 0.4s;
}

.menu-card:hover::before {
  opacity: 1;
}

/* hover */
.menu-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
}

/* icon */
.menu-icon {
  width: 80px;
  height: 80px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35);
  flex-shrink: 0;
}

.menu-icon img {
  width: 40px;
  
}

/* text */
.menu-text {
  flex: 1;
}

.menu-text h5 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.3px;
}

.menu-text p {
  margin-top: 6px;
  font-size: 0.9rem;
  color: #64748b;
}

/* click area */
.LinkToMNG {
  width: 320px;
  cursor: pointer;
  transition: 0.2s;
}

.LinkToMNG:active {
  transform: scale(0.97);
}
  `;