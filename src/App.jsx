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
  @keyframes name-reveal {
    0%   { opacity:0; transform:scale(0.75); letter-spacing:40px; filter:blur(12px); }
    60%  { opacity:1; filter:blur(0); letter-spacing:14px; }
    100% { opacity:1; transform:scale(1); letter-spacing:10px; }
  }
  @keyframes rise {
    0%   { opacity:0; transform:translateY(10px); }
    100% { opacity:1; transform:translateY(0); }
  }
  @keyframes float-particle {
    0%,100% { transform:translateY(0) translateX(0); opacity:0.3; }
    50%     { transform:translateY(-20px) translateX(10px); opacity:0.8; }
  }
  @keyframes sparkle {
    0%,100% { opacity:0; transform:scale(0.5) rotate(0deg); }
    50%     { opacity:1; transform:scale(1) rotate(180deg); }
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
      repeating-linear-gradient(115deg, transparent, transparent 100px, rgba(228,189,108,1) 100px, rgba(228,189,108,1) 101px),
      repeating-linear-gradient(65deg, transparent, transparent 160px, rgba(228,189,108,0.5) 160px, rgba(228,189,108,0.5) 161px);
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
    z-index:7; pointer-events:none;
    box-shadow: 0 0 12px rgba(228,189,108,0.6);
  }
  .diamond-orn.tl { top:38px; left:38px; }
  .diamond-orn.tr { top:38px; right:38px; }
  .diamond-orn.bl { bottom:38px; left:38px; }
  .diamond-orn.br { bottom:38px; right:38px; }

  /* ━━━ 왼쪽 패널 ━━━ */
  .left-panel {
    width:28%; min-width: 340px;
    display:flex; flex-direction:column;
    padding:36px 28px 28px;
    position:relative; z-index:3;
    background: linear-gradient(180deg, rgba(5,11,26,0.85) 0%, rgba(5,11,26,0.65) 100%);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(212,168,64,0.12);
    overflow-y: auto;
  }
  .left-panel::after {
    content:''; position:absolute; right:-1px; top:80px; bottom:80px; width:1px;
    background: linear-gradient(180deg, transparent, rgba(228,189,108,0.5), transparent);
  }

  .brand { text-align:center; margin-bottom:22px; animation: fadeDown 0.8s ease both; flex-shrink:0; }
  .brand-eyebrow { font-family: var(--font); font-size:9px; font-weight:300; color: var(--gold-400); letter-spacing:10px; text-transform:uppercase; margin-bottom:10px; opacity:0.8; }
  .brand-line-top { width:36px; height:1px; margin:0 auto 14px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .brand-year { font-family: var(--font); font-size:13px; font-weight:300; color: var(--gold-200); letter-spacing:7px; margin-bottom:3px; }
  .brand-name { font-family: var(--font); font-size:12px; font-weight:400; color: var(--gold-100); letter-spacing:5px; text-transform:uppercase; margin-bottom:2px; }
  .brand-main {
    font-family: var(--font); font-size:34px; font-weight:700;
    line-height:1; letter-spacing:5px; text-transform:uppercase;
    background: linear-gradient(135deg, #f5e6bf 0%, #e4bd6c 40%, #d4a840 60%, #e4bd6c 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    margin-bottom:10px;
    animation: shimmer 6s linear infinite;
  }
  .brand-seminar {
    display:inline-block;
    font-family: var(--font); font-size:9px; font-weight:500;
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

  .textarea-wrap {
    flex:1; min-height:120px; position:relative;
    animation: fadeUp 0.7s ease both;
    display:flex;
  }
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
  .textarea:focus { border-color: rgba(228,189,108,0.5); box-shadow: 0 0 0 1px rgba(228,189,108,0.15), inset 0 0 20px rgba(228,189,108,0.04); }
  .textarea::placeholder { color: rgba(248,241,221,0.15); font-size: 11px; font-weight: 200; line-height: 1.9; }

  .count-info {
    display:flex; align-items:center; justify-content:space-between;
    margin-top:10px; padding: 9px 12px;
    background: rgba(10,18,40,0.4);
    border: 1px solid rgba(212,168,64,0.12);
    animation: fadeUp 0.7s 0.1s ease both;
  }
  .count-stat { display:flex; flex-direction:column; align-items:center; gap:2px; flex:1; }
  .count-stat + .count-stat { border-left: 1px solid rgba(212,168,64,0.1); }
  .count-num { font-family: var(--font); font-size: 18px; font-weight: 600; color: var(--gold-100); line-height: 1; }
  .count-lbl { font-family: var(--font); font-size: 7.5px; font-weight: 400; color: rgba(212,168,64,0.5); letter-spacing: 2px; text-transform: uppercase; }

  .draw-count-row {
    display:flex; align-items:center; justify-content:space-between;
    margin-top: 10px; padding: 9px 12px;
    background: rgba(10,18,40,0.4);
    border: 1px solid rgba(212,168,64,0.12);
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
  .dc-val {
    width: 44px; height: 28px;
    border-top: 1px solid rgba(212,168,64,0.25); border-bottom: 1px solid rgba(212,168,64,0.25);
    background: rgba(5,11,26,0.95);
    font-family: var(--font); font-size: 15px; font-weight: 600;
    color: var(--gold-100); text-align: center; line-height: 28px; letter-spacing: 1px;
  }

  /* 맵 선택 */
  .map-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 8px;
    animation: fadeUp 0.7s 0.18s ease both;
  }
  .map-card {
    padding: 10px 8px;
    background: rgba(10,18,40,0.5);
    border: 1px solid rgba(212,168,64,0.15);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }
  .map-card:hover { background: rgba(228,189,108,0.05); border-color: rgba(228,189,108,0.4); }
  .map-card.active {
    background: rgba(228,189,108,0.12);
    border-color: var(--gold-400);
    box-shadow: 0 0 16px rgba(228,189,108,0.2), inset 0 0 12px rgba(228,189,108,0.05);
  }
  .map-icon {
    width: 100%; height: 36px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .map-icon svg { width: 100%; height: 100%; }
  .map-name {
    font-family: var(--font); font-size: 9px; font-weight: 500;
    color: var(--gold-100); letter-spacing: 2.5px; text-transform: uppercase;
  }
  .map-card.active .map-name { color: var(--gold-50); }

  .draw-btn {
    width: 100%; padding: 15px; margin-top: 14px;
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
    transition: all 0.2s;
    flex-shrink:0;
  }
  .reset-btn:hover { color: rgba(255,140,140,0.7); border-color: rgba(255,140,140,0.25); }

  /* ━━━ 오른쪽 ━━━ */
  .right-panel {
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; z-index: 2;
    padding: 40px;
  }

  .standby { text-align: center; animation: fadeIn 0.8s ease both; }
  .standby-top-orn { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 32px; animation: fadeDown 0.8s 0.1s ease both; }
  .standby-top-orn .line { width: 80px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .standby-top-orn .diamond { width: 8px; height: 8px; background: var(--gold-300); transform: rotate(45deg); box-shadow: 0 0 16px rgba(228,189,108,0.6); }

  .standby .eyebrow { font-family: var(--font); font-size: 0.85vw; font-weight: 400; letter-spacing: 12px; text-transform: uppercase; color: var(--gold-300); margin-bottom: 28px; opacity: 0.85; animation: fadeUp 0.8s 0.2s ease both; }
  .standby .title {
    font-family: var(--font);
    font-size: 7vw; font-weight: 700;
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
  .game-header { text-align: center; margin-bottom: 10px; animation: fadeDown 0.5s ease both; }
  .game-title {
    font-family: var(--font); font-size: 1.3vw; font-weight: 600;
    letter-spacing: 7px; text-transform: uppercase;
    color: var(--gold-200); margin-bottom: 3px;
  }
  .game-subtitle { font-family: var(--font-ko); font-size: 0.72vw; font-weight: 300; letter-spacing: 4px; color: rgba(228,189,108,0.5); }

  .game-body {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 16px;
    min-height: 0;
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

  /* 실시간 랭킹 패널 */
  .rank-panel {
    background: linear-gradient(180deg, rgba(10,18,40,0.6) 0%, rgba(10,18,40,0.4) 100%);
    border: 1px solid rgba(228,189,108,0.2);
    padding: 14px 12px;
    display: flex; flex-direction: column;
    animation: fadeUp 0.5s 0.2s ease both;
  }
  .rank-title {
    font-family: var(--font);
    font-size: 9px; font-weight: 600;
    letter-spacing: 4px; text-transform: uppercase;
    color: var(--gold-300);
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(228,189,108,0.15);
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .rank-title::before {
    content:''; width: 4px; height: 4px;
    background: var(--gold-300); transform: rotate(45deg);
    box-shadow: 0 0 6px rgba(228,189,108,0.6);
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
  .rank-row.top {
    background: linear-gradient(90deg, rgba(228,189,108,0.15) 0%, rgba(228,189,108,0.05) 100%);
    border-color: rgba(228,189,108,0.45);
    box-shadow: 0 0 12px rgba(228,189,108,0.15);
  }
  .rank-row.top1 {
    background: linear-gradient(90deg, rgba(228,189,108,0.25) 0%, rgba(228,189,108,0.08) 100%);
    border-color: var(--gold-400);
    box-shadow: 0 0 20px rgba(228,189,108,0.3);
  }
  .rank-row.eliminated { opacity: 0.35; filter: grayscale(0.3); }

  .rank-num {
    font-family: var(--font); font-size: 12px; font-weight: 700;
    color: var(--gold-200); width: 22px; text-align: center;
    letter-spacing: 0.5px;
  }
  .rank-row.top1 .rank-num { color: var(--gold-50); font-size: 13px; }
  .rank-row.eliminated .rank-num { color: rgba(228,189,108,0.4); }

  .rank-color {
    width: 8px; height: 8px; border-radius: 50%;
    flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.4);
  }
  .rank-name {
    font-family: var(--font-ko); font-size: 11px; font-weight: 400;
    color: var(--cream); letter-spacing: 1px;
    flex: 1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .rank-row.top1 .rank-name { color: var(--white); font-weight: 500; }

  .rank-status {
    font-family: var(--font); font-size: 8px; font-weight: 500;
    letter-spacing: 1px; text-transform: uppercase;
    color: rgba(228,189,108,0.5);
  }
  .rank-row.eliminated .rank-status { color: rgba(255,100,100,0.5); }

  /* 하단 게임 정보 */
  .game-footer {
    display:flex; justify-content: space-between; align-items: center;
    padding: 10px 4px 0;
    font-family: var(--font); font-size: 9px; font-weight: 300;
    color: var(--gold-300); letter-spacing: 3px; text-transform: uppercase;
  }
  .game-footer .left { display: flex; align-items: center; gap: 10px; }
  .game-footer .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold-300); animation: pulse-dot 1.2s infinite; }
  .game-footer .counter { color: var(--gold-50); font-weight: 600; font-size: 11px; }

  /* 당첨자 발표 오버레이 */
  .winner-overlay {
    position: absolute; inset: 0; z-index: 10;
    display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, rgba(15,26,61,0.85) 0%, rgba(5,11,26,0.95) 70%);
    backdrop-filter: blur(8px);
    animation: fadeIn 0.4s ease both;
  }
  .winner-screen { text-align: center; max-width: 900px; padding: 40px; animation: winner-reveal 0.8s cubic-bezier(0.22,1,0.36,1) both; position: relative; }
  .sparkle { position: absolute; font-family: var(--font); color: var(--gold-200); opacity: 0; animation: sparkle 2s ease-in-out infinite; text-shadow: 0 0 12px rgba(228,189,108,0.8); pointer-events: none; }
  .sparkle.s1 { top: 15%; left: 15%; animation-delay: 0.4s; font-size: 14px; }
  .sparkle.s2 { top: 25%; right: 18%; animation-delay: 0.7s; font-size: 18px; }
  .sparkle.s3 { bottom: 30%; left: 20%; animation-delay: 1s; font-size: 12px; }
  .sparkle.s4 { top: 40%; right: 12%; animation-delay: 1.3s; font-size: 16px; }
  .sparkle.s5 { bottom: 20%; right: 25%; animation-delay: 0.2s; font-size: 13px; }

  .w-top-orn { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 24px; animation: fadeDown 0.6s 0.3s ease both; }
  .w-top-orn .line { width: 100px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .w-top-orn .diamond { width: 7px; height: 7px; background: var(--gold-300); transform: rotate(45deg); box-shadow: 0 0 12px rgba(228,189,108,0.8); }

  .w-label { font-family: var(--font); font-size: 0.95vw; font-weight: 600; letter-spacing: 14px; text-transform: uppercase; color: var(--gold-300); margin-bottom: 10px; animation: rise 0.5s 0.4s ease both; }
  .w-label-ko { font-family: var(--font-ko); font-size: 0.95vw; font-weight: 200; letter-spacing: 10px; color: rgba(228,189,108,0.55); margin-bottom: 30px; animation: rise 0.5s 0.5s ease both; }

  .w-rank-big {
    font-family: var(--font); font-size: 0.9vw; font-weight: 700;
    letter-spacing: 10px; text-transform: uppercase;
    color: var(--gold-50); margin-bottom: 16px;
    padding: 8px 28px;
    display: inline-block;
    background: linear-gradient(135deg, rgba(228,189,108,0.2), rgba(228,189,108,0.08));
    border: 1px solid var(--gold-400);
    animation: rise 0.5s 0.35s ease both;
  }

  .w-name-wrap { position: relative; padding: 40px 0; margin-bottom: 32px; }
  .w-name-wrap::before, .w-name-wrap::after {
    content: ''; position: absolute; left: 50%; transform: translateX(-50%);
    width: 200px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-300), transparent);
  }
  .w-name-wrap::before { top: 0; }
  .w-name-wrap::after  { bottom: 0; }

  .w-name {
    font-family: var(--font-ko); font-size: 7.5vw; font-weight: 700;
    letter-spacing: 10px; line-height: 1;
    animation: name-reveal 1s cubic-bezier(0.22,1,0.36,1) 0.3s both;
    background: linear-gradient(180deg, #ffffff 0%, #f8f1dd 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 40px rgba(228,189,108,0.3));
  }

  .next-btn {
    padding: 14px 48px;
    background: rgba(228,189,108,0.04);
    border: 1px solid var(--gold-400);
    cursor: pointer;
    font-family: var(--font); font-size: 0.85vw; font-weight: 600;
    letter-spacing: 6px; text-transform: uppercase;
    color: var(--gold-100);
    transition: all 0.3s;
    animation: rise 0.6s 1.1s ease both;
    margin-top: 16px;
  }
  .next-btn:hover { background: rgba(228,189,108,0.14); color: var(--gold-50); transform: translateY(-1px); }

  /* ━━━ 전체 결과 화면 (모든 라운드 완료 시) ━━━ */
  .final-results {
    text-align: center; animation: fadeIn 0.5s ease both;
    max-width: 760px; margin: 0 auto;
  }
  .final-top-orn { display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 24px; }
  .final-top-orn .line { width: 90px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .final-top-orn .diamond { width: 7px; height: 7px; background: var(--gold-300); transform: rotate(45deg); box-shadow: 0 0 12px rgba(228,189,108,0.8); }

  .final-title {
    font-family: var(--font); font-size: 3vw; font-weight: 700;
    letter-spacing: 8px; text-transform: uppercase;
    background: linear-gradient(135deg, #faf1d8, #e4bd6c, #d4a840, #e4bd6c, #faf1d8);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 4s linear infinite;
    margin-bottom: 10px;
  }
  .final-subtitle { font-family: var(--font-ko); font-size: 0.9vw; font-weight: 300; letter-spacing: 8px; color: var(--cream); margin-bottom: 40px; }

  .final-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 36px; }
  .final-row {
    display: grid; grid-template-columns: 80px 1fr auto; align-items: center;
    gap: 24px; padding: 18px 32px;
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
    font-family: var(--font); font-size: 32px; font-weight: 700;
    color: var(--gold-200); letter-spacing: 1px;
    line-height: 1;
  }
  .final-row.gold .final-rank-num { color: var(--gold-50); font-size: 36px; }
  .final-rank-label {
    font-family: var(--font); font-size: 9px; font-weight: 500;
    color: var(--gold-400); letter-spacing: 3px; text-transform: uppercase;
    display: block; margin-bottom: 2px;
  }
  .final-name {
    font-family: var(--font-ko); font-size: 26px; font-weight: 500;
    color: var(--cream); letter-spacing: 4px;
    text-align: left;
  }
  .final-row.gold .final-name { font-size: 32px; color: var(--white); font-weight: 600; }
  .final-badge {
    font-family: var(--font); font-size: 10px; font-weight: 500;
    color: var(--gold-300); letter-spacing: 3px; text-transform: uppercase;
    padding: 6px 14px;
    border: 1px solid rgba(228,189,108,0.3);
  }

  .confetti-wrap { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 15; }
  .cp { position: absolute; animation: confetti-fall 2.5s ease forwards; }
`;

if (!document.getElementById("ld-style")) {
  const el = document.createElement("style");
  el.id = "ld-style";
  el.textContent = css;
  document.head.appendChild(el);
}

// 샴페인 컨페티
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
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        }}/>
      ))}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 맵 빌더 — 4종 맵 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MAPS = {
  zigzag: {
    id: "zigzag",
    name: "Zigzag",
    nameKo: "지그재그",
    icon: (
      <svg viewBox="0 0 40 30">
        <line x1="4" y1="8"  x2="36" y2="12" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="36" y1="16" x2="4"  y2="20" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="4"  y1="24" x2="36" y2="26" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  pachinko: {
    id: "pachinko",
    name: "Pachinko",
    nameKo: "파친코",
    icon: (
      <svg viewBox="0 0 40 30">
        {[8,20,32].map(x => [6,14,22].map(y => (
          <circle key={`${x}-${y}`} cx={x+((y%8===6)?4:0)} cy={y} r="1.2" fill="currentColor"/>
        )))}
      </svg>
    ),
  },
  spiral: {
    id: "spiral",
    name: "Spiral",
    nameKo: "스파이럴",
    icon: (
      <svg viewBox="0 0 40 30">
        <path d="M 4 8 L 36 8 L 36 14 L 8 14 L 8 20 L 32 20 L 32 26" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  maze: {
    id: "maze",
    name: "Maze",
    nameKo: "미로",
    icon: (
      <svg viewBox="0 0 40 30">
        <line x1="8" y1="4" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="20" y1="10" x2="20" y2="26" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="32" y1="4" x2="32" y2="20" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="8" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="20" y1="10" x2="32" y2="10" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
};

function buildMap(mapId, W, H, Bodies, World, world) {
  const wallOpts = {
    isStatic: true,
    render: { fillStyle: 'rgba(228,189,108,0.15)', strokeStyle: 'rgba(228,189,108,0.6)', lineWidth: 1.5 },
  };
  const slopeOpts = {
    isStatic: true, friction: 0.005,
    render: { fillStyle: 'rgba(228,189,108,0.3)', strokeStyle: 'rgba(228,189,108,0.7)', lineWidth: 1 },
  };
  const pegOpts = {
    isStatic: true,
    render: { fillStyle: 'rgba(228,189,108,0.25)', strokeStyle: 'rgba(228,189,108,0.8)', lineWidth: 1 },
  };

  // 공통: 외곽 벽
  const walls = [
    Bodies.rectangle(-5, H/2, 10, H*2, wallOpts),
    Bodies.rectangle(W+5, H/2, 10, H*2, wallOpts),
    Bodies.rectangle(W/2, -5, W*2, 10, wallOpts),
  ];
  World.add(world, walls);

  const obstacles = [];

  if (mapId === "zigzag") {
    const slopeCount = 5;
    const slopeH = H / (slopeCount + 2);
    for (let i = 0; i < slopeCount; i++) {
      const y = slopeH * (i + 1) + 40;
      const isLeft = i % 2 === 0;
      const slopeLen = W * 0.72;
      const angle = isLeft ? 0.16 : -0.16;
      const cx = isLeft ? slopeLen/2 + 20 : W - slopeLen/2 - 20;
      obstacles.push(Bodies.rectangle(cx, y, slopeLen, 6, { ...slopeOpts, angle }));
    }
    // 중간 페그
    const pegRows = 3;
    for (let r = 0; r < pegRows; r++) {
      const y = (slopeH * 1.5) + r * slopeH * 1.4;
      if (y > H - 140) break;
      const cols = r % 2 === 0 ? 6 : 7;
      for (let c = 0; c < cols; c++) {
        const x = (W / (cols + 1)) * (c + 1) + (r % 2 === 0 ? 20 : 0);
        if (x < 40 || x > W - 40) continue;
        obstacles.push(Bodies.circle(x, y + slopeH*0.7, 4, pegOpts));
      }
    }
  }
  else if (mapId === "pachinko") {
    // 빽빽한 핀 그리드
    const startY = 80;
    const endY = H - 140;
    const rowCount = 10;
    const rowH = (endY - startY) / rowCount;
    for (let r = 0; r < rowCount; r++) {
      const y = startY + r * rowH;
      const cols = 9;
      const offset = r % 2 === 0 ? 0 : (W / cols) / 2;
      for (let c = 0; c < cols; c++) {
        const x = (W / (cols + 1)) * (c + 1) + offset;
        if (x < 20 || x > W - 20) continue;
        obstacles.push(Bodies.circle(x, y, 5, pegOpts));
      }
    }
    // 분할 벽 (좌우로 튕기도록)
    obstacles.push(Bodies.rectangle(W * 0.3, H * 0.35, 3, 60, { ...wallOpts, angle: 0.4 }));
    obstacles.push(Bodies.rectangle(W * 0.7, H * 0.55, 3, 60, { ...wallOpts, angle: -0.4 }));
  }
  else if (mapId === "spiral") {
    // 나선형 선반 (좌우 번갈아 긴 선반)
    const shelfCount = 6;
    const shelfH = (H - 180) / shelfCount;
    for (let i = 0; i < shelfCount; i++) {
      const y = 80 + i * shelfH;
      const isLeft = i % 2 === 0;
      const shelfLen = W * 0.82;
      // 살짝 기울어진 선반
      const angle = isLeft ? 0.08 : -0.08;
      const cx = isLeft ? shelfLen / 2 - 10 : W - shelfLen / 2 + 10;
      obstacles.push(Bodies.rectangle(cx, y, shelfLen, 5, { ...slopeOpts, angle }));

      // 선반 끝 막은 벽 (떨어지는 구간만 빼고)
      if (isLeft) {
        // 왼쪽으로 쭉 가다가 오른쪽 끝으로 떨어짐 - 왼쪽 끝 살짝 올라간 벽
        obstacles.push(Bodies.rectangle(8, y - 18, 4, 30, wallOpts));
      } else {
        obstacles.push(Bodies.rectangle(W - 8, y - 18, 4, 30, wallOpts));
      }
    }
    // 중앙 페그 몇 개
    obstacles.push(Bodies.circle(W * 0.3, H * 0.25, 5, pegOpts));
    obstacles.push(Bodies.circle(W * 0.7, H * 0.45, 5, pegOpts));
    obstacles.push(Bodies.circle(W * 0.4, H * 0.65, 5, pegOpts));
  }
  else if (mapId === "maze") {
    // 미로 스타일 - 좁은 통로들
    // 수평 벽들 (중간에 구멍)
    const rowCount = 5;
    const rowH = (H - 180) / rowCount;
    for (let i = 0; i < rowCount; i++) {
      const y = 80 + i * rowH;
      const gapCenter = W * (0.25 + (i % 3) * 0.25);
      const gapWidth = 70;

      // 왼쪽 부분
      const leftLen = gapCenter - gapWidth/2;
      if (leftLen > 20) {
        obstacles.push(Bodies.rectangle(leftLen/2, y, leftLen, 5, slopeOpts));
      }
      // 오른쪽 부분
      const rightStart = gapCenter + gapWidth/2;
      const rightLen = W - rightStart;
      if (rightLen > 20) {
        obstacles.push(Bodies.rectangle(rightStart + rightLen/2, y, rightLen, 5, slopeOpts));
      }
    }

    // 세로 가이드 벽
    obstacles.push(Bodies.rectangle(W * 0.25, H * 0.25, 4, 80, wallOpts));
    obstacles.push(Bodies.rectangle(W * 0.5, H * 0.5, 4, 80, wallOpts));
    obstacles.push(Bodies.rectangle(W * 0.75, H * 0.35, 4, 80, wallOpts));

    // 페그 장식
    obstacles.push(Bodies.circle(W * 0.6, H * 0.2, 4, pegOpts));
    obstacles.push(Bodies.circle(W * 0.35, H * 0.45, 4, pegOpts));
    obstacles.push(Bodies.circle(W * 0.8, H * 0.6, 4, pegOpts));
  }

  World.add(world, obstacles);

  // 공통: 하단 결승선 (탈락 센서)
  const funnelY = H - 100;
  const funnelLeft = Bodies.rectangle(W*0.25, funnelY, W*0.55, 4, {
    ...slopeOpts, angle: 0.3,
    render: { fillStyle: 'rgba(228,189,108,0.4)', strokeStyle: 'rgba(228,189,108,0.9)', lineWidth: 1.5 }
  });
  const funnelRight = Bodies.rectangle(W*0.75, funnelY, W*0.55, 4, {
    ...slopeOpts, angle: -0.3,
    render: { fillStyle: 'rgba(228,189,108,0.4)', strokeStyle: 'rgba(228,189,108,0.9)', lineWidth: 1.5 }
  });
  const eliminationLine = Bodies.rectangle(W/2, H - 20, W, 4, {
    ...wallOpts, isSensor: true, label: 'finish',
    render: { fillStyle: 'rgba(228,189,108,0.9)', strokeStyle: 'rgba(228,189,108,1)', lineWidth: 2 }
  });
  const finishWallL = Bodies.rectangle(10, H - 40, 20, 80, wallOpts);
  const finishWallR = Bodies.rectangle(W - 10, H - 40, 20, 80, wallOpts);
  const bottomWall = Bodies.rectangle(W/2, H+5, W*2, 10, wallOpts);

  World.add(world, [funnelLeft, funnelRight, eliminationLine, finishWallL, finishWallR, bottomWall]);

  return eliminationLine;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 마블 게임
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MarbleGame({ players, winnerCount, mapId, onComplete, gameKey }) {
  const canvasRef = useRef(null);
  const rankListRef = useRef([]); // 탈락 순서대로 push (먼저 탈락=꼴찌)
  const [rankings, setRankings] = useState([]); // 실시간 순위
  const winnersNotifiedRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || players.length === 0) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const W = parent.clientWidth;
    const H = parent.clientHeight;
    canvas.width = W;
    canvas.height = H;

    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    const engine = Engine.create();
    engine.gravity.y = 0.9;

    const render = Render.create({
      canvas, engine,
      options: { width: W, height: H, wireframes: false, background: 'transparent' }
    });

    // 맵 빌드
    buildMap(mapId, W, H, Bodies, World, engine.world);

    // 구슬 생성
    const MARBLE_COLORS = [
      '#e4bd6c', '#d4a840', '#f5e6bf', '#b8922e',
      '#f8f1dd', '#eed398', '#faf1d8', '#c99c3d',
    ];

    const marbles = players.map((name, i) => {
      const col = i % 10;
      const row = Math.floor(i / 10);
      const x = 30 + col * ((W - 60) / 10) + Math.random() * 8;
      const y = 20 + row * 22 + Math.random() * 6;
      const color = MARBLE_COLORS[i % MARBLE_COLORS.length];

      const marble = Bodies.circle(x, y, 9, {
        restitution: 0.55,
        friction: 0.002,
        frictionAir: 0.005,
        density: 0.001,
        label: name,
        render: {
          fillStyle: color,
          strokeStyle: 'rgba(255,255,255,0.6)',
          lineWidth: 1.5,
        }
      });
      marble.customName = name;
      marble.customColor = color;
      marble.customEliminated = false;
      return marble;
    });

    World.add(engine.world, marbles);

    // 순위 관리: rankListRef는 [1등, 2등, 3등, ...] 순서로 쌓임
    // 마블 레이스에서는 "마지막에 떨어진 사람이 1등"
    // 탈락 = 결승선 도달 = 순위 결정
    // 첫 탈락 = 꼴찌, 마지막 생존자 = 1등
    // → 탈락 순서를 역순으로 뒤집어야 함
    const eliminationOrder = []; // 탈락한 순서대로 push

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        let marble = null;
        if (pair.bodyA.label === 'finish' || pair.bodyB.label === 'finish') {
          marble = pair.bodyA.label === 'finish' ? pair.bodyB : pair.bodyA;
        }
        if (marble && marble.customName && !marble.customEliminated) {
          marble.customEliminated = true;
          eliminationOrder.push({ name: marble.customName, color: marble.customColor });

          setTimeout(() => {
            try { World.remove(engine.world, marble); } catch(e){}
          }, 100);

          const alive = marbles.filter(m => !m.customEliminated);

          // 현재 랭킹 업데이트
          // 남아있는 구슬들 = 상위권 후보 (위에 있을수록 높은 등수)
          // 탈락한 구슬들 = 나중에 탈락할수록 높은 등수
          const aliveSorted = [...alive].sort((a,b) => a.position.y - b.position.y)
            .map(m => ({ name: m.customName, color: m.customColor, status: 'alive' }));
          const eliminated = [...eliminationOrder].reverse()
            .map(e => ({ ...e, status: 'eliminated' }));
          setRankings([...aliveSorted, ...eliminated]);

          // 마지막 1명 → 1등 확정
          if (alive.length === 1 && !winnersNotifiedRef.current) {
            winnersNotifiedRef.current = true;
            const winnerMarble = alive[0];
            eliminationOrder.push({ name: winnerMarble.customName, color: winnerMarble.customColor });

            // 최종 순위: eliminationOrder 역순 (마지막 탈락=1등)
            const finalRanking = [...eliminationOrder].reverse();

            setTimeout(() => {
              onComplete(finalRanking.slice(0, winnerCount));
            }, 1200);
          }
        }
      });
    });

    // afterRender: 이름 + 선두 링
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      ctx.save();

      const alive = marbles.filter(m => !m.customEliminated);

      // 실시간 순위 업데이트 (탈락 없이도 위치 기반)
      const aliveSorted = [...alive].sort((a,b) => a.position.y - b.position.y)
        .map(m => ({ name: m.customName, color: m.customColor, status: 'alive' }));
      const eliminated = [...eliminationOrder].reverse()
        .map(e => ({ ...e, status: 'eliminated' }));
      const currentRank = [...aliveSorted, ...eliminated];

      // 이름 라벨
      alive.forEach((m) => {
        ctx.font = '500 11px Montserrat, "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const name = m.customName;
        const x = m.position.x;
        const y = m.position.y - 18;

        const metrics = ctx.measureText(name);
        const bw = Math.max(metrics.width + 12, 24);
        const bh = 16;
        ctx.fillStyle = 'rgba(5,11,26,0.75)';
        ctx.strokeStyle = m.customColor;
        ctx.lineWidth = 1;
        ctx.fillRect(x - bw/2, y - bh/2, bw, bh);
        ctx.strokeRect(x - bw/2, y - bh/2, bw, bh);
        ctx.fillStyle = '#faf1d8';
        ctx.fillText(name, x, y);
      });

      // 선두 링 (1등 후보)
      if (alive.length > 1) {
        const leaderMarble = alive.reduce((top, m) => m.position.y < top.position.y ? m : top, alive[0]);
        ctx.strokeStyle = 'rgba(250,241,216,0.95)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(leaderMarble.position.x, leaderMarble.position.y, 16, 0, Math.PI * 2);
        ctx.stroke();

        // 1등 관왕 표시
        ctx.font = 'bold 9px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#faf1d8';
        ctx.fillText('◆ 1st', leaderMarble.position.x, leaderMarble.position.y - 32);
      }

      ctx.restore();
    });

    // React state 업데이트 (60fps 간격은 너무 자주이므로 500ms 간격)
    const rankUpdateInterval = setInterval(() => {
      const alive = marbles.filter(m => !m.customEliminated);
      const aliveSorted = [...alive].sort((a,b) => a.position.y - b.position.y)
        .map(m => ({ name: m.customName, color: m.customColor, status: 'alive' }));
      const eliminated = [...eliminationOrder].reverse()
        .map(e => ({ ...e, status: 'eliminated' }));
      setRankings([...aliveSorted, ...eliminated]);
    }, 400);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      clearInterval(rankUpdateInterval);
      try {
        Render.stop(render);
        Runner.stop(runner);
        World.clear(engine.world, false);
        Engine.clear(engine);
      } catch(e){}
    };
  }, [gameKey]);

  const alive = rankings.filter(r => r.status === 'alive').length;

  return (
    <div className="game-body">
      <div className="canvas-wrap">
        <canvas ref={canvasRef} className="game-canvas"/>
      </div>

      {/* 실시간 순위 패널 */}
      <div className="rank-panel">
        <div className="rank-title">Live Ranking</div>
        <div className="rank-list">
          {rankings.slice(0, 20).map((r, i) => {
            const rank = i + 1;
            const isTop = rank <= winnerCount && r.status === 'alive';
            const is1 = rank === 1 && r.status === 'alive';
            return (
              <div
                key={`${r.name}-${i}`}
                className={`rank-row ${is1 ? 'top1' : isTop ? 'top' : ''} ${r.status==='eliminated'?'eliminated':''}`}
              >
                <div className="rank-num">{rank}</div>
                <div className="rank-color" style={{background: r.color}}/>
                <div className="rank-name">{r.name}</div>
                {r.status === 'eliminated' && <div className="rank-status">OUT</div>}
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
  const [phase, setPhase] = useState("standby"); // standby | playing | results
  const [gameKey, setGameKey] = useState(0);

  const names = rawText.split(/[\n,，\t]+/).map(n=>n.trim()).filter(n=>n.length>0);
  const canStart = names.length >= 2 && phase === "standby";

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
    if (!window.confirm("결과를 초기화하고 다시 시작할까요?")) return;
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
          <div className="count-stat">
            <div className="count-num">{Math.max(0, names.length - drawCount)}</div>
            <div className="count-lbl">Pool</div>
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
              className={`map-card ${selectedMap === m.id ? 'active' : ''}`}
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
            ? <><span className="spin-icon">◈</span>Running</>
            : phase === "results" ? "Replay"
            : "Start Game"}
        </button>

        {(finalWinners.length > 0 || phase === "playing") && (
          <button className="reset-btn" onClick={handleReset} disabled={phase === "playing"}>Reset</button>
        )}
      </div>

      {/* ═══ 오른쪽 ═══ */}
      <div className="right-panel">

        {/* 대기 화면 */}
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
                : names.length < 2
                ? "2명 이상 입력해 주세요"
                : `${names.length}명 참가 · 상위 ${drawCount}명 당첨 · ${MAPS[selectedMap].nameKo} 맵`}
            </div>
          </div>
        )}

        {/* 게임 진행 중 */}
        {phase==="playing" && (
          <div className="game-screen">
            <div className="game-header">
              <div className="game-title">Marble Race  ·  {MAPS[selectedMap].name}</div>
              <div className="game-subtitle">상위 {drawCount}명이 당첨됩니다 · 끝까지 남는 순서가 순위입니다</div>
            </div>
            <MarbleGame
              players={names}
              winnerCount={drawCount}
              mapId={selectedMap}
              onComplete={handleComplete}
              gameKey={gameKey}
            />
            <div className="game-footer">
              <div className="left">
                <span className="dot"/>
                <span>Live  ·  최후까지 남는 순서대로 순위 결정</span>
              </div>
              <div>
                Winners  <span className="counter">{drawCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* 최종 결과 화면 */}
        {phase==="results" && finalWinners.length > 0 && (
          <div className="final-results">
            <Confetti active={true}/>

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
                  <div key={w.name} className={`final-row ${rankClass}`} style={{animationDelay: `${i * 0.15}s`}}>
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

            <button className="next-btn" onClick={handleReset}>
              New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
