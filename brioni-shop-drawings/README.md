# Brioni Granite: Shop Drawings prototype

A clickable, high-fidelity prototype of a simple countertop shop-drawing tool.
It replaces the ERP's dark, five-step CAD-style flow (Draw → Slab layout →
Vein match → 3D view → Review) with three calm, light steps:

| Step | Replaces | What you do |
| --- | --- | --- |
| **1 Draw** | Draw | Size, shape, edges, backsplash and cut-outs on one screen, with a live dimensioned drawing |
| **2 Slab** | Slab layout + Vein match | Nothing: pieces are seamed and nested automatically. Optionally pick a standard or jumbo slab |
| **3 Review** | 3D view + Review | Check the shop drawing or a 3D preview, see the estimate, download the PDF, send for approval |

The visual language is light and quiet: white surfaces, black pill buttons
and soft grey segmented controls, in the spirit of ElevenLabs.

All data is mocked locally. There is no backend.

## Run it

```bash
cd brioni-shop-drawings
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run build:single   # one self-contained file: dist-single/index.html
```

`build:single` inlines all the JS, CSS and fonts into a single HTML file
(~900 KB) that you can email or open straight from disk. It works offline.

## Stack

React 19 + TypeScript + Vite, Tailwind CSS v4, shadcn/ui (Radix, neutral theme
with a stone-blue accent), lucide-react icons, and the drawing is plain inline SVG.

### shadcn/ui components used

The component source is already in `src/components/ui/`. To regenerate it from
the registry:

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label select tabs dialog badge separator tooltip toggle toggle-group table switch
```

## File structure

```
src/
  App.tsx                      Quote list ⇄ workspace routing, mock "database" in state
  data/mock.ts                 5 quotes, 2 with pre-built drawings (rectangle + L-shape)
  lib/
    types.ts                   Drawing, Cutout, Quote… (all lengths stored in inches)
    catalog.ts                 Materials, edge profiles, cut-out defaults, slab limit
    units.ts                   ⅛" fractions, mm, and forgiving input parsing ("25 1/2", "25½")
    geometry.ts                Outline, edges, cut-out placement, clearances
    validation.ts              Friendly warnings (off the stone, overlap, < 2" stone, slab size)
    slab.ts                    Auto seams (kept 3" from cut-outs) and guillotine nesting onto slabs
    pricing.ts                 Mock estimate: material, fabrication, edges, cut-outs, seams
    drawing.ts                 Defaults and smart placement of new cut-outs
  components/
    QuoteTable.tsx             Home: searchable quote table
    NewDrawingDialog.tsx       Start a new quote + drawing
    DimensionInput.tsx         Length field (inches/fractions or mm) with helper text
    icons.tsx                  Shape, edge-profile and cut-out pictograms
    workspace/
      Workspace.tsx            Top bar, 3-step navigation, responsive layout, print sheet
      SlabStep.tsx             Step 2: automatic slab layout with yield and seams
      ReviewStep.tsx           Step 3: drawing / 3D preview, estimate, PDF
      IsoPreview.tsx           Lightweight 3D (isometric SVG) preview with cabinets
    StoneTexture.tsx           SVG filter for marble veins, granite flecks, quartz clouding
      PieceForm.tsx            Left panel: piece details
      EdgeSelector.tsx         Tap-an-edge visual picker with profile cross-sections
      DrawingCanvas.tsx        Live SVG drawing: dimensions, edges, cut-outs, title block, drag
      CutoutPanel.tsx          Right panel: cut-out list
      CutoutDialog.tsx         Add/edit a cut-out with a live check
      IssueList.tsx            Inline, non-blocking alerts
      ApprovalDialog.tsx       Send for approval → Approved
      CutoutSchedule.tsx       Print-only schedule of cut-outs and edges
```

## Behaviour notes

- **Units:** everything is stored in inches. The in/mm toggle only changes what
  you see and type. Inches round to ⅛".
- **Cut-out position:** "from left" goes to the cut-out's left side, and "from
  front" goes to its front side, measured from the front edge directly in
  front of it. On an L-shape's return, that is the end of the return.
- **Drawing offsets:** the drawing dimensions each cut-out from whichever edge
  has a clear line (left or right, front or back), so lines never cross
  another cut-out.
- **Download PDF** opens the browser print dialog with a print-ready landscape
  sheet: the drawing, the title block, and a cut-out and edge schedule.
- **Save draft** sets the quote to *Drawing ready*. **Send for approval** sets
  it to *Approved*. Editing and saving an approved drawing returns it to
  *Drawing ready*.
