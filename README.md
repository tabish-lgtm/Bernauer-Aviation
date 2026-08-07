# Bernauer Aviation — WordPress Theme

A pixel-perfect, one-page WordPress theme built from the
[Figma design](https://www.figma.com/design/B94ikCWFFyGQ3qSvEnZ5Rl/Bernauer-Car-Upholstery?node-id=33-954)
for **Bernauer Aviation** (luxury aircraft interior upholstery).

The theme reproduces the desktop comp (1440px) exactly and reflows to the
Figma mobile comp (390px). It ships as a self-contained classic theme — no page
builder, no build step, no external requests.

## Installation

1. Zip the theme folder:
   ```bash
   cd bernauer-aviation && zip -r ../bernauer-aviation.zip . -x '.*'
   ```
   (or use the `dist/` zip if provided).
2. In WordPress: **Appearance → Themes → Add New → Upload Theme**, choose the
   zip, install and activate.
3. **Settings → Reading → Your homepage displays → A static page** (or leave as
   "Your latest posts"). The theme renders the full one-page layout on the front
   page via `front-page.php` (and `index.php` as a fallback), so it works either
   way.

## Editing content

Everything is editable in **Appearance → Customize** — no code required:

- **Bernauer Content** — hero title/description, contact title/description,
  phone numbers, email, address, map URL, copyright, footer links, and:
  - **Social links** — Instagram (`instagram.com/bernauer.design`) and Facebook
    (`facebook.com/bernauer.design`) are pre-filled; LinkedIn is optional.
  - **Craftsmen videos** — the strip ships with **five bundled clips**
    (`assets/videos/`: `process-1`, `process-3`, `panels`, `process-5`,
    `process-10`). Each of the five slots has a URL field that **overrides** the
    bundled clip with your own self-hosted file (`.mp4`/`.webm`) or a
    YouTube/Vimeo link. A play button plays the video inline; YouTube/Vimeo use
    click-to-load (no third-party requests until the visitor opts in). Upload an
    optional poster per slot under *Bernauer Images*; otherwise the video's
    first frame is used as the thumbnail.

### A note on the bundled videos & zip size

The five clips are ~61 MB, so the built theme zip is ~62 MB — larger than some
hosts' default WordPress upload limit. Options:

- Install via **SFTP/git** instead of the zip uploader, or raise
  `upload_max_filesize` / `post_max_size` on the server; **or**
- For production, upload the clips to the **Media Library**, paste their URLs
  into the five *Craftsmen video* fields, and delete `assets/videos/` to slim
  the theme.

(The bundled videos are H.264 MP4 and play in all modern browsers.)
- **Bernauer Images** — one upload control per image slot (see the map below).
  Empty slots show an on-palette SVG placeholder.

Real contact details are pre-filled as defaults:

- Phone: `+49 7742 927 88 30`, `+41 43 508 02 26`
- Email: `info@bernauer.design`
- Address: Weberstraße 10a, 79801 Hohentengen-Lienheim, Deutschland
- Map: linked to the Bernauer Design Google Maps location

## Image slots → Figma node map

| Slot key | Where | Figma node | Aspect |
|---|---|---|---|
| `hero` | Hero cabin | `33:975` | 1312×600 |
| `wwd_1`…`wwd_4` | What we do cards | `33:985/990/996/1001` | 644×424 |
| `projects_featured` | Projects feature | `33:1029` | 1312×600 |
| `materials_1`…`materials_4` | Material swatches | `33:1120/1123/1126/1129` | 344×400 |
| `gallery_1` | Gallery large | `33:1137` | 844×568 |
| `gallery_2` / `gallery_3` | Gallery stacked | `33:1139/1140` | 444×272 |
| `gallery_4` | Gallery full width | `33:1141` | 1312×568 |
| `craftsmen_1`…`craftsmen_3` | Craftsmen strip | `33:1147/1148/1154` | 1115×680 |
| `contact` | Footer image (fallback when no map embed) | `33:1174` | 574×543 |

The footer's right panel embeds a **Google Map** of the Bernauer Design
location by default (Customizer → *Bernauer Content* → *Map embed URL*). Clear
that field to fall back to the `contact` image slot instead.

## Design system

- **Type:** self-hosted **Geist** (400/500/600/700). The two footer
  contact-card labels use **Inter** (500/600) to match the comp exactly. Both
  are bundled as `woff2` under `assets/fonts/` — no Google Fonts / external
  requests.
- **Palette (CSS custom properties in `style.css`):** Zinc scale
  (`#09090b`…`#fafafa`), Stone (`#292524`, `#a6a09b`), dark accent `#28303f`.
- **Grid:** 1440 canvas · 1312 content · 64px gutters (20px on mobile).

## Structure

```
bernauer-aviation/
├── style.css               Theme header + all styles (tokens, sections, responsive)
├── functions.php           Theme setup + asset enqueue + includes
├── header.php / footer.php
├── front-page.php / index.php
├── inc/
│   ├── images.php          Image-slot system + placeholders + Customizer controls
│   └── customizer.php      Editable text / contact / social settings
├── template-parts/         One file per section
└── assets/
    ├── fonts/  images/  js/
```

## Notes on fidelity

- Photographic images are wired as editable WordPress slots because the Figma
  exports live on an egress-restricted host; drop the real exports in via the
  Customizer (or the WP Media Library) to complete the visuals.
- A few small vector glyphs (the logo mark, the Benefits feature icons, social
  icons) are re-authored as clean inline SVGs matched to the design, so they
  stay crisp at any resolution. Swap them if the exact Figma icon set is
  provided.

## Local preview (developers)

`/.preview/` contains a tiny WordPress-function shim to render the front page as
static HTML for visual QA (not shipped in the theme):

```bash
php -S 127.0.0.1:8899 -t .
# open http://127.0.0.1:8899/.preview/render.php
```
