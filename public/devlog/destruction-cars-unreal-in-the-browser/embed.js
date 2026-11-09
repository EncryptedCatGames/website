// "Play here": runs the Unreal Engine web test in a frame on this page. Nothing loads until the reader asks.
// The first time, the page installs coi-sw.js (it makes this page cross-origin isolated) and reloads once.
(() => {
  const box = document.querySelector('[data-unreal-embed]');
  if (!box) return;
  const button = box.querySelector('[data-play]');
  const note = box.querySelector('[data-note]');
  const base = new URL('./', location.href.split(/[?#]/)[0]);
  const TRIED = 'dc-unreal-isolation-reload';
  const remember = (on) => {
    try {
      on ? sessionStorage.setItem(TRIED, '1') : sessionStorage.removeItem(TRIED);
    } catch (e) {
      /* private window */
    }
  };
  const tried = () => {
    try {
      return sessionStorage.getItem(TRIED) === '1';
    } catch (e) {
      return true;
    }
  };
  const say = (text) => {
    note.textContent = text;
    note.hidden = false;
    button.disabled = false;
    button.textContent = 'Play here';
  };
  const FULL_PAGE = ' You can still open it full page with the link below.';

  const start = () => {
    remember(false);
    const frame = document.createElement('iframe');
    frame.src = new URL('play/index.html', base).href;
    frame.title = 'Destruction Cars, the Unreal Engine web test';
    frame.allow = 'fullscreen; cross-origin-isolated; gamepad; autoplay';
    const full = document.createElement('button');
    full.type = 'button';
    full.className = 'button unreal-embed-full';
    full.textContent = 'Full screen';
    full.addEventListener('click', () => frame.requestFullscreen && frame.requestFullscreen());
    box.classList.add('is-playing');
    box.replaceChildren(frame, full);
    frame.focus();
  };

  const play = async () => {
    if (!navigator.gpu) return say("This browser has no WebGPU, so the test can't run here. Try Chrome or Edge on a desktop.");
    if (self.crossOriginIsolated) return start();
    if (!('serviceWorker' in navigator) || tried()) {
      remember(false);
      return say("This browser can't run the test inside the page." + FULL_PAGE);
    }
    button.disabled = true;
    button.textContent = 'Getting ready…';
    try {
      await navigator.serviceWorker.register(new URL('coi-sw.js', base).href, { scope: base.pathname });
      await navigator.serviceWorker.ready;
    } catch (e) {
      return say("This browser can't run the test inside the page." + FULL_PAGE);
    }
    remember(true);
    // A real reload: the page must come back through the worker (a change of the #part alone would not)
    const target = base.pathname + '?play=1';
    if (location.pathname + location.search === target) location.reload();
    else location.replace(target + '#play');
  };

  button.addEventListener('click', play);
  if (new URLSearchParams(location.search).get('play') === '1') play();
})();
