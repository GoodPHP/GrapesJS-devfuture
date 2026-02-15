# GrapesJS DevFuture

Modernized GrapesJS preset UI with improved panel UX, vanilla JavaScript interactions, Bootstrap 5 local runtime, and custom signature workflow.

<p align="center">
	<img alt="RTE Ready" src="https://img.shields.io/badge/RTE-ScribeJS-blue?style=for-the-badge"/>
	<img alt="Signature Ready" src="https://img.shields.io/badge/Signature-AutographJS-4f46e5?style=for-the-badge"/>
	<img alt="Bootstrap 5.3.8" src="https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?style=for-the-badge"/>
	<img alt="Vanilla JS" src="https://img.shields.io/badge/Frontend-Vanilla%20JS-111827?style=for-the-badge"/>
</p>

<p align="center"><img src="https://devfuture.pro/wp-content/uploads/2020/03/editor-by-devfuture1.png" alt="GrapesJS DevFuture editor 2.0" width="900"/></p>

## Highlights

- Updated GrapesJS stack with pinned stable versions.
- Sidebar UX refresh (Blocks/Styles behavior, floating action controls).
- Vanilla JS event handling (no jQuery dependency in app logic).
- Local Bootstrap runtime (`assets/vendor/bootstrap/js/bootstrap.min.js`).
- Rich text support with ScribeJS plugin.
- Signature block in **Extra** category:
	- drag/drop placeholder,
	- double-click to open signature modal,
	- undo/redo/clear in modal,
	- save PNG to canvas component and Asset Manager.

## Changelog

### 2026-02-16

- Upgraded GrapesJS ecosystem to stable pinned versions.
- Migrated editor interactions from jQuery-style handlers to vanilla JavaScript.
- Updated UI runtime to local Bootstrap `5.3.8` bundle.
- Refined editor sidebars, panel toggles, search, and floating action controls.
- Added and configured **ScribeJS RTE** plugin for richer in-canvas text editing.
- Added **Signature** block in `Extra` with AutographJS-powered modal workflow.
- Implemented signature replacement history in modal (`Undo`/`Redo` between old and new sign).

### 2026-02-15

- Initial UI/UX modernization pass for panel layout and style manager sectors.
- Introduced command-based panel control architecture for cleaner behavior.

## Featured Integrations

### ScribeJS RTE Plugin (Rich Text Editing)

GJS: https://gjs.market/products/rte-scribejs-for-grapesjs-inline-toolbar

ScribeJS gives this preset a smoother authoring experience for content teams:

- clean inline editing directly inside the GrapesJS canvas,
- practical toolbar actions for common formatting,
- responsive toolbar behavior for different viewport sizes.

If you are building email/page templates where non-technical users edit text often, this integration is a strong productivity upgrade.

### AutographJS Signature Workflow

AutographJS powers a production-ready signature flow in the editor:

GitHub: https://github.com/GoodPHP/AutographJS

- add a Signature block from **Extra**,
- open the editor by double-clicking the block,
- draw, undo/redo, clear, and insert the final signature,
- automatically save PNG into both the canvas component and GrapesJS Asset Manager.

This makes it easy to prepare signed templates (contracts, forms, approvals) without leaving the builder.

## Pinned Frontend Dependencies

- `grapesjs@0.22.14`
- `grapesjs-blocks-basic@1.0.2`
- `grapesjs-navbar@1.0.2`
- `grapesjs-plugin-forms@2.0.6`
- `grapesjs-plugin-scribejs@1.0.28`
- `bootstrap@5.3.8` (local vendor files)
- `autographjs@1.0.1` (browser ESM import)

## Run Locally

This project is static HTML/CSS/JS.

1. Open `index.html` directly in the browser, **or**
2. Serve the folder with any local static server.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Project Links

- Demo: https://devfuture.pro/live/new-design-grapesjs/
- GJS.MARKET: https://gjs.market/authors/devfuture-development
- Website: https://devfuture.pro/
- Support: support@devfuture.pro
- AutographJS: https://autographjs.com/
- ScribeJS: https://scribejs.top/
## License

Licensed under **GNU General Public License v3.0**. See [LICENSE](LICENSE).