# Multilingual System — EN / FR / AR (with RTL)

This document explains the i18n layer that was added to the existing static
website. It is **non-invasive**: the original `index.html`, `style.css`,
and `script.js` keep their structure, behaviour, and design. The new code
only adds translation support on top.

---

## 1. Stack detected

| Layer    | What it is                                |
|----------|-------------------------------------------|
| Markup   | Single static `index.html` (no framework) |
| Styles   | Vanilla CSS (`style.css`)                 |
| Scripts  | Vanilla JS (`script.js`)                  |
| Build    | None — open `index.html` directly         |

Because there is no framework, the cleanest fit is a **vanilla JS i18n
engine + JSON locale files**. No build step, no dependencies.

---

## 2. Project structure (changes only)

```
WebSite/
├── index.html              (modified — data-i18n attributes + lang switcher slots)
├── style.css               (modified — appended switcher styles, Arabic font, RTL block)
├── script.js               (modified — listens to 'languagechange' to close mobile drawer)
├── js/
│   └── i18n.js             (new — translation engine)
├── locales/
│   ├── en.json             (new — English source of truth)
│   ├── fr.json             (new — French)
│   └── ar.json             (new — Arabic)
├── img/                    (untouched)
└── README-i18n.md          (this file)
```

Original styling, animations, and design tokens were not edited; the i18n
CSS is fully appended at the end of `style.css` and scoped with
`[dir="rtl"]` or `body.lang-ar` so it can never affect the LTR layout.

---

## 3. How it works

### 3.1 Locale files (`locales/*.json`)

One JSON file per language, hierarchical keys, arrays for repeating
content (e.g. `services.cards[0].features[2]`). All three files share
exactly the same shape — adding a new language is a copy-translate of one
file (see § 6).

### 3.2 Engine (`js/i18n.js`)

A self-invoking module that:

1. **Detects** the initial language in this order: `localStorage` →
   `<html lang>` → `navigator.languages` → fallback `en`.
2. **Loads** the right `locales/{lang}.json` via `fetch` (with
   `cache: 'force-cache'`) and caches the parsed dictionary.
3. **Walks** the DOM and fills every element marked with:
   - `data-i18n="key"` → sets `textContent`
   - `data-i18n-html="key"` → sets `innerHTML` (used for `<strong>` etc.)
   - `data-i18n-attr="attr:key;attr2:key2"` → sets HTML attributes
     (placeholders, `alt`, `aria-label`, `content`, …)
4. Updates `<html lang>` and `<html dir>` (rtl for Arabic) and adds a
   `lang-XX` class on `<body>` so CSS can react.
5. Persists the selection in `localStorage` under `site.lang`.
6. Dispatches a `'languagechange'` `CustomEvent` so other scripts
   (`script.js`) can react. Right now the only consumer closes the mobile
   drawer if it's open.

It exposes a tiny global API for ad-hoc usage:

```js
window.i18n.setLanguage('fr');   // switch
window.i18n.getLanguage();       // → 'en' | 'fr' | 'ar'
window.i18n.t('cta.main_button') // translation lookup (toast/validation)
window.i18n.supported            // → ['en', 'fr', 'ar']
```

### 3.3 Language switcher

Two empty slots are placed in `index.html`:

```html
<div class="lang-switcher" data-lang-switcher></div>          <!-- desktop -->
<div class="lang-switcher lang-switcher-mobile" data-lang-switcher></div> <!-- mobile drawer -->
```

The engine finds every `[data-lang-switcher]` and renders an accessible
dropdown (`role="listbox"`, `aria-expanded`, ESC-to-close, click-outside
to close) into each. Both switchers stay in sync via the
`'languagechange'` event so changing the language on mobile also updates
the desktop trigger label and vice-versa.

### 3.4 RTL & Arabic typography

- `<html dir="rtl">` is set automatically for Arabic.
- The full original layout is preserved (it's mostly flex/grid, which
  mirrors itself) — only a handful of targeted CSS rules flip the
  hand-positioned hero stat cards, flip directional SVG arrows, and
  mirror the back-to-top button.
- Premium Arabic fonts **Cairo** and **Tajawal** are pre-loaded once via
  Google Fonts. They are only **applied** when `body` has the `lang-ar`
  class — so English/French still use Inter/Space Grotesk with zero
  overhead.
- Numbers, currencies, prices and `<48h`-style indicators stay LTR
  inside RTL flow via `unicode-bidi: isolate; direction: ltr;`.

---

## 4. Files created / modified

| File                       | Change                                                              |
|----------------------------|----------------------------------------------------------------------|
| `index.html`               | **modified** — `data-i18n*` attributes on every translatable node, language switcher slot in nav (desktop + mobile), Arabic font preload, `hreflang` alternates, `<script src="js/i18n.js" defer>` in `<head>`. |
| `style.css`                | **modified** — appended ~280 lines: language switcher styles, Arabic font block, RTL overrides. No existing rule changed. |
| `script.js`                | **modified** — added `'languagechange'` listener (closes mobile menu). All existing code untouched. |
| `js/i18n.js`               | **new** — translation engine.                                       |
| `locales/en.json`          | **new** — English (source of truth).                                |
| `locales/fr.json`          | **new** — French.                                                   |
| `locales/ar.json`          | **new** — Arabic.                                                   |
| `.claude/launch.json`      | **modified** — preview command updated to `py -m http.server 3000`. |
| `README-i18n.md`           | **new** — this file.                                                |

---

## 5. Run it locally

Because the engine uses `fetch()` to load JSON, opening `index.html` via
`file://` will not work in most browsers (CORS). Any static server is
fine. Pick one:

```bash
# Python 3 (already installed on this machine)
py -m http.server 3000

# Node
npx serve .

# PHP
php -S localhost:3000
```

Then visit <http://localhost:3000>.

First visit auto-detects the browser language. After the user picks one
from the switcher, the choice is remembered (`localStorage.site.lang`)
and restored on every future visit.

---

## 6. Adding a new language (e.g. Spanish)

1. **Translate the file**

   ```bash
   cp locales/en.json locales/es.json
   # then translate the values inside es.json — keys must stay identical
   ```

2. **Register it in the engine** — `js/i18n.js`, two constants near the
   top:

   ```js
   const SUPPORTED = ['en', 'fr', 'ar', 'es'];   // add 'es'
   // RTL_LANGS stays the same unless the new lang is RTL (he, fa, ur, …)
   ```

3. **Add the label** in the switcher UI — inside `initSwitcher`:

   ```js
   const labels = { en: 'EN', fr: 'FR', ar: 'AR', es: 'ES' };
   const names  = { en: 'English', fr: 'Français', ar: 'العربية', es: 'Español' };
   ```

4. **(Optional)** add `<link rel="alternate" hreflang="es" href="./?lang=es">`
   to `<head>` for SEO.

That's it — no other file changes needed.

For a **right-to-left language** (Hebrew, Persian, Urdu), also add the
code to `RTL_LANGS` and, if needed, append a font-family rule to
`style.css` similar to the `body.lang-ar` block.

---

## 7. SEO

- `<html lang>` is updated to match the active language → search engines
  and screen readers see the correct language.
- `<title>` and `<meta name="description">` are localised per locale via
  `meta.title` / `meta.description` keys.
- `hreflang` alternates are declared in the document head for the three
  languages plus `x-default`.

---

## 8. Performance notes

- Locale JSONs are tiny (~10 KB gzipped each) and loaded once per
  session, then cached in memory (`cache: 'force-cache'` for HTTP cache,
  in-memory map for subsequent calls).
- Switching language is **DOM in-place** — no full reload, no flash.
- Arabic fonts are requested once during the initial font CSS load, but
  only **applied** when `body.lang-ar` is set, so non-Arabic visitors
  pay the connect cost only.
- The engine has zero dependencies, no virtual DOM, no observer loops —
  it walks `[data-i18n*]` exactly once per language change.

---

## 9. Conventions for translatable content

When you add new HTML, just tag it:

```html
<!-- plain text -->
<h2 data-i18n="section.title">English fallback</h2>

<!-- rich text with safe HTML (e.g. <strong>) -->
<p data-i18n-html="hero.desc_html">…</p>

<!-- attributes (semi-colon separated) -->
<img src="…" data-i18n-attr="alt:hero.image_alt;title:hero.image_title" alt="…">

<!-- arrays -->
<li data-i18n="problem.story_steps[0]">…</li>
```

Then add the matching key to `locales/en.json` and translate it in the
other locale files. The fallback English text inside the element is kept
as a no-JS / pre-paint default.
