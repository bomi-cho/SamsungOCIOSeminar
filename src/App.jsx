import { useState, useRef, useEffect } from "react";

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

  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUpLg { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes glow-breathe {
    0%,100% { box-shadow: 0 0 0 0 rgba(228,189,108,0); }
    50%     { box-shadow: 0 0 50px 4px rgba(228,189,108,0.35); }
  }
  @keyframes text-glow {
    0%,100% { text-shadow: 0 0 20px rgba(228,189,108,0.2); }
    50%     { text-shadow: 0 0 40px rgba(228,189,108,0.45), 0 0 80px rgba(228,189,108,0.15); }
  }
  @keyframes confetti-fall {
    0%   { transform:translateY(-20px) rotate(0deg); opacity:1; }
    100% { transform:translateY(110vh) rotate(720deg); opacity:0; }
  }
  @keyframes name-reveal {
    0%   { opacity:0; transform:scale(0.7); letter-spacing:60px; filter:blur(20px); }
    50%  { opacity:1; filter:blur(0); }
    100% { opacity:1; transform:scale(1); letter-spacing:14px; filter:blur(0); }
  }
  @keyframes row-reveal {
    0%   { opacity:0; transform:translateX(-30px); filter:blur(8px); }
    100% { opacity:1; transform:translateX(0); filter:blur(0); }
  }
  @keyframes rise { 0%{opacity:0; transform:translateY(20px)} 100%{opacity:1; transform:translateY(0)} }
  @keyframes float-particle {
    0%,100% { transform:translateY(0) translateX(0); opacity:0.3; }
    50%     { transform:translateY(-20px) translateX(10px); opacity:0.8; }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:0.3; transform:scale(1); }
    50%     { opacity:1; transform:scale(1.3); }
  }
  @keyframes sparkle-flash {
    0%,100% { opacity:0; transform:scale(0.5) rotate(0deg); }
    50%     { opacity:1; transform:scale(1.2) rotate(180deg); }
  }
  @keyframes drum-roll {
    0% { transform:translateX(0); }
    25% { transform:translateX(-3px); }
    50% { transform:translateX(0); }
    75% { transform:translateX(3px); }
    100% { transform:translateX(0); }
  }
  @keyframes pulse-ring {
    0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
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
    z-index:7; pointer-events:none; box-shadow: 0 0 12px rgba(228,189,108,0.6);
  }
  .diamond-orn.tl { top:38px; left:38px; }
  .diamond-orn.tr { top:38px; right:38px; }
  .diamond-orn.bl { bottom:38px; left:38px; }
  .diamond-orn.br { bottom:38px; right:38px; }

  /* ━━━ 왼쪽 컨트롤 패널 ━━━ */
  .left-panel {
    width:34%; min-width: 400px;
    display:flex; flex-direction:column;
    padding:32px 26px 24px;
    position:relative; z-index:3;
    background: linear-gradient(180deg, rgba(5,11,26,0.88) 0%, rgba(5,11,26,0.72) 100%);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(212,168,64,0.12);
    overflow-y: auto;
  }
  .left-panel::-webkit-scrollbar { width: 4px; }
  .left-panel::-webkit-scrollbar-thumb { background: rgba(228,189,108,0.3); }

  .brand { text-align:center; margin-bottom:20px; animation: fadeDown 0.8s ease both; flex-shrink:0; }
  .brand-eyebrow { font-family: var(--font); font-size:9px; font-weight:300; color: var(--gold-400); letter-spacing:10px; text-transform:uppercase; margin-bottom:10px; opacity:0.8; }
  .brand-line-top { width:36px; height:1px; margin:0 auto 14px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .brand-year { font-family: var(--font); font-size:13px; font-weight:300; color: var(--gold-200); letter-spacing:7px; margin-bottom:2px; }
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
    font-family: var(--font); font-size:8px; font-weight:500;
    color: var(--cream); letter-spacing:5px; text-transform:uppercase;
    padding:6px 14px;
    border-top: 1px solid rgba(228,189,108,0.3);
    border-bottom: 1px solid rgba(228,189,108,0.3);
  }

  /* 라운드 인디케이터 */
  .round-indicator {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; margin-bottom: 12px;
    background: linear-gradient(90deg, rgba(228,189,108,0.12), rgba(228,189,108,0.04));
    border: 1px solid rgba(228,189,108,0.3);
    animation: fadeDown 0.6s ease both;
  }
  .ri-left { display: flex; align-items: center; gap: 10px; }
  .ri-icon {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold-400), var(--gold-500));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font); font-size: 13px; font-weight: 700;
    color: var(--bg-0, #050b1a);
    box-shadow: 0 0 16px rgba(228,189,108,0.4);
  }
  .ri-text {
    font-family: var(--font); font-size: 10px; font-weight: 600;
    color: var(--gold-50); letter-spacing: 3px; text-transform: uppercase;
  }
  .ri-text .sub { font-size: 8px; color: var(--gold-400); font-weight: 400; display: block; }
  .ri-stat {
    font-family: var(--font); font-size: 10px; font-weight: 500;
    color: var(--gold-300); letter-spacing: 2px; text-transform: uppercase;
    text-align: right;
  }
  .ri-stat .num { font-size: 16px; font-weight: 700; color: var(--gold-50); display: block; letter-spacing: 1px; }

  .sec-label {
    font-family: var(--font); font-size:9px; font-weight:500;
    letter-spacing:5px; text-transform:uppercase; color: var(--gold-300);
    display:flex; align-items:center; gap:10px; margin:12px 0 8px;
  }
  .sec-label .step-num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 18px; height: 18px;
    background: rgba(228,189,108,0.15);
    border: 1px solid var(--gold-400);
    color: var(--gold-50);
    font-family: var(--font); font-size: 9px; font-weight: 700;
    letter-spacing: 0;
    flex-shrink: 0;
  }
  .sec-label::after { content:''; flex:1; height:1px; background: linear-gradient(90deg, rgba(228,189,108,0.3), transparent); }

  /* 명단 입력 (Step 1) */
  .pool-wrap { position: relative; }
  .pool-textarea {
    width: 100%; height: 120px;
    background: linear-gradient(180deg, rgba(10,18,40,0.7) 0%, rgba(10,18,40,0.5) 100%);
    border: 1px solid rgba(212,168,64,0.18);
    padding: 12px 14px;
    font-family: var(--font-ko); font-size: 12px; font-weight: 300;
    color: var(--cream); outline: none; resize: none;
    line-height: 1.85; letter-spacing: 0.5px;
    transition: all 0.3s;
  }
  .pool-textarea:focus { border-color: rgba(228,189,108,0.5); box-shadow: 0 0 0 1px rgba(228,189,108,0.15); }
  .pool-textarea::placeholder { color: rgba(248,241,221,0.2); font-size: 11px; }
  .pool-textarea:read-only {
    background: linear-gradient(180deg, rgba(10,18,40,0.5), rgba(10,18,40,0.3));
    color: var(--gold-200);
    border-color: rgba(228,189,108,0.25);
    font-weight: 400;
  }

  /* 버튼 그룹 */
  .btn-row { display: flex; gap: 8px; margin-top: 8px; }
  .btn {
    flex: 1; padding: 11px 12px;
    background: rgba(10,18,40,0.6);
    border: 1px solid rgba(228,189,108,0.25);
    cursor: pointer;
    font-family: var(--font); font-size: 9px; font-weight: 500;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold-100);
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .btn:hover:not(:disabled) {
    background: rgba(228,189,108,0.1);
    border-color: var(--gold-400);
    color: var(--gold-50);
  }
  .btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn.primary {
    background: linear-gradient(135deg, rgba(228,189,108,0.15), rgba(228,189,108,0.08));
    border-color: var(--gold-400);
    color: var(--gold-50);
    font-weight: 600;
  }
  .btn.primary:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(228,189,108,0.25), rgba(228,189,108,0.12));
    box-shadow: 0 0 24px rgba(228,189,108,0.2);
  }
  .btn .icon { font-size: 11px; }

  .copied-toast {
    position: fixed; top: 40px; left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: rgba(228,189,108,0.95);
    color: #0a1228;
    font-family: var(--font); font-size: 11px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    z-index: 100;
    animation: fadeDown 0.3s ease;
    box-shadow: 0 8px 32px rgba(228,189,108,0.4);
  }

  /* 당첨자 입력 (Step 3) */
  .winner-input-section {
    margin-top: 4px;
  }
  .winner-input-list {
    display: flex; flex-direction: column; gap: 6px;
    margin-top: 8px;
    max-height: 240px;
    overflow-y: auto;
    padding-right: 4px;
  }
  .winner-input-list::-webkit-scrollbar { width: 3px; }
  .winner-input-list::-webkit-scrollbar-thumb { background: rgba(228,189,108,0.3); }

  .winner-row {
    display: flex; align-items: center; gap: 8px;
    animation: fadeUp 0.3s ease both;
  }
  .winner-row-num {
    width: 28px; flex-shrink: 0;
    font-family: var(--font); font-size: 11px; font-weight: 700;
    color: var(--gold-300); text-align: center;
    letter-spacing: 0.5px;
  }
  .winner-row-input {
    flex: 1;
    background: rgba(10,18,40,0.6);
    border: 1px solid rgba(228,189,108,0.2);
    padding: 9px 12px;
    font-family: var(--font-ko); font-size: 13px; font-weight: 500;
    color: var(--cream); outline: none;
    letter-spacing: 1.5px;
    transition: all 0.2s;
  }
  .winner-row-input:focus {
    border-color: var(--gold-400);
    box-shadow: 0 0 0 1px rgba(228,189,108,0.2);
    color: var(--gold-50);
  }
  .winner-row-input::placeholder { color: rgba(248,241,221,0.15); font-size: 11px; }

  /* 자동완성 드롭다운 */
  .autocomplete-wrap {
    position: relative; flex: 1;
  }
  .autocomplete-dropdown {
    position: absolute;
    top: 100%; left: 0; right: 0;
    margin-top: 2px;
    background: linear-gradient(180deg, rgba(10,18,40,0.98), rgba(5,11,26,0.98));
    border: 1px solid var(--gold-400);
    box-shadow: 0 12px 32px rgba(0,0,0,0.6), 0 0 24px rgba(228,189,108,0.15);
    max-height: 220px;
    overflow-y: auto;
    z-index: 50;
    animation: fadeUp 0.15s ease both;
  }
  .autocomplete-dropdown::-webkit-scrollbar { width: 3px; }
  .autocomplete-dropdown::-webkit-scrollbar-thumb { background: rgba(228,189,108,0.4); }

  .ac-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 14px;
    cursor: pointer;
    font-family: var(--font-ko); font-size: 13px; font-weight: 400;
    color: var(--cream); letter-spacing: 1.5px;
    border-bottom: 1px solid rgba(228,189,108,0.06);
    transition: background 0.1s;
  }
  .ac-item:last-child { border-bottom: none; }
  .ac-item:hover, .ac-item.selected {
    background: rgba(228,189,108,0.15);
    color: var(--gold-50);
  }
  .ac-item.selected {
    border-left: 2px solid var(--gold-400);
    padding-left: 12px;
  }
  .ac-item .ac-match {
    color: var(--gold-300);
    font-weight: 600;
  }
  .ac-item .ac-hint {
    margin-left: auto;
    font-family: var(--font); font-size: 9px; font-weight: 400;
    color: rgba(228,189,108,0.4); letter-spacing: 1.5px; text-transform: uppercase;
  }
  .ac-empty {
    padding: 14px; text-align: center;
    font-family: var(--font-ko); font-size: 11px; font-weight: 300;
    color: rgba(228,189,108,0.4); letter-spacing: 2px;
  }
  .winner-row-remove {
    width: 28px; height: 28px;
    background: none; border: 1px solid rgba(255,140,140,0.2);
    color: rgba(255,140,140,0.5);
    cursor: pointer;
    font-size: 14px; line-height: 1;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .winner-row-remove:hover { color: rgba(255,100,100,0.9); border-color: rgba(255,100,100,0.6); }

  .add-row-btn {
    padding: 8px; margin-top: 6px;
    background: none;
    border: 1px dashed rgba(228,189,108,0.25);
    cursor: pointer;
    font-family: var(--font); font-size: 9px; font-weight: 500;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(228,189,108,0.5);
    transition: all 0.2s;
  }
  .add-row-btn:hover { border-color: rgba(228,189,108,0.6); color: var(--gold-200); }

  /* 총 당첨자 카운트 */
  .total-winners {
    margin-top: 14px; padding: 10px 14px;
    background: rgba(10,18,40,0.5);
    border: 1px solid rgba(228,189,108,0.15);
    display: flex; align-items: center; justify-content: space-between;
  }
  .tw-lbl { font-family: var(--font); font-size: 9px; font-weight: 500; color: var(--gold-300); letter-spacing: 3px; text-transform: uppercase; }
  .tw-num { font-family: var(--font); font-size: 20px; font-weight: 700; color: var(--gold-50); letter-spacing: 2px; line-height: 1; }

  /* 전체 당첨자 목록 */
  .all-winners {
    margin-top: 10px;
    background: rgba(10,18,40,0.4);
    border: 1px solid rgba(228,189,108,0.12);
    max-height: 180px;
    overflow-y: auto;
    padding: 6px;
  }
  .all-winners::-webkit-scrollbar { width: 3px; }
  .all-winners::-webkit-scrollbar-thumb { background: rgba(228,189,108,0.3); }

  .aw-empty {
    padding: 16px; text-align: center;
    font-family: var(--font); font-size: 9px; font-weight: 400;
    color: rgba(228,189,108,0.3); letter-spacing: 3px; text-transform: uppercase;
  }
  .aw-round-group {
    margin-bottom: 6px;
    border-bottom: 1px dashed rgba(228,189,108,0.1);
    padding-bottom: 4px;
  }
  .aw-round-group:last-child { border-bottom: none; margin-bottom: 0; }
  .aw-round-lbl {
    font-family: var(--font); font-size: 7.5px; font-weight: 600;
    color: var(--gold-400); letter-spacing: 3px; text-transform: uppercase;
    padding: 4px 8px;
    opacity: 0.7;
  }
  .aw-item {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 10px;
  }
  .aw-item .rank {
    font-family: var(--font); font-size: 10px; font-weight: 700;
    color: var(--gold-300); width: 22px;
  }
  .aw-item .name {
    flex: 1;
    font-family: var(--font-ko); font-size: 12px; font-weight: 400;
    color: var(--cream); letter-spacing: 1.5px;
  }

  .danger-btn {
    width: 100%; padding: 9px; margin-top: 8px;
    background: none;
    border: 1px solid rgba(212,168,64,0.12);
    cursor: pointer;
    font-family: var(--font); font-size: 8px; font-weight: 400;
    letter-spacing: 4px; text-transform: uppercase;
    color: rgba(212,168,64,0.3);
    transition: all 0.2s; flex-shrink: 0;
  }
  .danger-btn:hover { color: rgba(255,140,140,0.7); border-color: rgba(255,140,140,0.25); }

  /* ━━━ 오른쪽 발표 화면 ━━━ */
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

  .standby .eyebrow { font-family: var(--font); font-size: 0.85vw; font-weight: 400; letter-spacing: 12px; text-transform: uppercase; color: var(--gold-300); margin-bottom: 24px; opacity: 0.85; animation: fadeUp 0.8s 0.2s ease both; }
  .standby .title {
    font-family: var(--font); font-size: 6.5vw; font-weight: 700;
    line-height: 0.95; letter-spacing: 0.14em; text-transform: uppercase;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #faf1d8 0%, #f5e6bf 20%, #e4bd6c 40%, #d4a840 55%, #e4bd6c 70%, #f5e6bf 90%, #faf1d8 100%);
    background-size: 250% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 5s linear infinite, fadeUpLg 1s 0.1s ease both, text-glow 4s ease infinite;
    filter: drop-shadow(0 4px 30px rgba(228,189,108,0.2));
  }
  .standby .divider-ornament { display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 20px; animation: fadeUp 0.8s 0.3s ease both; }
  .standby .divider-ornament .line { width: 90px; height: 1px; background: linear-gradient(90deg, transparent, rgba(228,189,108,0.5), transparent); }
  .standby .divider-ornament .star { font-family: var(--font); font-size: 9px; color: var(--gold-300); letter-spacing: 4px; }
  .standby .subtitle { font-family: var(--font-ko); font-size: 1.1vw; font-weight: 200; color: var(--cream); letter-spacing: 10px; margin-bottom: 36px; animation: fadeUp 0.8s 0.4s ease both; }
  .standby .info-cards { display: flex; gap: 36px; justify-content: center; margin-bottom: 30px; animation: fadeUp 0.8s 0.5s ease both; }
  .standby .info-card { text-align: center; }
  .standby .info-card .lbl { font-family: var(--font); font-size: 0.6vw; font-weight: 500; letter-spacing: 4px; text-transform: uppercase; color: var(--gold-400); margin-bottom: 6px; opacity: 0.7; }
  .standby .info-card .val { font-family: var(--font); font-size: 1.05vw; font-weight: 400; color: var(--cream); letter-spacing: 3px; }
  .standby .info-divider { width: 1px; height: 32px; background: linear-gradient(180deg, transparent, rgba(228,189,108,0.3), transparent); }
  .standby .hint-ko { font-family: var(--font-ko); font-size: 0.78vw; font-weight: 300; letter-spacing: 3px; color: var(--gold-300); opacity: 0.6; animation: fadeUp 0.8s 0.6s ease both; }

  /* 드럼롤 */
  .drumroll { text-align: center; animation: fadeIn 0.4s ease both; position: relative; }
  .drumroll-label { font-family: var(--font); font-size: 1vw; font-weight: 500; letter-spacing: 14px; text-transform: uppercase; color: var(--gold-300); margin-bottom: 20px; animation: text-glow 1.5s ease infinite; }
  .drumroll-label-ko { font-family: var(--font-ko); font-size: 0.9vw; font-weight: 200; letter-spacing: 10px; color: rgba(228,189,108,0.6); margin-bottom: 50px; }
  .drumroll-text { font-family: var(--font-ko); font-size: 5vw; font-weight: 500; color: rgba(255,255,255,0.25); letter-spacing: 14px; animation: drum-roll 0.1s linear infinite; text-shadow: 0 0 30px rgba(228,189,108,0.15); }
  .pulse-ring {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 320px; height: 320px;
    border: 1px solid rgba(228,189,108,0.4);
    border-radius: 50%;
    animation: pulse-ring 2s ease-out infinite;
    pointer-events: none;
  }
  .pulse-ring:nth-child(2) { animation-delay: 0.7s; }
  .pulse-ring:nth-child(3) { animation-delay: 1.4s; }

  /* ━━━ 한 명 발표 ━━━ */
  .winner-show { text-align: center; width: 100%; position: relative; animation: fadeIn 0.4s ease both; }
  .ws-top-orn { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 24px; animation: fadeDown 0.6s 0.2s ease both; }
  .ws-top-orn .line { width: 100px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .ws-top-orn .diamond { width: 7px; height: 7px; background: var(--gold-300); transform: rotate(45deg); box-shadow: 0 0 12px rgba(228,189,108,0.8); }
  .ws-rank-badge {
    display: inline-block;
    font-family: var(--font); font-size: 0.95vw; font-weight: 600;
    letter-spacing: 8px; text-transform: uppercase;
    color: var(--gold-50);
    padding: 10px 32px;
    background: linear-gradient(135deg, rgba(228,189,108,0.25), rgba(228,189,108,0.08));
    border: 1px solid var(--gold-400);
    margin-bottom: 24px;
    animation: rise 0.5s 0.3s ease both;
  }
  .ws-rank-badge .num { font-weight: 700; color: var(--white); margin-right: 6px; }
  .ws-label { font-family: var(--font); font-size: 1vw; font-weight: 600; letter-spacing: 16px; text-transform: uppercase; color: var(--gold-300); margin-bottom: 12px; animation: rise 0.5s 0.4s ease both; text-shadow: 0 0 30px rgba(228,189,108,0.3); }
  .ws-label-ko { font-family: var(--font-ko); font-size: 1vw; font-weight: 200; letter-spacing: 12px; color: rgba(228,189,108,0.65); margin-bottom: 40px; animation: rise 0.5s 0.5s ease both; }
  .ws-name-frame { position: relative; padding: 40px 40px; margin-bottom: 40px; }
  .ws-name-frame::before, .ws-name-frame::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); width: 280px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .ws-name-frame::before { top: 0; }
  .ws-name-frame::after  { bottom: 0; }
  .ws-name {
    font-family: var(--font-ko); font-size: 7.5vw; font-weight: 700;
    letter-spacing: 14px; line-height: 1;
    background: linear-gradient(180deg, #ffffff 0%, #faf1d8 50%, #f0d080 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 40px rgba(228,189,108,0.5)) drop-shadow(0 0 80px rgba(228,189,108,0.3));
    animation: name-reveal 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }
  .ws-actions { display: flex; gap: 16px; justify-content: center; animation: rise 0.6s 1s ease both; }
  .ws-btn {
    padding: 14px 40px;
    background: rgba(228,189,108,0.06);
    border: 1px solid var(--gold-400);
    cursor: pointer;
    font-family: var(--font); font-size: 0.85vw; font-weight: 600;
    letter-spacing: 6px; text-transform: uppercase;
    color: var(--gold-100);
    transition: all 0.3s;
  }
  .ws-btn.primary {
    background: linear-gradient(135deg, rgba(228,189,108,0.15), rgba(228,189,108,0.05));
    color: var(--gold-50);
  }
  .ws-btn:hover { background: rgba(228,189,108,0.18); color: var(--gold-50); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(228,189,108,0.2); }

  /* ━━━ 여러 명 동시 발표 (순위표) ━━━ */
  .ranking-show {
    text-align: center; width: 100%; max-width: 1100px;
    animation: fadeIn 0.5s ease both;
    position: relative;
  }
  .rs-top-orn { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 16px; animation: fadeDown 0.6s 0.2s ease both; }
  .rs-top-orn .line { width: 90px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .rs-top-orn .diamond { width: 7px; height: 7px; background: var(--gold-300); transform: rotate(45deg); box-shadow: 0 0 12px rgba(228,189,108,0.8); }

  .rs-round {
    font-family: var(--font); font-size: 0.75vw; font-weight: 500;
    letter-spacing: 10px; text-transform: uppercase;
    color: var(--gold-400); margin-bottom: 8px;
    animation: fadeUp 0.5s 0.25s ease both;
  }
  .rs-title {
    font-family: var(--font); font-size: 2.8vw; font-weight: 700;
    letter-spacing: 10px; text-transform: uppercase;
    background: linear-gradient(135deg, #faf1d8, #e4bd6c, #d4a840, #e4bd6c, #faf1d8);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 4s linear infinite, fadeUp 0.6s 0.3s ease both;
    margin-bottom: 8px;
  }
  .rs-subtitle {
    font-family: var(--font-ko); font-size: 0.85vw; font-weight: 200;
    letter-spacing: 10px; color: var(--cream);
    margin-bottom: 40px;
    animation: fadeUp 0.6s 0.4s ease both;
  }

  .rs-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 40px; }
  .rs-row {
    display: grid;
    grid-template-columns: 110px 1fr auto;
    align-items: center; gap: 32px;
    padding: 22px 40px;
    background: linear-gradient(90deg, rgba(10,18,40,0.7), rgba(10,18,40,0.4));
    border: 1px solid rgba(228,189,108,0.18);
    animation: row-reveal 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }
  .rs-row.gold {
    background: linear-gradient(90deg, rgba(228,189,108,0.28), rgba(228,189,108,0.06));
    border-color: var(--gold-400);
    box-shadow: 0 0 32px rgba(228,189,108,0.25);
  }
  .rs-row.silver {
    background: linear-gradient(90deg, rgba(220,220,220,0.15), rgba(220,220,220,0.04));
    border-color: rgba(220,220,220,0.5);
  }
  .rs-row.bronze {
    background: linear-gradient(90deg, rgba(205,127,50,0.15), rgba(205,127,50,0.04));
    border-color: rgba(205,127,50,0.5);
  }
  .rs-rank-block { text-align: left; }
  .rs-rank-lbl {
    font-family: var(--font); font-size: 10px; font-weight: 500;
    color: var(--gold-400); letter-spacing: 3px; text-transform: uppercase;
    display: block; margin-bottom: 4px;
  }
  .rs-rank-num {
    font-family: var(--font); font-size: 42px; font-weight: 700;
    color: var(--gold-200); letter-spacing: 1px; line-height: 1;
  }
  .rs-row.gold .rs-rank-num { color: var(--gold-50); font-size: 48px; }
  .rs-name {
    font-family: var(--font-ko); font-size: 32px; font-weight: 500;
    color: var(--cream); letter-spacing: 6px;
    text-align: left;
  }
  .rs-row.gold .rs-name { font-size: 40px; color: var(--white); font-weight: 600; }
  .rs-badge {
    font-family: var(--font); font-size: 11px; font-weight: 500;
    color: var(--gold-300); letter-spacing: 3px; text-transform: uppercase;
    padding: 8px 16px;
    border: 1px solid rgba(228,189,108,0.35);
  }
  .rs-row.gold .rs-badge {
    background: rgba(228,189,108,0.15);
    color: var(--gold-50); border-color: var(--gold-300);
  }

  .rs-action-row {
    display: flex; gap: 14px; justify-content: center;
    animation: fadeUp 0.6s 1.2s ease both;
  }

  /* 스파클 */
  .sparkle {
    position: absolute; font-family: var(--font);
    color: var(--gold-200); opacity: 0;
    text-shadow: 0 0 12px rgba(228,189,108,0.9);
    pointer-events: none;
    animation: sparkle-flash 2.2s ease-in-out infinite;
  }
  .sparkle.s1 { top: 12%; left: 12%; font-size: 16px; animation-delay: 0.2s; }
  .sparkle.s2 { top: 18%; right: 15%; font-size: 22px; animation-delay: 0.6s; }
  .sparkle.s3 { top: 35%; left: 8%; font-size: 14px; animation-delay: 1s; }
  .sparkle.s4 { top: 28%; right: 10%; font-size: 18px; animation-delay: 1.4s; }
  .sparkle.s5 { bottom: 25%; left: 18%; font-size: 13px; animation-delay: 0.4s; }
  .sparkle.s6 { bottom: 15%; right: 22%; font-size: 16px; animation-delay: 0.9s; }
  .sparkle.s7 { bottom: 35%; left: 5%; font-size: 11px; animation-delay: 1.6s; }
  .sparkle.s8 { top: 45%; right: 5%; font-size: 14px; animation-delay: 0.1s; }

  /* 컨페티 */
  .confetti-wrap { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 15; }
  .cp { position: absolute; animation: confetti-fall 3s ease forwards; }
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
  const ps = Array.from({length:120},(_,i)=>({
    id:i, left: Math.random()*100, delay: Math.random()*1.5,
    color: CC[Math.floor(Math.random()*CC.length)],
    size: 4 + Math.random()*10,
    round: Math.random() > 0.4,
    duration: 2.2 + Math.random()*1.5,
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
  const ps = Array.from({length:24},(_,i)=>({
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

// 자동완성 입력 컴포넌트 (App 밖에 정의해서 리마운트 방지 → 한글 IME 정상 동작)
function AutocompleteInput({ value, onChange, onSubmit, placeholder, candidates, excludeNames }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 중 여부
  const wrapRef = useRef(null);

  // 후보 필터링: 이름에 숫자/괄호/특수문자 모두 포함 가능
  // 쿼리는 앞뒤 공백만 제거하고 원본 그대로 비교 (toLowerCase는 영문에만 영향)
  const query = (value || "").trim();
  const queryLower = query.toLowerCase();
  const filtered = query.length === 0
    ? []
    : candidates
        .filter(name => !excludeNames.has(name))
        .filter(name => String(name).toLowerCase().includes(queryLower))
        .slice(0, 8);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 입력값 변경 시 드롭다운 다시 열기
  useEffect(() => {
    if (query.length > 0 && filtered.length > 0) {
      setShowDropdown(true);
      setSelectedIdx(0);
    } else {
      setShowDropdown(false);
    }
  }, [value]);

  const handleKeyDown = (e) => {
    // 한글 조합 중에는 키 이벤트 무시 (IME 정상 동작)
    if (isComposing || e.nativeEvent.isComposing || e.keyCode === 229) return;

    if (showDropdown && filtered.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((selectedIdx + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((selectedIdx - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selected = filtered[selectedIdx];
        onChange(selected);
        setShowDropdown(false);
        if (e.key === 'Enter' && onSubmit) {
          setTimeout(() => onSubmit(selected), 50);
        }
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    } else if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  const handleSelect = (name) => {
    onChange(name);
    setShowDropdown(false);
    if (onSubmit) {
      setTimeout(() => onSubmit(name), 50);
    }
  };

  const highlight = (name) => {
    if (!query) return name;
    const lowerName = String(name).toLowerCase();
    const idx = lowerName.indexOf(queryLower);
    if (idx === -1) return name;
    const nameStr = String(name);
    return (
      <>
        {nameStr.slice(0, idx)}
        <span className="ac-match">{nameStr.slice(idx, idx + query.length)}</span>
        {nameStr.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="autocomplete-wrap" ref={wrapRef}>
      <input
        type="text"
        className="winner-row-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onFocus={() => query.length > 0 && filtered.length > 0 && setShowDropdown(true)}
      />
      {showDropdown && (
        <div className="autocomplete-dropdown">
          {filtered.length === 0 ? (
            <div className="ac-empty">일치하는 이름이 없습니다</div>
          ) : (
            filtered.map((name, i) => (
              <div
                key={name}
                className={`ac-item ${i === selectedIdx ? 'selected' : ''}`}
                onClick={() => handleSelect(name)}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <span>{highlight(name)}</span>
                {i === selectedIdx && <span className="ac-hint">Enter</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {

  // 전체 명단 & 현재 참가자 풀
  const [initialText, setInitialText] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);

  // 라운드별 당첨자
  const [rounds, setRounds] = useState([]); // [{round:1, winners:[{name,rank}]}]
  const [currentRound, setCurrentRound] = useState(1);

  // 이번 라운드 입력 중인 당첨자
  const [inputs, setInputs] = useState([""]);

  // 발표 화면 상태
  const [phase, setPhase] = useState("standby"); // standby | single | ranking
  const [announcingName, setAnnouncingName] = useState(null); // 단일 발표용
  const [announcingList, setAnnouncingList] = useState(null); // 순위표 발표용
  const [toastMsg, setToastMsg] = useState("");

  // 파생 상태 - 오직 줄바꿈으로만 구분 (이름에 숫자/공백/특수문자 모두 허용)
  const allNames = initialText.split(/\r?\n/).map(n=>n.trim()).filter(n=>n.length>0);
  const allWinners = rounds.flatMap(r => r.winners);
  const wonNames = new Set(allWinners.map(w => w.name));
  const remainingNames = allNames.filter(n => !wonNames.has(n));

  // ━━━ 토스트 ━━━
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  // ━━━ Step 1: 명단 고정 ━━━
  const handleConfirmPool = () => {
    if (allNames.length < 2) {
      alert("최소 2명 이상의 참가자를 입력해 주세요.");
      return;
    }
    setSetupComplete(true);
  };

  const handleEditPool = () => {
    if (rounds.length > 0) {
      if (!window.confirm("참가자 명단을 수정하면 당첨자 기록이 모두 초기화됩니다.\n진행하시겠습니까?")) return;
      setRounds([]);
      setCurrentRound(1);
    }
    setSetupComplete(false);
  };

  // ━━━ Step 2: lazygyu로 명단 복사 ━━━
  const handleCopyPool = () => {
    const text = remainingNames.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${remainingNames.length}명 명단 복사 완료`);
    });
  };

  const handleOpenRoulette = () => {
    window.open("https://lazygyu.github.io/roulette/", "_blank", "noopener,noreferrer");
  };

  // ━━━ Step 3: 당첨자 입력 ━━━
  const handleInputChange = (idx, value) => {
    const next = [...inputs];
    next[idx] = value;
    setInputs(next);
  };

  const handleAddRow = () => {
    setInputs([...inputs, ""]);
  };

  const handleRemoveRow = (idx) => {
    if (inputs.length === 1) {
      setInputs([""]);
      return;
    }
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  // ━━━ 개별 발표 (1명씩 드럼롤) ━━━
  const handleAnnounceOne = async (idx) => {
    const name = inputs[idx].trim();
    if (!name) { alert("이름을 입력해 주세요."); return; }

    // 중복 체크
    if (wonNames.has(name)) {
      alert(`"${name}" 님은 이미 당첨된 참가자입니다.\n(중복 당첨은 불가합니다)`);
      return;
    }

    // 해당 라운드 찾거나 새로 생성
    const existingRound = rounds.find(r => r.round === currentRound);
    const winnerRank = existingRound ? existingRound.winners.length + 1 : 1;
    const newWinner = { name, rank: winnerRank };

    setAnnouncingName({ ...newWinner, round: currentRound });
    setPhase("single");

    // 기록에 추가
    if (existingRound) {
      setRounds(rounds.map(r =>
        r.round === currentRound
          ? { ...r, winners: [...r.winners, newWinner] }
          : r
      ));
    } else {
      setRounds([...rounds, { round: currentRound, winners: [newWinner] }]);
    }

    // 입력 칸 비우기
    const next = [...inputs];
    next[idx] = "";
    setInputs(next);
  };

  // ━━━ 전체 순위 발표 (여러 명) ━━━
  const handleAnnounceAll = () => {
    const validNames = inputs.map(n => n.trim()).filter(n => n.length > 0);
    if (validNames.length === 0) {
      alert("발표할 당첨자를 입력해 주세요.");
      return;
    }

    // 중복 체크
    const duplicates = validNames.filter(n => wonNames.has(n));
    if (duplicates.length > 0) {
      alert(`이미 당첨된 참가자가 포함되어 있습니다:\n${duplicates.join(', ')}\n\n(중복 당첨은 불가합니다)`);
      return;
    }

    // 입력 내 중복
    const uniqueNames = [...new Set(validNames)];
    if (uniqueNames.length !== validNames.length) {
      alert("입력 명단에 중복된 이름이 있습니다.");
      return;
    }

    // 라운드 당첨자 추가
    const winners = validNames.map((name, i) => ({ name, rank: i + 1 }));
    setRounds([...rounds, { round: currentRound, winners }]);

    setAnnouncingList({ round: currentRound, winners });
    setPhase("ranking");
    setInputs([""]);
  };

  // ━━━ 다음 라운드로 ━━━
  const handleNextRound = () => {
    setCurrentRound(currentRound + 1);
    setPhase("standby");
    setAnnouncingName(null);
    setAnnouncingList(null);
    setInputs([""]);
  };

  const handleBackToStandby = () => {
    setPhase("standby");
    setAnnouncingName(null);
    setAnnouncingList(null);
  };

  // ━━━ 초기화 ━━━
  const handleResetAll = () => {
    if (!window.confirm("모든 당첨자 기록을 초기화합니다.\n참가자 명단은 유지됩니다.\n진행하시겠습니까?")) return;
    setRounds([]);
    setCurrentRound(1);
    setInputs([""]);
    setPhase("standby");
  };

  const handleCopyAllWinners = () => {
    if (allWinners.length === 0) return;
    const text = rounds.map(r =>
      `[Round ${r.round}]\n` + r.winners.map(w => `${w.rank}. ${w.name}`).join('\n')
    ).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      showToast("전체 당첨자 목록 복사 완료");
    });
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

      {toastMsg && <div className="copied-toast">✓ {toastMsg}</div>}

      {/* ═══ 왼쪽 컨트롤 패널 ═══ */}
      <div className="left-panel">
        <div className="brand">
          <div className="brand-eyebrow">Invitation</div>
          <div className="brand-line-top"/>
          <div className="brand-year">2026</div>
          <div className="brand-name">Samsung</div>
          <div className="brand-main">OCIO</div>
          <span className="brand-seminar">OCIO Seminar</span>
        </div>

        {/* 라운드 인디케이터 */}
        {setupComplete && (
          <div className="round-indicator">
            <div className="ri-left">
              <div className="ri-icon">{currentRound}</div>
              <div className="ri-text">
                Round {currentRound}
                <span className="sub">{allWinners.length} / {allNames.length} 당첨</span>
              </div>
            </div>
            <div className="ri-stat">
              <span className="num">{remainingNames.length}</span>
              Remaining
            </div>
          </div>
        )}

        {!setupComplete ? (
          <>
            <div className="sec-label">
              <span className="step-num">1</span>
              참가자 명단 입력
            </div>
            <div className="pool-wrap">
              <textarea
                className="pool-textarea"
                placeholder={"전체 참가자 명단을 입력해 주세요\n한 줄에 한 명씩\n\n9803(조)\n9804(김)\n9805(이)\n..."}
                value={initialText}
                onChange={e => setInitialText(e.target.value)}
              />
            </div>
            <div className="btn-row">
              <button className="btn primary" onClick={handleConfirmPool} disabled={allNames.length < 2}>
                <span className="icon">✓</span>
                명단 확정 ({allNames.length}명)
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="sec-label">
              <span className="step-num">2</span>
              룰렛으로 명단 전달
            </div>
            <textarea
              className="pool-textarea"
              value={remainingNames.join('\n')}
              readOnly
              style={{height: '100px'}}
            />
            <div className="btn-row">
              <button className="btn" onClick={handleCopyPool} disabled={remainingNames.length === 0}>
                <span className="icon">⎘</span>
                명단 복사
              </button>
              <button className="btn primary" onClick={handleOpenRoulette}>
                <span className="icon">◈</span>
                룰렛 열기
              </button>
            </div>
            <button className="btn" style={{width: '100%', marginTop: '6px', fontSize: '8px', padding: '8px', opacity: 0.6}} onClick={handleEditPool}>
              전체 명단 수정
            </button>

            <div className="sec-label">
              <span className="step-num">3</span>
              당첨자 입력 및 발표
            </div>
            <div className="winner-input-section">
              <div className="winner-input-list">
                {inputs.map((val, idx) => (
                  <div key={idx} className="winner-row">
                    <div className="winner-row-num">{idx + 1}등</div>
                    <AutocompleteInput
                      value={val}
                      onChange={(newVal) => handleInputChange(idx, newVal)}
                      onSubmit={(submittedVal) => {
                        if (inputs.length === 1 && submittedVal.trim()) {
                          handleInputChange(idx, submittedVal);
                          setTimeout(() => handleAnnounceOne(idx), 100);
                        }
                      }}
                      placeholder={`${idx + 1}등 이름`}
                      candidates={allNames}
                      excludeNames={wonNames}
                    />
                    <button
                      className="winner-row-remove"
                      onClick={() => inputs.length === 1 ? handleAnnounceOne(idx) : handleRemoveRow(idx)}
                      title={inputs.length === 1 ? "발표" : "삭제"}
                    >
                      {inputs.length === 1 ? '▶' : '×'}
                    </button>
                  </div>
                ))}
              </div>
              <button className="add-row-btn" style={{width: '100%'}} onClick={handleAddRow}>
                + 당첨자 추가
              </button>
            </div>

            <div className="btn-row" style={{marginTop: '10px'}}>
              {inputs.length === 1 ? (
                <button className="btn primary" onClick={() => handleAnnounceOne(0)} disabled={!inputs[0].trim()}>
                  <span className="icon">✦</span>
                  한 명 발표
                </button>
              ) : (
                <button className="btn primary" onClick={handleAnnounceAll} disabled={!inputs.some(i => i.trim())}>
                  <span className="icon">✦</span>
                  순위표 발표 ({inputs.filter(i => i.trim()).length}명)
                </button>
              )}
            </div>

            {/* 총 당첨자 */}
            <div className="total-winners">
              <span className="tw-lbl">Total Winners</span>
              <span className="tw-num">{allWinners.length}</span>
            </div>

            {/* 전체 당첨자 목록 */}
            <div className="sec-label">전체 당첨자 기록</div>
            <div className="all-winners">
              {rounds.length === 0 ? (
                <div className="aw-empty">No Winners Yet</div>
              ) : (
                [...rounds].reverse().map(r => (
                  <div key={r.round} className="aw-round-group">
                    <div className="aw-round-lbl">Round {r.round}</div>
                    {r.winners.map(w => (
                      <div key={`${r.round}-${w.rank}`} className="aw-item">
                        <span className="rank">{w.rank}</span>
                        <span className="name">{w.name}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {allWinners.length > 0 && (
              <>
                <button className="btn" style={{width: '100%', marginTop: '8px', fontSize: '9px'}} onClick={handleCopyAllWinners}>
                  <span className="icon">⎘</span>
                  전체 당첨자 복사
                </button>
                <button className="danger-btn" onClick={handleResetAll}>Reset All</button>
              </>
            )}
          </>
        )}
      </div>

      {/* ═══ 오른쪽 발표 화면 ═══ */}
      <div className="right-panel">

        {phase === "standby" && (
          <div className="standby">
            <div className="standby-top-orn">
              <div className="line"/><div className="diamond"/><div className="line"/>
            </div>
            <div className="eyebrow">
              {setupComplete ? `Round ${currentRound}` : "Samsung OCIO Seminar"}
            </div>
            <div className="title">Lucky Draw</div>
            <div className="divider-ornament">
              <div className="line"/>
              <div className="star">◆ ◆ ◆</div>
              <div className="line"/>
            </div>
            <div className="subtitle">경 품 추 첨</div>

            <div className="info-cards">
              <div className="info-card">
                <div className="lbl">Participants</div>
                <div className="val">{allNames.length || '-'}</div>
              </div>
              <div className="info-divider"/>
              <div className="info-card">
                <div className="lbl">Winners</div>
                <div className="val">{allWinners.length}</div>
              </div>
              <div className="info-divider"/>
              <div className="info-card">
                <div className="lbl">Remaining</div>
                <div className="val">{remainingNames.length || '-'}</div>
              </div>
            </div>

            <div className="hint-ko">
              {!setupComplete
                ? "좌측에 참가자 명단을 입력해 주세요"
                : remainingNames.length === 0
                ? "모든 참가자의 추첨이 완료되었습니다"
                : `Round ${currentRound}  ·  ${remainingNames.length}명 중에서 추첨`}
            </div>
          </div>
        )}

        {phase === "single" && announcingName && (
          <>
            <Confetti active={true}/>
            <div className="winner-show">
              <span className="sparkle s1">✦</span>
              <span className="sparkle s2">✧</span>
              <span className="sparkle s3">✦</span>
              <span className="sparkle s4">✧</span>
              <span className="sparkle s5">✦</span>
              <span className="sparkle s6">✧</span>
              <span className="sparkle s7">✦</span>
              <span className="sparkle s8">✧</span>

              <div className="ws-top-orn">
                <div className="line"/><div className="diamond"/><div className="line"/>
              </div>

              <div className="ws-rank-badge">
                <span className="num">Round {announcingName.round}</span>
                · {announcingName.rank}등
              </div>

              <div className="ws-label">Congratulations</div>
              <div className="ws-label-ko">당 첨 을   축 하 드 립 니 다</div>

              <div className="ws-name-frame">
                <div className="ws-name">{announcingName.name}</div>
              </div>

              <div className="ws-actions">
                <button className="ws-btn" onClick={handleBackToStandby}>Continue</button>
                <button className="ws-btn primary" onClick={handleNextRound}>Next Round</button>
              </div>
            </div>
          </>
        )}

        {phase === "ranking" && announcingList && (
          <>
            <Confetti active={true}/>
            <div className="ranking-show">
              <span className="sparkle s1">✦</span>
              <span className="sparkle s2">✧</span>
              <span className="sparkle s5">✦</span>
              <span className="sparkle s6">✧</span>
              <span className="sparkle s8">✦</span>

              <div className="rs-top-orn">
                <div className="line"/><div className="diamond"/><div className="line"/>
              </div>

              <div className="rs-round">Round {announcingList.round}</div>
              <div className="rs-title">Winners</div>
              <div className="rs-subtitle">당 첨 자 발 표</div>

              <div className="rs-list">
                {announcingList.winners.map((w, i) => {
                  const rank = w.rank;
                  const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
                  const suffix = rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th';
                  const badge = rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : rank === 3 ? 'Bronze' : `${rank}${suffix}`;
                  return (
                    <div key={w.name} className={`rs-row ${rankClass}`} style={{animationDelay: `${0.3 + i * 0.25}s`}}>
                      <div className="rs-rank-block">
                        <span className="rs-rank-lbl">{rank}{suffix} Place</span>
                        <div className="rs-rank-num">{rank}</div>
                      </div>
                      <div className="rs-name">{w.name}</div>
                      <div className="rs-badge">{badge}</div>
                    </div>
                  );
                })}
              </div>

              <div className="rs-action-row">
                <button className="ws-btn" onClick={handleBackToStandby}>Continue</button>
                <button className="ws-btn primary" onClick={handleNextRound}>Next Round</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
