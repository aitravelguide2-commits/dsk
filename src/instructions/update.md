# PRD & KI-Prompt für Trae IDE: Unterkunfts-Admin (/accommodations/new)

**Ziel:**
Dieses Dokument beschreibt funktionale Anforderungen, UX-Verbesserungen und die genaue KI-Integration (DeepSeek) für das Admin-Frontend der Unterkunftsverwaltung (`http://localhost:5175/accommodations/new`). Es enthält zusätzlich ausführliche, direkt verwendbare Prompt-Vorlagen und ein erwartetes JSON-Output-Schema für die KI.

---

## 1. Zusammenfassung (Kurzversion)

* **Automatische Bezirksbestimmung**: Sobald eine Postleitzahl eingegeben wird (nur Leipzig & Chemnitz), liefert die KI den Bezirk (Zentrum, Nord, Ost, Süd).
* **Bilderbereich**: Vergrößertes Upload-Feld, Drag-&-Drop-Sortierung, Bild-Vorschau, Cover/Titelbild auswählbar, Bildanzahlbegrenzung, responsive Grid.
* **Moderner interaktiver Kalender**: Zeitraum sperren → Termine durchgestrichen/rot; frei → grün; moderne UI-Komponenten, barrierefrei und mobilfreundlich.
* **Feld *Anbindung***: KI-generierte Kontextbeschreibung (mittels DeepSeek API). Ergebnis soll variabel sein, nicht immer derselbe Satz — Kontext: {Bezirk}, Adresse und echte POI-Checks (wenn verfügbar).

---

## 2. Ziele & Nutzen

* **Erhöhte Datenqualität**: Genauere Bezirkszuordnung reduziert manuelle Arbeit.
* **Verbesserte UX**: Besseres Bilder-Management & moderner Kalender erhöhen Conversion und Admin-Effizienz.
* **Automatisierte, kontext-sensitive Beschreibungen**: Schnellere Inseraterstellung, präzisere Informationen für Gäste.

---

## 3. Funktionale Anforderungen


### 3.2 Bilderbereich (Upload UI)

**Anforderungen:**

* Größeres Upload-Fenster (sichtbare Grid-Vorschau 4 Spalten auf Desktop, 2 auf Mobile).
* Unterstütze Drag-&-Drop Upload + Multi-Select.
* Nach Upload: Bilder als Karten/Thumbnails anzeigen mit folgenden Controls:

  * Drag-Handle zum Sortieren (Reihenfolge speichern als `images.order`).
  * Auswahl-Button für Titelbild / Cover (genau 1 Cover-Flag pro Unterkunft).
  * Inline-Bearbeiten: Caption/Titel-Feld pro Bild.
  * Lösch-Button + Bestätigungsmodal.
* Bildgrößen und Thumbnails: Client-side Generierung von Vorschaubildern, serverseitig speichern und optimieren.
* Limitierung: max 30 Bilder, max 10MB pro Bild; Bildformate `jpg|jpeg|png|webp`.

**UI/Design-Vorschläge:**

* Verwende ein responsives Grid mit vergrößertem Bereich (min-height 300–420px beim Upload-Container).
* Zeige beim Hover Lupe/Preview in größerem Modal.
* Biete `Sort by drag` & `Auto-arrange` Optionen.

**Akzeptanzkriterien:**

* Admin kann Bildreihenfolge ändern und Cover auswählen; Reihenfolge persistiert beim Speichern.
* Thumbnails laden in < 300ms (bei getesteter Bandbreite) – Client/Server-Optimierungen sind erforderlich.

---

### 3.3 Kalender (Interaktivität & Modernisierung)

**Anforderungen:**

* Modernes Look & Feel (z. B. react-day-picker / FullCalendar / react-date-range / shadcn/ui-komponenten mit Tailwind).
* Zwei Farben: **grün** für verfügbare Tage, **rot durchgestrichen** für gesperrte Tage.
* Aktion `Zeitraum sperren`: Wählt man mehrere Tage, sollen diese im Kalender-UI visuell *durchgestrichen* und in Rot markiert werden. Normalzustand: grün.
* Sperrungen als intervalle (start,end) speichern; UI zeigt bestehende Sperrungen.
* Accessibility: ARIA-Labels, Keyboard-Navigation, Screen-Reader-Kompatibilität.

**Interaktion:**

* Auswahlmodus: `Freigeben` oder `Sperren`.
* Im Sperr-Modus: Klick & Drag oder Date-Range-Selector um Zeitraum zu wählen.
* Tooltip/Legend erklärt Farben und Strikethrough.

**Akzeptanzkriterien:**

* Admin kann Intervalle sperren/entsperren.
* Gesperrte Tage sind visuell durchgestrichen und rot; andere grün.
* Änderungen werden korrekt als intervals saved und bei Seiten-Neuladen gespiegelt.

---

### 3.4 Feld "Anbindung" (KI-Generierung)

**Anforderungen:**

* Button: `Mit KI Beschreibung generieren`.
* Nutzung der DeepSeek API (API-Key vorhanden) zur Generierung einer anpassbaren, lokalen Beschreibung.
* Die KI-Beschreibung soll kontextsensitiv sein: **Adresse, Bezirk, eventuelle POIs (optional)** und Ausstattung.
* Vermeide statische, generische Standard-Sätze. Die KI muss variieren und spezifische Hinweise einbauen (z. B. konkrete ÖPNV-Linien wenn verfügbar, Gehminuten zu Bahnhof/Einkauf).

**Output JSON-Schema (erwartet):**

```json
{
  "anbindung_description": "string",
  "bullet_points": ["string"],
  "amenities": ["wifi","kitchen","parking",...],
  "confidence": 0.0-1.0
}
```

**Akzeptanzkriterien:**

* Der Button ruft DeepSeek auf; Ergebnis schreibt ins Feld `Anbindung` und in ein `history`-Log.
* Wenn API nicht verfügbar oder low confidence (<0.6), zeige Fallback-Text + Empfehlung zur manuellen Ergänzung.

---

## 4. KI-Integration: Detaillierte Prompt + API-Spezifikation

### 4.1 Allgemeine Richtlinien für Prompts

* Verwende festen JSON-Output (kein Freitext), damit die UI das Ergebnis direkt parsen kann.
* Begrenze Längen (z. B. `anbindung_description` max 300–400 Zeichen).
* Liefere zusätzlich `confidence` und `explain` (kurze Begründung), damit Admin nachvollziehen kann, warum die KI so antwortete.

### 4.2 Prompt für Bezirksbestimmung (Postleitzahl)

**System / Instruction (Kurz):**

```
Du bist ein präziser Geokodierungs-Assistent, spezialisiert auf Postleitzahlen in Leipzig und Chemnitz. Deine Aufgabe ist es, einer gegebenen deutschen Postleitzahl exakt einen Bezirk zuzuordnen: "Zentrum", "Nord", "Ost", oder "Süd". Antworte ausschließlich JSON gemäß Schema.
```

**User / Input Template:**

```
{"task":"get_district","postal_code":"04103","city":"Leipzig"}
```

**Expected JSON Response Schema:**

```json
{
  "district":"Zentrum",
  "confidence":0.95,
  "method":"mapping|deepseek",
  "note":"optional text if ambiguous"
}
```

### 4.3 Prompt für Feld "Anbinding" (Beschreibung)

**System / Instruction (Kurz):**

```
Du bist ein lokaler City-Guide-Generator (Deutsch). Erzeuge für eine Unterkunft eine prägnante "Anbindung"-Beschreibung basierend auf: {FirmaName}, {Adresse}, {Bezirk}, {Amenities[]}. Nutze wenn möglich lokale Bezüge (z. B. ÖPNV-Haltestellen, Gehminuten-Angaben), ansonsten allgemeine, aber variierende Formulierungen. Antworte ausschließlich JSON nach Schema. Max 300 Zeichen in `anbindung_description`.
```

**User / Input Template:**

```
{
 "task":"generate_anbindung",
 "name": "Hofmann Personal | Zeitarbeit in Chemnitz",
 "address": "Börnichsgasse 1, Chemnitz",
 "district": "Zentrum",
 "amenities": ["wifi","kitchen","parking","bathroom","tv","laundry","balcony"]
}
```

**Expected JSON Response Schema:**

```json
{
  "anbindung_description":"string (max 300 chars)",
  "bullet_points":["ÖPNV: Bus 1 (5 min Fußweg)","Einkauf: Supermarkt 3 min"],
  "amenities":[...],
  "confidence":0.0-1.0,
  "explain":"kurze erklärung, wie die info entstanden ist"
}
```

**Beispielantwort (gute Variation):**

```json
{
  "anbindung_description":"Gute Anbindung im Zentrum von Chemnitz: Buslinien in 3–5 Minuten erreichbar. Einkaufsmöglichkeiten und Gastronomie fußläufig. Parkmöglichkeiten in der Nähe. Ausstattung: WLAN, Küche, TV, Waschmaschine.",
  "bullet_points":["Bus 3: 4 Min Fußweg","Supermarkt: 2 Min"],
  "amenities":["wifi","kitchen","parking","bathroom","tv","laundry"],
  "confidence":0.87,
  "explain":"Basierend auf Bezirkslage (Zentrum) und üblicher Infrastruktur in zentralen Lagen; keine konkreten POI-Daten geliefert."
}
```

---

## 5. API-Request & Response: DeepSeek Integration (Beispiel)

**Request (POST)**

```
POST https://api.deepseek.example/v1/generate
Headers: { Authorization: "Bearer <API_KEY>", "Content-Type": "application/json" }
Body: {
  "model": "deepseek-city-1",
  "input": { ... (siehe Input Template oben) },
  "response_format": "json",
  "max_tokens": 400,
  "temperature": 0.2
}
```

**Response (200)**

* JSON entsprechend Schema in Kapitel 4.2 / 4.3.

**Fehlerbehandlung:**

* 429 → Rate-Limit: Implementiere Exponential Backoff.
* 5xx → Retry bis zu 3x dann Fallback zu local mapping oder Standardtext.
* Wenn `confidence < 0.6` → Markiere KI-Antwort als "unsicher" und zeige Warnhinweis im UI.

---

## 6. UI / UX Details & Wireframe-Notes

### 6.1 PLZ Feld

* Inline-Icon `map-pin`; nach PLZ-Eingabe erscheint rechts ein kleines Badge: `Bezirk: Zentrum (98%)` mit Edit-Icon.
* Tooltip: "Ermittelt automatisch basierend auf PLZ; manuell änderbar."

### 6.2 Bild-Upload

* Upload-Container: `min-height: 360px`.
* Grid: `grid-template-columns: repeat(auto-fit, minmax(120px, 1fr))`.
* Jeder Thumbnail-Karte: Cover-Checkbox (Stern), Drag-Handle (≡), Caption-Input.

### 6.3 Kalender

* Legende oben links: grüner Punkt = verfügbar, rotes durchgestrichen = gesperrt.
* Optionen oben rechts: `Freigeben | Sperren | Löschen aller Sperrungen`
* OnHover: Tooltip mit Zeitraum & Grund (optional).

---

## 7. Datenmodelländerungen (Backend)

* `accommodations` table:

  * `district: string` (nullable)
  * `images: [{ url, order, title, isCover }]` (JSON)
  * `blockedPeriods: [{ start: date, end: date, reason?: string }]` (JSON)
  * `anbindung: { description, bullets[], amenities[], confidence, generatedAt }` (JSON)

---

## 8. Sicherheit & Datenschutz

* Keine personenbezogenen Daten an externe KI senden (z. B. Mieternamen). Nur Adresse/PLZ und öffentliche POI-Daten.
* API-Keys in Secrets/Env; keinesfalls im Client hardcoden.
* Logging: speichere nur Erfolg/Fehler und confidence, nicht automatisch die vollen Prompt-Inhalte (falls sensibel).

---

## 9. Akzeptanztests & Beispiele

* **Test 1 (PLZ → Bezirk):** Input `04103` (Leipzig) → `Zentrum`.
* **Test 2 (Bildreihenfolge):** Upload 6 Bilder, sortiere, setze Cover → Speichern → Reihenfolge & Cover bleiben.
* **Test 3 (Kalender Sperren):** Sperre 2025-12-24 bis 2025-12-26 → Tage rot/durchgestrichen im UI; DB speichert interval.
* **Test 4 (Anbindung):** Button `Mit KI Beschreibung generieren` liefert variierenden Text entsprechend Bezirk; wenn API down → Fallbacktext.

---

## 10. Zeitplanung & Milestones (Vorschlag)

1. Woche: Mapping-Tabelle + PLZ UI + Unit-Tests
2. Woche: Bilderbereich-UI + Backend-Speicherung
3. Woche: Moderner Kalender + Interaktivität
4. Woche: DeepSeek-Integration + Prompts + QA

---

## 11. Ready-to-use KI-Prompts (Kopierbar)

### Prompt A — Bezirksbestimmung (Payload)

```
SYSTEM:
Du bist ein präziser Geokodierungs-Assistent spezialisiert auf Leipzig und Chemnitz. Antworte nur mit JSON.

USER:
{"task":"get_district","postal_code":"{{postal_code}}","city":"{{city}}"}

CONSTRAINTS:
- city ist entweder "Leipzig" oder "Chemnitz"
- Output-Schema: {"district":"Zentrum|Nord|Ost|Süd","confidence":0.0-1.0,"method":"mapping|deepseek","note":"optional"}
```

### Prompt B — Anbindung Beschreibung

```
SYSTEM:
Du bist ein lokaler City-Guide-Generator (Deutsch). Output format JSON.

USER:
{
 "task":"generate_anbindung",
 "name":"{{name}}",
 "address":"{{address}}",
 "district":"{{district}}",
 "amenities":{{amenities_array}}
}

CONSTRAINTS:
- `anbindung_description` max 300 Zeichen
- `bullet_points` max 5
- Provide `confidence` and short `explain`.
- Answer only in JSON.
```

---

## 12. Beispiel-Responses

* siehe Kapitel 4.3 (oben)

---

## 13. Offene Fragen / Entscheidungen

* Sollen konkrete POIs (Haltestellen, Supermärkte) über eine zusätzliche POI-API (z. B. Overpass/OSM) ergänzt werden? (Empfohlen für bessere Genauigkeit)
* Soll die PLZ-Mapping-Datei serverseitig verwaltet oder im Client cached werden?

---

## 14. Nächste Schritte

1. Absegnen des PRD durch Produktverantwortlichen.
2. Erstellung der PLZ-Mapping-Datei (Initialversion durch Entwickler).
3. Implementierung Bild-Upload & Sortierung (UI + Backend-Speicher).
4. Kalender-Upgrade.
5. DeepSeek-Prompt-Testing & Rate-Limit-Handling.

---

*Dokument erstellt für Trae IDE – bereit zur Iteration.*
