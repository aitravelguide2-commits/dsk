# Cookie-Bereich (DSGVO) – Implementierte Lösung

## Übersicht

- Opt‑in für nicht-essenzielle Cookies (Funktional, Statistik)
- Übersichtlich kategorisiert: `Notwendig` (fix), `Funktional`, `Statistik`
- Änderung der Einstellungen jederzeit über `Footer → Cookie‑Einstellungen`
- Transparente Variablenanzeige inkl. technischer Details
- Responsiv (Mobile/Tablet/Desktop) und barrierearm gemäß WCAG 2.1

## Technische Umsetzung

- Komponente: `src/components/CookieBanner.vue`
- Speicherung: `localStorage['cookieConsent']` mit Schema `{ essential, functional, analytics, updatedAt }`
- Ereignis: `window` dispatcht `cookie-consent-updated` mit `detail` = aktuelle Consent‑Werte
- Mehrsprachigkeit: neue Keys unter `messages.<lang>.cookie.*` und `messages.<lang>.footer.cookieSettings` (`src/locales/index.js`)
- Zugriff: Banner bei fehlender Einwilligung, Modal über Banner oder Footer

## Barrierefreiheit (WCAG 2.1)

- Modal mit `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- ESC schließt Modal, initialer Fokus im Dialog, beschriftete Checkboxen
- Textklarheit und ausreichender Kontrast der Schaltflächen

## Variablenanzeige

- Zusammenfassung: ausgewählte Kategorien, `updatedAt`
- Technische Details (umschaltbar): Speicher‑Schlüssel (`cookieConsent`) und Roh‑JSON

## Erfolgskriterien (Mapping)

- DSGVO Opt‑in: Standard nur `Notwendig`; optional erst nach Zustimmung
- Intuitive Bedienbarkeit: klare Texte, eindeutige Buttons, Footer‑Einstieg
- Technisch einwandfrei: persistente Speicherung, Ereignis für Gating, responsive Layout
- Nachvollziehbarkeit: strukturierte Anzeige und technische Details sichtbar

## Testprotokoll

1. Erster Besuch ohne Einwilligung
   - Erwartet: Banner sichtbar, Kategorien erklärt, Buttons funktionieren
2. „Alle akzeptieren“
   - Erwartet: `functional=true`, `analytics=true`, `updatedAt` gesetzt; Banner/Modal schließen; Event gesendet
3. „Nur notwendige“
   - Erwartet: `functional=false`, `analytics=false`, `updatedAt` gesetzt; Event gesendet
4. „Einstellungen“ öffnen → Auswahl ändern → „Auswahl speichern“
   - Erwartet: Werte aktualisiert; Persistenz in `localStorage['cookieConsent']`
5. Footer → „Cookie‑Einstellungen“
   - Erwartet: Modal öffnet jederzeit; aktuelle Auswahl wird angezeigt
6. Variablenanzeige
   - Erwartet: Ausgewählte Kategorien und `updatedAt` sichtbar; Toggle zeigt `storageKey` und Roh‑JSON
7. Tastaturbedienung
   - Erwartet: Fokus im Modal, ESC schließt, Checkboxen über Labels erreichbar
8. Responsivität
   - Erwartet: Layout straff auf Smartphone, Tablet und Desktop

## Hinweise für Entwickler

- Optionales Skript‑Gating: auf `cookie-consent-updated` lauschen und externe Skripte nur bei `analytics/functional=true` laden
- Einwilligung mit Zeitstempel dokumentiert (`updatedAt`)