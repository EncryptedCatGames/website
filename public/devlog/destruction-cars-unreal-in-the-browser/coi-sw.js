// The Unreal Engine web test, played inside its devlog page.
//
// The game runs its threads on SharedArrayBuffer, which needs a cross-origin isolated page. GitHub Pages can't
// send the headers for that, so this worker, limited to this one page's folder, adds them:
// - the devlog page itself gets COOP same-origin + COEP credentialless (other sites' scripts and images still load);
// - play/… is the game, relayed from its Cloud Storage bucket with the same headers, so it runs same-origin in a frame.
// The game reads its files in many small ranges. Each file is fetched whole once and the ranges are cut from it
// (a second visit reads it from Cache Storage); asking the bucket for every range made the start take minutes.
const BUCKET = 'https://storage.googleapis.com/e94fdbda3a7064ad2329d5c8c09b925c/';
const CACHE = 'dc-unreal-web-1'; // change it with each new upload to the bucket
const SCOPE = new URL('./', self.location).href;
const PLAY = SCOPE + 'play/';
const files = new Map(); // path → Promise<Blob>

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) =>
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key.startsWith('dc-unreal-web-') && key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  ),
);

function isolate(headers, coep) {
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Embedder-Policy', coep);
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  return headers;
}

// The whole file, once: Cache Storage first, else the bucket (a Brotli file arrives unpacked)
function whole(path) {
  if (!files.has(path)) {
    const load = (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(BUCKET + path);
      if (hit) return { blob: await hit.blob(), type: hit.headers.get('content-type') || '' };
      const r = await fetch(BUCKET + path, { mode: 'cors', credentials: 'omit' });
      if (!r.ok) throw new Error(`${r.status} ${path}`);
      const blob = await r.blob();
      const type = r.headers.get('content-type') || '';
      await cache.put(BUCKET + path, new Response(blob, { headers: { 'content-type': type } })).catch(() => {});
      return { blob, type };
    })();
    files.set(path, load);
    load.catch(() => files.delete(path));
  }
  return files.get(path);
}

async function play(request, path) {
  let file;
  try {
    file = await whole(path);
  } catch (e) {
    return new Response(String(e), { status: 404, headers: isolate(new Headers(), 'credentialless') });
  }
  const { blob, type } = file;
  const size = blob.size;
  const headers = isolate(new Headers({ 'content-type': type, 'accept-ranges': 'bytes', 'cache-control': 'no-cache' }), 'credentialless');
  if (request.method === 'HEAD') {
    headers.set('content-length', String(size));
    return new Response(null, { status: 200, headers });
  }
  const m = /^bytes=(\d+)-(\d*)$/.exec(request.headers.get('Range') || '');
  if (!m) {
    headers.set('content-length', String(size));
    return new Response(blob, { status: 200, headers });
  }
  const start = Number(m[1]);
  const end = Math.min(m[2] ? Number(m[2]) : size - 1, size - 1);
  if (start >= size) {
    headers.set('content-range', `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set('content-range', `bytes ${start}-${end}/${size}`);
  headers.set('content-length', String(end - start + 1));
  return new Response(blob.slice(start, end + 1), { status: 206, headers });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = request.url.split('#')[0];
  if (url.startsWith(PLAY)) {
    // The game's file reader asks for <folder>//<name>: the bucket needs single slashes
    const path = url.slice(PLAY.length).split('?')[0].replace(/\/{2,}/g, '/') || 'index.html';
    event.respondWith(play(request, path));
    return;
  }
  if (request.mode === 'navigate' && url.startsWith(SCOPE)) {
    event.respondWith(
      fetch(request).then(
        (r) => new Response(r.body, { status: r.status, statusText: r.statusText, headers: isolate(new Headers(r.headers), 'credentialless') }),
      ),
    );
  }
});
