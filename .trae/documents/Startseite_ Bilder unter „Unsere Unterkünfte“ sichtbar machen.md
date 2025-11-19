## Befund
- Die Bilder sind im DOM vorhanden, werden aber nicht sichtbar. Wahrscheinliche Ursachen:
  1) i18n-Fehler durch `contact.info.email` mit `info\@dsk-ug.de` führt zu Runtime-Exceptions (Footer.vue) und stört Renderpfad.
  2) Bild-Normalisierung in `loadFeatured()` setzt `image` aus `images[0]`; bei abweichender Struktur muss `url` berücksichtigt werden.
  3) CSS/Container sind korrekt dimensioniert (`h-32 ...`, `w-full h-full object-cover`), Z-Index der Preis-Badge liegt nicht über dem Bildinhalt.

## Geplante Korrekturen
1. locales: `contact.info.email` auf einen harmlosen String ohne Backslash setzen: `info@dsk-ug.de`.
2. Home.vue: Bild-Normalisierung robust machen:
   - nur überschreiben wenn `image` fehlt,
   - aus `images[0]` den String oder `url` extrahieren,
   - leere Werte vermeiden.
3. Sicherheit: Keine Änderungen an Z-Index nötig; aber Computed Styles und Dimensionen prüfen.

## Technische Änderungen
- Datei `src/locales/index.js`:
  - `email: 'info@dsk-ug.de'` statt `email: 'info\\@dsk-ug.de'`.
- Datei `src/components/Home.vue` in `loadFeatured()`:
  - `if (!a.image && Array.isArray(a.images) && a.images.length > 0) { a.image = (typeof a.images[0] === 'string' ? a.images[0] : (a.images[0]?.url || '')) }`

## Verifikation – 10 Logs
1. DOM-Check: `img[src]` vorhanden für jede Karte.
2. Network-Check: HTTP-Status der Bild-URLs (200/304) und korrekte `Content-Type`.
3. CSS-Check: `display`, `opacity`, `visibility` der Karten und Bilder.
4. Z-Index-Check: Preis-Badge/Z-Index und eventuelle Overlays über dem Bild.
5. Dimensions-Check: Computed `width`/`height` und Container-Höhen > 0.
6. Overflow-Check: kein `overflow: hidden` in einem Elternteil, das das Bild außerhalb des Sichtbereichs hält.
7. i18n-Check: Keine `Message compilation error` mehr; Footer rendert korrekt.
8. Daten-Check: `image` Feld nach Normalisierung gefüllt; kein `[object Object]`.
9. Fallback-Check: Platzhalter greift nur, wenn wirklich kein Bild vorhanden.
10. Cache-Check: Hard-Reload ohne Caching-Anomalien; Bilder werden sichtbar.

## Ergebnis
- Bilder werden sichtbar gerendert; i18n-Fehler beseitigt; Karten zeigen korrekte Bildquellen. Nach Freigabe setze ich die Änderungen um und liefere die 10 Logs für Validierung.