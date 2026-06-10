/* ============ {P} Web Studio — интерактив ============ */

/* ---------- бургер-меню ---------- */
const burger = document.getElementById('burgerBtn');
const menu = document.getElementById('menuOverlay');
burger.setAttribute('aria-expanded', 'false');
burger.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menu.setAttribute('aria-hidden', String(!open));
  burger.setAttribute('aria-expanded', String(open));
});

/* ---------- подложка шапки при скролле ---------- */
const headerEl = document.querySelector('.header');
addEventListener('scroll', () => {
  headerEl.classList.toggle('scrolled', scrollY > 40);
}, { passive: true });
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menu.setAttribute('aria-hidden', 'true');
}));

/* ---------- аккордеон ---------- */
document.querySelectorAll('.acc__head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.parentElement;
    const isOpen = item.classList.contains('acc__item--open');
    document.querySelectorAll('.acc__item--open').forEach(i => {
      i.classList.remove('acc__item--open');
      i.querySelector('.acc__head').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('acc__item--open');
      head.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ---------- скролл-спай нижней навигации ---------- */
const spyLinks = [...document.querySelectorAll('.navbar__link[data-spy]')];
const spySections = spyLinks
  .map(l => document.getElementById(l.dataset.spy))
  .filter(Boolean);
const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    spyLinks.forEach(l => l.classList.toggle('navbar__link--active', l.dataset.spy === e.target.id));
  });
}, { rootMargin: '-40% 0px -50% 0px' });
spySections.forEach(s => spyObserver.observe(s));

/* ---------- мини-чат оценки проекта ---------- */
const chatFeed = document.getElementById('chatFeed');
const chatChoices = document.getElementById('chatChoices');
const chatChip = document.getElementById('chatChip');
const chatRestart = document.getElementById('chatRestart');
const chatInitialFeed = chatFeed.innerHTML;

const BOT_REPLIES = {
  'Боты и автоматизация': 'Отличный выбор! Telegram-бот — от 5 000 ₽, срок от 2 дней. Парсеры, авто-воронки, оплата, CRM — всё умеем. Напишите <a class="chat__link" href="https://t.me/BaronPavel" target="_blank" rel="noopener">@BaronPavel</a> — за вечер прикинем смету.',
  'Сайт или лендинг': 'Супер! Лендинг — от 30 000 ₽ и от 3 дней, магазин или платформа — обсудим объём. Дизайн с нуля, без шаблонов — как в кейсах выше. Пишите <a class="chat__link" href="https://t.me/BaronPavel" target="_blank" rel="noopener">@BaronPavel</a> — посчитаем точно.',
  'Просто хочу сделать красиво': 'Это к нам :) Красиво — наша базовая комплектация. Расскажите пару слов о проекте в <a class="chat__link" href="https://t.me/BaronPavel" target="_blank" rel="noopener">Telegram</a>, а мы предложим 2–3 варианта, как это может выглядеть.',
  'Просто хочу автоматизировать рутину': 'Любимая задача. Расскажите, что съедает время — отчёты, заявки, посты, переписка? Подберём бота, который заберёт это на себя. Пишите <a class="chat__link" href="https://t.me/BaronPavel" target="_blank" rel="noopener">@BaronPavel</a>.'
};

const FOLLOWUPS = {
  'Сколько стоит?': 'Бот — от 5 000 ₽, лендинг — от 30 000 ₽, магазин или платформа — по брифу. Цену фиксируем до старта, без доплат в процессе.',
  'Какие сроки?': 'Бот — от 2 дней, лендинг — от 3, магазин — от пары недель. Срок называем до старта и держим.',
  'А поддержка будет?': 'Будет. Хостинг, обновления, новые функции — берём на себя, пока мы вам нужны. Сами писали — сами и сопровождаем.'
};

function chatFollowups() {
  const row = document.createElement('div');
  row.className = 'chat__follow';
  Object.keys(FOLLOWUPS).forEach(q => {
    const b = document.createElement('button');
    b.textContent = q;
    b.addEventListener('click', () => {
      row.classList.add('chat__follow--done');
      chatPush(q, 'user');
      setTimeout(() => {
        chatPush(FOLLOWUPS[q] + ' Обсудить детали: <a class="chat__link" href="https://t.me/BaronPavel" target="_blank" rel="noopener">@BaronPavel</a>', 'bot');
        chatFollowups();
      }, 600);
    });
    row.appendChild(b);
  });
  const tg = document.createElement('a');
  tg.href = 'https://t.me/BaronPavel';
  tg.target = '_blank';
  tg.rel = 'noopener';
  tg.textContent = 'Перейти в Telegram ↗';
  row.appendChild(tg);
  chatFeed.appendChild(row);
  chatFeed.scrollTop = chatFeed.scrollHeight;
}

function chatPush(text, who) {
  const wrap = document.createElement('div');
  wrap.className = 'chat__msg chat__msg--' + who;
  wrap.innerHTML = who === 'bot'
    ? `<div class="chat__ava"><span class="logo-mark logo-mark--chat"><span class="logo-brace">{</span>P<span class="logo-brace">}</span></span><i class="chat__dot"></i></div>
       <div><p class="chat__name">Ассистент студии</p><p class="chat__text">${text}</p></div>`
    : `<p class="chat__text">${text}</p>`;
  chatFeed.appendChild(wrap);
  chatFeed.scrollTop = chatFeed.scrollHeight;
}

function chatPick(label) {
  chatPush(label, 'user');
  chatChoices.style.display = 'none';
  setTimeout(() => {
    chatPush(BOT_REPLIES[label], 'bot');
    chatFollowups();
  }, 600);
}

chatChoices.querySelectorAll('.chat__choice').forEach(btn =>
  btn.addEventListener('click', () => chatPick(btn.dataset.pick)));
chatChip.addEventListener('click', () => chatPick(chatChip.textContent.trim()));
chatRestart.addEventListener('click', () => {
  chatFeed.innerHTML = chatInitialFeed;
  chatChoices.style.display = '';
});

/* ---------- GSAP-анимации ---------- */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduced) {
    /* hero: появление строк и визуала */
    gsap.from('.hero__label', { y: 30, opacity: 0, duration: .8, ease: 'power3.out' });
    gsap.from('.hero__title .line', { y: 40, opacity: 0, duration: .9, stagger: .12, delay: .15, ease: 'power3.out' });
    gsap.from('.hero__cta', { y: 24, opacity: 0, duration: .7, delay: .55, ease: 'power3.out' });
    gsap.from('.hero__shot', { y: 70, opacity: 0, scale: .92, duration: 1.1, stagger: .18, delay: .3, ease: 'power3.out' });
    gsap.from('.pill-label', { scale: 0, opacity: 0, duration: .6, stagger: .2, delay: 1, ease: 'back.out(1.8)' });

    /* плавающие скриншоты */
    document.querySelectorAll('[data-float]').forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 ? 14 : -14,
        duration: 2.6 + i * .4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    });

    /* reveal по скроллу */
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.from(el, {
        y: 44,
        opacity: 0,
        duration: .85,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    /* разлетающиеся карточки кейсов (только desktop-раскладка) */
    if (matchMedia('(min-width: 721px)').matches) {
      const cards = gsap.utils.toArray('.scatter__card');
      gsap.from(cards, {
        x: 0,
        y: 120,
        rotation: 0,
        opacity: 0,
        duration: 1.1,
        stagger: .08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#scatter', start: 'top 75%' },
        clearProps: 'opacity'
      });
    }

    /* лёгкий параллакс глобусов и звёзд */
    gsap.utils.toArray('.qa__spark, .cases__globe, .why__spark--green').forEach(el => {
      gsap.to(el, {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    });

    /* счётчики статистики в hero */
    document.querySelectorAll('.stat [data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.4,
        delay: .7,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); }
      });
    });

    /* магнитные кнопки (только desktop с мышью) */
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.querySelectorAll('.btn--primary, .btn--light, .btn--dark, .navbar__order').forEach(btn => {
        const xTo = gsap.quickTo(btn, 'x', { duration: .4, ease: 'power3.out' });
        const yTo = gsap.quickTo(btn, 'y', { duration: .4, ease: 'power3.out' });
        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * .25);
          yTo((e.clientY - r.top - r.height / 2) * .35);
        });
        btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
      });
    }
  }
}
