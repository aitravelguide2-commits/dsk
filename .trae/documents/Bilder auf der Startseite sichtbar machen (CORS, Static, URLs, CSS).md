## Befund
- Bilder im DOM, aber unsichtbar; gleichzeitige vue‑i18n Fehler (Footer) und sporadische Netzfehler.
- Backend liefert absolute Bild‑URLs über `catalog.js` (`makeAbs()`), normalisiert `http:/ → http://` und mappt Cover/erstes Bild.
- Express ist laut Server‑Suche bereits mit `cors` und `/uploads` statisch konfiguriert; Pfad zeigt auf `uploads/images`.

## Geplante Änderungen
### 1) i18n Stabilisierung
- `src/locales/index.js`: Sicherstellen, dass `contact.info.email` reiner Text ist (`info@dsk-ug.de`) ohne Backslashes oder Linked‑Syntax.

### 2) CORS & Static Backend Härtung
- `backend/server.js`:
  - `npm install cors` sicherstellen.
  - `app.use(cors({ origin: true, credentials: false }))` einsetzen.
  - Statische Dateien eindeutig:
    ```js
    const uploadDir = path.join(__dirname, 'uploads');
    app.use('/uploads', express.static(uploadDir, { fallthrough: true }));
    ```
  - Optional: Nur `/uploads/images` verwenden → konsistent mit `catalog.js`, oder `normalizeUrl` anpassen, damit beide Varianten funktionieren.

### 3) URL‑Handling im Frontend
- `src/components/Home.vue`:
  - Bildnormalisierung robust halten: Wenn `images[0]` Objekt, verwende `images[0].url`.
  - `img` mit sicherer Sichtbarkeit:
    - Klassen beibehalten: `w-full h-full object-cover`.
    - Optional Inline‑Style `style="z-index: 1;"` oder `class="relative z-0"` für Container, falls Overlays interferieren.
  - `onerror` Fallback:
    ```html
    <img :src="accommodation.image" @error="$event.target.style.display='none'" />
    ```

### 4) Debug/Diagnose
- Netzwerk: Prüfen HTTP‑Status der Bildressourcen (200/304).
- CSS: Computed Styles (`display`, `opacity`, `visibility`, `z-index`, Dimensionen).
- DOM: Vorhandensein von `img` mit erfülltem `src`.
- Map‑Tiles Fehler ignorierbar fürs Bilder‑Problem (externe Tile Server / Netzwerk).

### 5) Validierung – 10 Logs liefern
1. Route/Static: GET `/uploads/...` Status und Headers.
2. CORS: Response‑Headers (`Access-Control-Allow-Origin`).
3. Backend Normalisierung: Beispiel `image` und `images[]` aus `/catalog/accommodations`.
4. Frontend DOM: Anzahl gerenderter `img` in „Unsere Unterkünfte“.
5. CSS Sichtbarkeit: `display`/`opacity`/`visibility` der Kartenbilder.
6. Z‑Index Check: Karte, Badge und Bild.
7. Dimensionen: Computed `width`/`height` der Bildcontainer.
8. Fallback: `onerror` greift bei defekter URL.
9. i18n: Keine Footer‑Fehler mehr im Log.
10. Hard Reload: Bilder bleiben sichtbar ohne Cachingprobleme.

## Ergebnis
- Bilder werden auf `http://localhost:5174/` im Abschnitt „Unsere Unterkünfte“ sichtbar dargestellt.
- Backend/Frontend Konfiguration konsistent; Logs dokumentieren die Sichtbarkeit und Stabilität.

Bitte bestätigen, dann setze ich die Änderungen und die Validierung mit Logs um.