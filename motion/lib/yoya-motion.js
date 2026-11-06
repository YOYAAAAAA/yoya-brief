/*!
 * YOYA MOTION — 22 effects, one registry.
 * Usage:
 *   <link rel="stylesheet" href="lib/yoya-motion.css">
 *   <script src="lib/yoya-motion.js"></script>
 *   <script>
 *     YoyaMotion.mount('#my-grid', ['fade','parallax','ripple']);
 *   </script>
 * Add/remove = edit the id array. Each effect is defined once below.
 */
(function () {
  'use strict';
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const registry = new Map();
  let assets = '../v1.0/assets/img/';
  let defaultEnabled = false;
  const enabled = new Set();

  const inits = {
    fade(root) {
      const box = q('.fade-box', root); if (!box) return;
      const cue = q('.fade-cue', root);
      box.addEventListener('scroll', () => { if (cue) cue.classList.toggle('is-hidden', box.scrollTop > 10); }, { passive: true });
      const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('in', e.isIntersecting)), { root: box, threshold: .12, rootMargin: '-10% 0px -10% 0px' });
      qa('.fade-item', box).forEach(el => io.observe(el));
    },
    parallax(root) {
      const box = q('.px-scroll', root); if (!box || reduced) return;
      const layers = qa('.px-layer[data-f]', box);
      const update = () => {
        const y = box.scrollTop;
        layers.forEach(el => {
          const f = Number(el.dataset.f || 1);
          el.style.transform = `translate3d(0,${(y * (1 - f)).toFixed(1)}px,0)`;
        });
      };
      box.addEventListener('scroll', update, { passive: true }); update();
    },
    sticky(root) {
      const box = q('.sticky-box', root); if (!box) return;
      const head = q('.mini-head', box); if (!head) return;
      const update = () => head.classList.toggle('stuck', box.scrollTop > 26);
      box.addEventListener('scroll', update, { passive: true }); update();
    },
    pin(root) {
      const box = q('.pin-box', root); if (!box) return;
      const track = q('.pin-track', box), sticky = q('.pin-sticky', box);
      const num = q('.pin-num', box), img = q('.pin-img img', box);
      if (!track || !sticky) return;
      const update = () => {
        const max = Math.max(1, track.offsetHeight - sticky.offsetHeight);
        const p = clamp(box.scrollTop / max), step = Math.min(2, Math.floor(p * 3));
        if (num) num.textContent = String(step + 1).padStart(2, '0');
        sticky.style.setProperty('--pin-p', p.toFixed(3));
        if (img) img.style.setProperty('--pin-y', `${-step * 18}px`);
      };
      box.addEventListener('scroll', update, { passive: true }); update();
    },
    horizontal(root) {
      const box = q('.h-box', root); if (!box) return;
      const track = q('.h-track', box), sticky = q('.h-sticky', box), inner = q('.h-inner', box);
      if (!track || !sticky || !inner) return;
      const update = () => {
        const max = Math.max(1, track.offsetHeight - sticky.offsetHeight);
        const dist = Math.max(0, inner.scrollWidth - box.clientWidth + 44);
        inner.style.transform = `translate3d(${-clamp(box.scrollTop / max) * dist}px,0,0)`;
      };
      box.addEventListener('scroll', update, { passive: true }); update();
    },
    progress(root) {
      const box = q('.prog-box', root); if (!box) return;
      const bar = q('.prog-bar i', box); if (!bar) return;
      const update = () => {
        const max = Math.max(1, box.scrollHeight - box.clientHeight);
        bar.style.width = `${(box.scrollTop / max) * 100}%`;
      };
      box.addEventListener('scroll', update, { passive: true }); update();
    },
    highlight(root) {
      qa('.hl', root).forEach(el => {
        const io = new IntersectionObserver(es => es.forEach(e => el.classList.toggle('in', e.isIntersecting)), { threshold: .55 });
        io.observe(el);
      });
    },
    magnetic(root) {
      const stage = root.matches('.mag-stage') ? root : q('.mag-stage', root); if (!stage) return;
      const btn = q('.mag-btn', stage); if (!btn) return;
      stage.addEventListener('mousemove', e => {
        const r = stage.getBoundingClientRect();
        btn.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .2}px,0)`;
      });
      stage.addEventListener('mouseleave', () => { btn.style.transform = 'translate3d(0,0,0)'; });
    },
    ripple(root) {
      qa('.ripple-btn', root).forEach(btn => {
        btn.addEventListener('click', e => {
          const r = btn.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2;
          const s = document.createElement('span');
          s.style.width = s.style.height = `${size}px`;
          s.style.left = `${e.clientX - r.left - size / 2}px`;
          s.style.top = `${e.clientY - r.top - size / 2}px`;
          btn.appendChild(s); setTimeout(() => s.remove(), 640);
        });
      });
    },
    compare(root) {
      const stage = root.matches('.ba-stage') ? root : q('.ba-stage', root); if (!stage) return;
      const input = q('.ba-range', stage); if (!input) return;
      const update = () => stage.style.setProperty('--split', `${input.value}%`);
      input.addEventListener('input', update); update();
    },
    preloader(root) {
      const stage = root.matches('.pre-stage') ? root : q('.pre-stage', root); if (!stage) return;
      const cover = q('.pre-cover', stage), num = q('.pre-num', stage), btn = q('.pre-replay', stage);
      if (!cover || !num) return;
      if (reduced) { num.textContent = '100%'; cover.classList.add('gone'); return; }
      let raf = 0, started = false;
      const play = () => {
        cancelAnimationFrame(raf); cover.classList.remove('gone');
        const start = performance.now();
        const tick = now => {
          const p = clamp((now - start) / 1400);
          num.textContent = `${Math.round(p * 100)}%`;
          if (p < 1) raf = requestAnimationFrame(tick); else setTimeout(() => cover.classList.add('gone'), 220);
        };
        num.textContent = '0%'; raf = requestAnimationFrame(tick);
      };
      new IntersectionObserver(es => { if (es[0].isIntersecting && !started) { started = true; play(); } }, { threshold: .45 }).observe(stage);
      if (btn) btn.addEventListener('click', play);
    },
    lazy(root) {
      const box = q('.lazy-box', root); if (!box) return;
      const load = item => {
        if (item.dataset.loading) return;
        item.dataset.loading = '1';
        const img = q('img', item); if (!img) return;
        if (!img.getAttribute('src') && img.dataset.src) img.src = img.dataset.src;
        const done = () => item.classList.add('loaded');
        if (img.complete) done(); else img.addEventListener('load', done, { once: true });
      };
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { load(e.target); io.unobserve(e.target); }
      }), { root: box, rootMargin: '90px 0px' });
      qa('.lazy-item', box).forEach(item => {
        const img = q('img', item);
        if (img && img.getAttribute('src')) load(item); else io.observe(item);
      });
    },
    infinite(root) {
      const box = q('.feed-box', root); if (!box) return;
      const feed = q('.feed-list', box), spin = q('.feed-spin', box); if (!feed) return;
      let n = qa('.feed-item', feed).length, busy = false;
      const add = () => {
        for (let i = 0; i < 3; i++) {
          n++;
          const row = document.createElement('div'); row.className = 'feed-item';
          row.innerHTML = `<span class="feed-dot"></span><b>NOTE ${String(n).padStart(2, '0')}</b><span>${['墙面的划痕被保留下来。', '红色只出现在切角上。', '让下一层内容自己出现。'][i % 3]}</span>`;
          feed.appendChild(row);
        }
      };
      box.addEventListener('scroll', () => {
        if (busy) return;
        if (box.scrollTop + box.clientHeight > box.scrollHeight - 36) {
          busy = true; if (spin) spin.classList.add('on');
          setTimeout(() => { add(); if (spin) spin.classList.remove('on'); busy = false; }, 620);
        }
      }, { passive: true });
    },
    transition(root) {
      const stage = root.matches('.pt-stage') ? root : q('.pt-stage', root); if (!stage) return;
      const rows = qa('.pt-row', stage), back = q('.back', stage), cover = q('.pt-cover', stage);
      if (!cover) return;
      let busy = false;
      const go = detail => {
        if (busy) return; busy = true; stage.classList.add('cover');
        setTimeout(() => {
          stage.classList.toggle('detail', detail);
          stage.classList.remove('cover'); stage.classList.add('reveal');
          setTimeout(() => {
            cover.style.transition = 'none'; stage.classList.remove('reveal');
            cover.style.transform = 'translateX(-101%)'; void cover.offsetWidth;
            cover.style.transition = ''; busy = false;
          }, 460);
        }, 460);
      };
      rows.forEach(row => row.addEventListener('click', () => go(true)));
      if (back) back.addEventListener('click', () => go(false));
    },
    smooth(root) {
      const box = q('.smooth-box', root); if (!box) return;
      qa('.smooth-nav a[data-target]', box).forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const target = box.querySelector(`#${a.dataset.target}`);
          if (target) box.scrollTo({ top: target.offsetTop - 34, behavior: reduced ? 'auto' : 'smooth' });
        });
      });
      const up = q('.smooth-up', box);
      if (up) up.addEventListener('click', () => box.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    }
  };

  function define(def) {
    registry.set(def.id, def);
    if (def.enabled) enabled.add(def.id); else enabled.delete(def.id);
  }
  function toIds(list) {
    if (list === 'all') return [...registry.keys()];
    if (list == null) return defaultEnabled ? [...registry.keys()] : [...enabled];
    if (typeof list === 'string') return [list];
    return list;
  }
  function enable(id) { if (!registry.has(id)) return false; enabled.add(id); return true; }
  function disable(id) { enabled.delete(id); return true; }
  function ids(group) {
    return [...registry.values()]
      .filter(d => !group || d.group === group)
      .sort((a, b) => Number(a.num) - Number(b.num))
      .map(d => d.id);
  }
  function card(def, opts) {
    const art = document.createElement('article');
    art.className = 'spec'; art.id = def.id;
    art.innerHTML = `<header class="spec-head"><span class="num">${def.num}</span><h3>${def.title}</h3><span class="tag">${def.tag}</span></header><p class="spec-desc">${def.desc}</p>`;
    const wrap = document.createElement('div'); wrap.className = 'ym';
    const stage = document.createElement('div'); stage.className = def.stageClass || 'stage';
    stage.innerHTML = def.html.replace(/\{\{assets\}\}/g, opts.assets || assets);
    wrap.append(stage); art.append(wrap);
    return { art, stage };
  }
  function mount(target, list, opts = {}) {
    const root = typeof target === 'string' ? q(target) : target;
    if (!root) return [];
    root.replaceChildren();
    const selected = toIds(list);
    selected.forEach(id => {
      const def = registry.get(id);
      if (!def) { console.warn('[YoyaMotion] unknown effect:', id); return; }
      const { art, stage } = card(def, opts);
      root.append(art);
      const fn = def.init || inits[id];
      if (fn) { try { fn(stage, opts); } catch (e) { console.error('[YoyaMotion]', id, e); } }
    });
    return selected;
  }
  function create(target, id, opts = {}) {
    const root = typeof target === 'string' ? q(target) : target;
    const def = registry.get(id);
    if (!root || !def) return null;
    const { art, stage } = card(def, opts);
    root.append(art);
    const fn = def.init || inits[id];
    if (fn) { try { fn(stage, opts); } catch (e) { console.error('[YoyaMotion]', id, e); } }
    return art;
  }
  function remove(target, id) {
    const root = typeof target === 'string' ? q(target) : target;
    if (!root) return;
    const el = root.querySelector(`#${CSS.escape(id)}`);
    if (el) el.remove();
  }

  window.YoyaMotion = {
    define, mount, create, remove, ids, enable, disable,
    enabled: () => [...enabled],
    get defaultEnabled() { return defaultEnabled; },
    set defaultEnabled(v) { defaultEnabled = !!v; },
    get: id => registry.get(id),
    has: id => registry.has(id),
    all: () => [...registry.keys()],
    get assets() { return assets; },
    set assets(v) { assets = v; },
    version: '1.0.0'
  };

  /* Effect definitions — generated from .shots/cards.json; edit the source cards instead. */
define({id:"fade",num:"01",group:"scroll",title:"滚动淡入",tag:"SCROLL",desc:"元素越过视区 85% 的线，0.7 秒内上浮 28px 并淡入；退回视野外会重置。",stageClass:"stage",enabled:false,html:"<div class=\"scrollbox fade-box\">\n            <div class=\"fade-cue\">\n              <span>SCROLL / 01</span>\n              <b>↓</b>\n              <p>向下滚动这一格<br>标题和卡片才会出现。</p>\n            </div>\n            <div class=\"fade-inner\">\n              <div class=\"fade-item\">\n                <p class=\"mono\">SCROLL / 01</p>\n                <h4>墙不会说话，<br>但它记得。</h4>\n              </div>\n              <div class=\"fade-cards\">\n                <div class=\"fade-card fade-item\"><b>01</b><span>识别 / 字标</span></div>\n                <div class=\"fade-card fade-item\"><b>02</b><span>材质 / 墙面</span></div>\n                <div class=\"fade-card fade-item\"><b>03</b><span>应用 / 出口</span></div>\n              </div>\n              <p class=\"fade-item\">同一排卡片同时出现，标题、卡片、正文各自向上浮现。这不是加载动画，是页面在读者面前慢慢展开。</p>\n              <div style=\"height:200px\"></div>\n            </div>\n          </div>\n          <span class=\"stage-hint\">SCROLL INSIDE</span>\n        "});
define({id:"parallax",num:"02",group:"scroll",title:"视差滚动",tag:"SCROLL",desc:"天空 0.15×、图形标 0.4×、标题 1.0×。背景慢，正文快，纵深就出来了。",stageClass:"stage mint",enabled:false,html:"<div class=\"px-scroll\">\n            <div class=\"px-content\">\n              <div class=\"px-layer px-sky\" data-f=\".15\"></div>\n              <div class=\"px-layer px-title\" data-f=\"1\">\n                <h4>向墙的<br>更深处。</h4>\n                <p>PARALLAX / 向下滚</p>\n              </div>\n              <div class=\"px-layer px-mark\" data-f=\".4\">\n                <img src=\"{{assets}}yoya-mark-ink.svg\" alt=\"\">\n              </div>\n              <div class=\"px-next\">\n                <p class=\"mono\">LAYER 02 / MINT</p>\n                <h4>背景在退，内容在走。</h4>\n                <p>最近的一层是纸，中层是图形标，最远的是墙。滚动时三层以不同速度让开。</p>\n                <div class=\"row\"><i></i><i></i><i></i></div>\n              </div>\n            </div>\n          </div>\n          <span class=\"stage-hint\">SCROLL INSIDE</span>\n        "});
define({id:"sticky",num:"03",group:"scroll",title:"吸顶页头",tag:"SCROLL",desc:"通知条先走，页头到顶后停住；阴影在 24px 内从 0 到 0.16。",stageClass:"stage",enabled:false,html:"<div class=\"scrollbox sticky-box\">\n            <div class=\"notice\">2026 识别系统 / 预约开放</div>\n            <div class=\"mini-head\">\n              <img src=\"{{assets}}yoya-logo-primary.webp\" alt=\"\">\n              <nav><span>识别</span><span>材质</span><span>故事</span></nav>\n              <em>查看</em>\n            </div>\n            <div class=\"sticky-body\">\n              <div class=\"hero-line\">把痕迹，<br>留在墙上。</div>\n              <p>页头像一枚图钉，把“现在读到哪”固定在顶部。通知条是它愿意让出的第一层。</p>\n              <div class=\"row3\"><i></i><i></i><i></i></div>\n              <p>下面所有内容继续从页头下方通过。阴影只在页头真正吸住时出现，不抢状态。</p>\n              <div style=\"height:220px\"></div>\n            </div>\n          </div>\n          <span class=\"stage-hint\">SCROLL INSIDE</span>\n        "});
define({id:"pin",num:"04",group:"scroll",title:"区块固定",tag:"SCROLL",desc:"区块停住 300px 的滚动距离，编号 01→02→03，照片跟着向内走。",stageClass:"stage ink",enabled:false,html:"<div class=\"pin-box\">\n            <div class=\"pin-track\">\n              <div class=\"pin-sticky\">\n                <div class=\"pin-num\">01</div>\n                <div class=\"pin-copy\">\n                  <span>PINNED / STEP</span>\n                  <h4>先看墙，<br>再看字。</h4>\n                  <p>固定不是停顿，是把同一屏里的顺序讲完。</p>\n                </div>\n                <div class=\"pin-img\"><img src=\"{{assets}}yoya-wall-mint-detail-960.webp\" alt=\"\"></div>\n                <div class=\"pin-line\"><i></i></div>\n              </div>\n              <div style=\"height:360px\"></div>\n              <div class=\"pin-tail\">\n                <p class=\"mono\">RELEASED / 03</p>\n                <h4>三步走完，区块才继续。</h4>\n                <p>编号、图像、进度线在固定期间推进；解除固定后，整块和下一段一起向上。</p>\n              </div>\n            </div>\n          </div>\n          <span class=\"stage-hint\">SCROLL INSIDE</span>\n        "});
define({id:"horizontal",num:"05",group:"scroll",title:"横向滚动",tag:"SCROLL",desc:"页面往下，四张卡往左。纵向的滚动量被翻译成横向的位移。",stageClass:"stage ink",enabled:false,html:"<div class=\"h-box\">\n            <div class=\"h-track\">\n              <div class=\"h-sticky\">\n                <div class=\"h-inner\">\n                  <div class=\"h-card\"><b>01</b><img src=\"{{assets}}yoya-mark-ink.svg\" alt=\"\"><span>MARK / INK</span></div>\n                  <div class=\"h-card\"><b>02</b><img src=\"{{assets}}yoya-wall-mint-2400.webp\" alt=\"\"><span>WALL / MINT</span></div>\n                  <div class=\"h-card\"><b>03</b><img src=\"{{assets}}yoya-mark-ink.svg\" alt=\"\"><span>MARK / PAPER</span></div>\n                  <div class=\"h-card\"><b>04</b><img src=\"{{assets}}yoya-wall-mint-2400.webp\" alt=\"\"><span>WALL / RISO</span></div>\n                </div>\n              </div>\n            </div>\n          </div>\n          <span class=\"stage-hint\">SCROLL INSIDE</span>\n        "});
define({id:"snap",num:"06",group:"scroll",title:"滚动吸附",tag:"SCROLL",desc:"每一屏停在下一屏的起点。适合按整屏逐段读，不让人停在两张卡之间。",stageClass:"stage",enabled:false,html:"<div class=\"scrollbox snap-box\">\n            <section class=\"snap-sec\"><span class=\"big\">01</span><p>IDENTITY / 识别</p><h4>先看见切口。</h4></section>\n            <section class=\"snap-sec\"><span class=\"big\">02</span><p>MATERIAL / 材质</p><h4>再看见墙。</h4></section>\n            <section class=\"snap-sec\"><span class=\"big\">03</span><p>APPLICATION / 应用</p><h4>最后看见它被使用。</h4></section>\n          </div>\n          <span class=\"stage-hint\">SCROLL / SNAP</span>\n        "});
define({id:"progress",num:"07",group:"scroll",title:"滚动进度条",tag:"SCROLL",desc:"一条 3px 的红线，告诉你读到了哪里。到页底刚好填满。",stageClass:"stage",enabled:false,html:"<div class=\"prog-box\">\n            <div class=\"prog-bar\"><i></i></div>\n            <article class=\"prog-article\">\n              <p class=\"mono\">READING / 01</p>\n              <h4>墙不会说话，<br>但它记得。</h4>\n              <p>第一次看见这面墙，是在下午四点。光从侧面进来，把薄荷色照得发白，划痕、颗粒和深浅不匀都浮了出来。</p>\n              <p>它不完美，但没有一处是多余的。我们决定不修掉这些痕迹。字标因此长这样：黑色的 YOYA，笔画粗、间距紧，像用刷子一次写成。</p>\n              <p>红色只出现在切角上，像墙上唯一一处新鲜的伤口。它占的面积很小，但你必须先看见它，才认得出整套东西。</p>\n              <div class=\"tall\"></div>\n              <p>读到这里，进度条刚好走完。它不是装饰，是把“还剩多少”交给读者。</p>\n            </article>\n          </div>\n          <span class=\"stage-hint\">SCROLL INSIDE</span>\n        "});
define({id:"highlight",num:"08",group:"interact",title:"荧光笔高亮",tag:"SCROLL",desc:"关键词进入视区，一道薄荷色笔画从左到右盖住下半行。",stageClass:"stage",enabled:false,html:"<div class=\"hl-stage\">\n            <p>我们把<span class=\"hl\">墙不会说话</span>，<br>但它记得，写进了品牌的<br>第一句话里。</p>\n            <span class=\"hl-note\">HIGHLIGHT / MINT</span>\n          </div>\n          <span class=\"stage-hint\">SCROLL INTO VIEW</span>\n        "});
define({id:"lift",num:"09",group:"interact",title:"悬停上浮",tag:"HOVER",desc:"卡片上浮 8px，阴影扩散，边框转成薄荷深色。只抬起鼠标指向的那一张。",stageClass:"stage",enabled:false,html:"<div class=\"lift-stage\">\n            <div class=\"lift-card\"><b>01</b><p>识别<br>字标 / 切角</p><span>HOVER ME</span></div>\n            <div class=\"lift-card\"><b>02</b><p>材质<br>墙面 / 色板</p><span>HOVER ME</span></div>\n            <div class=\"lift-card\"><b>03</b><p>应用<br>网页 / 纸张</p><span>HOVER ME</span></div>\n          </div>\n          <span class=\"stage-hint\">HOVER</span>\n        "});
define({id:"zoom",num:"10",group:"interact",title:"悬停图片放大",tag:"HOVER",desc:"边框不动，里面的照片缓慢放大 1.09 倍。像把目光推近一格。",stageClass:"stage",enabled:false,html:"<div class=\"zoom-stage\">\n            <div class=\"zoom-frame\"><img src=\"{{assets}}yoya-wall-mint-2400.webp\" alt=\"\"></div>\n            <div class=\"zoom-meta\"><span>MINT FIELD / 01</span><span>HOVER THE IMAGE</span></div>\n          </div>\n          <span class=\"stage-hint\">HOVER</span>\n        "});
define({id:"magnetic",num:"11",group:"interact",title:"磁吸按钮",tag:"HOVER",desc:"鼠标靠近，按钮朝指针移动；离开后带一点回弹。只给最想被点的动作。",stageClass:"stage ink",enabled:false,html:"<div class=\"mag-stage\">\n            <button class=\"mag-btn\" type=\"button\">查看识别 <span>→</span></button>\n            <span class=\"mag-note\">MOVE YOUR CURSOR</span>\n          </div>\n          <span class=\"stage-hint\">MOVE / CLICK</span>\n        "});
define({id:"ripple",num:"12",group:"interact",title:"点击涟漪",tag:"CLICK",desc:"每次点击，白圈从指针位置扩散，铺满按钮后消失。确认发生在手指下面。",stageClass:"stage",enabled:false,html:"<div class=\"ripple-stage\">\n            <button class=\"ripple-btn\" type=\"button\">点击 / 查看完整识别</button>\n          </div>\n          <span class=\"stage-hint\">CLICK</span>\n        "});
define({id:"underline",num:"13",group:"interact",title:"下划线动画",tag:"HOVER",desc:"线从左伸出来，向右收回去。菜单、文字链、页脚都能用。",stageClass:"stage",enabled:false,html:"<div class=\"u-stage\">\n            <a class=\"u-link\" href=\"#material\">墙面与色板<small>MATERIAL</small></a>\n            <a class=\"u-link\" href=\"#templates\">网页 / 海报 / 卡片<small>OUTPUTS</small></a>\n            <a class=\"u-link\" href=\"#story\">长文与语气<small>STORY</small></a>\n          </div>\n          <span class=\"stage-hint\">HOVER</span>\n        "});
define({id:"compare",num:"14",group:"media",title:"前后对比滑块",tag:"DRAG",desc:"左边灰色是处理前，右边彩色是处理后。拖分隔线，自己看差别。",stageClass:"stage",enabled:false,html:"<div class=\"ba-stage\" style=\"--split:50%\">\n            <img class=\"ba-img ba-before\" src=\"{{assets}}yoya-wall-mint-2400.webp\" alt=\"\">\n            <img class=\"ba-img ba-after\" src=\"{{assets}}yoya-wall-mint-2400.webp\" alt=\"\">\n            <div class=\"ba-line\"></div>\n            <input class=\"ba-range\" type=\"range\" min=\"4\" max=\"96\" value=\"50\" aria-label=\"对比分割线\">\n            <div class=\"ba-tags\"><span>BEFORE</span><span>AFTER</span></div>\n          </div>\n          <span class=\"stage-hint\">DRAG</span>\n        "});
define({id:"preloader",num:"15",group:"media",title:"预加载画面",tag:"LOAD",desc:"0→100% 的数字，跑到头后整块向上移开，露出下面的页面。",stageClass:"stage ink",enabled:false,html:"<div class=\"pre-stage\">\n            <div class=\"pre-under\">\n              <div>\n                <p class=\"mono\">READY / 100</p>\n                <h4>页面已经<br>把痕迹留好。</h4>\n                <p>现在可以继续往下。</p>\n              </div>\n            </div>\n            <div class=\"pre-cover\">\n              <img src=\"{{assets}}yoya-mark-white.svg\" alt=\"YOYA\">\n              <div class=\"pre-num\">0%</div>\n              <div class=\"lab\">LOADING / YOYA 2026</div>\n            </div>\n            <button class=\"pre-replay\" type=\"button\">重播</button>\n          </div>\n        "});
define({id:"lazy",num:"16",group:"media",title:"图片懒加载",tag:"SCROLL",desc:"第一排已经加载；往下滚，占位框里的图片才依次出现，各自淡入。",stageClass:"stage",enabled:false,html:"<div class=\"scrollbox lazy-box\">\n            <div class=\"lazy-grid\">\n              <div class=\"lazy-item\"><img src=\"{{assets}}yoya-wall-mint-detail-960.webp\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img src=\"{{assets}}yoya-wall-mint-detail-960.webp\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img src=\"{{assets}}yoya-mark-ink.svg\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img data-src=\"{{assets}}yoya-wall-mint-2400.webp\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img data-src=\"{{assets}}yoya-wall-mint-2400.webp\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img data-src=\"{{assets}}yoya-wall-mint-detail-960.webp\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img data-src=\"{{assets}}yoya-mark-white.svg\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img data-src=\"{{assets}}yoya-wall-mint-detail-960.webp\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img data-src=\"{{assets}}yoya-wall-mint-2400.webp\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img data-src=\"{{assets}}yoya-wall-mint-2400.webp\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img data-src=\"{{assets}}yoya-wall-mint-detail-960.webp\" alt=\"\"></div>\n              <div class=\"lazy-item\"><img data-src=\"{{assets}}yoya-mark-ink.svg\" alt=\"\"></div>\n            </div>\n          </div>\n          <span class=\"stage-hint\">SCROLL INSIDE</span>\n        "});
define({id:"infinite",num:"17",group:"media",title:"无限滚动",tag:"SCROLL",desc:"滚到列表底部，转一圈，再长三条。没有页码，只有继续。",stageClass:"stage",enabled:false,html:"<div class=\"scrollbox feed-box\">\n            <div class=\"feed-list\">\n              <div class=\"feed-item\"><span class=\"feed-dot\"></span><b>NOTE 01</b><span>墙面的划痕被保留下来。</span></div>\n              <div class=\"feed-item\"><span class=\"feed-dot\"></span><b>NOTE 02</b><span>红色只出现在切角上。</span></div>\n              <div class=\"feed-item\"><span class=\"feed-dot\"></span><b>NOTE 03</b><span>让下一层内容自己出现。</span></div>\n              <div class=\"feed-item\"><span class=\"feed-dot\"></span><b>NOTE 04</b><span>薄荷是场，纸是留白。</span></div>\n              <div class=\"feed-item\"><span class=\"feed-dot\"></span><b>NOTE 05</b><span>字标被切开，签名把它按回墙上。</span></div>\n              <div class=\"feed-item\"><span class=\"feed-dot\"></span><b>NOTE 06</b><span>同一套 token，换三个尺寸。</span></div>\n              <div class=\"feed-item\"><span class=\"feed-dot\"></span><b>NOTE 07</b><span>墙会旧，墨会淡，切角的角度不变。</span></div>\n              <div class=\"feed-item\"><span class=\"feed-dot\"></span><b>NOTE 08</b><span>先把规则固定下来，再等着被使用。</span></div>\n            </div>\n            <div class=\"feed-spin\"><i></i></div>\n          </div>\n          <span class=\"stage-hint\">SCROLL TO LOAD</span>\n        "});
define({id:"transition",num:"18",group:"media",title:"页面转场",tag:"CLICK",desc:"点一行，薄荷遮幕从左侧铺满，换页后向右退出。返回时同样走一遍。",stageClass:"stage",enabled:false,html:"<div class=\"pt-stage\">\n            <div class=\"pt-view pt-index\">\n              <p class=\"mono\">INDEX / 03</p>\n              <h4>选一个<br>继续看。</h4>\n              <div class=\"pt-row\" data-detail><span>01 / 墙面与色板</span><span>→</span></div>\n              <div class=\"pt-row\" data-detail><span>02 / 海报与界面</span><span>→</span></div>\n              <div class=\"pt-row\" data-detail><span>03 / 长文与语气</span><span>→</span></div>\n            </div>\n            <div class=\"pt-view pt-detail\">\n              <p class=\"mono\">DETAIL / 01</p>\n              <h4>墙面不是背景，<br>是证据。</h4>\n              <p>薄荷色墙面来自真实拍摄。细微的划痕与颗粒没有被修掉——它们让品牌看起来被使用过，而不是被合成出来。</p>\n              <div class=\"back\">← 返回列表</div>\n            </div>\n            <div class=\"pt-cover\"></div>\n          </div>\n          <span class=\"stage-hint\">CLICK A ROW</span>\n        "});
define({id:"smooth",num:"19",group:"ambient",title:"平滑滚动",tag:"CLICK",desc:"点菜单，页面不是跳过去，而是滑过去；右下角的箭头以同样方式回到顶部。",stageClass:"stage",enabled:false,html:"<div class=\"smooth-box\">\n            <div class=\"smooth-nav\">\n              <span>SECTIONS</span>\n              <a data-target=\"sm-1\">识别</a>\n              <a data-target=\"sm-2\">材质</a>\n              <a data-target=\"sm-3\">应用</a>\n            </div>\n            <section class=\"smooth-sec\" id=\"sm-1\"><p class=\"mono\">01 / IDENTITY</p><h4>先看见切口。</h4><p>字标、切角、签名。三者一起出现，比例不改。</p></section>\n            <section class=\"smooth-sec\" id=\"sm-2\"><p class=\"mono\">02 / MATERIAL</p><h4>再看见墙。</h4><p>薄荷不是背景，是证据。划痕和颗粒没有被修掉。</p></section>\n            <section class=\"smooth-sec\" id=\"sm-3\"><p class=\"mono\">03 / APPLICATION</p><h4>最后看见它被使用。</h4><p>网页、A4、3:4。同一套 token，三种出口。</p></section>\n            <button class=\"smooth-up\" type=\"button\" aria-label=\"回到顶部\">↑</button>\n          </div>\n          <span class=\"stage-hint\">CLICK MENU</span>\n        "});
define({id:"gradient",num:"20",group:"ambient",title:"动态渐变",tag:"LOOP",desc:"薄荷、纸白、深绿三块光斑慢慢绕圈、交融。标题后方不需要照片。",stageClass:"stage ink",enabled:false,html:"<div class=\"grad-stage\">\n            <div class=\"grad-blob grad-a\"></div>\n            <div class=\"grad-blob grad-b\"></div>\n            <div class=\"grad-blob grad-c\"></div>\n            <div class=\"grad-text\">\n              <h4>颜色<br>在动。</h4>\n              <p>GRADIENT / MINT · PAPER · INK</p>\n            </div>\n          </div>\n          <span class=\"stage-hint\">AMBIENT LOOP</span>\n        "});
define({id:"float",num:"21",group:"ambient",title:"漂浮动画",tag:"LOOP",desc:"手机、29.5° 徽章、评分标签以错开的节奏上下浮动，阴影跟着呼吸。",stageClass:"stage",enabled:false,html:"<div class=\"float-stage\">\n            <div class=\"phone\"><img src=\"{{assets}}yoya-mark-ink.svg\" alt=\"\"></div>\n            <div class=\"badge\">29.5°</div>\n            <div class=\"rate\">CUT ANGLE<br>FIXED / 01</div>\n          </div>\n          <span class=\"stage-hint\">AMBIENT LOOP</span>\n        "});
define({id:"marquee",num:"22",group:"ambient",title:"跑马灯",tag:"LOOP",desc:"墨黑横条里，服务名称被薄荷圆点隔开，无间断向左。悬停会暂停。",stageClass:"stage ink",enabled:false,html:"<div class=\"mq-stage\">\n            <div class=\"mq-label\">WHAT WE MAKE / 2026</div>\n            <div class=\"marquee\">\n              <div class=\"mq-track\">\n                <div class=\"mq-item\">识别 <i></i> 海报 <i></i> 卡片 <i></i> 网页 <i></i> 材质 <i></i> 标识 <i></i></div>\n                <div class=\"mq-item\">识别 <i></i> 海报 <i></i> 卡片 <i></i> 网页 <i></i> 材质 <i></i> 标识 <i></i></div>\n              </div>\n            </div>\n          </div>\n          <span class=\"stage-hint\">HOVER TO PAUSE</span>\n        "});
})();
