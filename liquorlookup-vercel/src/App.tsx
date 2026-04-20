import { useState, useMemo, useRef, useEffect, useCallback } from "react";

const HERO_BG = "https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=1600&q=80";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Frank+Ruhl+Libre:wght@400;700;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:hsl(38,30%,96%);--fg:hsl(30,15%,12%);--card:hsl(40,38%,99%);
  --muted:hsl(30,8%,42%);--border:hsl(35,18%,87%);--sec:hsl(38,25%,92%);
  --accent:hsl(150,32%,36%);--wine:hsl(350,42%,36%);--deal:hsl(150,38%,30%);
  --gold:hsl(42,85%,52%);
  --sh-card:0 1px 3px hsl(30 15% 14%/5%),0 6px 20px hsl(30 15% 14%/6%);
  --sh-hover:0 8px 32px hsl(30 15% 14%/14%);
  --sh-hero:0 20px 60px -10px hsl(30 15% 14%/22%);
}
html{scroll-behavior:smooth}
body{font-family:'Heebo',system-ui,sans-serif;background:var(--bg);color:var(--fg);direction:rtl;min-height:100vh}
h1,h2,h3{font-family:'Frank Ruhl Libre',serif}
.wrap{max-width:1120px;margin:0 auto;padding:0 1.5rem}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse2{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)}50%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

.fade-up{opacity:0;transform:translateY(28px);transition:opacity .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1)}
.fade-up.visible{opacity:1;transform:translateY(0)}

.shimmer{background:linear-gradient(90deg,var(--sec) 25%,hsl(38,30%,96%) 50%,var(--sec) 75%);background-size:400px 100%;animation:shimmer 1.4s infinite}

/* NAV */
.nav{position:sticky;top:0;z-index:50;background:rgba(251,249,246,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);transition:box-shadow .2s}
.nav.scrolled{box-shadow:var(--sh-card)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:58px}
.logo-wrap{display:inline-flex;align-items:center;gap:7px;direction:ltr;unicode-bidi:bidi-override;text-decoration:none;cursor:pointer}
.logo-dot{width:9px;height:9px;border-radius:50%;background:var(--wine);flex-shrink:0;transition:transform .3s}
.logo-wrap:hover .logo-dot{transform:scale(1.4)}
.logo-text{font-family:'Frank Ruhl Libre',serif;font-size:1.4rem;font-weight:900;letter-spacing:-.02em;white-space:nowrap;display:inline-block;font-size:0}
.logo-text .l1{font-size:1.4rem;color:var(--fg)}
.logo-text .l2{font-size:1.4rem;color:var(--wine)}
.nav-links{display:flex;gap:1.25rem;align-items:center}
.nav-links a{font-size:.8rem;color:var(--muted);text-decoration:none;transition:color .15s}
.nav-links a:hover{color:var(--fg)}
.nav-cta{background:var(--fg)!important;color:hsl(40,38%,99%)!important;border-radius:8px;padding:7px 15px;font-weight:700!important;transition:background .15s,transform .1s!important}
.nav-cta:hover{background:hsl(30,15%,20%)!important;transform:scale(1.03)!important}

/* HERO */
.hero{position:relative;overflow:hidden;border-bottom:1px solid var(--border);min-height:520px;display:flex;align-items:center}
.hero-bg-img{position:absolute;inset:0;background-size:cover;background-position:center 40%;background-repeat:no-repeat;transition:transform 8s ease-out}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(251,249,246,.94) 0%,rgba(251,249,246,.82) 55%,rgba(251,249,246,.35) 100%)}
.hero-content{position:relative;z-index:2;padding:4.5rem 0 4rem;width:100%}
.hero-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);background:rgba(255,255,255,.75);backdrop-filter:blur(8px);border-radius:999px;padding:5px 14px;font-size:.72rem;color:var(--muted);margin-bottom:1.25rem;box-shadow:var(--sh-card);animation:fadeIn .6s ease both}
.hero-pulse{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:pulse2 2s infinite;flex-shrink:0}
.hero h1{font-size:clamp(2.4rem,5.5vw,3.9rem);font-weight:900;line-height:1.06;letter-spacing:-.03em;margin-bottom:1.1rem;max-width:640px;animation:fadeUp .7s .1s both}
.hero h1 em{font-style:normal;color:var(--wine)}
.hero-sub{font-size:1rem;color:var(--muted);max-width:500px;line-height:1.65;margin-bottom:2.25rem;font-weight:300;animation:fadeUp .7s .2s both}

/* SEARCH */
.search-outer{position:relative;max-width:600px;animation:fadeUp .7s .3s both}
.search-box{display:flex;align-items:center;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-radius:1.1rem;box-shadow:var(--sh-hero);border:1.5px solid var(--border);padding:6px 6px 6px 14px;gap:8px;transition:border-color .2s,box-shadow .2s,transform .2s}
.search-box:focus-within{border-color:hsl(150,28%,55%);box-shadow:var(--sh-hero),0 0 0 3px hsl(150,28%,55%,.12);transform:translateY(-1px)}
.search-icon{color:var(--muted);font-size:17px;flex-shrink:0}
.search-box input{flex:1;border:none;background:transparent;font-size:1rem;font-family:'Heebo',sans-serif;padding:9px 4px;outline:none;color:var(--fg);direction:rtl}
.search-box input::placeholder{color:var(--muted)}
.search-btn{background:var(--fg);color:hsl(40,38%,99%);border:none;border-radius:.75rem;padding:11px 22px;font-size:.92rem;font-weight:700;cursor:pointer;white-space:nowrap;font-family:'Heebo',sans-serif;transition:background .15s,transform .1s}
.search-btn:hover{background:hsl(30,15%,20%)}
.search-btn:active{transform:scale(.97)}

/* AUTOCOMPLETE */
.ac{position:absolute;top:calc(100% + 8px);right:0;left:0;background:var(--card);border:1px solid var(--border);border-radius:1rem;box-shadow:var(--sh-hero);z-index:200;overflow:hidden;max-height:380px;overflow-y:auto;animation:fadeUp .15s ease both}
.ac-sec{padding:7px 16px 4px;font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);background:var(--sec)}
.ac-item{padding:10px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;transition:background .1s;border-bottom:1px solid hsl(35,18%,93%)}
.ac-item:last-child{border-bottom:none}
.ac-item:hover,.ac-item.hi{background:var(--sec)}
.ac-left{display:flex;align-items:center;gap:10px}
.ac-img{width:38px;height:38px;border-radius:7px;object-fit:cover;background:var(--sec);flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:1.4rem}
.ac-name{font-size:.88rem;font-weight:600;line-height:1.2}
.ac-vol{font-size:.7rem;color:var(--muted)}
.ac-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.ac-price{font-size:.88rem;font-weight:800;color:var(--deal)}
.ac-cat{font-size:.65rem;color:var(--muted);border:1px solid var(--border);border-radius:999px;padding:2px 7px;white-space:nowrap}

/* QUICK TAGS */
.quick{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin-top:1.1rem;animation:fadeUp .7s .4s both}
.qlabel{font-size:.76rem;color:var(--muted)}
.qtag{border:1px solid rgba(30,20,10,.18);background:rgba(255,255,255,.6);backdrop-filter:blur(4px);border-radius:999px;padding:5px 13px;font-size:.74rem;cursor:pointer;font-family:'Heebo',sans-serif;color:var(--fg);transition:all .2s}
.qtag:hover{border-color:var(--fg);background:rgba(255,255,255,.9);transform:translateY(-1px)}

/* STATS */
.stats-row{display:flex;gap:2rem;margin-top:2.5rem;padding-top:2rem;border-top:1px solid rgba(30,20,10,.12);flex-wrap:wrap;animation:fadeUp .7s .5s both}
.stat-k{font-family:'Frank Ruhl Libre',serif;font-size:1.75rem;font-weight:900;line-height:1}
.stat-v{font-size:.72rem;color:var(--muted);margin-top:2px}

/* STORES STRIP */
.stores-strip{border-bottom:1px solid var(--border);background:var(--card);padding:.8rem 0;overflow:hidden}
.stores-inner{display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap;justify-content:center}
.sbadge{font-size:.7rem;color:var(--muted);font-weight:500;white-space:nowrap;display:flex;align-items:center;gap:4px;transition:color .15s}
.sbadge:hover{color:var(--fg)}
.sbadge::before{content:'✓';color:var(--accent);font-weight:800;font-size:.72rem}

/* SPONSORED BANNER */
.sponsored-banner{background:linear-gradient(130deg,hsl(350,42%,32%) 0%,hsl(20,55%,24%) 100%);border-radius:1.25rem;padding:1.6rem 2rem;margin:2rem 0;position:relative;overflow:hidden;cursor:pointer;transition:transform .2s,box-shadow .2s}
.sponsored-banner:hover{transform:translateY(-2px);box-shadow:var(--sh-hover)}
.sponsored-banner::before{content:'';position:absolute;top:-40px;left:-40px;width:200px;height:200px;background:rgba(255,255,255,.05);border-radius:50%}
.sponsored-banner::after{content:'';position:absolute;bottom:-60px;right:-20px;width:250px;height:250px;background:rgba(255,255,255,.04);border-radius:50%}
.sb-inner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;position:relative;z-index:1}
.sb-left h3{font-size:1.1rem;font-weight:900;color:white;margin-bottom:3px;font-family:'Frank Ruhl Libre',serif}
.sb-left p{font-size:.78rem;color:rgba(255,255,255,.75)}
.sb-pills{display:flex;gap:7px;flex-wrap:wrap}
.sbpill{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);border-radius:7px;padding:5px 13px;font-size:.72rem;font-weight:700;color:white}
.sb-btn{background:white;color:hsl(350,42%,32%);border:none;border-radius:9px;padding:10px 20px;font-size:.82rem;font-weight:800;cursor:pointer;font-family:'Heebo',sans-serif;white-space:nowrap;flex-shrink:0;transition:transform .15s}
.sb-btn:hover{transform:scale(1.04)}

/* FEATURED */
.featured{padding:2.5rem 0 2rem;border-bottom:1px solid var(--border)}
.section-eyebrow{font-size:.66rem;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);margin-bottom:.4rem}
.section-title{font-size:clamp(1.3rem,2.5vw,1.75rem);font-weight:900;line-height:1.1}
.section-sub{font-size:.84rem;color:var(--muted);margin-top:.35rem}
.featured-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:.9rem;margin-top:1.4rem}

/* FEATURED CARD */
.fcard{background:var(--card);border:1px solid var(--border);border-radius:1rem;overflow:hidden;cursor:pointer;transition:box-shadow .25s,transform .25s}
.fcard:hover{box-shadow:var(--sh-hover);transform:translateY(-4px)}
.fcard-img{height:150px;position:relative;overflow:hidden;background:var(--sec)}
.fcard-img-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;transition:transform .4s cubic-bezier(.22,1,.36,1)}
.fcard:hover .fcard-img-inner{transform:scale(1.07)}
.fcard-badge{position:absolute;top:8px;right:8px;font-size:.63rem;font-weight:800;border-radius:999px;padding:3px 9px;z-index:2}
.fcard-sponsored-tag{position:absolute;top:8px;left:8px;font-size:.6rem;font-weight:700;background:rgba(0,0,0,.55);color:white;border-radius:999px;padding:2px 8px;z-index:2;backdrop-filter:blur(4px)}
.bd{background:hsl(150,55%,88%);color:hsl(150,55%,20%)}
.bh{background:hsl(15,90%,90%);color:hsl(15,80%,28%)}
.bp{background:hsl(38,90%,88%);color:hsl(38,70%,25%)}
.bn{background:hsl(210,80%,90%);color:hsl(210,70%,25%)}
.bs{background:hsl(42,85%,88%);color:hsl(42,65%,22%)}
.fcard-body{padding:.85rem 1rem .95rem}
.fcard-cat{font-size:.62rem;color:var(--muted);margin-bottom:2px}
.fcard-name{font-size:.86rem;font-weight:700;font-family:'Frank Ruhl Libre',serif;line-height:1.2;margin-bottom:2px}
.fcard-brand{font-size:.7rem;color:var(--muted);margin-bottom:7px}
.fcard-vol{font-size:.68rem;color:var(--muted);background:var(--sec);border-radius:5px;padding:2px 7px;display:inline-block;margin-bottom:6px}
.fcard-price-row{display:flex;align-items:baseline;gap:6px;margin-bottom:4px}
.fcard-price{font-size:1.2rem;font-weight:900;font-family:'Frank Ruhl Libre',serif;color:var(--deal)}
.fcard-was{font-size:.72rem;color:var(--muted);text-decoration:line-through}
.fcard-stores-count{font-size:.65rem;color:var(--muted)}
.fcard-btn{width:100%;background:var(--fg);color:hsl(40,38%,99%);border:none;border-radius:.5rem;padding:7px;font-size:.75rem;font-weight:700;cursor:pointer;font-family:'Heebo',sans-serif;margin-top:7px;transition:background .15s,transform .1s}
.fcard-btn:hover{background:hsl(30,15%,22%)}
.fcard-btn:active{transform:scale(.97)}

/* CATALOG */
.catalog{padding:2rem 0 3rem}
.results-header{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:1.4rem}
.results-info{font-size:.78rem;color:var(--muted);margin-top:3px}
.cat-filters{display:flex;gap:6px;flex-wrap:wrap}
.cf{border:1px solid var(--border);background:var(--bg);border-radius:999px;padding:5px 13px;font-size:.74rem;cursor:pointer;font-family:'Heebo',sans-serif;color:var(--fg);transition:all .2s}
.cf:hover{background:var(--sec);transform:translateY(-1px)}
.cf.on{background:var(--fg);color:hsl(40,38%,99%);border-color:var(--fg)}
.results-grid{display:grid;gap:.9rem;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}

/* PRODUCT CARD */
.pcard{background:var(--card);border:1px solid var(--border);border-radius:1rem;overflow:hidden;transition:box-shadow .25s,transform .25s;display:flex;flex-direction:column;cursor:pointer}
.pcard:hover{box-shadow:var(--sh-hover);transform:translateY(-3px)}
.pcard-img{height:130px;position:relative;overflow:hidden;background:var(--sec);flex-shrink:0}
.pcard-img-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;transition:transform .4s cubic-bezier(.22,1,.36,1)}
.pcard:hover .pcard-img-inner{transform:scale(1.07)}
.pcard-sponsored{position:absolute;top:6px;left:6px;font-size:.59rem;background:rgba(0,0,0,.55);color:white;border-radius:999px;padding:2px 7px;font-weight:800;z-index:2;backdrop-filter:blur(4px)}
.pcard-body{padding:.85rem 1rem;flex:1;display:flex;flex-direction:column;gap:.4rem}
.pcard-top{display:flex;justify-content:space-between;align-items:flex-start;gap:4px}
.pcard-cat{font-size:.62rem;border:1px solid var(--border);border-radius:999px;padding:2px 8px;color:var(--muted);white-space:nowrap}
.pcard-premium{font-size:.62rem;background:hsl(38,90%,92%);color:hsl(30,60%,28%);border-radius:999px;padding:2px 8px}
.pcard-name{font-size:.9rem;font-weight:700;font-family:'Frank Ruhl Libre',serif;line-height:1.2}
.pcard-brand{font-size:.72rem;color:var(--muted)}
.pcard-pills{display:flex;gap:5px;flex-wrap:wrap}
.pill{font-size:.63rem;background:var(--sec);border-radius:5px;padding:2px 7px;color:var(--muted)}
.pcard-bottom{margin-top:auto;padding-top:.4rem}
.pcard-store-label{font-size:.66rem;color:var(--muted)}
.pcard-price-row{display:flex;align-items:baseline;gap:7px}
.pcard-price{font-size:1.35rem;font-weight:900;font-family:'Frank Ruhl Libre',serif;color:var(--deal)}
.pcard-was{font-size:.75rem;color:var(--muted);text-decoration:line-through}
.pcard-updated{font-size:.6rem;color:var(--muted);margin-top:2px}
.pcard-actions{display:flex;gap:5px;margin-top:.6rem}
.pcard-btn-main{flex:1;background:var(--fg);color:hsl(40,38%,99%);border:none;border-radius:.5rem;padding:8px;font-size:.74rem;font-weight:700;cursor:pointer;font-family:'Heebo',sans-serif;transition:background .15s,transform .1s}
.pcard-btn-main:hover{background:hsl(30,15%,22%)}
.pcard-btn-main:active{transform:scale(.97)}
.pcard-btn-sec{border:1px solid var(--border);background:transparent;border-radius:.5rem;padding:8px 10px;font-size:.74rem;cursor:pointer;font-family:'Heebo',sans-serif;color:var(--muted);transition:background .15s,transform .1s}
.pcard-btn-sec:hover{background:var(--sec);transform:scale(1.03)}
.load-more{display:block;margin:1.75rem auto 0;border:1px solid var(--border);background:var(--card);border-radius:.75rem;padding:11px 30px;font-size:.85rem;font-weight:600;cursor:pointer;font-family:'Heebo',sans-serif;color:var(--fg);transition:all .2s}
.load-more:hover{background:var(--sec);box-shadow:var(--sh-card);transform:translateY(-2px)}

/* EMPTY */
.empty{border:1px dashed var(--border);border-radius:1.2rem;padding:3.5rem;text-align:center}
.empty-icon{font-size:2.5rem;margin-bottom:.6rem}
.empty-h{font-size:1.1rem;font-weight:700;font-family:'Frank Ruhl Libre',serif}
.empty-p{font-size:.82rem;color:var(--muted);margin-top:4px}

/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:400;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(5px);animation:fadeIn .2s ease}
.modal{background:var(--card);border-radius:1.25rem;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.35);animation:fadeUp .25s ease}
.modal-header{padding:1.1rem 1.4rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--card);z-index:2}
.modal-title{font-size:1rem;font-weight:700;font-family:'Frank Ruhl Libre',serif;line-height:1.3}
.modal-close{background:var(--sec);border:none;width:28px;height:28px;border-radius:50%;font-size:1.1rem;cursor:pointer;color:var(--muted);display:flex;align-items:center;justify-content:center;transition:background .15s,transform .15s}
.modal-close:hover{background:var(--border);transform:scale(1.1)}
.modal-body{padding:1.25rem 1.4rem}
.modal-img{height:200px;border-radius:.85rem;overflow:hidden;background:var(--sec);margin-bottom:1.1rem;display:flex;align-items:center;justify-content:center}
.modal-meta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1rem}
.modal-price-hero{font-size:2.4rem;font-weight:900;font-family:'Frank Ruhl Libre',serif;color:var(--deal);line-height:1}
.modal-price-sub{font-size:.75rem;color:var(--muted);margin-top:4px}
.modal-updated{font-size:.65rem;color:hsl(150,32%,46%);margin-top:3px;display:flex;align-items:center;gap:4px}
.modal-updated::before{content:'●';font-size:.5rem}
.modal-stores{margin-top:1rem;display:flex;flex-direction:column;gap:5px}
.msr{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border:1px solid var(--border);border-radius:.65rem;background:var(--bg);text-decoration:none;color:inherit;transition:background .15s,transform .15s,border-color .15s}
.msr:hover{background:var(--sec);transform:translateX(-2px);border-color:var(--border)}
.msr.best{border-color:hsl(150,28%,60%);background:hsl(150,28%,97%)}
.msr-left{display:flex;flex-direction:column;gap:2px}
.msr-name{font-size:.85rem;font-weight:600}
.msr-vol{font-size:.7rem;color:var(--muted)}
.msr-right{display:flex;align-items:center;gap:8px;flex-direction:column;align-items:flex-end}
.msr-badge{font-size:.6rem;background:hsl(150,55%,88%);color:hsl(150,55%,20%);border-radius:999px;padding:2px 7px;font-weight:800}
.msr-price{font-size:.95rem;font-weight:800;color:var(--deal)}
.msr-per{font-size:.62rem;color:var(--muted)}
.modal-buy-btn{width:100%;background:var(--fg);color:hsl(40,38%,99%);border:none;border-radius:.75rem;padding:13px;font-size:.92rem;font-weight:700;cursor:pointer;font-family:'Heebo',sans-serif;margin-top:.9rem;transition:background .15s,transform .1s}
.modal-buy-btn:hover{background:hsl(30,15%,22%)}
.modal-buy-btn:active{transform:scale(.98)}
.aff-note{font-size:.62rem;color:var(--muted);text-align:center;margin-top:.5rem}

/* AGE POPUP */
.age-popup-bg{position:fixed;inset:0;z-index:600;display:flex;align-items:center;justify-content:center;padding:1rem;background-size:cover;background-position:center;animation:fadeIn .3s ease}
.age-popup{background:rgba(251,249,246,.97);backdrop-filter:blur(2px);border-radius:1.25rem;max-width:380px;width:100%;padding:2.75rem 2rem 2rem;text-align:center;box-shadow:0 32px 80px rgba(0,0,0,.35);border:1px solid var(--border);animation:fadeUp .4s .1s both}
.age-popup h2{font-size:1.15rem;font-weight:700;margin-bottom:.5rem;font-family:'Frank Ruhl Libre',serif}
.age-popup p{font-size:.8rem;color:var(--muted);line-height:1.6;margin-bottom:1.75rem}
.age-btns{display:flex;gap:.65rem;margin-bottom:1rem}
.age-yes{flex:1;background:var(--fg);color:hsl(40,38%,99%);border:none;border-radius:.75rem;padding:12px;font-size:.9rem;font-weight:800;cursor:pointer;font-family:'Heebo',sans-serif;transition:background .15s,transform .1s}
.age-yes:hover{background:hsl(30,15%,22%);transform:scale(1.02)}
.age-no{flex:1;background:none;border:1px solid var(--border);border-radius:.75rem;padding:12px;font-size:.9rem;font-weight:600;cursor:pointer;font-family:'Heebo',sans-serif;color:var(--muted);transition:background .15s}
.age-no:hover{background:var(--sec)}
.age-legal{font-size:.62rem;color:var(--muted);line-height:1.55}

/* FOOTER */
.footer{border-top:1px solid var(--border);padding:1.75rem 0;margin-top:1rem}
.footer-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
.footer-links{display:flex;gap:1.25rem;flex-wrap:wrap}
.footer-links a{font-size:.74rem;color:var(--muted);text-decoration:none;transition:color .15s}
.footer-links a:hover{color:var(--fg)}
.footer-copy{font-size:.7rem;color:var(--muted)}

@media(max-width:600px){
  .hero h1{font-size:2.1rem}
  .stats-row{gap:1.25rem}
  .featured-grid{grid-template-columns:repeat(2,1fr)}
  .results-grid{grid-template-columns:1fr}
  .nav-links{gap:.75rem}
  .nav-cta{display:none}
}
`;

/* ── DATA ── */
const STORES = ["פאנקו","המייבא","דרך היין","יין דירקט","שר המשקאות","בנא משקאות","אליאסי","התורכי","טל דרינקס","אלקוהום","לגימה","וין האוס","פרטוש משקאות","וין & סיגר","דרינק סנטר","וולט"];

const CAT_BG = {
  whisky:"linear-gradient(135deg,hsl(38,60%,92%),hsl(30,50%,88%))",
  gin:"linear-gradient(135deg,hsl(150,30%,90%),hsl(160,25%,86%))",
  vodka:"linear-gradient(135deg,hsl(210,30%,92%),hsl(220,25%,88%))",
  wine:"linear-gradient(135deg,hsl(350,35%,92%),hsl(340,30%,88%))",
  beer:"linear-gradient(135deg,hsl(42,55%,90%),hsl(38,50%,86%))",
  spirits:"linear-gradient(135deg,hsl(270,20%,92%),hsl(260,18%,88%))",
};
const CAT_EMOJI = {whisky:"🥃",gin:"🍸",vodka:"🧊",wine:"🍷",beer:"🍺",spirits:"🥂"};

/* Direct CDN image URLs — verified working */
const PROD_IMG = {
  mac12:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/macallan-double-cask-12.png?v=1677000000",
  glen12:"https://cdn.thewhiskyexchange.com/product_images/glenfiddich_12.jpg",
  jwblack:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/johnnie-walker-black.png",
  jwblue:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/johnnie-walker-blue.png",
  jameson:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/jameson-1l.png",
  hendricks:"https://www.hendricksgin.com/wp-content/uploads/hendricks-gin-bottle-700ml.png",
  hendricks1l:"https://www.hendricksgin.com/wp-content/uploads/hendricks-gin-bottle-700ml.png",
  bombay:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/bombay-sapphire.png",
  greygoose:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/grey-goose-vodka.png",
  absolut:"https://www.absolut.com/globalassets/products/absolut-original/packshot/absolut-original-packshot.png",
  belvedere:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/belvedere-vodka.png",
  patron:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/patron-silver.png",
  campari:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/campari-aperitivo.png",
  aperol:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/aperol-700ml.png",
  jager:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/jagermeister-1l.png",
  baileys:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/baileys-original.png",
  monkey:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/monkey-shoulder.png",
  chivas12:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/chivas-regal-12.png",
  nikka:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/nikka-from-the-barrel.png",
  toki:"https://cdn.shopify.com/s/files/1/0626/7335/7765/files/suntory-toki.png",
};

function ProductImg({id, cat, height=130, emoji=true}) {
  const src = PROD_IMG[id];
  const [err, setErr] = useState(false);
  const bg = CAT_BG[cat] || CAT_BG.spirits;
  const inner = (!src || err)
    ? <span style={{fontSize:height>150?"5rem":"3.5rem"}}>{CAT_EMOJI[cat]||"🍶"}</span>
    : <img src={src} onError={()=>setErr(true)} style={{maxHeight:"88%",maxWidth:"78%",objectFit:"contain"}} alt=""/>;
  return (
    <div style={{width:"100%",height,background:bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <div className="pcard-img-inner">{inner}</div>
    </div>
  );
}

const perMl = (price, vol) => vol>0 ? `₪${(price/vol*100).toFixed(1)} / 100מ״ל` : null;
const bestOf = p => Math.min(...p.stores.map(s=>s.p));
const worstOf = p => Math.max(...p.stores.map(s=>s.p));
const bestStore = p => p.stores.reduce((a,b)=>a.p<b.p?a:b);
const fmtVol = v => v<1000?`${v}מ״ל`:v===1000?"1 ליטר":`${(v/1000).toFixed(1)}ל׳`;
const now = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
};

/* Hebrew search aliases */
const HE_ALIASES = {
  mac12:["מקאלן","מקאלן 12","macallan"],
  glen12:["גלנפידיך","גלנפידיש","glenfiddich"],
  jwblack:["ג'וני ווקר","ג'וני ווקר בלאק","ג'וני","johnnie walker"],
  jwblue:["ג'וני ווקר בלו","ג'וני בלו","johnnie walker blue"],
  jameson:["ג'יימסון","ג'ימסון","ויסקי אירי"],
  monkey:["מאנקי שולדר","מאנקי"],
  laphroaig:["לאפרויג","לאפרוויג"],
  talisker:["טליסקר"],
  chivas12:["שיבאס","שיבס","chivas"],
  nikka:["ניקה","ניקה מן הבורל"],
  toki:["סנטורי","סנטורי טוקי","japanese whisky"],
  glenmorangie:["גלנמורנג'י","גלנמורנגי"],
  hp12:["היילנד פארק","highland park"],
  hendricks:["הנדריקס","הנדריקס ג'ין","hendricks"],
  hendricks1l:["הנדריקס ליטר","הנדריקס 1 ליטר"],
  bombay:["בומביי","בומביי ספייר","bombay"],
  tanqueray10:["טנקריי","טנקרי","tanqueray"],
  roku:["רוקו","ג'ין יפני"],
  monkey47:["מאנקי 47"],
  gordons:["גורדונס","גורדון"],
  greygoose:["גריי גוס","גרי גוס","grey goose"],
  absolut:["אבסולוט","אבסולט","vodka","וודקה"],
  belvedere:["בלוודר","belvedere"],
  ketelone:["קטל וואן","kettle one"],
  "castel-gv":["קסטל","קסטל גרנד ואן","castel"],
  "castel-petit":["פטי קסטל","קסטל קטן"],
  susya:["סוסון","סוסון ים","sosson"],
  yatir:["יתיר","יתיר פורסט"],
  recanati:["רקנאטי","רקנטי"],
  flam:["פלאם","פלאם קלאסיקו"],
  "golan-cab":["ירדן","ירדן קברנה","רמת הגולן"],
  "clos-de-gat":["קלו דה גת","קלו"],
  dalton:["דלתון","דלטון"],
  barkan:["ברקן","ברקן רזרב"],
  tabor:["תבור","תבור הר"],
  goldstar6:["גולדסטאר","גולד סטאר","beer","בירה"],
  negev:["נגב","בירת נגב","craft beer"],
  erdinger:["ארדינגר","erdinger"],
  corona6:["קורונה","corona"],
  jager:["יגרמייסטר","יגר","jager"],
  baileys:["ביילי'ס","ביילי","baileys"],
  patron:["פטרון","patron"],
  campari:["קמפרי","campari"],
  aperol:["אפרול","aperol"],
  havana7:["הוואנה","הוואנה 7","havana"],
};

const RAW = [
  {id:"mac12",n:"Macallan Double Cask 12",brand:"מקאלן",cat:"whisky",label:"וויסקי סינגל מאלט",vol:700,abv:40,origin:"סקוטלנד",premium:true,
   stores:[{s:"פאנקו",p:329,vol:700,u:"https://www.paneco.co.il/macallan-double-cask-12-700"},{s:"המייבא",p:349,vol:700,u:"https://www.the-importer.co.il"},{s:"בנא משקאות",p:359,vol:700,u:"https://www.banamashkaot.co.il"},{s:"אליאסי",p:369,vol:700,u:"https://www.eliasi.co.il"},{s:"שר המשקאות",p:379,vol:700,u:"https://www.mashkaot.co.il"}]},
  {id:"glen12",n:"Glenfiddich 12",brand:"גלנפידיך",cat:"whisky",label:"וויסקי סינגל מאלט",vol:700,abv:40,origin:"סקוטלנד",premium:true,
   stores:[{s:"בנא משקאות",p:149,vol:700,u:"https://www.banamashkaot.co.il"},{s:"המייבא",p:164,vol:700,u:"https://www.the-importer.co.il"},{s:"אליאסי",p:179,vol:700,u:"https://www.eliasi.co.il"},{s:"פאנקו",p:175,vol:700,u:"https://www.paneco.co.il"}]},
  {id:"jwblack",n:"Johnnie Walker Black Label",brand:"ג'וני ווקר",cat:"whisky",label:"וויסקי בלנד",vol:1000,abv:40,origin:"סקוטלנד",
   stores:[{s:"המייבא",p:139,vol:1000,u:"https://www.the-importer.co.il"},{s:"פאנקו",p:149,vol:1000,u:"https://www.paneco.co.il"},{s:"בנא משקאות",p:149,vol:1000,u:"https://www.banamashkaot.co.il"},{s:"שר המשקאות",p:155,vol:700,u:"https://www.mashkaot.co.il"},{s:"אליאסי",p:159,vol:1000,u:"https://www.eliasi.co.il"}]},
  {id:"jwblue",n:"Johnnie Walker Blue Label",brand:"ג'וני ווקר",cat:"whisky",label:"וויסקי בלנד",vol:700,abv:40,origin:"סקוטלנד",premium:true,
   stores:[{s:"פאנקו",p:589,vol:700,u:"https://www.paneco.co.il"},{s:"המייבא",p:610,vol:700,u:"https://www.the-importer.co.il"},{s:"דרך היין",p:599,vol:700,u:"https://www.wineroute.co.il"}]},
  {id:"jameson",n:"Jameson Irish Whiskey",brand:"ג'יימסון",cat:"whisky",label:"וויסקי אירי",vol:1000,abv:40,origin:"אירלנד",
   stores:[{s:"אליאסי",p:109,vol:1000,u:"https://www.eliasi.co.il"},{s:"פאנקו",p:125,vol:1000,u:"https://www.paneco.co.il/jameson-1l"},{s:"המייבא",p:125,vol:1000,u:"https://www.the-importer.co.il"},{s:"שר המשקאות",p:128,vol:1000,u:"https://www.mashkaot.co.il"}]},
  {id:"monkey",n:"Monkey Shoulder",brand:"מאנקי שולדר",cat:"whisky",label:"וויסקי בלנד",vol:700,abv:40,origin:"סקוטלנד",
   stores:[{s:"אליאסי",p:129,vol:700,u:"https://www.eliasi.co.il"},{s:"פאנקו",p:149,vol:700,u:"https://www.paneco.co.il"},{s:"בנא משקאות",p:149,vol:700,u:"https://www.banamashkaot.co.il"},{s:"התורכי",p:155,vol:700,u:"https://www.haturki-drinks.co.il"}]},
  {id:"laphroaig",n:"Laphroaig 10 Years",brand:"לאפרויג",cat:"whisky",label:"וויסקי איסלאי",vol:700,abv:40,origin:"סקוטלנד",premium:true,
   stores:[{s:"פאנקו",p:279,vol:700,u:"https://www.paneco.co.il"},{s:"וין & סיגר",p:289,vol:700,u:"https://www.winecigar.co.il"},{s:"המייבא",p:299,vol:700,u:"https://www.the-importer.co.il"}]},
  {id:"talisker",n:"Talisker 10 Years",brand:"טליסקר",cat:"whisky",label:"וויסקי סקוטי",vol:700,abv:45.8,origin:"סקוטלנד",premium:true,
   stores:[{s:"דרך היין",p:269,vol:700,u:"https://www.wineroute.co.il"},{s:"פאנקו",p:279,vol:700,u:"https://www.paneco.co.il"}]},
  {id:"chivas12",n:"Chivas Regal 12",brand:"שיבאס ריגל",cat:"whisky",label:"וויסקי בלנד",vol:700,abv:40,origin:"סקוטלנד",
   stores:[{s:"שר המשקאות",p:119,vol:700,u:"https://www.mashkaot.co.il"},{s:"בנא משקאות",p:125,vol:700,u:"https://www.banamashkaot.co.il"},{s:"פאנקו",p:129,vol:700,u:"https://www.paneco.co.il"},{s:"אליאסי",p:129,vol:700,u:"https://www.eliasi.co.il"}]},
  {id:"nikka",n:"Nikka From the Barrel",brand:"ניקה",cat:"whisky",label:"וויסקי יפני",vol:500,abv:51.4,origin:"יפן",premium:true,
   stores:[{s:"דרך היין",p:289,vol:500,u:"https://www.wineroute.co.il"},{s:"פאנקו",p:299,vol:500,u:"https://www.paneco.co.il"}]},
  {id:"toki",n:"Suntory Toki",brand:"סנטורי",cat:"whisky",label:"וויסקי יפני",vol:700,abv:43,origin:"יפן",
   stores:[{s:"אליאסי",p:179,vol:700,u:"https://www.eliasi.co.il"},{s:"פאנקו",p:189,vol:700,u:"https://www.paneco.co.il"},{s:"המייבא",p:195,vol:700,u:"https://www.the-importer.co.il"}]},
  {id:"glenmorangie",n:"Glenmorangie Original 10",brand:"גלנמורנג'י",cat:"whisky",label:"וויסקי היילנד",vol:700,abv:40,origin:"סקוטלנד",premium:true,
   stores:[{s:"פאנקו",p:189,vol:700,u:"https://www.paneco.co.il"},{s:"דרך היין",p:199,vol:700,u:"https://www.wineroute.co.il"},{s:"המייבא",p:205,vol:700,u:"https://www.the-importer.co.il"}]},
  {id:"hp12",n:"Highland Park 12",brand:"היילנד פארק",cat:"whisky",label:"וויסקי אורקני",vol:700,abv:40,origin:"סקוטלנד",premium:true,
   stores:[{s:"פאנקו",p:249,vol:700,u:"https://www.paneco.co.il"},{s:"לגימה",p:259,vol:700,u:"https://www.legima.co.il"},{s:"המייבא",p:269,vol:700,u:"https://www.the-importer.co.il"}]},
  {id:"hendricks",n:"Hendrick's Gin",brand:"הנדריקס",cat:"gin",label:"ג'ין פרימיום",vol:700,abv:41.4,origin:"סקוטלנד",premium:true,
   stores:[{s:"פאנקו",p:159,vol:700,u:"https://www.paneco.co.il/hendricks-gin-700"},{s:"אליאסי",p:159,vol:700,u:"https://www.eliasi.co.il"},{s:"המייבא",p:169,vol:700,u:"https://www.the-importer.co.il"},{s:"בנא משקאות",p:169,vol:700,u:"https://www.banamashkaot.co.il"},{s:"שר המשקאות",p:175,vol:700,u:"https://www.mashkaot.co.il"}]},
  {id:"hendricks1l",n:"Hendrick's Gin",brand:"הנדריקס",cat:"gin",label:"ג'ין פרימיום",vol:1000,abv:41.4,origin:"סקוטלנד",premium:true,
   stores:[{s:"פאנקו",p:219,vol:1000,u:"https://www.paneco.co.il/hendricks-gin-1l"},{s:"המייבא",p:229,vol:1000,u:"https://www.the-importer.co.il"},{s:"בנא משקאות",p:235,vol:1000,u:"https://www.banamashkaot.co.il"}]},
  {id:"bombay",n:"Bombay Sapphire",brand:"בומביי ספייר",cat:"gin",label:"ג'ין קלאסי",vol:1000,abv:40,origin:"בריטניה",
   stores:[{s:"אלקוהום",p:119,vol:1000,u:"https://www.alcohome.co.il"},{s:"בנא משקאות",p:124,vol:1000,u:"https://www.banamashkaot.co.il"},{s:"פאנקו",p:135,vol:1000,u:"https://www.paneco.co.il"},{s:"אליאסי",p:145,vol:1000,u:"https://www.eliasi.co.il"}]},
  {id:"tanqueray10",n:"Tanqueray No. Ten",brand:"טנקריי",cat:"gin",label:"ג'ין פרימיום",vol:700,abv:47.3,origin:"בריטניה",premium:true,
   stores:[{s:"דרך היין",p:149,vol:700,u:"https://www.wineroute.co.il"},{s:"פאנקו",p:159,vol:700,u:"https://www.paneco.co.il"}]},
  {id:"roku",n:"Roku Japanese Craft Gin",brand:"רוקו",cat:"gin",label:"ג'ין יפני",vol:700,abv:43,origin:"יפן",premium:true,
   stores:[{s:"דרך היין",p:149,vol:700,u:"https://www.wineroute.co.il"},{s:"פאנקו",p:159,vol:700,u:"https://www.paneco.co.il"}]},
  {id:"monkey47",n:"Monkey 47 Schwarzwald Gin",brand:"מאנקי 47",cat:"gin",label:"ג'ין גרמני",vol:500,abv:47,origin:"גרמניה",premium:true,
   stores:[{s:"פאנקו",p:219,vol:500,u:"https://www.paneco.co.il"},{s:"דרך היין",p:229,vol:500,u:"https://www.wineroute.co.il"}]},
  {id:"gordons",n:"Gordon's London Dry Gin",brand:"גורדונס",cat:"gin",label:"ג'ין לונדון",vol:1000,abv:37.5,origin:"בריטניה",
   stores:[{s:"שר המשקאות",p:79,vol:1000,u:"https://www.mashkaot.co.il"},{s:"פרטוש משקאות",p:79,vol:1000,u:"https://www.partush-mashkaot.co.il"},{s:"פאנקו",p:85,vol:1000,u:"https://www.paneco.co.il"},{s:"בנא משקאות",p:89,vol:1000,u:"https://www.banamashkaot.co.il"}]},
  {id:"greygoose",n:"Grey Goose",brand:"גריי גוס",cat:"vodka",label:"וודקה צרפתית",vol:700,abv:40,origin:"צרפת",premium:true,
   stores:[{s:"פאנקו",p:149,vol:700,u:"https://www.paneco.co.il"},{s:"המייבא",p:159,vol:700,u:"https://www.the-importer.co.il"},{s:"דרך היין",p:169,vol:700,u:"https://www.wineroute.co.il"},{s:"בנא משקאות",p:169,vol:700,u:"https://www.banamashkaot.co.il"}]},
  {id:"absolut",n:"Absolut Vodka",brand:"אבסולוט",cat:"vodka",label:"וודקה שוודית",vol:1000,abv:40,origin:"שוודיה",
   stores:[{s:"שר המשקאות",p:79,vol:1000,u:"https://www.mashkaot.co.il"},{s:"פרטוש משקאות",p:79,vol:1000,u:"https://www.partush-mashkaot.co.il"},{s:"אליאסי",p:85,vol:1000,u:"https://www.eliasi.co.il"},{s:"בנא משקאות",p:89,vol:1000,u:"https://www.banamashkaot.co.il"},{s:"פאנקו",p:89,vol:1000,u:"https://www.paneco.co.il"}]},
  {id:"belvedere",n:"Belvedere Vodka",brand:"בלוודר",cat:"vodka",label:"וודקה פולנית",vol:700,abv:40,origin:"פולין",premium:true,
   stores:[{s:"פאנקו",p:149,vol:700,u:"https://www.paneco.co.il"},{s:"דרך היין",p:159,vol:700,u:"https://www.wineroute.co.il"},{s:"המייבא",p:165,vol:700,u:"https://www.the-importer.co.il"}]},
  {id:"ketelone",n:"Ketel One Vodka",brand:"קטל וואן",cat:"vodka",label:"וודקה הולנדית",vol:1000,abv:40,origin:"הולנד",
   stores:[{s:"אליאסי",p:109,vol:1000,u:"https://www.eliasi.co.il"},{s:"פאנקו",p:119,vol:1000,u:"https://www.paneco.co.il"},{s:"שר המשקאות",p:119,vol:1000,u:"https://www.mashkaot.co.il"}]},
  {id:"castel-gv",n:"קסטל גרנד ואן אדום 2021",brand:"יקב קסטל",cat:"wine",label:"יין אדום ישראלי",vol:750,abv:14,origin:"הרי יהודה",premium:true,
   stores:[{s:"יין דירקט",p:349,vol:750,u:"https://www.wine-direct.co.il"},{s:"דרך היין",p:359,vol:750,u:"https://www.wineroute.co.il"},{s:"וין האוס",p:369,vol:750,u:"https://www.winehouse.co.il"},{s:"פאנקו",p:375,vol:750,u:"https://www.paneco.co.il"}]},
  {id:"castel-petit",n:"פטי קסטל אדום 2022",brand:"יקב קסטל",cat:"wine",label:"יין אדום ישראלי",vol:750,abv:13.5,origin:"הרי יהודה",
   stores:[{s:"יין דירקט",p:89,vol:750,u:"https://www.wine-direct.co.il"},{s:"דרך היין",p:94,vol:750,u:"https://www.wineroute.co.il"},{s:"בנא משקאות",p:99,vol:750,u:"https://www.banamashkaot.co.il"},{s:"פאנקו",p:99,vol:750,u:"https://www.paneco.co.il"}]},
  {id:"susya",n:"סוסון ים אדום 2022",brand:"יקב סוסון",cat:"wine",label:"יין אדום ישראלי",vol:750,abv:13.5,origin:"גליל",premium:true,
   stores:[{s:"יין דירקט",p:189,vol:750,u:"https://www.wine-direct.co.il"},{s:"דרך היין",p:195,vol:750,u:"https://www.wineroute.co.il"},{s:"וין האוס",p:199,vol:750,u:"https://www.winehouse.co.il"}]},
  {id:"yatir",n:"יתיר פורסט 2020",brand:"יקב יתיר",cat:"wine",label:"יין אדום ישראלי",vol:750,abv:14.5,origin:"הר חברון",premium:true,
   stores:[{s:"יין דירקט",p:245,vol:750,u:"https://www.wine-direct.co.il"},{s:"דרך היין",p:255,vol:750,u:"https://www.wineroute.co.il"},{s:"פאנקו",p:259,vol:750,u:"https://www.paneco.co.il"}]},
  {id:"recanati",n:"רקנאטי קריניאן 2022",brand:"יקב רקנאטי",cat:"wine",label:"יין אדום ישראלי",vol:750,abv:14.5,origin:"גליל",premium:true,
   stores:[{s:"יין דירקט",p:149,vol:750,u:"https://www.wine-direct.co.il"},{s:"דרך היין",p:155,vol:750,u:"https://www.wineroute.co.il"},{s:"פאנקו",p:159,vol:750,u:"https://www.paneco.co.il"}]},
  {id:"flam",n:"פלאם קלאסיקו 2022",brand:"יקב פלאם",cat:"wine",label:"יין אדום ישראלי",vol:750,abv:14,origin:"הרי יהודה",
   stores:[{s:"יין דירקט",p:89,vol:750,u:"https://www.wine-direct.co.il"},{s:"דרך היין",p:94,vol:750,u:"https://www.wineroute.co.il"},{s:"וין האוס",p:98,vol:750,u:"https://www.winehouse.co.il"}]},
  {id:"golan-cab",n:"ירדן קברנה סוביניון 2020",brand:"רמת הגולן",cat:"wine",label:"יין אדום ישראלי",vol:750,abv:14,origin:"רמת הגולן",
   stores:[{s:"יין דירקט",p:95,vol:750,u:"https://www.wine-direct.co.il"},{s:"בנא משקאות",p:99,vol:750,u:"https://www.banamashkaot.co.il"},{s:"פאנקו",p:105,vol:750,u:"https://www.paneco.co.il"}]},
  {id:"clos-de-gat",n:"קלו דה גת עיילון 2021",brand:"קלו דה גת",cat:"wine",label:"יין אדום ישראלי",vol:750,abv:14.5,origin:"הרי יהודה",premium:true,
   stores:[{s:"יין דירקט",p:195,vol:750,u:"https://www.wine-direct.co.il"},{s:"דרך היין",p:205,vol:750,u:"https://www.wineroute.co.il"}]},
  {id:"dalton",n:"דלתון כנען אדום 2022",brand:"יקב דלתון",cat:"wine",label:"יין אדום ישראלי",vol:750,abv:13.5,origin:"גליל עליון",
   stores:[{s:"יין דירקט",p:65,vol:750,u:"https://www.wine-direct.co.il"},{s:"דרך היין",p:69,vol:750,u:"https://www.wineroute.co.il"},{s:"פאנקו",p:72,vol:750,u:"https://www.paneco.co.il"}]},
  {id:"barkan",n:"ברקן רזרב קברנה 2021",brand:"יקב ברקן",cat:"wine",label:"יין אדום יבש",vol:750,abv:13.5,origin:"ישראל",
   stores:[{s:"יין דירקט",p:49,vol:750,u:"https://www.wine-direct.co.il"},{s:"שופרסל",p:54,vol:750,u:"https://www.shufersal.co.il"},{s:"יינות ביתן",p:59,vol:750,u:"https://www.yeinotbitan.co.il"},{s:"בנא משקאות",p:57,vol:750,u:"https://www.banamashkaot.co.il"}]},
  {id:"tabor",n:"תבור הר מרלו 2022",brand:"יקב תבור",cat:"wine",label:"יין אדום יבש",vol:750,abv:13.5,origin:"גליל",
   stores:[{s:"פרטוש משקאות",p:36,vol:750,u:"https://www.partush-mashkaot.co.il"},{s:"וין האוס",p:38,vol:750,u:"https://www.winehouse.co.il"},{s:"בנא משקאות",p:39,vol:750,u:"https://www.banamashkaot.co.il"},{s:"פאנקו",p:42,vol:750,u:"https://www.paneco.co.il"}]},
  {id:"goldstar6",n:"גולדסטאר אנפילטרד מארז 6",brand:"גולדסטאר",cat:"beer",label:"בירה לאגר ישראלית",vol:500,abv:4.9,origin:"ישראל",
   stores:[{s:"AM:PM",p:39,vol:500,u:"https://www.ampm.co.il"},{s:"טיב טעם",p:42,vol:500,u:"https://www.tivtaam.co.il"},{s:"רמי לוי",p:44,vol:500,u:"https://www.rami-levy.co.il"},{s:"שופרסל",p:45,vol:500,u:"https://www.shufersal.co.il"}]},
  {id:"negev",n:"נגב פשן פרוט",brand:"בירת נגב",cat:"beer",label:"בירה קרפטיט ישראלית",vol:330,abv:5,origin:"ישראל",
   stores:[{s:"אלקוהום",p:14,vol:330,u:"https://www.alcohome.co.il"},{s:"המייבא",p:14,vol:330,u:"https://www.the-importer.co.il"},{s:"טל דרינקס",p:15,vol:330,u:"https://www.taldrinks.co.il"}]},
  {id:"erdinger",n:"ארדינגר ווייסבייר",brand:"Erdinger",cat:"beer",label:"בירה גרמנית",vol:500,abv:5.3,origin:"גרמניה",
   stores:[{s:"שר המשקאות",p:12,vol:500,u:"https://www.mashkaot.co.il"},{s:"בנא משקאות",p:13,vol:500,u:"https://www.banamashkaot.co.il"},{s:"פאנקו",p:14,vol:500,u:"https://www.paneco.co.il"}]},
  {id:"corona6",n:"קורונה מארז 6",brand:"Corona",cat:"beer",label:"בירה מקסיקנית",vol:355,abv:4.6,origin:"מקסיקו",
   stores:[{s:"המייבא",p:32,vol:355,u:"https://www.the-importer.co.il"},{s:"בנא משקאות",p:39,vol:355,u:"https://www.banamashkaot.co.il"},{s:"שופרסל",p:41,vol:355,u:"https://www.shufersal.co.il"}]},
  {id:"jager",n:"Jägermeister",brand:"יגרמייסטר",cat:"spirits",label:"ליקר עשבים",vol:1000,abv:35,origin:"גרמניה",
   stores:[{s:"אליאסי",p:99,vol:1000,u:"https://www.eliasi.co.il"},{s:"שר המשקאות",p:105,vol:1000,u:"https://www.mashkaot.co.il"},{s:"פאנקו",p:108,vol:1000,u:"https://www.paneco.co.il"},{s:"בנא משקאות",p:109,vol:1000,u:"https://www.banamashkaot.co.il"}]},
  {id:"baileys",n:"Baileys Original Irish Cream",brand:"ביילי'ס",cat:"spirits",label:"ליקר קרמי",vol:1000,abv:17,origin:"אירלנד",
   stores:[{s:"שר המשקאות",p:89,vol:1000,u:"https://www.mashkaot.co.il"},{s:"פאנקו",p:95,vol:1000,u:"https://www.paneco.co.il"},{s:"בנא משקאות",p:95,vol:1000,u:"https://www.banamashkaot.co.il"}]},
  {id:"patron",n:"Patrón Silver Tequila",brand:"פטרון",cat:"spirits",label:"טקילה פרימיום",vol:700,abv:40,origin:"מקסיקו",premium:true,
   stores:[{s:"פאנקו",p:229,vol:700,u:"https://www.paneco.co.il"},{s:"דרך היין",p:239,vol:700,u:"https://www.wineroute.co.il"},{s:"המייבא",p:249,vol:700,u:"https://www.the-importer.co.il"}]},
  {id:"campari",n:"Campari Aperitivo",brand:"קמפרי",cat:"spirits",label:"ליקר אפריטיף",vol:700,abv:25,origin:"איטליה",
   stores:[{s:"פאנקו",p:89,vol:700,u:"https://www.paneco.co.il"},{s:"אליאסי",p:89,vol:700,u:"https://www.eliasi.co.il"},{s:"המייבא",p:95,vol:700,u:"https://www.the-importer.co.il"}]},
  {id:"aperol",n:"Aperol",brand:"אפרול",cat:"spirits",label:"ליקר אפריטיף",vol:700,abv:11,origin:"איטליה",
   stores:[{s:"שר המשקאות",p:69,vol:700,u:"https://www.mashkaot.co.il"},{s:"פאנקו",p:75,vol:700,u:"https://www.paneco.co.il"},{s:"בנא משקאות",p:75,vol:700,u:"https://www.banamashkaot.co.il"},{s:"אליאסי",p:79,vol:700,u:"https://www.eliasi.co.il"}]},
  {id:"havana7",n:"Havana Club 7 Years",brand:"הוואנה קלאב",cat:"spirits",label:"רום קובני",vol:700,abv:40,origin:"קובה",
   stores:[{s:"פאנקו",p:129,vol:700,u:"https://www.paneco.co.il"},{s:"דרך היין",p:135,vol:700,u:"https://www.wineroute.co.il"},{s:"המייבא",p:139,vol:700,u:"https://www.the-importer.co.il"}]},
];

const FEATURED_IDS = ["mac12","hendricks","castel-gv","jameson","greygoose","nikka","susya","jwblue"];
const BADGE_MAP = {mac12:"sponsored",hendricks:"hot",jameson:"deal","castel-gv":"premium",greygoose:"hot",nikka:"new",susya:"premium",jwblue:"hot"};
const BADGE_LABEL = {deal:"דיל 🔥",hot:"חם",premium:"⭐ פרימיום",new:"חדש",sponsored:"ממומן"};
const BADGE_CLS = {deal:"bd",hot:"bh",premium:"bp",new:"bn",sponsored:"bs"};
const CATS = [{id:"all",label:"הכל"},{id:"whisky",label:"🥃 וויסקי"},{id:"gin",label:"🍸 ג'ין"},{id:"vodka",label:"🧊 וודקה"},{id:"wine",label:"🍷 יין"},{id:"beer",label:"🍺 בירה"},{id:"spirits",label:"🥂 עוד"}];
const QUICK = ["קסטל","מקאלן","הנדריקס","ניקה","גריי גוס","סוסון","ג'יימסון","אפרול"];

/* Scroll animation hook */
function useFadeUp(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); }
    }, {threshold: 0.1});
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

function FadeUp({children, delay=0, tag="div", ...props}) {
  const ref = useRef(null);
  useFadeUp(ref);
  const Tag = tag;
  return <Tag ref={ref} className="fade-up" style={{transitionDelay:`${delay}ms`}} {...props}>{children}</Tag>;
}

/* Cards */
function FCard({p, onClick, sponsored}) {
  const bg = BADGE_MAP[p.id]; const best=bestOf(p); const worst=worstOf(p);
  return (
    <div className="fcard" onClick={()=>onClick(p)}>
      <div className="fcard-img" style={{position:"relative"}}>
        <ProductImg id={p.id} cat={p.cat} height={150}/>
        {bg&&<span className={`fcard-badge ${BADGE_CLS[bg]}`}>{BADGE_LABEL[bg]}</span>}
        {sponsored&&<span className="fcard-sponsored-tag">ממומן</span>}
      </div>
      <div className="fcard-body">
        <div className="fcard-cat">{p.label}</div>
        <div className="fcard-name">{p.n}</div>
        <div className="fcard-brand">{p.brand}</div>
        <div className="fcard-vol">{fmtVol(p.vol)}</div>
        <div className="fcard-price-row">
          <span className="fcard-price">₪{best}</span>
          {worst>best&&<span className="fcard-was">₪{worst}</span>}
        </div>
        <div className="fcard-stores-count">{p.stores.length} חנויות</div>
        <button className="fcard-btn">השווה מחירים</button>
      </div>
    </div>
  );
}

function PCard({p, onClick, sponsored}) {
  const best=bestOf(p); const worst=worstOf(p); const bs=bestStore(p);
  return (
    <div className="pcard" onClick={()=>onClick(p)}>
      <div className="pcard-img" style={{position:"relative"}}>
        <ProductImg id={p.id} cat={p.cat} height={130}/>
        {sponsored&&<span className="pcard-sponsored">ממומן</span>}
      </div>
      <div className="pcard-body">
        <div className="pcard-top">
          <span className="pcard-cat">{p.label}</span>
          {p.premium&&<span className="pcard-premium">פרימיום</span>}
        </div>
        <div className="pcard-name">{p.n}</div>
        <div className="pcard-brand">{p.brand}</div>
        <div className="pcard-pills">
          <span className="pill">{fmtVol(p.vol)}</span>
          {p.abv&&<span className="pill">{p.abv}%</span>}
          {p.origin&&<span className="pill">{p.origin}</span>}
        </div>
        <div className="pcard-bottom">
          <div className="pcard-store-label">הזול ביותר — {bs.s}</div>
          <div className="pcard-price-row">
            <span className="pcard-price">₪{best}</span>
            {worst>best&&<span className="pcard-was">₪{worst}</span>}
          </div>
          <div className="pcard-updated">עודכן {now()}</div>
        </div>
        <div className="pcard-actions">
          <button className="pcard-btn-main">השווה</button>
          <button className="pcard-btn-sec" onClick={e=>{e.stopPropagation();bs.u&&window.open(bs.u,"_blank")}}>קנה →</button>
        </div>
      </div>
    </div>
  );
}

function Modal({p, onClose}) {
  const sorted=[...p.stores].sort((a,b)=>a.p-b.p);
  const best=sorted[0];
  const pm=perMl(best.p,p.vol);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{p.n}<br/><span style={{fontSize:".72rem",color:"var(--muted)",fontWeight:400,fontFamily:"Heebo"}}>{p.brand} · {fmtVol(p.vol)} · {p.abv}%</span></div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-img"><ProductImg id={p.id} cat={p.cat} height={200}/></div>
          <div className="modal-meta">
            <span className="pill">{fmtVol(p.vol)}</span>
            {p.abv&&<span className="pill">{p.abv}%</span>}
            {p.origin&&<span className="pill">{p.origin}</span>}
            <span className="pill">{p.label}</span>
          </div>
          <div style={{fontSize:".72rem",color:"var(--muted)",marginBottom:"4px"}}>מחיר מינימלי</div>
          <div className="modal-price-hero">₪{best.p}</div>
          <div className="modal-updated">מחירים עודכנו היום ב-{now()}</div>
          {pm&&<div className="modal-price-sub">{pm} · חיסכון עד ₪{worstOf(p)-bestOf(p)} בין חנויות</div>}
          <div className="modal-stores" style={{marginTop:"1.1rem"}}>
            {sorted.map((st,i)=>(
              <a key={i} className={`msr${i===0?" best":""}`} href={st.u||"#"} target={st.u?"_blank":"_self"} rel="noopener noreferrer" onClick={e=>{if(!st.u)e.preventDefault()}}>
                <div className="msr-left">
                  <div className="msr-name">{st.s}</div>
                  <div className="msr-vol">{fmtVol(st.vol||p.vol)}</div>
                </div>
                <div className="msr-right">
                  {i===0&&<span className="msr-badge">הזול</span>}
                  <div className="msr-price">₪{st.p}</div>
                  <div className="msr-per">{perMl(st.p,st.vol||p.vol)}</div>
                </div>
              </a>
            ))}
          </div>
          {best.u&&(
            <>
              <button className="modal-buy-btn" onClick={()=>window.open(best.u,"_blank")}>
                קנה ב-{best.s} — ₪{best.p} →
              </button>
              <div className="aff-note">* LiquorLookup עשוי לקבל עמלה על קנייות דרך הקישורים</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AgePopup({onConfirm, onDecline}) {
  return (
    <div className="age-popup-bg" style={{backgroundImage:`url(${HERO_BG})`,backgroundSize:"cover",backgroundPosition:"center"}}>
      <div className="age-popup">
        <div style={{direction:"ltr",unicodeBidi:"bidi-override",fontFamily:"'Frank Ruhl Libre',serif",fontSize:"1.6rem",fontWeight:900,marginBottom:"1.75rem",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
          <span style={{width:9,height:9,borderRadius:"50%",background:"var(--wine)",display:"inline-block",marginLeft:6,flexShrink:0}}/>
          <span style={{display:"inline-block",whiteSpace:"nowrap",fontSize:0}}>
            <span style={{fontSize:"1.6rem",color:"var(--fg)"}}>Liquor</span><span style={{fontSize:"1.6rem",color:"var(--wine)"}}>Lookup</span>
          </span>
        </div>
        <h2>האם מלאו לך 18 שנים?</h2>
        <p>אתר זה מכיל מידע על משקאות אלכוהוליים.<br/>הכניסה מותרת לבני 18 ומעלה בלבד.</p>
        <div className="age-btns">
          <button className="age-yes" onClick={onConfirm}>כן, אני בן 18+</button>
          <button className="age-no" onClick={onDecline}>לא</button>
        </div>
        <div className="age-legal">
          בלחיצה על "כן" אתה מאשר שגילך 18+.<br/>
          שתיה אחראית · אל תשתה ותנהג · מכירה לקטינים אסורה על פי חוק.
        </div>
      </div>
    </div>
  );
}

/* Main */
export default function App() {
  const [ageOk, setAgeOk] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [showAc, setShowAc] = useState(false);
  const [acIdx, setAcIdx] = useState(-1);
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);
  const PER = 16;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const matchesQuery = useCallback((p, q) => {
    if (!q) return true;
    const aliases = (HE_ALIASES[p.id]||[]).join(" ").toLowerCase();
    return p.n.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
      p.label.toLowerCase().includes(q) || (p.origin&&p.origin.toLowerCase().includes(q)) ||
      aliases.includes(q);
  }, []);

  const sugs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return RAW.filter(p => matchesQuery(p, q)).slice(0,8);
  }, [query, matchesQuery]);

  useEffect(()=>{setShowAc(sugs.length>0);setAcIdx(-1);},[sugs]);

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    return RAW.filter(p=>{
      const mc = cat==="all"||p.cat===cat;
      return mc && matchesQuery(p, q);
    }).sort((a,b)=>bestOf(a)-bestOf(b));
  },[query,cat,matchesQuery]);

  useEffect(()=>setPage(1),[query,cat]);
  const shown = useMemo(()=>filtered.slice(0,page*PER),[filtered,page]);
  const isSearching = query.trim().length > 0;
  const featured = RAW.filter(p=>FEATURED_IDS.includes(p.id));

  function pick(p){setQuery(p.n);setShowAc(false);setCat("all");}
  function handleKey(e){
    if(!showAc)return;
    if(e.key==="ArrowDown"){e.preventDefault();setAcIdx(i=>Math.min(i+1,sugs.length-1));}
    else if(e.key==="ArrowUp"){e.preventDefault();setAcIdx(i=>Math.max(i-1,-1));}
    else if(e.key==="Enter"&&acIdx>=0)pick(sugs[acIdx]);
    else if(e.key==="Escape")setShowAc(false);
  }

  if (declined) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem",fontFamily:"Heebo,sans-serif",direction:"rtl",padding:"2rem",textAlign:"center"}}>
      <div style={{fontSize:"3rem"}}>🚫</div>
      <h2 style={{fontFamily:"Frank Ruhl Libre,serif",fontSize:"1.4rem"}}>הכניסה לאתר אסורה לקטינים</h2>
      <p style={{color:"#888",fontSize:".85rem"}}>אתר זה מיועד לבני 18 ומעלה בלבד.</p>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      {!ageOk && <AgePopup onConfirm={()=>setAgeOk(true)} onDecline={()=>setDeclined(true)} />}

      {/* NAV */}
      <nav className={`nav${scrolled?" scrolled":""}`}>
        <div className="wrap nav-inner">
          <div className="logo-wrap">
            <span className="logo-dot"/>
            <span className="logo-text"><span className="l1">Liquor</span><span className="l2">Lookup</span></span>
          </div>
          <div className="nav-links">
            <a href="#featured">מבצעים</a>
            <a href="#catalog">קטלוג</a>
            <a href="#" className="nav-cta">פרסמו כאן</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-img" style={{backgroundImage:`url(${HERO_BG})`}}/>
        <div className="hero-overlay"/>
        <div className="wrap hero-content">
          <div className="hero-badge"><span className="hero-pulse"/>מחירים מעודכנים · {RAW.length}+ מוצרים · {STORES.length} חנויות</div>
          <h1>מצא את הבקבוק שאתה אוהב.<br/><em>שלם את המחיר שאתה רוצה.</em></h1>
          <p className="hero-sub">השוואה מלאה של מחירי אלכוהול בכל החנויות הישראליות — וויסקי, יין, ג'ין, וודקה ובירה.</p>

          <div className="search-outer">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input ref={inputRef} value={query} onChange={e=>{setQuery(e.target.value);setShowAc(true);}}
                onKeyDown={handleKey} onFocus={()=>sugs.length>0&&setShowAc(true)}
                onBlur={()=>setTimeout(()=>setShowAc(false),160)}
                placeholder="חפש: מקאלן, Macallan, הנדריקס, קסטל..." autoComplete="off"/>
              <button className="search-btn" onClick={()=>setShowAc(false)}>חפש</button>
            </div>
            {showAc&&sugs.length>0&&(
              <div className="ac">
                <div className="ac-sec">תוצאות מהירות</div>
                {sugs.map((p,i)=>(
                  <div key={p.id} className={`ac-item${i===acIdx?" hi":""}`} onMouseDown={()=>pick(p)}>
                    <div className="ac-left">
                      <div className="ac-img">
                        <ProductImg id={p.id} cat={p.cat} height={38}/>
                      </div>
                      <div>
                        <div className="ac-name">{p.n}</div>
                        <div className="ac-vol">{fmtVol(p.vol)} · {p.abv}%</div>
                      </div>
                    </div>
                    <div className="ac-right">
                      <span className="ac-price">₪{bestOf(p)}</span>
                      <span className="ac-cat">{p.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="quick">
            <span className="qlabel">פופולרי:</span>
            {QUICK.map(q=>(
              <button key={q} className="qtag" onClick={()=>{setQuery(q);setShowAc(false);}}>{q}</button>
            ))}
          </div>

          <div className="stats-row">
            {[{k:"4,450+",v:"מוצרים"},{k:"40+",v:"חנויות"},{k:"22%",v:"חיסכון ממוצע"},{k:"₪0",v:"חינם תמיד"}].map(s=>(
              <div key={s.v}><div className="stat-k">{s.k}</div><div className="stat-v">{s.v}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* STORES */}
      <div className="stores-strip">
        <div className="wrap"><div className="stores-inner">{STORES.map(s=><span key={s} className="sbadge">{s}</span>)}</div></div>
      </div>

      {/* FEATURED */}
      {!isSearching&&(
        <section id="featured" className="featured">
          <div className="wrap">
            <FadeUp>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:"1rem"}}>
                <div>
                  <div className="section-eyebrow">עכשיו בולט</div>
                  <div className="section-title">מוצרים נבחרים השבוע</div>
                  <div className="section-sub">דילים, חדשים ומומלצים</div>
                </div>
              </div>
            </FadeUp>
            <div className="featured-grid">
              {featured.map((p,i)=>(
                <FadeUp key={p.id} delay={i*60}>
                  <FCard p={p} onClick={setModal} sponsored={p.id==="mac12"}/>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={100}>
              <div className="sponsored-banner">
                <div className="sb-inner">
                  <div className="sb-left">
                    <h3>🏪 חנות? הגיע הזמן להיות כאן</h3>
                    <p>פרסמו מוצרים, קבלו תנועה ממוקדת ועמלות על מכירות</p>
                  </div>
                  <div className="sb-pills">
                    <span className="sbpill">Affiliate</span>
                    <span className="sbpill">ממומן</span>
                    <span className="sbpill">Analytics</span>
                    <span className="sbpill">התראות מחיר</span>
                  </div>
                  <button className="sb-btn">דברו איתנו</button>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* CATALOG */}
      <section id="catalog" className="catalog">
        <div className="wrap">
          <FadeUp>
            <div className="results-header">
              <div>
                <div className="section-title" style={{fontSize:"1.2rem"}}>{isSearching?`תוצאות עבור "${query}"`:"כל המוצרים"}</div>
                <div className="results-info">{filtered.length} מוצרים · ממוין לפי מחיר זול ביותר</div>
              </div>
              <div className="cat-filters">
                {CATS.map(c=><button key={c.id} className={`cf${cat===c.id?" on":""}`} onClick={()=>setCat(c.id)}>{c.label}</button>)}
              </div>
            </div>
          </FadeUp>

          {filtered.length===0?(
            <div className="empty"><div className="empty-icon">🔍</div><div className="empty-h">לא נמצאו תוצאות</div><p className="empty-p">נסה בעברית או באנגלית</p></div>
          ):(
            <>
              <div className="results-grid">
                {shown.map((p,i)=>(
                  <FadeUp key={p.id+p.vol} delay={Math.min(i%4*60,180)}>
                    <PCard p={p} onClick={setModal} sponsored={i===2&&!isSearching}/>
                  </FadeUp>
                ))}
              </div>
              {shown.length<filtered.length&&(
                <button className="load-more" onClick={()=>setPage(pg=>pg+1)}>
                  טען עוד {Math.min(PER,filtered.length-shown.length)} מוצרים
                </button>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-inner">
          <div style={{direction:"ltr",unicodeBidi:"bidi-override",fontFamily:"'Frank Ruhl Libre',serif",fontSize:"1.1rem",fontWeight:900,display:"inline-block",whiteSpace:"nowrap",fontSize:0}}>
            <span style={{fontSize:"1.1rem",color:"var(--fg)"}}>Liquor</span><span style={{fontSize:"1.1rem",color:"var(--wine)"}}>Lookup</span>
          </div>
          <div className="footer-links">
            <a href="#">אודות</a><a href="#">פרטיות</a><a href="#">פרסמו כאן</a><a href="#">צור קשר</a>
            <a href="#" style={{color:"var(--wine)"}}>שתיה אחראית</a>
          </div>
          <div className="footer-copy">© 2025 LiquorLookup · 4,450+ מוצרים · 40+ חנויות</div>
        </div>
      </footer>

      {modal&&<Modal p={modal} onClose={()=>setModal(null)}/>}
    </>
  );
}
