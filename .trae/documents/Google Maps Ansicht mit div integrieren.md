## Ziel
Eine Vue-Ansicht/Komponente, die eine interaktive OpenStreetMap-Karte in einem `div` rendert, inklusive Geolocation, Marker/Popup, Zoom/Pan, Responsiveness und korrekter Attribution, ohne zusätzliche neue Abhängigkeiten (Leaflet ist bereits im Projekt vorhanden).

## Architektur
- Quelle: OpenStreetMap Tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) mit zwingender Attribution (OSM + Leaflet).
- Rendering: Leaflet (bereits installiert) innerhalb eines responsiven `div`.
- Optionen:
  - Reuse der bestehenden `InteractiveMap.vue` (Props: `center`, `zoom`, `height`, `markers`) und Erweiterung um Geolocation + InfoPopup.
  - Alternativ neue Komponente `OSMMap.vue` mit identischer API.

## Funktionsumfang
- Positionsbestimmung:
  - Browser-Geolocation (`navigator.geolocation`) optional aktivierbar (Prop `useBrowserGeolocation`).
  - Feste Koordinaten als Fallback über Prop `center` (Lat/Lng).
- Marker & Info:
  - Ein Marker mit optionalem `title`/`content`; öffnet Popup beim Klick.
  - Mehrere Marker via Array.
- Interaktionen:
  - Zoom-Controls, Scroll-Zoom, Dragging; mobile Touch-Gesten aktiv.
- Responsiveness:
  - `div`-Container mit `width: 100%` und `height`-Prop (Default 320px); CSS-Media-Queries für kleinere Screens.
  - Resize-Observer, um Karte bei Containergrößenänderung sauber neu zu berechnen.

## Datenschutz & Nutzungsbedingungen
- Geolocation nur mit Nutzerzustimmung; keine Speicherung personenbezogener Koordinaten.
- OSM Tile Usage Policy respektieren; Anfragen moderat halten.
- Attribution-Overlay sichtbar halten (Leaflet Standard + OSM-Credit).

## Tests
- Unit-Tests (Vitest/JSDOM):
  - Loader/Initialisierung, Prop-Handlings, Marker-Erstellung, Geolocation-Fallback (gemockt).
- Cross-Browser manuell: Chrome/Edge/Firefox, mobile Safari/Android.
- Performance: Initialisierung unter 500ms nach Komponentenmount (ohne externe Blocker); Lazy-Init nur bei Sichtbarkeit via IntersectionObserver.

## Implementierungsschritte
1) Variante wählen: Bestehende `InteractiveMap.vue` reusen und um Props `useBrowserGeolocation`, `onLocationResolved`, `onError`, `markers`-Popup-Content erweitern.
2) Map-Initiierung: OSM Tile Layer + Attribution setzen; Zoom-Controls aktivieren.
3) Geolocation-Flow: Bei Zustimmung → `map.setView` + Marker aktualisieren; bei Fehler → Fallback-Center + Fehler-Event.
4) Marker/Popup: Erstellung mit übergebenem Inhalt; Klick-Listener.
5) Responsives CSS: Container-Höhe via Prop; Media-Query für sehr kleine Bildschirme.
6) A11y: `aria-label`, Tastaturfokus, ausreichende Kontraste.
7) Tests: Unit-Tests für Props/Events; QA mit realen Browsern.
8) Einbindung: Beispiel in `AccommodationDetail.vue` oder eigene Demo-Route `/osm-demo` zur Prüfung.

Bitte bestätigen Sie die OSM-Variante und ob wir die bestehende `InteractiveMap.vue` erweitern oder eine neue Komponente `OSMMap.vue` erstellen sollen. Danach setze ich die Umsetzung inklusive Tests um.