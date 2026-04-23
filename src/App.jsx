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
  @keyframes winner-bg-pulse {
    0%,100% { background: radial-gradient(ellipse at center, rgba(15,26,61,0.85) 0%, rgba(5,11,26,0.95) 70%); }
    50%     { background: radial-gradient(ellipse at center, rgba(42,58,112,0.6) 0%, rgba(5,11,26,0.92) 70%); }
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
  @keyframes count-up {
    0% { opacity:0; transform:scale(0.5); }
    100% { opacity:1; transform:scale(1); }
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
    width:30%; min-width: 360px;
    display:flex; flex-direction:column;
    padding:36px 28px;
    position:relative; z-index:3;
    background: linear-gradient(180deg, rgba(5,11,26,0.85) 0%, rgba(5,11,26,0.65) 100%);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(212,168,64,0.12);
    overflow-y: auto;
  }
  .left-panel::-webkit-scrollbar { width: 4px; }
  .left-panel::-webkit-scrollbar-thumb { background: rgba(228,189,108,0.3); }

  .brand { text-align:center; margin-bottom:24px; animation: fadeDown 0.8s ease both; flex-shrink:0; }
  .brand-eyebrow { font-family: var(--font); font-size:9px; font-weight:300; color: var(--gold-400); letter-spacing:10px; text-transform:uppercase; margin-bottom:12px; opacity:0.8; }
  .brand-line-top { width:36px; height:1px; margin:0 auto 16px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
  .brand-year { font-family: var(--font); font-size:14px; font-weight:300; color: var(--gold-200); letter-spacing:8px; margin-bottom:3px; }
  .brand-name { font-family: var(--font); font-size:13px; font-weight:400; color: var(--gold-100); letter-spacing:6px; text-transform:uppercase; margin-bottom:2px; }
  .brand-main {
    font-family: var(--font); font-size:38px; font-weight:700;
    line-height:1; letter-spacing:5px; text-transform:uppercase;
    background: linear-gradient(135deg, #f5e6bf 0%, #e4bd6c 40%, #d4a840 60%, #e4bd6c 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    margin-bottom:12px;
    animation: shimmer 6s linear infinite;
  }
  .brand-seminar {
    display:inline-block;
    font-family: var(--font); font-size:9px; font-weight:500;
    color: var(--cream); letter-spacing:5px; text-transform:uppercase;
    padding:7px 16px;
    border-top: 1px solid rgba(228,189,108,0.3);
    border-bottom: 1px solid rgba(228,189,108,0.3);
  }

  .sec-label {
    font-family: var(--font); font-size:9px; font-weight:500;
    letter-spacing:5px; text-transform:uppercase; color: var(--gold-300);
    display:flex; align-items:center; gap:10px; margin:18px 0 10px;
  }
  .sec-label::before {
    content:''; width:5px; height:5px;
    background: var(--gold-300); transform: rotate(45deg);
    box-shadow: 0 0 6px rgba(228,189,108,0.6);
    flex-shrink:0;
  }
  .sec-label::after { content:''; flex:1; height:1px; background: linear-gradient(90deg, rgba(228,189,108,0.3), transparent); }

  /* lazygyu 링크 버튼 */
  .roulette-link {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    background: linear-gradient(135deg, rgba(228,189,108,0.1), rgba(228,189,108,0.04));
    border: 1px solid rgba(228,189,108,0.4);
    color: var(--gold-100);
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
    font-family: var(--font); font-size: 11px; font-weight: 500;
    letter-spacing: 3px; text-transform: uppercase;
  }
  .roulette-link:hover {
    background: linear-gradient(135deg, rgba(228,189,108,0.18), rgba(228,189,108,0.08));
    border-color: var(--gold-400);
    color: var(--gold-50);
    box-shadow: 0 0 24px rgba(228,189,108,0.2);
  }
  .roulette-link .rl-icon { font-size: 18px; }
  .roulette-link .rl-text { flex: 1; }
  .roulette-link .rl-arrow { font-size: 16px; opacity: 0.6; }

  .help-box {
    margin-top: 10px;
    padding: 12px 14px;
    background: rgba(10,18,40,0.5);
    border-left: 2px solid var(--gold-400);
    font-family: var(--font-ko); font-size: 11px; font-weight: 300;
    color: var(--cream); line-height: 1.7;
    letter-spacing: 0.5px;
  }
  .help-box .step {
    display: flex; gap: 8px; margin-bottom: 4px;
  }
  .help-box .step:last-child { margin-bottom: 0; }
  .help-box .num {
    font-family: var(--font); font-size: 9px; font-weight: 600;
    color: var(--gold-300); letter-spacing: 1px;
    flex-shrink: 0; padding-top: 2px;
  }

  /* 당첨자 입력 폼 */
  .winner-input-wrap {
    display: flex; flex-direction: column; gap: 10px;
  }
  .winner-input {
    width: 100%;
    background: linear-gradient(180deg, rgba(10,18,40,0.7), rgba(10,18,40,0.5));
    border: 1px solid rgba(228,189,108,0.25);
    padding: 16px 18px;
    font-family: var(--font-ko); font-size: 18px; font-weight: 500;
    color: var(--gold-50); outline: none;
    letter-spacing: 3px; text-align: center;
    transition: all 0.3s;
  }
  .winner-input:focus {
    border-color: var(--gold-400);
    box-shadow: 0 0 0 1px rgba(228,189,108,0.2), inset 0 0 20px rgba(228,189,108,0.05);
    color: var(--white);
  }
  .winner-input::placeholder {
    color: rgba(248,241,221,0.2);
    font-size: 13px; font-weight: 300; letter-spacing: 2px;
  }

  .reveal-btn {
    width: 100%; padding: 16px;
    background: linear-gradient(135deg, rgba(228,189,108,0.1) 0%, rgba(212,168,64,0.18) 50%, rgba(228,189,108,0.1) 100%);
    border: 1.5px solid var(--gold-400);
    cursor: pointer;
    font-family: var(--font); font-size: 12px; font-weight: 700;
    letter-spacing: 8px; text-transform: uppercase;
    color: var(--gold-50);
    transition: all 0.3s ease;
    animation: glow-breathe 2.5s ease infinite;
  }
  .reveal-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(228,189,108,0.18), rgba(212,168,64,0.28), rgba(228,189,108,0.18));
    transform: translateY(-1px);
  }
  .reveal-btn:disabled {
    opacity: 0.3; cursor: not-allowed; animation: none;
  }
  .reveal-btn .icon { font-size: 14px; margin-right: 8px; }

  /* 카운터 */
  .winner-count {
    margin-top: 14px;
    padding: 12px 16px;
    background: rgba(10,18,40,0.5);
    border: 1px solid rgba(228,189,108,0.15);
    text-align: center;
    display: flex; align-items: center; justify-content: space-between;
  }
  .wc-label {
    font-family: var(--font); font-size: 9px; font-weight: 400;
    color: var(--gold-400); letter-spacing: 3px; text-transform: uppercase;
  }
  .wc-num {
    font-family: var(--font); font-size: 22px; font-weight: 700;
    color: var(--gold-50); letter-spacing: 2px; line-height: 1;
  }

  /* 누적 당첨자 목록 */
  .winners-list {
    margin-top: 12px;
    flex: 1; min-height: 100px;
    background: rgba(10,18,40,0.4);
    border: 1px solid rgba(228,189,108,0.12);
    overflow-y: auto;
    padding: 8px;
  }
  .winners-list::-webkit-scrollbar { width: 4px; }
  .winners-list::-webkit-scrollbar-thumb { background: rgba(228,189,108,0.3); }

  .empty-list {
    padding: 20px; text-align: center;
    font-family: var(--font); font-size: 9px; font-weight: 400;
    color: rgba(228,189,108,0.3); letter-spacing: 3px; text-transform: uppercase;
  }
  .winner-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px;
    border-bottom: 1px solid rgba(228,189,108,0.08);
    animation: fadeUp 0.4s ease both;
  }
  .winner-item:last-child { border-bottom: none; }
  .wi-num {
    font-family: var(--font); font-size: 11px; font-weight: 700;
    color: var(--gold-300); letter-spacing: 1px;
    width: 26px;
  }
  .wi-name {
    font-family: var(--font-ko); font-size: 14px; font-weight: 500;
    color: var(--cream); letter-spacing: 2px;
    flex: 1;
  }
  .wi-time {
    font-family: var(--font); font-size: 8px; font-weight: 400;
    color: rgba(228,189,108,0.4); letter-spacing: 1px;
  }
  .wi-remove {
    background: none; border: none; cursor: pointer;
    font-size: 14px; color: rgba(255,140,140,0.4);
    padding: 2px 6px;
    transition: color 0.2s;
  }
  .wi-remove:hover { color: rgba(255,100,100,0.9); }

  .reset-btn {
    width: 100%; padding: 9px; margin-top: 10px;
    background: none; border: 1px solid rgba(212,168,64,0.1);
    cursor: pointer;
    font-family: var(--font); font-size: 8px; font-weight: 400;
    letter-spacing: 4px; text-transform: uppercase;
    color: rgba(212,168,64,0.3);
    transition: all 0.2s; flex-shrink: 0;
  }
  .reset-btn:hover { color: rgba(255,140,140,0.7); border-color: rgba(255,140,140,0.25); }

  .copy-btn {
    width: 100%; padding: 10px; margin-top: 6px;
    background: rgba(228,189,108,0.04);
    border: 1px solid rgba(228,189,108,0.2);
    cursor: pointer;
    font-family: var(--font); font-size: 9px; font-weight: 500;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold-200);
    transition: all 0.2s; flex-shrink: 0;
  }
  .copy-btn:hover { background: rgba(228,189,108,0.1); color: var(--gold-50); }

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
  .standby .hint-ko { font-family: var(--font-ko); font-size: 0.8vw; font-weight: 300; letter-spacing: 3px; color: var(--gold-300); opacity: 0.6; animation: fadeUp 0.8s 0.6s ease both; }

  /* 드럼롤 화면 (발표 전 긴장감) */
  .drumroll {
    text-align: center; animation: fadeIn 0.4s ease both;
    position: relative;
  }
  .drumroll-label {
    font-family: var(--font); font-size: 1vw; font-weight: 500;
    letter-spacing: 14px; text-transform: uppercase;
    color: var(--gold-300); margin-bottom: 20px;
    animation: text-glow 1.5s ease infinite;
  }
  .drumroll-label-ko {
    font-family: var(--font-ko); font-size: 0.9vw; font-weight: 200;
    letter-spacing: 10px; color: rgba(228,189,108,0.6);
    margin-bottom: 50px;
  }
  .drumroll-text {
    font-family: var(--font-ko); font-size: 5vw; font-weight: 500;
    color: rgba(255,255,255,0.25); letter-spacing: 14px;
    animation: drum-roll 0.1s linear infinite;
    text-shadow: 0 0 30px rgba(228,189,108,0.15);
  }
  .pulse-ring {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 320px; height: 320px;
    border: 1px solid rgba(228,189,108,0.4);
    border-radius: 50%;
    animation: pulse-ring 2s ease-out infinite;
    pointer-events: none;
  }
  @keyframes pulse-ring {
    0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
  }
  .pulse-ring:nth-child(2) { animation-delay: 0.7s; }
  .pulse-ring:nth-child(3) { animation-delay: 1.4s; }

  /* 당첨자 발표 (메인 이벤트!) */
  .winner-show {
    text-align: center; width: 100%;
    animation: winner-bg-pulse 3s ease-in-out infinite;
    position: relative;
  }

  .ws-top-orn {
    display: flex; align-items: center; justify-content: center;
    gap: 20px; margin-bottom: 24px;
    animation: fadeDown 0.6s 0.2s ease both;
  }
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
    margin-bottom: 28px;
    animation: rise 0.5s 0.3s ease both;
  }
  .ws-rank-badge .num { font-weight: 700; color: var(--white); margin-right: 6px; }

  .ws-label {
    font-family: var(--font); font-size: 1vw; font-weight: 600;
    letter-spacing: 16px; text-transform: uppercase;
    color: var(--gold-300); margin-bottom: 12px;
    animation: rise 0.5s 0.4s ease both;
    text-shadow: 0 0 30px rgba(228,189,108,0.3);
  }
  .ws-label-ko {
    font-family: var(--font-ko); font-size: 1vw; font-weight: 200;
    letter-spacing: 12px; color: rgba(228,189,108,0.65);
    margin-bottom: 50px;
    animation: rise 0.5s 0.5s ease both;
  }

  .ws-name-frame {
    position: relative;
    padding: 50px 40px;
    margin-bottom: 50px;
  }
  .ws-name-frame::before, .ws-name-frame::after {
    content: ''; position: absolute; left: 50%; transform: translateX(-50%);
    width: 280px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-300), transparent);
  }
  .ws-name-frame::before { top: 0; }
  .ws-name-frame::after  { bottom: 0; }

  .ws-name {
    font-family: var(--font-ko); font-size: 8vw; font-weight: 700;
    letter-spacing: 14px; line-height: 1;
    background: linear-gradient(180deg, #ffffff 0%, #faf1d8 50%, #f0d080 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 40px rgba(228,189,108,0.5)) drop-shadow(0 0 80px rgba(228,189,108,0.3));
    animation: name-reveal 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }

  .ws-actions {
    display: flex; gap: 16px; justify-content: center;
    animation: rise 0.6s 1s ease both;
  }
  .ws-btn {
    padding: 16px 44px;
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

export default function App() {
  const [inputName, setInputName] = useState("");
  const [winners, setWinners] = useState([]);
  const [phase, setPhase] = useState("standby"); // standby | drumroll | winner
  const [currentWinner, setCurrentWinner] = useState(null);
  const [drumName, setDrumName] = useState("");
  const inputRef = useRef(null);

  const handleReveal = async () => {
    const name = inputName.trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }

    // 중복 체크
    if (winners.some(w => w.name === name)) {
      if (!window.confirm(`"${name}" 님은 이미 당첨되었습니다.\n그래도 발표하시겠습니까?`)) {
        return;
      }
    }

    // 드럼롤 시작
    setPhase("drumroll");
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ가나다라마바사아자차카타파하김이박최정";
    const drumInterval = setInterval(() => {
      // 임의의 글자 4~5개로 드럼롤 효과
      const len = 3 + Math.floor(Math.random() * 2);
      let s = "";
      for (let i = 0; i < len; i++) {
        s += allChars[Math.floor(Math.random() * allChars.length)];
      }
      setDrumName(s);
    }, 60);

    await new Promise(r => setTimeout(r, 2000));
    clearInterval(drumInterval);
    setDrumName("");

    // 당첨자 등록
    const newWinner = {
      name,
      rank: winners.length + 1,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    setCurrentWinner(newWinner);
    setWinners(prev => [...prev, newWinner]);
    setInputName("");
    setPhase("winner");
  };

  const handleNext = () => {
    setPhase("standby");
    setCurrentWinner(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleRemove = (index) => {
    if (!window.confirm("이 당첨자를 목록에서 제외할까요?")) return;
    setWinners(prev => prev.filter((_, i) => i !== index).map((w, i) => ({...w, rank: i + 1})));
  };

  const handleReset = () => {
    if (!window.confirm("당첨자 목록을 모두 초기화할까요?")) return;
    setWinners([]); setCurrentWinner(null); setPhase("standby");
  };

  const handleCopyList = () => {
    if (winners.length === 0) return;
    const text = winners.map(w => `${w.rank}. ${w.name}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert("당첨자 목록이 클립보드에 복사되었습니다.");
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleReveal();
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

        <div className="sec-label">Step 1  ·  룰렛 게임</div>
        <a
          href="https://lazygyu.github.io/roulette/"
          target="_blank"
          rel="noopener noreferrer"
          className="roulette-link"
        >
          <span className="rl-icon">◈</span>
          <span className="rl-text">마블 룰렛 열기</span>
          <span className="rl-arrow">↗</span>
        </a>

        <div className="help-box">
          <div className="step"><span className="num">01</span><span>새 창에서 룰렛이 열려요</span></div>
          <div className="step"><span className="num">02</span><span>참가자 명단 입력 후 Start</span></div>
          <div className="step"><span className="num">03</span><span>당첨자가 결정되면 ↓ 입력</span></div>
        </div>

        <div className="sec-label">Step 2  ·  당첨자 발표</div>
        <div className="winner-input-wrap">
          <input
            ref={inputRef}
            type="text"
            className="winner-input"
            placeholder="당첨자 이름 입력"
            value={inputName}
            onChange={e => setInputName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={phase === "drumroll"}
          />
          <button
            className="reveal-btn"
            onClick={handleReveal}
            disabled={phase === "drumroll" || !inputName.trim()}
          >
            {phase === "drumroll"
              ? <><span className="icon" style={{display:'inline-block', animation:'spin 0.8s linear infinite'}}>◈</span>발표 중</>
              : <><span className="icon">✦</span>Reveal Winner</>
            }
          </button>
        </div>

        <div className="winner-count">
          <span className="wc-label">Total Winners</span>
          <span className="wc-num">{winners.length}</span>
        </div>

        <div className="sec-label">당첨자 목록</div>
        <div className="winners-list">
          {winners.length === 0 ? (
            <div className="empty-list">No Winners Yet</div>
          ) : (
            [...winners].reverse().map((w, idx) => {
              const realIdx = winners.length - 1 - idx;
              return (
                <div key={`${w.name}-${w.rank}`} className="winner-item">
                  <div className="wi-num">{String(w.rank).padStart(2,'0')}</div>
                  <div className="wi-name">{w.name}</div>
                  <div className="wi-time">{w.time}</div>
                  <button className="wi-remove" onClick={() => handleRemove(realIdx)} title="삭제">×</button>
                </div>
              );
            })
          )}
        </div>

        {winners.length > 0 && (
          <>
            <button className="copy-btn" onClick={handleCopyList}>당첨자 목록 복사</button>
            <button className="reset-btn" onClick={handleReset}>Reset All</button>
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
            <div className="eyebrow">Samsung OCIO Seminar</div>
            <div className="title">Lucky Draw</div>
            <div className="divider-ornament">
              <div className="line"/>
              <div className="star">◆ ◆ ◆</div>
              <div className="line"/>
            </div>
            <div className="subtitle">경 품 추 첨</div>

            <div className="info-cards">
              <div className="info-card">
                <div className="lbl">Date</div>
                <div className="val">2026. 04. 29</div>
              </div>
              <div className="info-divider"/>
              <div className="info-card">
                <div className="lbl">Venue</div>
                <div className="val">The Plaza Seoul</div>
              </div>
              <div className="info-divider"/>
              <div className="info-card">
                <div className="lbl">Winners</div>
                <div className="val">{winners.length} 명</div>
              </div>
            </div>

            <div className="hint-ko">
              {winners.length === 0
                ? "룰렛에서 당첨자를 뽑은 후 좌측에 입력해 주세요"
                : `${winners.length}명 발표 완료  ·  다음 당첨자를 입력해 주세요`}
            </div>
          </div>
        )}

        {phase === "drumroll" && (
          <div className="drumroll">
            <div className="pulse-ring"/>
            <div className="pulse-ring"/>
            <div className="pulse-ring"/>
            <div className="drumroll-label">Now Announcing</div>
            <div className="drumroll-label-ko">두 구 두 구 두 구</div>
            <div className="drumroll-text">{drumName || "···"}</div>
          </div>
        )}

        {phase === "winner" && currentWinner && (
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
                <span className="num">{currentWinner.rank}</span>
                Winner
              </div>

              <div className="ws-label">Congratulations</div>
              <div className="ws-label-ko">당 첨 을   축 하 드 립 니 다</div>

              <div className="ws-name-frame">
                <div className="ws-name">{currentWinner.name}</div>
              </div>

              <div className="ws-actions">
                <button className="ws-btn primary" onClick={handleNext}>Next Winner</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
