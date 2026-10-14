# Encrypted Cat Games

Static Astro website for Encrypted Cat Games. Built with Bun, ready for GitHub Pages, with no application server required.

## Local development

```sh
bun install
bun run dev
```

Open http://localhost:4321. Production commands:

```sh
bun run format:check
bun run check
bun run build
bun run verify
bun run preview
```

`dist/` contains the complete static site: 37 HTML pages, local images/fonts, CSS/JS, sitemap, robots.txt, CNAME, and .nojekyll. The 28 imported devlog articles are Markdown in `src/content/devlog/`. No runtime calls to itch.io are needed to render pages. Run `bun run format` to format source and supporting files; imported article text is preserved.

## Configuration and changing domains

GitHub Actions automatically reads the published URL from Pages settings before building. Project hosting uses `/website/`; configuring a custom domain in Pages switches the next deployment to root paths. `SITE_URL` and `SITE_BASE` Actions variables are optional overrides, not required setup. The build and link verification run with the same resolved configuration.

Edit `site.config.mjs`. The default URL is `https://games.encrypted-cat.com`. `siteUrl` determines canonical URLs, social image URLs, sitemap URLs, and the custom-domain CNAME. A different custom domain only requires changing `siteUrl`, rebuilding, and updating GitHub Pages/DNS. `customDomain` is derived from the URL; `CUSTOM_DOMAIN` can override it when needed. URLs ending in `.github.io` automatically omit CNAME.

Environment overrides (also documented in `.env.example`):

| Variable               | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `SITE_URL`             | Public origin, e.g. `https://games.encrypted-cat.com`         |
| `SITE_BASE`            | `/` for a custom domain; `/website/` for a GitHub project URL |
| `CUSTOM_DOMAIN`        | Optional CNAME override; empty string disables CNAME          |
| `PUBLIC_FORM_ENDPOINT` | Formspree endpoint                                            |
| `PUBLIC_GA_ID`         | GA4 measurement ID; placeholder disables analytics            |

For temporary GitHub project hosting:

```sh
SITE_URL=https://encryptedcatgames.github.io SITE_BASE=/website/ bun run build
SITE_URL=https://encryptedcatgames.github.io SITE_BASE=/website/ bun run verify
```

For another custom domain:

```sh
SITE_URL=https://your-new-domain.com bun run build
```

Assets, navigation, article images, and links respect the base path. Astro’s ClientRouter provides in-browser navigation with immediate content swaps and a persistent header/footer. Each route still has a real `index.html`, so direct links and reloads work on GitHub Pages without SPA rewrites. Document-level handlers keep forms and filters working immediately after route changes, and consent state persists between routes.

## GitHub Pages deployment

The workflow validates every push and pull request to `main`. Deployment is skipped while Pages is disabled, so the repository can stay private during preparation. GitHub Pages for private repositories requires a supported plan. On the current plan, make the repository public before enabling Pages.

1. Push this repository to GitHub, using `main` for the deployment branch (or edit `.github/workflows/deploy.yml`).
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. Configure the custom domain as `games.encrypted-cat.com` in Pages settings.
4. At your DNS provider, add a CNAME for `games` pointing to `encryptedcatgames.github.io` (without protocol or repository path).
5. Once GitHub issues the certificate, enable **Enforce HTTPS**.
6. Push to `main` or manually run the workflow. It checks formatting and types, builds, verifies internal links/assets, and deploys `dist/` when Pages is enabled.

Optional repository **Actions variables**: `SITE_URL`, `SITE_BASE`, `PUBLIC_FORM_ENDPOINT`, `PUBLIC_GA_ID`. Leaving them blank uses the defaults in `site.config.mjs`. These values are public site configuration, not secrets.

## Activate contact-form forwarding

GitHub Pages cannot send emails itself. Create a form on https://formspree.io, configure its notification recipient as `encrypted.cat53@gmail.com`, and complete the service's email verification. Then set its `https://formspree.io/f/FORM_ID` endpoint in `site.config.mjs` or the `PUBLIC_FORM_ENDPOINT` Actions variable and rebuild.

The form supports validation, a spam honeypot, pending/success/error messages, and a direct email fallback. Without an endpoint it prepares a copyable draft with a link to open the visitor's email app and clearly explains that the visitor must send it. It does not claim delivery. Before launch, submit a real test using the configured Formspree endpoint and confirm receipt in Gmail.

The privacy page automatically describes the configured form mode. If you switch away from Formspree, update that description and the provider link.

## Analytics

`G-XXXXXXXXXX` is intentionally inactive. Add your real GA4 measurement ID to enable optional analytics. The script is only injected after the visitor accepts, advertising features are disabled, and form messages/email addresses are never sent as analytics events. A footer privacy-settings button allows consent to be changed. Consent is stored in local storage; withdrawal disables tracking and attempts to clear analytics cookies. Check actual GA delivery after configuring your measurement ID.

## Privacy and App Store preparation

`/support/` is a permanent support URL with FAQs and contact details. `/privacy/` currently covers website hosting, contact information, optional analytics, and embeds. It explicitly distinguishes the website from future native releases.

Before using `/privacy/` as an App Store privacy URL, confirm each native game's actual data handling: SDKs, analytics/crash reports, ads, purchases, accounts, permissions, saved data, server communication, and retention. Add the native-game policy to `src/pages/privacy.astro`, update its date, and set `nativePrivacyConfirmed` only after that policy is accurate. Align App Store privacy labels with the app. This repository alone cannot verify native app data collection.

Add live App Store links to `appStoreUrl` in `src/data/games.ts` when available. Buttons remain hidden until real URLs exist.

## Content and asset maintenance

- Game copy and store links: `src/data/games.ts`.
- Game artwork metadata: `src/data/itch.json`.
- Articles: `src/content/devlog/*.md`, with title, date, game, description, source, and optional image frontmatter.
- Branding, game screenshots, and devlog images: `public/images/`.
- Asset provenance: `src/data/asset-sources.json`.
- Optimized brand artwork is included in `public/images/`; original working files are not needed to build or import articles.
- Fonts are bundled locally through Fontsource. Font licence files are included in `public/licenses/`.

`bun run import:itch` imports new owner-authored itch.io posts and artwork. Existing article IDs are skipped so local edits are preserved. It handles rate limits with delayed retries. Imported video embeds become links, and images are downloaded and compressed to WebP. Review imported content before deployment; imports do not run in CI. Screenshots and articles belong to Encrypted Cat Games and are reused at the owner's request.

Play links open each game directly on itch.io in a new tab. No itch.io widgets are embedded. Community links open external services. Reduced-motion preferences, keyboard focus, semantic labels, and a skip link are supported.
