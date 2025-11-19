1. Vision & Business Goals

Kurzfristig: Kunden können unverbindlich anfragen → höhere Conversion (viele scheuen direkte Buchung/Zahlung)
Mittelfristig: Alle Anfragen zentral im Admin → schnelleres Antworten → bessere Kundenzufriedenheit → mehr Buchungen
Langfristig: Basis für echte Buchungen + Zahlung + Kalender-Sync legen

Primäre KPIs nach Launch:

Anzahl Buchungsanfragen pro Woche
-Conversion-Rate Anfrage → bestätigte Buchung
Durchschnittliche Antwortzeit des Admins

2. Scope-Detail





























In ScopeOut of Scope (Phase 1)Komplettes Anfrage-Formular im Kunden-FrontendDirekte Speicherung + Echtzeit-Push ins AdminVollständige Admin-Liste + Detail + Status-WorkflowAutomatische Antwort-Emails an Kunden (kann manuell per Copy-Paste)Komplett neues Dashboard mit Charts & Live-UpdatesKalender-Blockierung bei AnfrageDarkmode, Responsive, Barrierefreiheit (WCAG AA)Mehrsprachigkeit (außer DE)Rate-Limiting & Spam-SchutzGästekonten / Login
3. Detaillierte User Personas

Kunde „Urlauber Max“ (30–45, Familie, bucht spontan über Handy)
Admin „Vermieter Anna“ (40–60, checkt Dashboard 3–5× täglich am Laptop)

4. Komplettes Formular-Flow (Kunden-Frontend)
Seite: /unterkunft/[slug]

Hero-Bereich mit Fotos, Preis, Bewertungen
Großer CTA-Button „Verfügbarkeit anfragen“ (farbig, fixed am unteren Rand auf Mobile)
Klick → Modal (90 % Breite auf Mobile, zentriertes Modal auf Desktop)
Formular in logischen Blöcken:

Block 1 – Reisedaten (immer sichtbar)

Check-in (Datepicker, min=today+1, disabled dates = schon gebucht – falls Kalender schon da ist)
Check-out (automatisch min=check-in+1)
Erwachsene (Counter 1–10, Default 2)
Kinder (Counter 0–10, Default 0)
Live-Preis-Berechnung: „X Nächte × Y € = Z €“ (fett, grün)

Block 2 – Deine Daten (erscheint nach Auswahl der Daten)

Vorname, Nachname (2 Spalten auf Desktop)
E-Mail
Telefon (optional, aber mit Flagge + Ländercodes)
Nachricht an uns (Textarea, Placeholder „Haben Sie Haustiere? Brauchen Sie ein Kinderbett?…“)

Block 3 – Zusammenfassung (vor Absenden)

Unterkunft: „Traumhaus am See“
Datum: 15.–20. Juli 2026 · 5 Nächte
Gäste: 2 Erwachsene, 1 Kind
Preis: 1.250 €
Checkbox Datenschutz „Ich akzeptiere die DSGVO-Bedingungen“ (Pflicht)

Button „Kostenlos & unverbindlich anfragen“ (disabled bis Checkbox)
Nach Absenden

Lade-Spinner → Success-Overlay im Modal: „Vielen Dank! Wir melden uns innerhalb von 24 h bei Ihnen.“
Button „Weitere Unterkünfte ansehen“ + „Zurück zur Unterkunft“
Optional: Bestätigungs-E-Mail an Kunden (Template siehe unten)

5. Error Handling & Validation (sehr wichtig!)
Client-seitig (React Hook Form + Zod)

Check-out muss > Check-in sein
Max. 30 Nächte (oder konfigurierbar)
E-Mail-Format
Pflichtfelder rot markieren

Server-seitig (Zod + zusätzliche Checks)

Preis-Manipulations-Schutz: Preis wird serverseitig neu berechnet und mit gesendeten Preis verglichen (±1 € Toleranz)
Rate-Limit: max. 5 Anfragen pro IP pro Stunde
hCaptcha oder Google ReCAPTCHA v3 (Score > 0.7 erforderlich)

Fehlermeldungen freundlich:

„Das Check-out-Datum muss nach dem Check-in liegen“
„Leider ist die Unterkunft in diesem Zeitraum nicht verfügbar“ (falls Kalender-Check)

6. Admin-Bereich – Detailseiten
URL: /admin/booking-requests
Übersichtstabelle (Shadcn DataTable mit Server-Side Pagination & Filtering)
Spalten (exakt in dieser Reihenfolge):

ID
Erstellt (Format: 18.11.2025 14:32)
Status-Badge (rot=neu, gelb=in Bearbeitung, grün=beantwortet, grau=abgelehnt)
Unterkunft (Link zur Unterkunfts-Detailseite)
Datum (15.–20.07. · 5 Nächte)
Preis (1.250 €)
Kunde (Max Mustermann · max@beispiel.de · +49…)
Aktionen (Button „Ansehen“ + „Status ändern“ Dropdown)

Filter-Bar oben:

Status (Dropdown)
Unterkunft (Search-Select)
Datum von/bis
Suche (über alle Felder)

Detailansicht (/admin/booking-requests/123)
Layout: 2-Spalten auf Desktop, gestapelt auf Mobile
Linke Spalte:

Unterkunftskarte (Foto + Name + Link)
Reisedaten + Gäste + Preis (groß)
Nachricht des Kunden (in Card)

Rechte Spalte:

Kundendaten (Name, E-Mail kopierbar, Telefon klick-to-call)
Status ändern (Dropdown + Speichern-Button)
Admin-Notizen (Rich-Text-Editor, z. B. TipTap)
Button „E-Mail an Kunden schreiben“ → öffnet mailto:max@… mit vorgefertigtem Template
Historie: „Status von neu → in Bearbeitung geändert durch Anna am 18.11. 14:45“

7. Dashboard – Pixelgenaue Beschreibung
URL: /admin/dashboard (ist die Startseite nach Login)
Grid-Layout (max. 1440 px Breite, zentriert)
Obere Reihe (2 große Cards):

Card „Gesamtumsatz“
– Riesenzahl: 47.320 €
– Darunter: +18 % zum Vorjahr
– Mini-Sparkline-Chart (letzte 12 Monate)
Card „Offene Anfragen“
– Riesenzahl: 12 (rot wenn > 5)
– Darunter: 4 neue heute
– Button „Alle ansehen“ → /admin/booking-requests?status=new

Mittlere Reihe (3 Cards):

Line-Chart „Umsatz letzte 30 Tage“ (Recharts, grüne Linie)
Donut-Chart „Anfragen nach Unterkunft“ (Top 5)
Card „Neue Anfragen diese Woche“: +23 % (mit Pfeil)

Untere Reihe:

Tabelle „Letzte 5 Anfragen“ (gleiche Spalten wie Übersicht, aber kompakt)
Optional: Kalender-Preview aktueller Monat mit farbigen Tagen (grün = gebucht, orange = Anfrage)

Live-Update: Alle 15 Sekunden Polling oder besser WebSocket → neue Anfrage = Zahl springt hoch + Toast „Neue Anfrage von Max Mustermann“ + Sound
8. E-Mail-Templates (optional aber empfohlen)
An Kunden nach Absenden
Betreff: Ihre Anfrage für Traumhaus am See
Text:
Vielen Dank für Ihre Anfrage vom 18.11.2025!
Wir prüfen die Verfügbarkeit und melden uns schnellstmöglich (spätestens innerhalb 24 h).
Ihre Daten: 15.–20.07.2026, 2 Erw + 1 Kind, 1.250 €
Vorlage für Admin → Kunde (Copy-Paste)
Betreff: Re: Ihre Anfrage für Traumhaus am See
„Sehr geehrter Herr Mustermann,
leider ist der Zeitraum bereits vergeben / gerne können wir Ihnen den 22.–27.07. anbieten…“
9. Technische Tiefendetails
Stack-Vorschlag (du kannst anpassen):

Next.js 15 App Router
Prisma + PostgreSQL
Tailwind + Shadcn/UI + Lucide Icons
Zustand oder TanStack Query für State
Echtzeit: Supabase Realtime (kostenlos bis 500 Verbindungen) oder Pusher
Formulare: React Hook Form + Zod Resolver
Charts: Recharts
Table: TanStack Table

Wichtige Environment-Variablen:

NEXT_PUBLIC_RECAPTCHA_SITE_KEY
RESEND_API_KEY (für spätere Automails)
DATABASE_URL

10. Edge Cases & Besonderheiten

Zeitzonen: Alle Daten in Europe/Berlin speichern/anzeigen
Saisonpreise: Preis-Berechnung serverseitig (nicht manipulierbar)
Doppelte Anfragen: Kunde kann mehrmals anfragen → alles speichern
Mobile: Formular muss 100 % nutzbar sein (große Touch-Targets)

11. Testing & QA-Checkliste

 Formular auf iPhone & Android testen
 100 Anfragen gleichzeitig (Load-Test)
 Darkmode überall
 Tastatur-Navigation (Tab-Order)
 Ladezustände überall (Skeleton)