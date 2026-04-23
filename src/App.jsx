import { useState, useRef, useEffect } from "react";
import Matter from "matter-js";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&family=Noto+Sans+KR:wght@100;200;300;400;500;700&display=swap');

  * { box-sizing:border-box; margin:0; padding:0; }
  html, body { width:100%; height:100%; background:#050b1a; overflow:hidden; }

  :root {
    --gold-50:  #faf1d8; --gold-100: #f5e6bf; --gold-200: #eed398;
    --gold-300: #e4bd6c; --gold-400: #d4a840; --gold-500: #b8922e;
    --cream: #f8f1dd; --white: #ffffff;
    --font: 'Montserrat', 'Noto Sans KR', sans-serif;
    --font-ko: 'Noto Sans KR', 'Montserrat', sans-serif;
  }

  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown  { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUpLg  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes glow-breathe {
    0%,100% { box-shadow: 0 0 0 0 rgba(228,189,108,0); }
    50%     { box-shadow: 0 0 40px 2px rgba(228,189,108,0.3); }
  }
  @keyframes text-glow {
    0%,100% { text-shadow: 0 0 20px rgba(228,189,108,0.2); }
    50%     { text-shadow: 0 0 40px rgba(228,189,108,0.45), 0 0 80px rgba(228,189,108,0.15); }
  }
  @keyframes confetti-fall {
    0%   { transform:translateY(-20px) rotate(0deg); opacity:1; }
    100% { transform:translateY(110vh) rotate(720deg); opacity:0; }
  }
  @keyframes winner-reveal {
    0%   { opacity:0; transform:scale(0.82) translateY(36px); filter:blur(8px); }
    60%  { transform:scale(1.04) translateY(-6px); filter:blur(0); }
    100% { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes rise {
    0%   { opacity:0; transform:translateY(10px); }
    100% { opacity:1; transform:translateY(0); }
  }
  @keyframes float-particle {
    0%,100% { transform:translateY(0) translateX(0); opacity:0.3; }
    50%     { transform:translateY(-20px) translateX(10px); opacity:0.8; }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:0.3; transform:scale(1); }
    50%     { opacity:1; transform:scale(1.3); }
  }
  @keyframes rank-in {
    0%   { opacity:0; transform:translateX(20px); }
    100% { opacity:1; transform:translateX(0); }
  }

  .stage {
    width:100vw; height:100vh;
    background:
      radial-gradient(ellipse 80% 50% at 50% 0%, rgba(42,58,112,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 0% 100%, rgba(212,168,64,0.06) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 100% 100%, rgba(26,38,84,0.4) 0%, transparent 55%),
      linear-gradient(155deg, #1a2654 0%, #0f1a3d 35%, #0a1228 65%, #050b1a 100%);
    display:flex;
    font-family: var(--font); color: var(--white);
    position:relative; overflow:hidden;
  }

  .silk-lines {
    position:absolute; inset:0; pointer-events:none; opacity:0.03; z-index:1;
    background:
      repeating-linear-gradient(115deg, transparent, transparent 100px, rgba(228,189,108,1) 100px, rgba(228,189,108,1) 101px);
  }
  .particles { position:absolute; inset:0; pointer-events:none; z-index:1; }
  .particle {
    position:absolute; border-radius:50%;
    background: radial-gradient(circle, rgba(228,189,108,0.8) 0%, rgba(228,189,108,0) 70%);
    animation: float-particle 8s ease-in-out infinite;
  }

  .frame-outer { position:absolute; inset:20px; pointer-events:none; z-index:5; border: 1px solid rgba(212,168,64,0.15); }
  .frame-inner { position:absolute; inset:28px; pointer-events:none; z-index:5; border: 1px solid rgba(212,168,64,0.08); }

  .corner-orn { position:absolute; width:48px; height:48px; z-index:6; pointer-events:none; }
  .corner-orn::before, .corner-orn::after { content:''; position:absolute; background: var(--gold-300); box-shadow: 0 0 8px rgba(228,189,108,0.5); }
  .corner-orn::before { width:24px; height:1px; }
  .corner-orn::after  { width:1px; height:24px; }
  .corner-orn.tl { top:20px; left:20px; }
  .corner-orn.tl::before, .corner-orn.tl::after { top:0; left:0; }
  .corner-orn.tr { top:20px; right:20px; }
  .corner-orn.tr::before, .corner-orn.tr::after { top:0; right:0; }
  .corner-orn.bl { bottom:20px; left:20px; }
  .corner-orn.bl::before, .corner-orn.bl::after { bottom:0; left:0; }
  .corner-orn.br { bottom:20px; right:20px; }
  .corner-orn.br::before, .corner-orn.br::after { bottom:0; right:0; }

  .diamond-orn {
    position:absolute; width:6px; height:6px;
    background: var(--gold-300); transform: rotate(45deg);
    z-index:7; pointer-events:none; box-shadow: 0 0 12px rgba(228,189,108,0.6);
  }
  .diamond-orn.tl { top:38px; left:38px; }
  .diamond-orn.tr { top:38px; right:38px; }
  .diamond-orn.bl { bottom:38px; left:38px; }
  .diamond-orn.br { bottom:38px; right:38px; }

  /* ━━━ 왼쪽 패널 ━━━ */
  .left-panel {
    width:26%; min-width: 320px;
    display:flex; flex-direction:column;
    padding:32px 26px 24px;
    position:relative; z-index:3;
    background: linear-gradient(180deg, rgba(5,11,26,0.85) 0%, rgba(5,11,26,0.65) 100%);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(212,168,64,0.12);
    overflow-y: auto;
  }

  .brand { text-align:center; margin-bottom:18px; animation: fadeDown 0.8s ease both; flex-shrink:0; }
  .brand-eyebrow { font-family: var(--font); font-size:9px; font-weight:300; color: var(--gold-400); letter-spacing:10px; text-transform:uppercase; margin-bottom:8px; opacity:0.8; }
  .brand-line-top { width:36px; height:1px; margin:0 auto 12px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .brand-year { font-family: var(--font); font-size:12px; font-weight:300; color: var(--gold-200); letter-spacing:7px; margin-bottom:2px; }
  .brand-name { font-family: var(--font); font-size:11px; font-weight:400; color: var(--gold-100); letter-spacing:5px; text-transform:uppercase; margin-bottom:2px; }
  .brand-main {
    font-family: var(--font); font-size:30px; font-weight:700;
    line-height:1; letter-spacing:5px; text-transform:uppercase;
    background: linear-gradient(135deg, #f5e6bf 0%, #e4bd6c 40%, #d4a840 60%, #e4bd6c 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    margin-bottom:8px;
    animation: shimmer 6s linear infinite;
  }
  .brand-seminar {
    display:inline-block;
    font-family: var(--font); font-size:8px; font-weight:500;
    color: var(--cream); letter-spacing:5px; text-transform:uppercase;
    padding:6px 14px;
    border-top: 1px solid rgba(228,189,108,0.3);
    border-bottom: 1px solid rgba(228,189,108,0.3);
  }

  .sec-label {
    font-family: var(--font); font-size:9px; font-weight:500;
    letter-spacing:5px; text-transform:uppercase; color: var(--gold-300);
    display:flex; align-items:center; gap:10px; margin:14px 0 8px;
    animation: fadeUp 0.6s ease both;
  }
  .sec-label::before {
    content:''; width:5px; height:5px;
    background: var(--gold-300); transform: rotate(45deg);
    box-shadow: 0 0 6px rgba(228,189,108,0.6);
    flex-shrink:0;
  }
  .sec-label::after { content:''; flex:1; height:1px; background: linear-gradient(90deg, rgba(228,189,108,0.3), transparent); }

  .textarea-wrap { flex:1; min-height:100px; position:relative; animation: fadeUp 0.7s ease both; display:flex; }
  .textarea {
    width:100%; height:100%;
    background: linear-gradient(180deg, rgba(10,18,40,0.7) 0%, rgba(10,18,40,0.5) 100%);
    border: 1px solid rgba(212,168,64,0.18);
    padding: 12px 14px;
    font-family: var(--font-ko); font-size: 12px; font-weight: 300;
    color: var(--cream); outline: none; resize: none;
    line-height: 1.9; letter-spacing: 0.5px;
    transition: all 0.3s ease;
  }
  .textarea:focus { border-color: rgba(228,189,108,0.5); box-shadow: 0 0 0 1px rgba(228,189,108,0.15); }
  .textarea::placeholder { color: rgba(248,241,221,0.15); font-size: 11px; font-weight: 200; line-height: 1.9; }

  .count-info {
    display:flex; align-items:center; justify-content:space-between;
    margin-top:10px; padding: 9px 12px;
    background: rgba(10,18,40,0.4); border: 1px solid rgba(212,168,64,0.12);
    animation: fadeUp 0.7s 0.1s ease both;
  }
  .count-stat { display:flex; flex-direction:column; align-items:center; gap:2px; flex:1; }
  .count-stat + .count-stat { border-left: 1px solid rgba(212,168,64,0.1); }
  .count-num { font-family: var(--font); font-size: 18px; font-weight: 600; color: var(--gold-100); line-height: 1; }
  .count-lbl { font-family: var(--font); font-size: 7.5px; font-weight: 400; color: rgba(212,168,64,0.5); letter-spacing: 2px; text-transform: uppercase; }

  .draw-count-row {
    display:flex; align-items:center; justify-content:space-between;
    margin-top: 10px; padding: 9px 12px;
    background: rgba(10,18,40,0.4); border: 1px solid rgba(212,168,64,0.12);
    animation: fadeUp 0.7s 0.15s ease both;
  }
  .dc-label { font-family: var(--font); font-size: 9px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: var(--gold-300); }
  .dc-ctrl { display:flex; align-items:center; }
  .dc-btn {
    width: 28px; height: 28px; background: rgba(5,11,26,0.8);
    border: 1px solid rgba(212,168,64,0.25); cursor: pointer;
    font-family: var(--font); font-size: 15px; font-weight: 300; color: var(--gold-200);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s ease;
  }
  .dc-btn:hover { background: rgba(228,189,108,0.1); border-color: rgba(228,189,108,0.5); color: var(--gold-50); }
  .dc-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .dc-val {
    width: 44px; height: 28px;
    border-top: 1px solid rgba(212,168,64,0.25); border-bottom: 1px solid rgba(212,168,64,0.25);
    background: rgba(5,11,26,0.95);
    font-family: var(--font); font-size: 15px; font-weight: 600;
    color: var(--gold-100); text-align: center; line-height: 28px; letter-spacing: 1px;
  }

  .map-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; margin-top: 8px;
    animation: fadeUp 0.7s 0.18s ease both;
  }
  .map-card {
    padding: 10px 8px;
    background: rgba(10,18,40,0.5);
    border: 1px solid rgba(212,168,64,0.15);
    cursor: pointer; transition: all 0.2s ease;
    text-align: center;
  }
  .map-card:hover { background: rgba(228,189,108,0.05); border-color: rgba(228,189,108,0.4); }
  .map-card.active {
    background: rgba(228,189,108,0.12);
    border-color: var(--gold-400);
    box-shadow: 0 0 16px rgba(228,189,108,0.2), inset 0 0 12px rgba(228,189,108,0.05);
  }
  .map-card.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
  .map-icon { width: 100%; height: 36px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
  .map-icon svg { width: 100%; height: 100%; }
  .map-name {
    font-family: var(--font); font-size: 9px; font-weight: 500;
    color: var(--gold-100); letter-spacing: 2.5px; text-transform: uppercase;
  }
  .map-card.active .map-name { color: var(--gold-50); }

  .draw-btn {
    width: 100%; padding: 14px; margin-top: 12px;
    background: linear-gradient(135deg, rgba(228,189,108,0.08) 0%, rgba(212,168,64,0.12) 50%, rgba(228,189,108,0.08) 100%);
    border: 1px solid var(--gold-400);
    cursor: pointer;
    font-family: var(--font); font-size: 11px; font-weight: 600;
    letter-spacing: 6px; text-transform: uppercase;
    color: var(--gold-100);
    transition: all 0.3s ease;
    animation: glow-breathe 3s ease infinite, fadeUp 0.7s 0.2s ease both;
    flex-shrink:0;
  }
  .draw-btn:hover:not(:disabled) { background: linear-gradient(135deg, rgba(228,189,108,0.15), rgba(212,168,64,0.2), rgba(228,189,108,0.15)); color: var(--gold-50); }
  .draw-btn:disabled { opacity: 0.25; cursor: not-allowed; animation: fadeUp 0.7s 0.2s ease both; }
  .spin-icon { display: inline-block; animation: spin 0.8s linear infinite; margin-right: 8px; }

  .reset-btn {
    width: 100%; padding: 8px; margin-top: 6px;
    background: none; border: 1px solid rgba(212,168,64,0.1);
    cursor: pointer;
    font-family: var(--font); font-size: 8px; font-weight: 400;
    letter-spacing: 4px; text-transform: uppercase;
    color: rgba(212,168,64,0.25);
    transition: all 0.2s; flex-shrink:0;
  }
  .reset-btn:hover { color: rgba(255,140,140,0.7); border-color: rgba(255,140,140,0.25); }

  /* ━━━ 오른쪽 ━━━ */
  .right-panel {
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; z-index: 2;
    padding: 32px;
  }

  .standby { text-align: center; animation: fadeIn 0.8s ease both; }
  .standby-top-orn { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 32px; animation: fadeDown 0.8s 0.1s ease both; }
  .standby-top-orn .line { width: 80px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .standby-top-orn .diamond { width: 8px; height: 8px; background: var(--gold-300); transform: rotate(45deg); box-shadow: 0 0 16px rgba(228,189,108,0.6); }

  .standby .eyebrow { font-family: var(--font); font-size: 0.85vw; font-weight: 400; letter-spacing: 12px; text-transform: uppercase; color: var(--gold-300); margin-bottom: 28px; opacity: 0.85; animation: fadeUp 0.8s 0.2s ease both; }
  .standby .title {
    font-family: var(--font); font-size: 7vw; font-weight: 700;
    line-height: 0.95; letter-spacing: 0.14em; text-transform: uppercase;
    margin-bottom: 28px;
    background: linear-gradient(135deg, #faf1d8 0%, #f5e6bf 20%, #e4bd6c 40%, #d4a840 55%, #e4bd6c 70%, #f5e6bf 90%, #faf1d8 100%);
    background-size: 250% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 5s linear infinite, fadeUpLg 1s 0.1s ease both, text-glow 4s ease infinite;
    filter: drop-shadow(0 4px 30px rgba(228,189,108,0.2));
  }
  .standby .divider-ornament { display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 24px; animation: fadeUp 0.8s 0.3s ease both; }
  .standby .divider-ornament .line { width: 90px; height: 1px; background: linear-gradient(90deg, transparent, rgba(228,189,108,0.5), transparent); }
  .standby .divider-ornament .star { font-family: var(--font); font-size: 9px; color: var(--gold-300); letter-spacing: 4px; }
  .standby .subtitle { font-family: var(--font-ko); font-size: 1.2vw; font-weight: 200; color: var(--cream); letter-spacing: 10px; margin-bottom: 40px; animation: fadeUp 0.8s 0.4s ease both; }
  .standby .info-cards { display: flex; gap: 40px; justify-content: center; margin-bottom: 36px; animation: fadeUp 0.8s 0.5s ease both; }
  .standby .info-card { text-align: center; }
  .standby .info-card .lbl { font-family: var(--font); font-size: 0.6vw; font-weight: 500; letter-spacing: 4px; text-transform: uppercase; color: var(--gold-400); margin-bottom: 6px; opacity: 0.7; }
  .standby .info-card .val { font-family: var(--font); font-size: 1.1vw; font-weight: 400; color: var(--cream); letter-spacing: 3px; }
  .standby .info-divider { width: 1px; height: 32px; background: linear-gradient(180deg, transparent, rgba(228,189,108,0.3), transparent); }
  .standby .hint { font-family: var(--font); font-size: 0.7vw; font-weight: 400; letter-spacing: 4px; color: var(--gold-300); text-transform: uppercase; opacity: 0.5; animation: fadeUp 0.8s 0.6s ease both; }
  .standby .hint.ko { font-family: var(--font-ko); font-weight: 300; letter-spacing: 3px; }

  /* ━━━ 게임 화면 ━━━ */
  .game-screen {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    animation: fadeIn 0.5s ease both;
  }
  .game-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px; animation: fadeDown 0.5s ease both;
    padding: 0 4px;
  }
  .game-title-block { text-align: left; }
  .game-title {
    font-family: var(--font); font-size: 1.2vw; font-weight: 600;
    letter-spacing: 7px; text-transform: uppercase;
    color: var(--gold-200); margin-bottom: 2px;
  }
  .game-subtitle { font-family: var(--font-ko); font-size: 0.7vw; font-weight: 300; letter-spacing: 3px; color: rgba(228,189,108,0.5); }

  .live-counter {
    display: flex; align-items: center; gap: 16px;
    font-family: var(--font); font-size: 10px; font-weight: 400;
    color: var(--gold-300); letter-spacing: 3px; text-transform: uppercase;
  }
  .live-counter .dot { width: 7px; height: 7px; border-radius: 50%; background: #ff5c5c; animation: pulse-dot 1s infinite; box-shadow: 0 0 12px rgba(255,92,92,0.6); }
  .live-counter .num {
    font-family: var(--font); font-size: 18px; font-weight: 700;
    color: var(--gold-50); letter-spacing: 1px; line-height: 1;
  }
  .live-counter .div { width: 1px; height: 18px; background: rgba(228,189,108,0.25); }

  .game-body {
    flex: 1; display: grid;
    grid-template-columns: 1fr 240px;
    gap: 14px; min-height: 0;
  }

  .canvas-wrap {
    position: relative;
    border: 1px solid rgba(228,189,108,0.3);
    background: radial-gradient(ellipse at center, rgba(26,38,84,0.3) 0%, rgba(5,11,26,0.8) 100%);
    overflow: hidden;
    box-shadow: inset 0 0 60px rgba(228,189,108,0.05), 0 0 40px rgba(228,189,108,0.1);
    min-height: 0;
  }
  .game-canvas { display: block; width: 100%; height: 100%; }

  /* 카메라 추적 표시 (왼쪽 위 오버레이) */
  .cam-info {
    position: absolute; top: 14px; left: 14px;
    background: rgba(5,11,26,0.85);
    border: 1px solid rgba(228,189,108,0.3);
    padding: 8px 14px;
    z-index: 5;
    animation: fadeIn 0.5s ease both;
  }
  .cam-label {
    font-family: var(--font); font-size: 8px; font-weight: 500;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold-400); margin-bottom: 3px;
    display: flex; align-items: center; gap: 6px;
  }
  .cam-label::before {
    content: ''; width: 4px; height: 4px; border-radius: 50%;
    background: var(--gold-300); animation: pulse-dot 1.2s infinite;
  }
  .cam-name {
    font-family: var(--font-ko); font-size: 14px; font-weight: 500;
    color: var(--cream); letter-spacing: 2px;
  }

  /* 진행률 바 (오른쪽 가장자리) */
  .progress-bar {
    position: absolute; top: 14px; right: 14px; bottom: 14px;
    width: 6px;
    background: rgba(228,189,108,0.1);
    border: 1px solid rgba(228,189,108,0.2);
    overflow: hidden;
    z-index: 5;
  }
  .progress-fill {
    position: absolute; left: 0; right: 0; top: 0;
    background: linear-gradient(180deg, var(--gold-400), var(--gold-300));
    box-shadow: 0 0 12px rgba(228,189,108,0.5);
    transition: height 0.3s ease;
  }

  /* 실시간 랭킹 패널 */
  .rank-panel {
    background: linear-gradient(180deg, rgba(10,18,40,0.6) 0%, rgba(10,18,40,0.4) 100%);
    border: 1px solid rgba(228,189,108,0.2);
    padding: 14px 12px;
    display: flex; flex-direction: column;
    animation: fadeUp 0.5s 0.2s ease both;
    overflow: hidden;
  }
  .rank-title {
    font-family: var(--font); font-size: 9px; font-weight: 600;
    letter-spacing: 4px; text-transform: uppercase;
    color: var(--gold-300);
    text-align: center;
    padding-bottom: 10px; margin-bottom: 8px;
    border-bottom: 1px solid rgba(228,189,108,0.15);
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .rank-title::before {
    content:''; width: 4px; height: 4px;
    background: var(--gold-300); transform: rotate(45deg);
    box-shadow: 0 0 6px rgba(228,189,108,0.6);
  }

  .winners-section {
    padding-bottom: 8px; margin-bottom: 8px;
    border-bottom: 1px dashed rgba(228,189,108,0.2);
  }
  .winners-section .section-lbl {
    font-family: var(--font); font-size: 7px; font-weight: 600;
    color: var(--gold-400); letter-spacing: 3px; text-transform: uppercase;
    margin-bottom: 6px; opacity: 0.7;
  }

  .rank-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
  .rank-list::-webkit-scrollbar { width: 3px; }
  .rank-list::-webkit-scrollbar-thumb { background: rgba(228,189,108,0.3); }

  .rank-row {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 8px;
    background: rgba(5,11,26,0.5);
    border: 1px solid rgba(228,189,108,0.08);
    animation: rank-in 0.3s ease both;
    transition: all 0.3s ease;
  }
  .rank-row.winner {
    background: linear-gradient(90deg, rgba(228,189,108,0.2) 0%, rgba(228,189,108,0.05) 100%);
    border-color: var(--gold-400);
    box-shadow: 0 0 16px rgba(228,189,108,0.2);
  }
  .rank-row.winner1 {
    background: linear-gradient(90deg, rgba(228,189,108,0.3) 0%, rgba(228,189,108,0.08) 100%);
    border-color: var(--gold-50);
    box-shadow: 0 0 24px rgba(228,189,108,0.4);
  }
  .rank-row.leader {
    background: linear-gradient(90deg, rgba(228,189,108,0.15) 0%, rgba(228,189,108,0.03) 100%);
    border-color: rgba(228,189,108,0.45);
  }

  .rank-num {
    font-family: var(--font); font-size: 12px; font-weight: 700;
    color: var(--gold-200); width: 22px; text-align: center;
    letter-spacing: 0.5px;
  }
  .rank-row.winner1 .rank-num { color: var(--gold-50); font-size: 13px; }

  .rank-color {
    width: 8px; height: 8px; border-radius: 50%;
    flex-shrink: 0; border: 1px solid rgba(255,255,255,0.4);
  }
  .rank-name {
    font-family: var(--font-ko); font-size: 11px; font-weight: 400;
    color: var(--cream); letter-spacing: 1px;
    flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .rank-row.winner1 .rank-name { color: var(--white); font-weight: 500; }

  .rank-status {
    font-family: var(--font); font-size: 8px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--gold-300);
  }

  /* 당첨자 발표 오버레이 */
  .winner-overlay {
    position: absolute; inset: 0; z-index: 10;
    display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, rgba(15,26,61,0.85) 0%, rgba(5,11,26,0.95) 70%);
    backdrop-filter: blur(8px);
    animation: fadeIn 0.4s ease both;
  }

  .final-results {
    text-align: center; max-width: 760px;
    animation: winner-reveal 0.8s cubic-bezier(0.22,1,0.36,1) both;
    position: relative; padding: 20px;
  }
  .final-top-orn { display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 20px; }
  .final-top-orn .line { width: 80px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .final-top-orn .diamond { width: 7px; height: 7px; background: var(--gold-300); transform: rotate(45deg); box-shadow: 0 0 12px rgba(228,189,108,0.8); }

  .final-title {
    font-family: var(--font); font-size: 2.6vw; font-weight: 700;
    letter-spacing: 8px; text-transform: uppercase;
    background: linear-gradient(135deg, #faf1d8, #e4bd6c, #d4a840, #e4bd6c, #faf1d8);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 4s linear infinite;
    margin-bottom: 8px;
  }
  .final-subtitle { font-family: var(--font-ko); font-size: 0.85vw; font-weight: 300; letter-spacing: 8px; color: var(--cream); margin-bottom: 30px; }

  .final-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px; }
  .final-row {
    display: grid; grid-template-columns: 80px 1fr auto; align-items: center;
    gap: 24px; padding: 16px 28px;
    background: linear-gradient(90deg, rgba(10,18,40,0.6), rgba(10,18,40,0.3));
    border: 1px solid rgba(228,189,108,0.15);
    animation: rank-in 0.5s ease both;
  }
  .final-row.gold {
    background: linear-gradient(90deg, rgba(228,189,108,0.2), rgba(228,189,108,0.05));
    border-color: var(--gold-400);
    box-shadow: 0 0 24px rgba(228,189,108,0.2);
  }
  .final-row.silver {
    background: linear-gradient(90deg, rgba(220,220,220,0.12), rgba(220,220,220,0.03));
    border-color: rgba(220,220,220,0.4);
  }
  .final-row.bronze {
    background: linear-gradient(90deg, rgba(205,127,50,0.12), rgba(205,127,50,0.03));
    border-color: rgba(205,127,50,0.4);
  }
  .final-rank-num {
    font-family: var(--font); font-size: 30px; font-weight: 700;
    color: var(--gold-200); letter-spacing: 1px; line-height: 1;
  }
  .final-row.gold .final-rank-num { color: var(--gold-50); font-size: 34px; }
  .final-rank-label {
    font-family: var(--font); font-size: 9px; font-weight: 500;
    color: var(--gold-400); letter-spacing: 3px; text-transform: uppercase;
    display: block; margin-bottom: 2px;
  }
  .final-name {
    font-family: var(--font-ko); font-size: 24px; font-weight: 500;
    color: var(--cream); letter-spacing: 4px; text-align: left;
  }
  .final-row.gold .final-name { font-size: 30px; color: var(--white); font-weight: 600; }
  .final-badge {
    font-family: var(--font); font-size: 10px; font-weight: 500;
    color: var(--gold-300); letter-spacing: 3px; text-transform: uppercase;
    padding: 6px 14px;
    border: 1px solid rgba(228,189,108,0.3);
  }

  .next-btn {
    padding: 14px 48px;
    background: rgba(228,189,108,0.04);
    border: 1px solid var(--gold-400);
    cursor: pointer;
    font-family: var(--font); font-size: 0.85vw; font-weight: 600;
    letter-spacing: 6px; text-transform: uppercase;
    color: var(--gold-100);
    transition: all 0.3s; margin-top: 8px;
    animation: rise 0.6s 0.8s ease both;
  }
  .next-btn:hover { background: rgba(228,189,108,0.14); color: var(--gold-50); transform: translateY(-1px); }

  .confetti-wrap { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 15; }
  .cp { position: absolute; animation: confetti-fall 2.5s ease forwards; }
`;

if (!document.getElementById("ld-style")) {
  const el = document.createElement("style");
  el.id = "ld-style";
  el.textContent = css;
  document.head.appendChild(el);
}

const CC = ["#faf1d8","#f5e6bf","#e4bd6c","#d4a840","#b8922e","#ffffff","#f8f1dd"];
function Confetti({ active }) {
  if (!active) return null;
  const ps = Array.from({length:80},(_,i)=>({
    id:i, left: Math.random()*100, delay: Math.random()*1.3,
    color: CC[Math.floor(Math.random()*CC.length)],
    size: 3 + Math.random()*9, round: Math.random() > 0.4,
    duration: 2 + Math.random()*1.2,
  }));
  return (
    <div className="confetti-wrap">
      {ps.map(p=>(
        <div key={p.id} className="cp" style={{
          left:`${p.left}%`, top:"-20px",
          width: p.size, height: p.size,
          background: p.color, borderRadius: p.round ? "50%" : "1px",
          animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
          boxShadow: `0 0 ${p.size}px ${p.color}`,
        }}/>
      ))}
    </div>
  );
}

function Particles() {
  const ps = Array.from({length:20},(_,i)=>({
    id:i, left: Math.random()*100, top: Math.random()*100,
    size: 1 + Math.random()*3, delay: Math.random()*8, duration: 6 + Math.random()*6,
  }));
  return (
    <div className="particles">
      {ps.map(p=>(
        <div key={p.id} className="particle" style={{
          left:`${p.left}%`, top:`${p.top}%`,
          width: p.size, height: p.size,
          animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
        }}/>
      ))}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 맵 정의 - 긴 트랙 (화면보다 훨씬 긴 세로 맵)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MAPS = {
  zigzag: {
    id: "zigzag", name: "Zigzag", nameKo: "지그재그",
    icon: (
      <svg viewBox="0 0 40 30">
        <line x1="4" y1="6"  x2="36" y2="11" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="36" y1="14" x2="4"  y2="19" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="4"  y1="22" x2="36" y2="26" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  pachinko: {
    id: "pachinko", name: "Pachinko", nameKo: "파친코",
    icon: (
      <svg viewBox="0 0 40 30">
        {[6,12,18,24].map(y => [0,1,2,3,4,5].map(c => (
          <circle key={`${c}-${y}`} cx={4+c*7+(y%12===6?3:0)} cy={y} r="1.2" fill="currentColor"/>
        )))}
      </svg>
    ),
  },
  spiral: {
    id: "spiral", name: "Cascade", nameKo: "캐스케이드",
    icon: (
      <svg viewBox="0 0 40 30">
        <path d="M 4 6 L 36 6 L 36 12 L 8 12 L 8 18 L 32 18 L 32 24" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  maze: {
    id: "maze", name: "Funnel", nameKo: "퍼널",
    icon: (
      <svg viewBox="0 0 40 30">
        <line x1="2" y1="6" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="38" y1="6" x2="26" y2="14" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="14" y1="14" x2="14" y2="22" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="26" y1="14" x2="26" y2="22" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="14" y1="22" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="26" y1="22" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
};

// 긴 트랙 빌드 - mapH는 화면 높이 H의 배수
function buildLongMap(mapId, W, H, mapH, Bodies, World, world) {
  const wallOpts = {
    isStatic: true,
    render: { fillStyle: 'rgba(228,189,108,0.15)', strokeStyle: 'rgba(228,189,108,0.6)', lineWidth: 1.5 },
  };
  const slopeOpts = {
    isStatic: true, friction: 0.001,
    render: { fillStyle: 'rgba(228,189,108,0.35)', strokeStyle: 'rgba(228,189,108,0.75)', lineWidth: 1.2 },
  };
  const pegOpts = {
    isStatic: true,
    render: { fillStyle: 'rgba(228,189,108,0.3)', strokeStyle: 'rgba(228,189,108,0.85)', lineWidth: 1 },
  };

  // 외곽 벽 (긴 맵)
  World.add(world, [
    Bodies.rectangle(-5, mapH/2, 10, mapH*2, wallOpts),
    Bodies.rectangle(W+5, mapH/2, 10, mapH*2, wallOpts),
    Bodies.rectangle(W/2, -5, W*2, 10, wallOpts),
  ]);

  const obstacles = [];
  const startY = 80;
  const endY = mapH - 200;

  if (mapId === "zigzag") {
    // 긴 트랙에 지그재그 경사판 많이
    const slopeCount = Math.floor((endY - startY) / 110);
    for (let i = 0; i < slopeCount; i++) {
      const y = startY + i * 110 + 30;
      const isLeft = i % 2 === 0;
      const slopeLen = W * 0.78;
      const angle = isLeft ? 0.18 : -0.18;
      const cx = isLeft ? slopeLen/2 + 15 : W - slopeLen/2 - 15;
      obstacles.push(Bodies.rectangle(cx, y, slopeLen, 7, { ...slopeOpts, angle }));
    }
    // 페그도 추가 (튕김 효과)
    const pegRows = Math.floor((endY - startY) / 90);
    for (let r = 0; r < pegRows; r++) {
      const y = startY + r * 90 + 75;
      if (y > endY) break;
      const cols = 5;
      for (let c = 0; c < cols; c++) {
        const x = (W / (cols + 1)) * (c + 1) + (r % 2 === 0 ? 25 : -10);
        if (x < 30 || x > W - 30) continue;
        obstacles.push(Bodies.circle(x, y, 5, pegOpts));
      }
    }
  }
  else if (mapId === "pachinko") {
    // 긴 트랙에 빽빽한 핀
    const rowH = 50;
    const rowCount = Math.floor((endY - startY) / rowH);
    for (let r = 0; r < rowCount; r++) {
      const y = startY + r * rowH;
      const cols = 10;
      const offset = r % 2 === 0 ? 0 : (W / cols) / 2;
      for (let c = 0; c < cols; c++) {
        const x = (W / (cols + 1)) * (c + 1) + offset;
        if (x < 25 || x > W - 25) continue;
        obstacles.push(Bodies.circle(x, y, 5, pegOpts));
      }
    }
    // 중간중간 가속용 경사
    const accelCount = Math.floor((endY - startY) / 400);
    for (let i = 0; i < accelCount; i++) {
      const y = startY + 350 + i * 400;
      if (y > endY) break;
      obstacles.push(Bodies.rectangle(W * 0.3, y, 80, 4, { ...wallOpts, angle: 0.5 }));
      obstacles.push(Bodies.rectangle(W * 0.7, y + 50, 80, 4, { ...wallOpts, angle: -0.5 }));
    }
  }
  else if (mapId === "spiral") {
    // 긴 캐스케이드 - 좌우 번갈아 긴 선반들이 폭포처럼
    const shelfH = 130;
    const shelfCount = Math.floor((endY - startY) / shelfH);
    for (let i = 0; i < shelfCount; i++) {
      const y = startY + i * shelfH;
      const isLeft = i % 2 === 0;
      const shelfLen = W * 0.85;
      const angle = isLeft ? 0.1 : -0.1;
      const cx = isLeft ? shelfLen / 2 - 5 : W - shelfLen / 2 + 5;
      obstacles.push(Bodies.rectangle(cx, y, shelfLen, 6, { ...slopeOpts, angle }));

      // 끝에 막은 벽 (반대쪽 끝으로 떨어지도록)
      if (isLeft) {
        obstacles.push(Bodies.rectangle(8, y - 22, 5, 36, wallOpts));
      } else {
        obstacles.push(Bodies.rectangle(W - 8, y - 22, 5, 36, wallOpts));
      }
    }
    // 중앙 페그 장식
    for (let i = 0; i < shelfCount; i++) {
      const y = startY + i * shelfH + 60;
      obstacles.push(Bodies.circle(W/2 + (i%2===0?-30:30), y, 5, pegOpts));
    }
  }
  else if (mapId === "maze") {
    // 퍼널 - 좁아졌다가 넓어졌다가 반복
    const sectionH = 220;
    const sectionCount = Math.floor((endY - startY) / sectionH);

    for (let s = 0; s < sectionCount; s++) {
      const yBase = startY + s * sectionH;

      // 깔때기 입구 (좁아짐)
      obstacles.push(Bodies.rectangle(W*0.25, yBase + 40, W*0.45, 5, { ...slopeOpts, angle: 0.4 }));
      obstacles.push(Bodies.rectangle(W*0.75, yBase + 40, W*0.45, 5, { ...slopeOpts, angle: -0.4 }));

      // 좁은 통로
      obstacles.push(Bodies.rectangle(W*0.35, yBase + 110, 5, 100, wallOpts));
      obstacles.push(Bodies.rectangle(W*0.65, yBase + 110, 5, 100, wallOpts));

      // 페그 장애물
      obstacles.push(Bodies.circle(W*0.5, yBase + 100, 6, pegOpts));
      obstacles.push(Bodies.circle(W*0.42, yBase + 160, 4, pegOpts));
      obstacles.push(Bodies.circle(W*0.58, yBase + 160, 4, pegOpts));
    }
  }

  World.add(world, obstacles);

  // 결승선 - 맵 가장 아래
  const finishY = mapH - 60;
  const funnelLeft = Bodies.rectangle(W*0.25, finishY - 60, W*0.55, 5, {
    ...slopeOpts, angle: 0.35,
    render: { fillStyle: 'rgba(228,189,108,0.5)', strokeStyle: 'rgba(228,189,108,1)', lineWidth: 2 }
  });
  const funnelRight = Bodies.rectangle(W*0.75, finishY - 60, W*0.55, 5, {
    ...slopeOpts, angle: -0.35,
    render: { fillStyle: 'rgba(228,189,108,0.5)', strokeStyle: 'rgba(228,189,108,1)', lineWidth: 2 }
  });
  const finishLine = Bodies.rectangle(W/2, finishY, W, 6, {
    ...wallOpts, isSensor: true, label: 'finish',
    render: { fillStyle: 'rgba(228,189,108,1)', strokeStyle: 'rgba(255,255,255,0.9)', lineWidth: 2 }
  });
  const finishWallL = Bodies.rectangle(8, finishY - 30, 16, 70, wallOpts);
  const finishWallR = Bodies.rectangle(W - 8, finishY - 30, 16, 70, wallOpts);
  const bottomWall = Bodies.rectangle(W/2, mapH+5, W*2, 10, wallOpts);

  World.add(world, [funnelLeft, funnelRight, finishLine, finishWallL, finishWallR, bottomWall]);

  return finishLine;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 마블 게임 - 카메라 추적, 긴 트랙, 즉시 종료
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MarbleGame({ players, winnerCount, mapId, onComplete }) {
  const canvasRef = useRef(null);
  const [winners, setWinners] = useState([]);
  const [leaderName, setLeaderName] = useState("");
  const [progress, setProgress] = useState(0); // 0~1: 1등 위치 비율
  const [liveRanking, setLiveRanking] = useState([]);
  const completedRef = useRef(false);
  const winnersRef = useRef([]);

  useEffect(() => {
    if (!canvasRef.current || players.length === 0) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const VIEW_W = parent.clientWidth;   // 화면(뷰포트) 크기
    const VIEW_H = parent.clientHeight;
    canvas.width = VIEW_W;
    canvas.height = VIEW_H;

    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    // 맵 크기: 가로는 뷰포트 그대로, 세로는 뷰포트의 3배 (긴 트랙)
    const MAP_W = VIEW_W;
    const MAP_H = VIEW_H * 3;

    const engine = Engine.create();
    engine.gravity.y = 1.4; // 더 빠른 중력 (스피드 업)
    engine.timing.timeScale = 1.15; // 시뮬레이션 자체도 약간 빠르게

    // Render는 직접 렌더링 안 쓰고 커스텀 렌더링
    const render = Render.create({
      canvas, engine,
      options: {
        width: VIEW_W, height: VIEW_H,
        wireframes: false,
        background: 'transparent',
        hasBounds: true,
      }
    });

    // 카메라 (Bounds) - 처음엔 맵 상단을 비춤
    render.bounds.min.x = 0;
    render.bounds.max.x = MAP_W;
    render.bounds.min.y = 0;
    render.bounds.max.y = VIEW_H;

    // 맵 빌드
    buildLongMap(mapId, MAP_W, VIEW_H, MAP_H, Bodies, World, engine.world);

    // 구슬 생성 (맵 상단에 펼쳐서 배치)
    const MARBLE_COLORS = [
      '#e4bd6c', '#d4a840', '#f5e6bf', '#b8922e',
      '#f8f1dd', '#eed398', '#faf1d8', '#c99c3d',
    ];

    const marbles = players.map((name, i) => {
      const cols = 12;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 30 + col * ((MAP_W - 60) / cols) + Math.random() * 6;
      const y = 25 + row * 22 + Math.random() * 4;
      const color = MARBLE_COLORS[i % MARBLE_COLORS.length];

      const marble = Bodies.circle(x, y, 9, {
        restitution: 0.6,
        friction: 0.001,
        frictionAir: 0.002,
        density: 0.0012,
        label: name,
        render: {
          fillStyle: color,
          strokeStyle: 'rgba(255,255,255,0.7)',
          lineWidth: 1.5,
        }
      });
      marble.customName = name;
      marble.customColor = color;
      marble.customFinished = false;
      marble.customRank = 0;
      return marble;
    });

    World.add(engine.world, marbles);

    // ━━━ 결승선 도달 → 즉시 우승 처리 ━━━
    Events.on(engine, 'collisionStart', (event) => {
      if (completedRef.current) return;

      event.pairs.forEach((pair) => {
        let marble = null;
        if (pair.bodyA.label === 'finish' || pair.bodyB.label === 'finish') {
          marble = pair.bodyA.label === 'finish' ? pair.bodyB : pair.bodyA;
        }

        if (marble && marble.customName && !marble.customFinished) {
          marble.customFinished = true;
          marble.customRank = winnersRef.current.length + 1;

          const newWinner = {
            name: marble.customName,
            color: marble.customColor,
            rank: marble.customRank,
          };
          winnersRef.current = [...winnersRef.current, newWinner];
          setWinners([...winnersRef.current]);

          // 결승선 통과한 구슬은 시각적으로 강조 (그대로 두되 색상 진하게)
          marble.render.lineWidth = 3;
          marble.render.strokeStyle = '#faf1d8';

          // ★ N명 채워지면 즉시 게임 종료 ★
          if (winnersRef.current.length >= winnerCount) {
            completedRef.current = true;
            setTimeout(() => {
              onComplete([...winnersRef.current]);
            }, 1500);
          }
        }
      });
    });

    // ━━━ 카메라 추적 + 커스텀 렌더링 ━━━
    let cameraY = 0;
    let lastUiUpdate = 0;

    Events.on(render, 'beforeRender', () => {
      // 1등 후보 = 아직 도달 못한 구슬 중 가장 아래쪽 (가장 진행이 빠른)
      const racing = marbles.filter(m => !m.customFinished);

      let leaderY = cameraY + VIEW_H * 0.4;
      let leader = null;

      if (racing.length > 0) {
        leader = racing.reduce((lead, m) => m.position.y > lead.position.y ? m : lead, racing[0]);
        leaderY = leader.position.y;
      } else if (winnersRef.current.length > 0) {
        // 모두 도달했으면 결승선 비춤
        leaderY = MAP_H - 100;
      }

      // 카메라 목표 위치: 1등 구슬을 화면의 35% 지점에 (앞을 좀 더 보여주기)
      let targetCameraY = leaderY - VIEW_H * 0.35;

      // 카메라 범위 제한
      targetCameraY = Math.max(0, Math.min(MAP_H - VIEW_H, targetCameraY));

      // 부드러운 이동 (LERP)
      cameraY += (targetCameraY - cameraY) * 0.08;

      // 카메라 적용 (Render bounds)
      render.bounds.min.y = cameraY;
      render.bounds.max.y = cameraY + VIEW_H;
      render.bounds.min.x = 0;
      render.bounds.max.x = MAP_W;

      // UI 업데이트 (200ms마다)
      const now = Date.now();
      if (now - lastUiUpdate > 200) {
        lastUiUpdate = now;
        if (leader) setLeaderName(leader.customName);
        // 진행도 (0~1)
        const totalDistance = MAP_H - 100;
        setProgress(Math.min(1, leaderY / totalDistance));

        // 실시간 랭킹: 도달자 + 남은 구슬을 y 좌표 큰 순(맵 아래쪽 = 진행 많이)
        const finished = winnersRef.current;
        const racingSorted = racing
          .slice()
          .sort((a, b) => b.position.y - a.position.y)
          .slice(0, 12)
          .map(m => ({ name: m.customName, color: m.customColor, status: 'racing' }));

        const finishedFormatted = finished.map(w => ({
          ...w, status: 'finished'
        }));

        setLiveRanking([...finishedFormatted, ...racingSorted]);
      }
    });

    // afterRender: 이름 라벨 + 결승선 통과자 표시
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      ctx.save();

      // 카메라 변환 적용
      const scaleX = VIEW_W / (render.bounds.max.x - render.bounds.min.x);
      const scaleY = VIEW_H / (render.bounds.max.y - render.bounds.min.y);
      ctx.scale(scaleX, scaleY);
      ctx.translate(-render.bounds.min.x, -render.bounds.min.y);

      const racing = marbles.filter(m => !m.customFinished);

      // 모든 살아있는 구슬에 이름
      racing.forEach((m) => {
        // 화면에 보이는 구슬만 라벨 (카메라 영역 + 여유)
        if (m.position.y < render.bounds.min.y - 30 || m.position.y > render.bounds.max.y + 30) return;

        ctx.font = '500 11px Montserrat, "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const name = m.customName;
        const x = m.position.x;
        const y = m.position.y - 18;

        const metrics = ctx.measureText(name);
        const bw = Math.max(metrics.width + 12, 24);
        const bh = 16;
        ctx.fillStyle = 'rgba(5,11,26,0.8)';
        ctx.strokeStyle = m.customColor;
        ctx.lineWidth = 1;
        ctx.fillRect(x - bw/2, y - bh/2, bw, bh);
        ctx.strokeRect(x - bw/2, y - bh/2, bw, bh);
        ctx.fillStyle = '#faf1d8';
        ctx.fillText(name, x, y);
      });

      // 1등 후보 구슬에 빛나는 링
      if (racing.length > 0) {
        const leader = racing.reduce((lead, m) => m.position.y > lead.position.y ? m : lead, racing[0]);
        ctx.strokeStyle = 'rgba(250,241,216,1)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(leader.position.x, leader.position.y, 16, 0, Math.PI * 2);
        ctx.stroke();

        // 깜빡이는 외곽 링
        ctx.strokeStyle = `rgba(228,189,108,${0.3 + 0.4 * Math.sin(Date.now()/200)})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(leader.position.x, leader.position.y, 22, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 도달한 구슬에 순위 표시
      marbles.filter(m => m.customFinished).forEach(m => {
        if (m.position.y < render.bounds.min.y - 30 || m.position.y > render.bounds.max.y + 30) return;
        ctx.font = 'bold 13px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#faf1d8';
        ctx.strokeStyle = '#0a1228';
        ctx.lineWidth = 3;
        const text = `#${m.customRank}`;
        ctx.strokeText(text, m.position.x, m.position.y - 24);
        ctx.fillText(text, m.position.x, m.position.y - 24);
      });

      ctx.restore();
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      try {
        Render.stop(render);
        Runner.stop(runner);
        World.clear(engine.world, false);
        Engine.clear(engine);
      } catch(e){}
    };
  }, []);

  const racingCount = liveRanking.filter(r => r.status === 'racing').length;
  const finishedCount = liveRanking.filter(r => r.status === 'finished').length;

  return (
    <div className="game-body">
      <div className="canvas-wrap">
        <canvas ref={canvasRef} className="game-canvas"/>

        {/* 카메라 추적 표시 */}
        {leaderName && (
          <div className="cam-info">
            <div className="cam-label">Leading</div>
            <div className="cam-name">{leaderName}</div>
          </div>
        )}

        {/* 진행률 바 */}
        <div className="progress-bar">
          <div className="progress-fill" style={{height: `${progress * 100}%`}}/>
        </div>
      </div>

      {/* 실시간 랭킹 */}
      <div className="rank-panel">
        <div className="rank-title">Live Ranking</div>

        {finishedCount > 0 && (
          <div className="winners-section">
            <div className="section-lbl">Finished  ·  {finishedCount} / {winnerCount}</div>
            {liveRanking.filter(r => r.status === 'finished').map((r, i) => {
              const is1 = r.rank === 1;
              return (
                <div key={`fin-${r.rank}`} className={`rank-row ${is1 ? 'winner1' : 'winner'}`}>
                  <div className="rank-num">{r.rank}</div>
                  <div className="rank-color" style={{background: r.color}}/>
                  <div className="rank-name">{r.name}</div>
                  <div className="rank-status">★</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="rank-list">
          {liveRanking.filter(r => r.status === 'racing').slice(0, 10).map((r, i) => {
            const isLeader = i === 0;
            return (
              <div key={`race-${r.name}`} className={`rank-row ${isLeader ? 'leader' : ''}`}>
                <div className="rank-num">{finishedCount + i + 1}</div>
                <div className="rank-color" style={{background: r.color}}/>
                <div className="rank-name">{r.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 메인 앱
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  const [rawText, setRawText] = useState("");
  const [drawCount, setDrawCount] = useState(5);
  const [selectedMap, setSelectedMap] = useState("zigzag");
  const [finalWinners, setFinalWinners] = useState([]);
  const [phase, setPhase] = useState("standby");
  const [gameKey, setGameKey] = useState(0);

  const names = rawText.split(/[\n,，\t]+/).map(n=>n.trim()).filter(n=>n.length>0);
  const canStart = names.length >= 2 && names.length >= drawCount && phase === "standby";

  const handleStart = () => {
    if (!canStart) return;
    setFinalWinners([]);
    setGameKey(k => k + 1);
    setPhase("playing");
  };

  const handleComplete = (rankedWinners) => {
    setFinalWinners(rankedWinners);
    setPhase("results");
  };

  const handleReset = () => {
    if (phase === "playing") return;
    if (!window.confirm("결과를 초기화하고 다시 시작할까요?")) return;
    setFinalWinners([]);
    setPhase("standby");
  };

  const handleNewGame = () => {
    setFinalWinners([]);
    setPhase("standby");
  };

  return (
    <div className="stage">
      <div className="silk-lines"/>
      <Particles />

      <div className="frame-outer"/>
      <div className="frame-inner"/>

      <span className="corner-orn tl"/><span className="corner-orn tr"/>
      <span className="corner-orn bl"/><span className="corner-orn br"/>
      <span className="diamond-orn tl"/><span className="diamond-orn tr"/>
      <span className="diamond-orn bl"/><span className="diamond-orn br"/>

      {/* ═══ 왼쪽 패널 ═══ */}
      <div className="left-panel">
        <div className="brand">
          <div className="brand-eyebrow">Invitation</div>
          <div className="brand-line-top"/>
          <div className="brand-year">2026</div>
          <div className="brand-name">Samsung</div>
          <div className="brand-main">OCIO</div>
          <span className="brand-seminar">OCIO Seminar</span>
        </div>

        <div className="sec-label">참가자 명단</div>
        <div className="textarea-wrap">
          <textarea
            className="textarea"
            placeholder={"이름을 한 줄에 한 명씩 입력해 주세요\n엑셀에서 복사 · 붙여넣기 가능"}
            value={rawText}
            onChange={e=>{ setRawText(e.target.value); setFinalWinners([]); setPhase("standby"); }}
            disabled={phase === "playing"}
          />
        </div>

        <div className="count-info">
          <div className="count-stat">
            <div className="count-num">{names.length}</div>
            <div className="count-lbl">Total</div>
          </div>
          <div className="count-stat">
            <div className="count-num">{drawCount}</div>
            <div className="count-lbl">Winners</div>
          </div>
        </div>

        <div className="draw-count-row">
          <span className="dc-label">당첨 인원</span>
          <div className="dc-ctrl">
            <button className="dc-btn" onClick={()=>setDrawCount(v=>Math.max(1,v-1))} disabled={phase==="playing"}>−</button>
            <div className="dc-val">{drawCount}</div>
            <button className="dc-btn" onClick={()=>setDrawCount(v=>Math.min(names.length||99,v+1))} disabled={phase==="playing"}>+</button>
          </div>
        </div>

        <div className="sec-label">맵 선택</div>
        <div className="map-grid">
          {Object.values(MAPS).map(m => (
            <div
              key={m.id}
              className={`map-card ${selectedMap === m.id ? 'active' : ''} ${phase==='playing' ? 'disabled' : ''}`}
              onClick={() => phase !== "playing" && setSelectedMap(m.id)}
            >
              <div className="map-icon" style={{color: selectedMap === m.id ? '#faf1d8' : 'rgba(228,189,108,0.6)'}}>
                {m.icon}
              </div>
              <div className="map-name">{m.name}</div>
            </div>
          ))}
        </div>

        <button className="draw-btn" onClick={handleStart} disabled={!canStart}>
          {phase === "playing"
            ? <><span className="spin-icon">◈</span>Racing</>
            : phase === "results" ? "Replay"
            : "Start Race"}
        </button>

        {(finalWinners.length > 0) && phase === "standby" && (
          <button className="reset-btn" onClick={handleReset}>Clear Results</button>
        )}
      </div>

      {/* ═══ 오른쪽 ═══ */}
      <div className="right-panel">

        {phase==="standby" && (
          <div className="standby">
            <div className="standby-top-orn">
              <div className="line"/><div className="diamond"/><div className="line"/>
            </div>
            <div className="eyebrow">Samsung OCIO Seminar</div>
            <div className="title">Lucky Draw</div>
            <div className="divider-ornament">
              <div className="line"/>
              <div className="star">◆ ◆ ◆</div>
              <div className="line"/>
            </div>
            <div className="subtitle">마 블   레 이 스</div>

            <div className="info-cards">
              <div className="info-card">
                <div className="lbl">Participants</div>
                <div className="val">{names.length > 0 ? `${names.length} Guests` : "-"}</div>
              </div>
              <div className="info-divider"/>
              <div className="info-card">
                <div className="lbl">Winners</div>
                <div className="val">{drawCount} 명</div>
              </div>
              <div className="info-divider"/>
              <div className="info-card">
                <div className="lbl">Map</div>
                <div className="val">{MAPS[selectedMap].name}</div>
              </div>
            </div>

            <div className={names.length === 0 ? "hint ko" : "hint"}>
              {names.length===0
                ? "좌측에 참가자 명단을 입력해 주세요"
                : names.length < drawCount
                ? `당첨 인원(${drawCount})보다 많은 참가자가 필요합니다`
                : `먼저 결승선에 도달한 ${drawCount}명이 당첨됩니다`}
            </div>
          </div>
        )}

        {phase==="playing" && (
          <div className="game-screen">
            <div className="game-header">
              <div className="game-title-block">
                <div className="game-title">Marble Race  ·  {MAPS[selectedMap].name}</div>
                <div className="game-subtitle">먼저 결승선에 도달한 {drawCount}명이 당첨됩니다</div>
              </div>
              <div className="live-counter">
                <span className="dot"/>
                <span>LIVE</span>
                <span className="div"/>
                <span>Goal</span>
                <span className="num">{drawCount}</span>
              </div>
            </div>
            <MarbleGame
              key={gameKey}
              players={names}
              winnerCount={drawCount}
              mapId={selectedMap}
              onComplete={handleComplete}
            />
          </div>
        )}

        {phase==="results" && finalWinners.length > 0 && (
          <div className="winner-overlay">
            <Confetti active={true}/>
            <div className="final-results">
              <div className="final-top-orn">
                <div className="line"/><div className="diamond"/><div className="line"/>
              </div>
              <div className="final-title">Winners</div>
              <div className="final-subtitle">당 첨 자 발 표</div>

              <div className="final-list">
                {finalWinners.map((w, i) => {
                  const rank = i + 1;
                  const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
                  const suffix = rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th';
                  return (
                    <div key={w.name} className={`final-row ${rankClass}`} style={{animationDelay: `${i * 0.18}s`}}>
                      <div>
                        <span className="final-rank-label">{rank}{suffix} Place</span>
                        <div className="final-rank-num">{rank}</div>
                      </div>
                      <div className="final-name">{w.name}</div>
                      <div className="final-badge">
                        {rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : rank === 3 ? 'Bronze' : `Top ${drawCount}`}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="next-btn" onClick={handleNewGame}>New Race</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
