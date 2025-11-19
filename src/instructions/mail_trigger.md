# Mail-Trigger Prozess (Buchungsanfrage)

## Übersicht
- Client sendet Buchungsdaten an `POST /api/mail/send-booking`.
- Backend validiert Felder und ruft Microsoft Graph API via Client Credentials auf.
- E-Mail wird aus dem Outlook-Postfach (`MICROSOFT_MAIL_TO` oder `info@dsk-ug.de`) versendet, CC an Gast.

## Endpunkt
- `POST /api/mail/send-booking`
- Payload:
  - `accommodationId:number`
  - `accommodationName:string`
  - `guestName:string`
  - `guestEmail:string`
  - `guestPhone:string`
  - `checkIn:YYYY-MM-DD`
  - `checkOut:YYYY-MM-DD` (muss nach `checkIn` liegen)
  - `guests:number (>0)`
  - `totalPrice:number`
  - `specialRequests?:string`

## Validierung
- Pflichtfelder geprüft, E-Mail-Format geprüft, Datumskonsistenz, Gästezahl > 0.
- Fehlerantworten: `400` bei ungültigen Daten, `500` bei Versandfehlern.

## Graph API Konfiguration
- `.env`:
  - `MICROSOFT_CLIENT_ID`
  - `MICROSOFT_CLIENT_SECRET`
  - `MICROSOFT_TENANT_ID` (optional; Default `common`)
  - `MICROSOFT_MAIL_TO` (optional; Default `info@dsk-ug.de`)
- Erforderliche App-Berechtigungen: `Mail.Send` (Application) in Azure App-Registrierung.
- Token-Endpoint: `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token`
- Senden: `POST https://graph.microsoft.com/v1.0/users/{MAIL_TO}/sendMail`

## Fehlerbehandlung
- Token-Fehler oder Sendefehler → `500` mit Log `[mail:send-booking]`.
- Frontend zeigt Fehlermeldung aus `useEmailService`.

## Tests (localhost)
- Backend starten: `npm run dev` im Ordner `backend`.
- Beispiel-Request:
  - `POST http://localhost:5000/api/mail/send-booking` mit validem Payload.
  - Erwartet: `200 { success: true }` oder `500` falls Graph nicht konfiguriert.

## Sicherheit
- Credentials verbleiben ausschließlich im Server (`.env`), kein Client-Side Exposure.