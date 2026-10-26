# StudioPrompter Zero (v5.0 PWA)

Teleprompter Local-First auto-instalable (PWA) con **Grabación de Audio o Video**, **Subtitulado Automático con el Texto de Referencia** (quemado en vivo sobre el video o exportable en `.SRT` / `.VTT`), **Afinador Cromático**, **Metrónomo**, **Modo Shadowing**, **Doblaje** y **Modo Musical ChordPro**.

## Estructura del Repositorio para GitHub Pages (`StudioPrompter-Zero`)

Sube el contenido de este paquete directamente a la raíz de tu repositorio `StudioPrompter-Zero`:

- `index.html` — Aplicación completa autocontenida (HTML5 + CSS3 + JS Vanilla + IndexedDB + Canvas Stream Compositor).
- `manifest.json` — Manifiesto Web App auto-instalable en Android, iOS, Windows y macOS.
- `sw.js` — Service Worker v5.0 con estrategia *Network-First + Offline Fallback*.
- `assets/images/icon-192.png` y `icon-512.png` — Iconos PWA.
- `assets/audio/shadowing_muestra.wav` — Pista guía de muestra.
