// Document-level handlers survive client-side route swaps and are ready immediately.
document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches('[data-contact]'))
    return;
  event.preventDefault();
  const data = new FormData(form);
  const status = form.querySelector<HTMLElement>('.form-status')!;
  if (data.get('_gotcha')) return;
  const endpoint = form.dataset.endpoint;
  if (!endpoint) {
    const subject = `${data.get('topic')}: ${data.get('game')}`;
    const body = `Reply to: ${data.get('email')}\nGame: ${data.get('game')}\n\n${data.get('message')}`;
    const fallback = form.querySelector<HTMLElement>('.email-fallback')!;
    fallback.hidden = false;
    fallback.querySelector('textarea')!.value =
      `Subject: ${subject}\n\n${body}`;
    status.textContent =
      'Finish sending in your email app. If it did not open, use the link below.';
    const emailLink =
      fallback.querySelector<HTMLAnchorElement>('[data-email-draft]')!;
    emailLink.href = `mailto:encrypted.cat53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    emailLink.click();
    return;
  }
  const button = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  )!;
  button.disabled = true;
  status.textContent = 'Sending your message…';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Submission failed');
    status.textContent = 'Message sent. Thank you for getting in touch.';
    form.reset();
  } catch {
    status.textContent =
      'Your message could not be sent. Please try again or email encrypted.cat53@gmail.com directly.';
  } finally {
    clearTimeout(timer);
    button.disabled = false;
  }
});

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>('[data-filter]');
  if (!button) return;
  const filter = button.dataset.filter;
  let count = 0;
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((b) => {
    b.classList.toggle('active', b === button);
    b.setAttribute('aria-pressed', String(b === button));
  });
  document.querySelectorAll<HTMLElement>('[data-post-game]').forEach((post) => {
    post.hidden = filter !== 'all' && post.dataset.postGame !== filter;
    if (!post.hidden) count++;
  });
  const countLabel = document.querySelector('#post-count');
  if (countLabel) countLabel.textContent = `${count} posts`;
});

// The header persists across route swaps, so the menu is driven by document-level handlers.
const menuToggle = () =>
  document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = () => document.querySelector<HTMLElement>('[data-menu]');
function setMenu(open: boolean, restoreFocus = false) {
  const toggle = menuToggle();
  const panel = menu();
  if (!toggle || !panel) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.menu-label')!.textContent = open ? 'Close' : 'Menu';
  panel.hidden = !open;
  document.documentElement.classList.toggle('menu-open', open);
  if (open) panel.querySelector<HTMLAnchorElement>('a')?.focus();
  else if (restoreFocus) toggle.focus();
}
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest('[data-menu-toggle]'))
    setMenu(menuToggle()?.getAttribute('aria-expanded') !== 'true');
  else if (event.target.closest('[data-menu] a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !menu()?.hidden) setMenu(false, true);
});
document.addEventListener('astro:after-swap', () => setMenu(false));
matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});

// Catalogue: one active value per filter group; items match on type and platform tags.
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>(
    '[data-catalogue-filter]',
  );
  const root = button?.closest<HTMLElement>('[data-catalogue]');
  if (!button || !root) return;
  const group = button.dataset.catalogueFilter!;
  root
    .querySelectorAll<HTMLButtonElement>(`[data-catalogue-filter="${group}"]`)
    .forEach((b) => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
  root.dataset[group] = button.dataset.value;
  const type = root.dataset.type ?? 'all';
  const platform = root.dataset.platform ?? 'all';
  let count = 0;
  root.querySelectorAll<HTMLElement>('[data-group]').forEach((section) => {
    let visible = 0;
    section.querySelectorAll<HTMLElement>('[data-item]').forEach((item) => {
      item.hidden =
        (type !== 'all' && item.dataset.type !== type) ||
        (platform !== 'all' &&
          !item.dataset.platforms!.split(' ').includes(platform));
      if (!item.hidden) visible++;
    });
    section.hidden = visible === 0;
    count += visible;
  });
  root.querySelector<HTMLElement>('[data-catalogue-empty]')!.hidden = count > 0;
  root.querySelector('[data-catalogue-count]')!.textContent =
    `${count} ${count === 1 ? 'title' : 'titles'}`;
});

// Trailers: swap the poster for YouTube's privacy-enhanced player only when asked.
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const poster = event.target.closest<HTMLAnchorElement>('[data-trailer]');
  if (!poster) return;
  event.preventDefault();
  const id = encodeURIComponent(poster.dataset.trailer ?? '');
  const frame = document.createElement('iframe');
  frame.className = 'trailer-frame';
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
  frame.title = poster.dataset.trailerTitle ?? 'Trailer';
  frame.allow =
    'autoplay; encrypted-media; picture-in-picture; fullscreen; web-share';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  poster.replaceWith(frame);
  frame.focus();
});
