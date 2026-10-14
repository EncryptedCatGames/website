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
