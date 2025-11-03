# PRD: DSK-UG Monteurunterkünfte Webseite

## Projekt-Übersicht
Modernisierung und Erweiterung der bestehenden Webseite für DSK-UG, spezialisiert auf Monteurunterkünfte in Leipzig mit Fokus auf internationale Arbeiter aus Osteuropa.

---

## 1. FRONTEND ANFORDERUNGEN

### 1.1 Header & Navigation

**Anforderungen:**
- **Modernes, interaktives Design:**
  - Sticky Header mit smooth scroll behavior
  - Hover-Animationen für Navigationselemente
  - Glassmorphismus oder moderne Schatten-Effekte
  - Responsive Hamburger-Menü für Mobile

- **Sprachumschalter:**
  - **Unterstützte Sprachen:** Deutsch (DE), Englisch (EN), Polnisch (PL), Rumänisch (RO)
  - **Design:** Flaggen-Icons neben Sprachkürzel für intuitive Erkennung
  - Dropdown-Menü mit Flaggen: 🇩🇪 Deutsch | 🇬🇧 English | 🇵🇱 Polski | 🇷🇴 Română
  - Aktive Sprache hervorgehoben
  - Sprache wird im LocalStorage gespeichert

- **Navigation:**
  - Logo (DSK-UG) links
  - Menüpunkte: Home | Unterkünfte | Über uns | Kontakt
  - Sprachauswahl rechts
  - CTA-Button "Jetzt buchen" prominent platziert

### 1.2 Unterkünfte-Seite (`/unterkuenfte`)

**Aktuelles Problem:** Interaktive Karte lädt nicht

**Anforderungen:**

**Übersichtsseite:**
- Grid/Card-Layout aller verfügbaren Unterkünfte
- Pro Unterkunft-Card:
  - Bild-Galerie (Carousel)
  - Titel & kurze Beschreibung
  - Key-Features (Icons): Personen, Quadratmeter, WLAN, Parkplatz, Küche
  - Preis pro Nacht
  - **Zwei Buttons:**
    - **"Details anzeigen"** → führt zu Detailseite
    - **"Jetzt buchen"** → führt direkt zur Buchungsseite

**Detailseite (`/unterkuenfte/{id}`):**
- Hero-Section mit Bildergalerie (Lightbox-Funktionalität)
- Ausführliche Beschreibung der Unterkunft
- Vollständige Ausstattungsliste mit Icons
- **Interaktive Karte:**
  - Google Maps oder OpenStreetMap Integration
  - Marker mit genauem Standort der Unterkunft
  - Umgebungsinformationen (nahegelegene Supermärkte, öffentliche Verkehrsmittel)
  - Zoom & Street View Funktionalität
- Verfügbarkeitskalender (read-only Vorschau, aus Supabase)
- **CTA-Button:** "Unterkunft buchen" → zur Buchungsseite

### 1.3 Buchungsseite

**Anforderungen:**

**Modernisiertes Datumsfeld:**
- Verwendung eines modernen Date-Picker Libraries (z.B. react-datepicker, flatpickr)
- **Features:**
  - Check-in / Check-out Auswahl
  - Belegte Tage visuell markiert (rot/grau) - Daten aus Supabase
  - Verfügbare Tage hervorgehoben (grün)
  - Mindestaufenthalt (z.B. 1 Nacht)
  - Automatische Preisberechnung bei Datumsauswahl
  - Range-Selection (von-bis)
  - Mobile-optimiert mit Touch-Gesten

**Buchungsformular:**
```
Unterkunft: [Dropdown wenn nicht vorgewählt]
Check-in: [Moderner Date Picker]
Check-out: [Moderner Date Picker]
Anzahl Personen: [Number Input]

--- Persönliche Daten ---
Vorname: [Input]
Nachname: [Input]
Firma/Arbeitgeber: [Input]
E-Mail: [Input mit Validierung]
Telefon: [Input mit Ländercode-Auswahl]
Zusätzliche Wünsche: [Textarea]

--- Preisübersicht ---
Preis pro Nacht: XX €
Anzahl Nächte: X
Gesamtpreis: XXX €

[Checkbox] Ich akzeptiere die AGB und Datenschutzerklärung
[Button] Buchungsanfrage senden
```

**Validierung:**
- Client-seitige Validierung aller Pflichtfelder
- E-Mail-Format-Prüfung
- Telefonnummer-Validierung
- Datums-Logik (Check-out nach Check-in)
- Verfügbarkeitsprüfung gegen Supabase vor Absenden

### 1.4 Trust-Elemente & moderne Webseiten-Features

**Trust-Building:**
- **Testimonials/Bewertungen-Sektion:**
  - Slider mit Kundenbewertungen (aus Supabase)
  - Fotos von zufriedenen Kunden (optional, mit Einwilligung)
  - Star-Ratings
  
- **Vertrauens-Badges:**
  - "Seit 20XX im Geschäft"
  - "Über XXX zufriedene Monteure" (Counter aus Supabase)
  - Sicherheitszertifikate (SSL, Datenschutz)
  
- **Live-Features:**
  - "X Personen schauen sich diese Unterkunft gerade an" (kann simuliert sein)
  - "Zuletzt gebucht vor X Stunden" (aus Supabase)

**Moderne UI-Elemente:**
- **Animationen:**
  - Smooth scroll zu Sektionen
  - Fade-in Animationen beim Scrollen
  - Hover-Effekte auf Cards und Buttons
  - Loading-Skeletons statt Spinner
  
- **Micro-Interactions:**
  - Button-Click-Feedback
  - Form-Input-Animationen
  - Success/Error-Toast-Notifications
  
- **Design-Patterns:**
  - Glassmorphismus-Effekte
  - Gradient-Overlays
  - Modern Cards mit Schatten
  - Konsistente Icon-Library (z.B. Lucide, Heroicons)

### 1.5 Rechtstexte

**Zu erstellende Seiten:**

1. **Impressum (`/impressum`)**
   - Firmenname: DSK-UG (haftungsbeschränkt)
   - Geschäftsführer: [Name einfügen]
   - Adresse: [Geschäftsadresse Leipzig]
   - Kontakt: mert.karaca@dsk-ug.de
   - Handelsregisternummer
   - USt-IdNr.
   
2. **Datenschutzerklärung (`/datenschutz`)**
   - DSGVO-konform
   - Datenerhebung (Kontaktformulare, Buchungen)
   - Cookie-Nutzung
   - E-Mail-Kommunikation
   - Rechte der Nutzer
   - Drittanbieter (Google Maps, E-Mail-Provider, Supabase)
   - Datenspeicherung in Supabase (EU-Server)
   
3. **AGB (`/agb`)**
   - Buchungsbedingungen
   - Stornierungsregelungen
   - Zahlungsbedingungen
   - Hausordnung
   - Haftungsausschlüsse
   - Kaution & Schadenersatz

**Hinweis:** *Diese Texte sind KI-generierte Vorschläge ohne rechtliche Gewähr. Empfohlen wird eine Prüfung durch einen Fachanwalt.*

---

## 2. BACKEND ANFORDERUNGEN

### 2.1 Supabase Datenbank-Schema

**Datenbank-Setup:**

#### Tabelle: `accommodations`
```sql
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name JSONB NOT NULL, -- {"de": "...", "en": "...", "pl": "...", "ro": "..."}
  description JSONB NOT NULL,
  short_description JSONB NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL,
  square_meters INTEGER,
  features TEXT[] NOT NULL, -- ['wifi', 'parking', 'kitchen', 'tv', 'washing_machine']
  images TEXT[] NOT NULL, -- Array von Image URLs
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_accommodations_active ON accommodations(active);
```

#### Tabelle: `bookings`
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accommodation_id UUID REFERENCES accommodations(id) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  language TEXT NOT NULL, -- 'de', 'en', 'pl', 'ro'
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_accommodation ON bookings(accommodation_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Check für überlappende Buchungen
CREATE UNIQUE INDEX idx_no_overlapping_bookings ON bookings (
  accommodation_id,
  daterange(check_in, check_out, '[]')
) WHERE status != 'cancelled';
```

#### Tabelle: `blocked_dates`
```sql
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accommodation_id UUID REFERENCES accommodations(id) NOT NULL,
  blocked_date DATE NOT NULL,
  reason TEXT, -- 'maintenance', 'cleaning', 'other'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Unique constraint
CREATE UNIQUE INDEX idx_unique_blocked_date ON blocked_dates(accommodation_id, blocked_date);
```

#### Tabelle: `testimonials`
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment JSONB NOT NULL, -- {"de": "...", "en": "...", "pl": "...", "ro": "..."}
  image_url TEXT,
  accommodation_id UUID REFERENCES accommodations(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_testimonials_active ON testimonials(active);
```

#### Tabelle: `contact_requests`
```sql
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'resolved'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_status ON contact_requests(status);
```

#### Tabelle: `site_settings`
```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Initial Werte
INSERT INTO site_settings (key, value) VALUES
  ('total_satisfied_customers', '{"count": 500}'),
  ('company_since_year', '{"year": 2020}');
```

### 2.2 Supabase Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can read active accommodations" 
  ON accommodations FOR SELECT 
  USING (active = true);

CREATE POLICY "Public can read active testimonials" 
  ON testimonials FOR SELECT 
  USING (active = true);

CREATE POLICY "Public can read site settings" 
  ON site_settings FOR SELECT 
  USING (true);

-- Public Insert Policies (für Buchungen und Kontaktanfragen)
CREATE POLICY "Anyone can create bookings" 
  ON bookings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can create contact requests" 
  ON contact_requests FOR INSERT 
  WITH CHECK (true);

-- Admin Policies (benötigt Authentication)
-- Diese werden später konfiguriert wenn Admin-Panel erstellt wird
```

### 2.3 Supabase Edge Functions

**Benötigte Edge Functions:**

#### 1. `send-booking-email`
```typescript
// supabase/functions/send-booking-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { booking } = await req.json()
  
  // E-Mail an mert.karaca@dsk-ug.de senden
  // E-Mail an Kunden senden
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

#### 2. `send-contact-email`
```typescript
// supabase/functions/send-contact-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { contact } = await req.json()
  
  // E-Mail an mert.karaca@dsk-ug.de senden
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

#### 3. `check-availability`
```typescript
// supabase/functions/check-availability/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { accommodationId, checkIn, checkOut } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Prüfe auf überlappende Buchungen
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('accommodation_id', accommodationId)
    .neq('status', 'cancelled')
    .or(`and(check_in.lte.${checkOut},check_out.gte.${checkIn})`)
  
  return new Response(
    JSON.stringify({ 
      available: !data || data.length === 0,
      conflicts: data 
    }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

### 2.4 E-Mail-System

**E-Mail-Provider Integration:**

**Option 1: Microsoft Graph API (bevorzugt)**
```typescript
// In Supabase Edge Function
const sendEmail = async (to: string, subject: string, html: string) => {
  const token = await getGraphToken(); // OAuth2 Token holen
  
  const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: 'HTML', content: html },
        toRecipients: [{ emailAddress: { address: to } }]
      }
    })
  });
  
  return response.ok;
};
```

**Benötigte Environment Variables in Supabase:**
```
MICROSOFT_TENANT_ID=xxx
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
MICROSOFT_SENDER_EMAIL=mert.karaca@dsk-ug.de
```

**Option 2: Resend (empfohlene Alternative)**
```typescript
// Einfachere Alternative mit Resend
import { Resend } from 'resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

await resend.emails.send({
  from: 'DSK-UG <bookings@dsk-ug.de>',
  to: ['mert.karaca@dsk-ug.de'],
  subject: 'Neue Buchungsanfrage',
  html: emailHtml
});
```

**Benötigte Environment Variable:**
```
RESEND_API_KEY=re_xxx
```

### 2.5 E-Mail Templates (mehrsprachig)

**Speicherort:** `supabase/functions/_shared/email-templates.ts`
```typescript
export const bookingConfirmationEmail = {
  de: (booking) => `
    <h1>Buchungsbestätigung</h1>
    <p>Sehr geehrte/r ${booking.first_name} ${booking.last_name},</p>
    <p>vielen Dank für Ihre Buchungsanfrage!</p>
    
    <h2>Buchungsdetails:</h2>
    <ul>
      <li><strong>Unterkunft:</strong> ${booking.accommodation_name}</li>
      <li><strong>Check-in:</strong> ${booking.check_in}</li>
      <li><strong>Check-out:</strong> ${booking.check_out}</li>
      <li><strong>Personen:</strong> ${booking.guests}</li>
      <li><strong>Gesamtpreis:</strong> ${booking.total_price}€</li>
    </ul>
    
    <p>Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.</p>
    <p><strong>Ihre Buchungsreferenz:</strong> ${booking.id}</p>
    
    <p>Mit freundlichen Grüßen<br>Ihr DSK-UG Team</p>
  `,
  en: (booking) => `
    <h1>Booking Confirmation</h1>
    <p>Dear ${booking.first_name} ${booking.last_name},</p>
    <p>Thank you for your booking request!</p>
    
    <h2>Booking Details:</h2>
    <ul>
      <li><strong>Accommodation:</strong> ${booking.accommodation_name}</li>
      <li><strong>Check-in:</strong> ${booking.check_in}</li>
      <li><strong>Check-out:</strong> ${booking.check_out}</li>
      <li><strong>Guests:</strong> ${booking.guests}</li>
      <li><strong>Total Price:</strong> €${booking.total_price}</li>
    </ul>
    
    <p>We will contact you within 24 hours.</p>
    <p><strong>Your booking reference:</strong> ${booking.id}</p>
    
    <p>Best regards<br>Your DSK-UG Team</p>
  `,
  pl: (booking) => `
    <h1>Potwierdzenie rezerwacji</h1>
    <p>Szanowny/a ${booking.first_name} ${booking.last_name},</p>
    <p>Dziękujemy za prośbę o rezerwację!</p>
    
    <h2>Szczegóły rezerwacji:</h2>
    <ul>
      <li><strong>Zakwaterowanie:</strong> ${booking.accommodation_name}</li>
      <li><strong>Zameldowanie:</strong> ${booking.check_in}</li>
      <li><strong>Wymeldowanie:</strong> ${booking.check_out}</li>
      <li><strong>Liczba gości:</strong> ${booking.guests}</li>
      <li><strong>Cena całkowita:</strong> ${booking.total_price}€</li>
    </ul>
    
    <p>Skontaktujemy się z Tobą w ciągu 24 godzin.</p>
    <p><strong>Numer rezerwacji:</strong> ${booking.id}</p>
    
    <p>Z poważaniem<br>Zespół DSK-UG</p>
  `,
  ro: (booking) => `
    <h1>Confirmare rezervare</h1>
    <p>Stimate/ă ${booking.first_name} ${booking.last_name},</p>
    <p>Vă mulțumim pentru cererea de rezervare!</p>
    
    <h2>Detalii rezervare:</h2>
    <ul>
      <li><strong>Cazare:</strong> ${booking.accommodation_name}</li>
      <li><strong>Check-in:</strong> ${booking.check_in}</li>
      <li><strong>Check-out:</strong> ${booking.check_out}</li>
      <li><strong>Oaspeți:</strong> ${booking.guests}</li>
      <li><strong>Preț total:</strong> ${booking.total_price}€</li>
    </ul>
    
    <p>Vă vom contacta în termen de 24 de ore.</p>
    <p><strong>Referința rezervării:</strong> ${booking.id}</p>
    
    <p>Cu stimă<br>Echipa DSK-UG</p>
  `
};

export const adminNotificationEmail = (booking) => `
  <h1>Neue Buchungsanfrage</h1>
  
  <h2>Unterkunft:</h2>
  <p>${booking.accommodation_name}</p>
  
  <h2>Zeitraum:</h2>
  <ul>
    <li><strong>Check-in:</strong> ${booking.check_in}</li>
    <li><strong>Check-out:</strong> ${booking.check_out}</li>
    <li><strong>Anzahl Nächte:</strong> ${booking.nights}</li>
  </ul>
  
  <h2>Kundendaten:</h2>
  <ul>
    <li><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</li>
    <li><strong>Firma:</strong> ${booking.company || 'Keine Angabe'}</li>
    <li><strong>E-Mail:</strong> ${booking.email}</li>
    <li><strong>Telefon:</strong> ${booking.phone}</li>
    <li><strong>Personen:</strong> ${booking.guests}</li>
  </ul>
  
  ${booking.message ? `
    <h2>Zusätzliche Wünsche:</h2>
    <p>${booking.message}</p>
  ` : ''}
  
  <h2>Preisübersicht:</h2>
  <p><strong>Gesamtpreis:</strong> ${booking.total_price}€</p>
  
  <p><em>Eingegangen am: ${new Date().toLocaleString('de-DE')}</em></p>
`;
```

### 2.6 API-Integration (Supabase Client)

**Frontend Integration:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Beispiel-Queries:**
```typescript
// Alle aktiven Unterkünfte laden
const { data: accommodations, error } = await supabase
  .from('accommodations')
  .select('*')
  .eq('active', true)
  .order('created_at', { ascending: false });

// Einzelne Unterkunft laden
const { data: accommodation, error } = await supabase
  .from('accommodations')
  .select('*')
  .eq('id', accommodationId)
  .single();

// Verfügbarkeit prüfen
const { data: bookings, error } = await supabase
  .from('bookings')
  .select('check_in, check_out')
  .eq('accommodation_id', accommodationId)
  .neq('status', 'cancelled')
  .gte('check_out', startDate)
  .lte('check_in', endDate);

// Buchung erstellen
const { data: booking, error } = await supabase
  .from('bookings')
  .insert({
    accommodation_id: accommodationId,
    check_in: checkIn,
    check_out: checkOut,
    guests: guests,
    first_name: firstName,
    last_name: lastName,
    company: company,
    email: email,
    phone: phone,
    message: message,
    language: language,
    total_price: totalPrice,
    status: 'pending'
  })
  .select()
  .single();

// Nach erfolgreicher DB-Einträge, Edge Function aufrufen
if (booking) {
  await supabase.functions.invoke('send-booking-email', {
    body: { booking }
  });
}

// Testimonials laden
const { data: testimonials, error } = await supabase
  .from('testimonials')
  .select('*')
  .eq('active', true)
  .order('created_at', { ascending: false })
  .limit(10);
```

---

## 3. TECHNISCHE SPEZIFIKATIONEN

### 3.1 Frontend Stack
- **Framework:** React (Next.js empfohlen für SSR)
- **Styling:** Tailwind CSS
- **Database Client:** @supabase/supabase-js
- **Date Picker:** react-datepicker oder date-fns
- **Maps:** react-google-maps oder Leaflet (OpenStreetMap)
- **Icons:** Lucide React oder Heroicons
- **Animationen:** Framer Motion oder CSS Transitions
- **Forms:** React Hook Form mit Zod Validation
- **i18n:** react-i18next oder next-intl
- **State Management:** React Query (TanStack Query) für Supabase-Daten

### 3.2 Backend Stack
- **Database:** Supabase (PostgreSQL)
- **API:** Supabase REST API + Edge Functions
- **Authentication:** Supabase Auth (für Admin-Panel später)
- **File Storage:** Supabase Storage (für Unterkunftsbilder)
- **Email:** Microsoft Graph API oder Resend (via Edge Functions)
- **Real-time:** Supabase Realtime (optional für Live-Updates)

### 3.3 Supabase Setup

**Environment Variables (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... (nur für Backend/Edge Functions)

# E-Mail Provider (wähle eine Option)
# Option 1: Microsoft Graph
MICROSOFT_TENANT_ID=xxx
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
MICROSOFT_SENDER_EMAIL=mert.karaca@dsk-ug.de

# Option 2: Resend
RESEND_API_KEY=re_xxx
```

**Supabase Storage Buckets:**
```sql
-- Bucket für Unterkunftsbilder erstellen
INSERT INTO storage.buckets (id, name, public) 
VALUES ('accommodation-images', 'accommodation-images', true);

-- Public Access Policy
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'accommodation-images');

-- Upload Policy (für Admin später)
CREATE POLICY "Authenticated can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'accommodation-images' AND auth.role() = 'authenticated');
```

### 3.4 Deployment
- **Frontend:** Vercel (empfohlen für Next.js) oder Netlify
- **Backend:** Supabase (EU-Region für DSGVO)
- **Edge Functions:** Supabase Edge Functions (Deno Runtime)
- **Domain:** dsk-ug.de (oder Subdomain)
- **CDN:** Supabase Storage CDN für Bilder

### 3.5 Supabase Features Nutzung

**Real-time Subscriptions (optional):**
```typescript
// Live-Updates für Verfügbarkeit
const subscription = supabase
  .channel('bookings')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'bookings',
      filter: `accommodation_id=eq.${accommodationId}`
    }, 
    (payload) => {
      console.log('Booking changed:', payload)
      // UI aktualisieren
    }
  )
  .subscribe();
```

**Database Functions (für komplexe Queries):**
```sql
-- Function: Verfügbare Tage für eine Unterkunft
CREATE OR REPLACE FUNCTION get_available_dates(
  p_accommodation_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE(date DATE, available BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d::DATE as date,
    NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.accommodation_id = p_accommodation_id
      AND b.status != 'cancelled'
      AND d::DATE >= b.check_in
      AND d::DATE < b.check_out
    ) AND NOT EXISTS (
      SELECT 1 FROM blocked_dates bd
      WHERE bd.accommodation_id = p_accommodation_id
      AND bd.blocked_date = d::DATE
    ) as available
  FROM generate_series(p_start_date, p_end_date, '1 day'::interval) d;
END;
$$ LANGUAGE plpgsql;
```

**Verwendung:**
```typescript
const { data, error } = await supabase
  .rpc('get_available_dates', {
    p_accommodation_id: accommodationId,
    p_start_date: '2025-11-01',
    p_end_date: '2025-11-30'
  });
```

---

## 4. BOLT.DIY PROMPT (MIT SUPA