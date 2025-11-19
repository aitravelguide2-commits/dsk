1. Executive Summary
Dieses PRD beschreibt die vollständige Integration zwischen dem Admin-Dashboard (React) und dem Kunden-Frontend (Vue.js) für die Monteurunterkünfte-Plattform. Ziel ist es, eine einheitliche Datenbasis zu schaffen, bei der Änderungen im Admin-Dashboard in Echtzeit im Kunden-Frontend reflektiert werden.

2. Problem Statement
Aktueller Zustand:

Admin-Dashboard verwendet Mock-Daten (React-Komponente)
Kunden-Frontend verwendet separate Mock-Daten (Vue-Komponenten)
Keine gemeinsame Datenquelle
Keine Synchronisation zwischen Admin- und Kunden-Sicht
Inkonsistente IDs und Datenstrukturen

Ziel-Zustand:

Einheitliche Backend-API als Single Source of Truth
Admin-Dashboard kann Unterkünfte erstellen, bearbeiten und löschen
Änderungen werden sofort im Kunden-Frontend sichtbar
Konsistente IDs über alle Komponenten hinweg
Echtzeit-Synchronisation via WebSocket (optional)


3. Systemarchitektur
3.1 Technologie-Stack
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
├──────────────────────────┬──────────────────────────────┤
│   Admin Dashboard        │    Customer Frontend         │
│   (React - Port 3001)    │    (Vue.js - Port 3000)     │
└──────────────┬───────────┴──────────────┬───────────────┘
               │                          │
               │      HTTP/REST API       │
               │                          │
┌──────────────┴──────────────────────────┴───────────────┐
│              Backend API Layer (Node.js)                │
│              Express.js - Port 5000                     │
├─────────────────────────────────────────────────────────┤
│         Routes: /api/accommodations/*                   │
│         - GET    /api/accommodations                    │
│         - GET    /api/accommodations/:id                │
│         - POST   /api/accommodations                    │
│         - PUT    /api/accommodations/:id                │
│         - DELETE /api/accommodations/:id                │
│         - GET    /api/accommodations/:id/availability   │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│              Database Layer (Supabase)                  │
│              PostgreSQL Database                        │
├─────────────────────────────────────────────────────────┤
│  Tables:                                                │
│  - accommodations                                       │
│  - bookings                                             │
│  - images                                               │
│  - availability_calendar                                │
└─────────────────────────────────────────────────────────┘

4. Datenbank-Schema
4.1 Tabelle: accommodations
sqlCREATE TABLE accommodations (
  id SERIAL PRIMARY KEY,
  name_de VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_pl VARCHAR(255) NOT NULL,
  name_ro VARCHAR(255) NOT NULL,
  description_de TEXT,
  description_en TEXT,
  description_pl TEXT,
  description_ro TEXT,
  price_per_night DECIMAL(10,2) NOT NULL,
  max_guests INTEGER NOT NULL,
  location VARCHAR(100) NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bookings_count INTEGER DEFAULT 0
);

-- Index für Performance
CREATE INDEX idx_accommodations_active ON accommodations(is_active);
CREATE INDEX idx_accommodations_location ON accommodations(location);
4.2 Tabelle: images
sqlCREATE TABLE images (
  id SERIAL PRIMARY KEY,
  accommodation_id INTEGER REFERENCES accommodations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_images_accommodation ON images(accommodation_id);
4.3 Tabelle: bookings
sqlCREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  accommodation_id INTEGER REFERENCES accommodations(id),
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_accommodation ON bookings(accommodation_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);
4.4 Tabelle: availability_calendar
sqlCREATE TABLE availability_calendar (
  id SERIAL PRIMARY KEY,
  accommodation_id INTEGER REFERENCES accommodations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  UNIQUE(accommodation_id, date)
);

CREATE INDEX idx_availability_accommodation_date ON availability_calendar(accommodation_id, date);
```

---

## 5. Backend-API Spezifikation

### 5.1 Datei-Struktur
```
backend/
├── server.js                 # Haupt-Server-Datei
├── config/
│   └── database.js          # Supabase Connection
├── routes/
│   ├── accommodations.js    # Unterkünfte Routes
│   ├── bookings.js          # Buchungen Routes
│   └── images.js            # Bilder Routes
├── controllers/
│   ├── accommodationController.js
│   ├── bookingController.js
│   └── imageController.js
├── middleware/
│   ├── auth.js              # Admin-Authentifizierung
│   ├── validation.js        # Input-Validierung
│   └── errorHandler.js      # Error Handling
└── package.json
5.2 API Endpoints
GET /api/accommodations
Beschreibung: Alle aktiven Unterkünfte abrufen
Query Parameters:

lang (optional): de|en|pl|ro - Sprache für Namen/Beschreibungen
location (optional): Filtern nach Standort
minGuests (optional): Minimum Gästeanzahl
isActive (optional): true|false - Admin-Filter

Response 200:
json{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Moderne Monteurwohnung Zentrum",
      "description": "Helle und moderne 2-Zimmer-Wohnung...",
      "price": 89,
      "capacity": 4,
      "location": "Zentrum",
      "features": ["wifi", "kitchen", "parking"],
      "images": [
        {
          "id": 1,
          "url": "https://...",
          "isPrimary": true
        }
      ],
      "isActive": true,
      "bookingsCount": 34
    }
  ],
  "count": 10
}
GET /api/accommodations/:id
Beschreibung: Einzelne Unterkunft mit allen Details
Parameters: id - Unterkunfts-ID
Response 200:
json{
  "success": true,
  "data": {
    "id": 1,
    "name": {
      "de": "Moderne Monteurwohnung Zentrum",
      "en": "Modern Worker Apartment Center",
      "pl": "Nowoczesne mieszkanie centrum",
      "ro": "Apartament modern centru"
    },
    "description": {
      "de": "Beschreibung auf Deutsch",
      "en": "Description in English",
      "pl": "Opis po polsku",
      "ro": "Descriere în română"
    },
    "pricePerNight": 89,
    "maxGuests": 4,
    "location": "Zentrum",
    "features": ["wifi", "kitchen", "parking", "bathroom", "tv"],
    "images": [...],
    "isActive": true,
    "bookingsCount": 34,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-11-07T15:30:00Z"
  }
}
POST /api/accommodations
Beschreibung: Neue Unterkunft erstellen (Admin only)
Authorization: Bearer Token required
Request Body:
json{
  "name": {
    "de": "Neue Unterkunft",
    "en": "New Accommodation",
    "pl": "Nowe mieszkanie",
    "ro": "Cazare nouă"
  },
  "description": {
    "de": "Beschreibung...",
    "en": "Description...",
    "pl": "Opis...",
    "ro": "Descriere..."
  },
  "pricePerNight": 75,
  "maxGuests": 3,
  "location": "West",
  "features": ["wifi", "kitchen"],
  "images": [
    {
      "url": "https://...",
      "isPrimary": true
    }
  ],
  "isActive": true
}
Response 201:
json{
  "success": true,
  "message": "Unterkunft erfolgreich erstellt",
  "data": {
    "id": 11,
    ...
  }
}
PUT /api/accommodations/:id
Beschreibung: Unterkunft aktualisieren (Admin only)
Authorization: Bearer Token required
Parameters: id - Unterkunfts-ID
Request Body: (Partial Update möglich)
json{
  "name": {
    "de": "Aktualisierter Name"
  },
  "pricePerNight": 95,
  "isActive": false
}
Response 200:
json{
  "success": true,
  "message": "Unterkunft erfolgreich aktualisiert",
  "data": {...}
}
DELETE /api/accommodations/:id
Beschreibung: Unterkunft löschen (Admin only)
Authorization: Bearer Token required
Parameters: id - Unterkunfts-ID
Response 200:
json{
  "success": true,
  "message": "Unterkunft erfolgreich gelöscht"
}
GET /api/accommodations/:id/availability
Beschreibung: Verfügbarkeit prüfen
Parameters: id - Unterkunfts-ID
Query Parameters:

startDate: YYYY-MM-DD
endDate: YYYY-MM-DD

Response 200:
json{
  "success": true,
  "data": {
    "accommodationId": 1,
    "availability": [
      {
        "date": "2025-11-10",
        "isAvailable": true
      },
      {
        "date": "2025-11-11",
        "isAvailable": false
      }
    ]
  }
}

6. Frontend-Integration
6.1 Admin-Dashboard (React)
Datei: src/services/api.js
javascriptimport axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor für Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor für Error Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const accommodationAPI = {
  // Alle Unterkünfte abrufen
  getAll: (params = {}) => api.get('/accommodations', { params }),
  
  // Einzelne Unterkunft abrufen
  getById: (id) => api.get(`/accommodations/${id}`),
  
  // Neue Unterkunft erstellen
  create: (data) => api.post('/accommodations', data),
  
  // Unterkunft aktualisieren
  update: (id, data) => api.put(`/accommodations/${id}`, data),
  
  // Unterkunft löschen
  delete: (id) => api.delete(`/accommodations/${id}`),
  
  // Verfügbarkeit prüfen
  checkAvailability: (id, startDate, endDate) => 
    api.get(`/accommodations/${id}/availability`, {
      params: { startDate, endDate }
    })
};

export default api;
Datei: src/components/AdminDashboard.jsx (Update)
javascriptimport React, { useState, useEffect } from 'react';
import { accommodationAPI } from '../services/api';

const AdminDashboard = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Unterkünfte laden
  useEffect(() => {
    loadAccommodations();
  }, []);
  
  const loadAccommodations = async () => {
    try {
      setLoading(true);
      const response = await accommodationAPI.getAll({ isActive: 'all' });
      setAccommodations(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Fehler beim Laden der Unterkünfte');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Unterkunft erstellen
  const handleCreate = async (accommodationData) => {
    try {
      await accommodationAPI.create(accommodationData);
      await loadAccommodations(); // Neu laden
      // Success notification
    } catch (err) {
      setError(err.message || 'Fehler beim Erstellen');
    }
  };
  
  // Unterkunft aktualisieren
  const handleUpdate = async (id, updates) => {
    try {
      await accommodationAPI.update(id, updates);
      await loadAccommodations(); // Neu laden
      // Success notification
    } catch (err) {
      setError(err.message || 'Fehler beim Aktualisieren');
    }
  };
  
  // Unterkunft löschen
  const handleDelete = async (id) => {
    if (!window.confirm('Möchten Sie diese Unterkunft wirklich löschen?')) {
      return;
    }
    
    try {
      await accommodationAPI.delete(id);
      await loadAccommodations(); // Neu laden
      // Success notification
    } catch (err) {
      setError(err.message || 'Fehler beim Löschen');
    }
  };
  
  // Rest des Components...
};
6.2 Kunden-Frontend (Vue.js)
Datei: src/services/api.js
javascriptimport axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error.response?.data || error);
  }
);

export const accommodationService = {
  // Alle Unterkünfte für Kunden (nur aktive)
  getAll(lang = 'de', filters = {}) {
    return api.get('/accommodations', {
      params: {
        lang,
        isActive: true,
        ...filters
      }
    });
  },
  
  // Einzelne Unterkunft
  getById(id, lang = 'de') {
    return api.get(`/accommodations/${id}`, {
      params: { lang }
    });
  },
  
  // Verfügbarkeit prüfen
  checkAvailability(id, startDate, endDate) {
    return api.get(`/accommodations/${id}/availability`, {
      params: { startDate, endDate }
    });
  }
};

export default api;
Datei: src/components/AccommodationDetail.vue (Update)
vue<script>
import { accommodationService } from '@/services/api';

export default {
  name: 'AccommodationDetail',
  data() {
    return {
      accommodation: null,
      loading: true,
      error: null
    };
  },
  async mounted() {
    await this.loadAccommodation();
  },
  methods: {
    async loadAccommodation() {
      try {
        this.loading = true;
        const id = parseInt(this.$route.params.id);
        const lang = this.$i18n.locale;
        
        const response = await accommodationService.getById(id, lang);
        this.accommodation = response.data;
        this.error = null;
      } catch (err) {
        this.error = err.message || 'Unterkunft nicht gefunden';
        console.error('Load error:', err);
      } finally {
        this.loading = false;
      }
    },
    
    async checkAvailability(startDate, endDate) {
      try {
        const response = await accommodationService.checkAvailability(
          this.accommodation.id,
          startDate,
          endDate
        );
        return response.data.availability;
      } catch (err) {
        console.error('Availability check error:', err);
        return [];
      }
    }
  },
  watch: {
    '$route'() {
      this.loadAccommodation();
    },
    '$i18n.locale'() {
      this.loadAccommodation();
    }
  }
};
</script>
```

---

## 7. Implementierungsanweisungen für KI (Claude/Trae)

### 7.1 Phase 1: Backend-Setup

**Schritt 1: Datenbank erstellen**
```
AUFGABE: Erstelle die Supabase-Datenbank-Tabellen
DATEIEN: backend/migrations/001_create_tables.sql

ANWEISUNGEN:
1. Öffne Supabase Dashboard
2. Navigiere zu SQL Editor
3. Führe das SQL-Schema aus Abschnitt 4 aus
4. Verifiziere, dass alle Tabellen erstellt wurden
5. Füge Test-Daten ein (10 Unterkünfte mit unterschiedlichen IDs 1-10)
```

**Schritt 2: Backend-Server erstellen**
```
AUFGABE: Implementiere den Express.js Backend-Server
DATEIEN: 
- backend/server.js
- backend/config/database.js
- backend/routes/accommodations.js
- backend/controllers/accommodationController.js

ANFORDERUNGEN:
- Express.js Server auf Port 5000
- CORS aktiviert für http://localhost:3000 und http://localhost:3001
- Supabase Client Integration
- Alle API Endpoints aus Abschnitt 5.2
- Error Handling Middleware
- Request Validation
- Admin-Authentifizierung mit JWT

WICHTIG:
- Verwende die EXAKTEN IDs aus der Datenbank (1-10)
- Implementiere Soft-Delete (isActive Flag statt echtem Delete)
- Transaktionale Updates für Bilder
- Logging für alle Operationen
```

**Schritt 3: API-Tests**
```
AUFGABE: Erstelle API-Tests
DATEIEN: backend/tests/accommodations.test.js

TESTE:
- GET /api/accommodations
- GET /api/accommodations/:id
- POST /api/accommodations (mit Auth)
- PUT /api/accommodations/:id (mit Auth)
- DELETE /api/accommodations/:id (mit Auth)
- Fehlerhandling (404, 401, 400)
```

### 7.2 Phase 2: Admin-Dashboard Integration

**Schritt 4: Admin API Service**
```
AUFGABE: Erstelle den API Service für das Admin-Dashboard
DATEI: admin-dashboard/src/services/api.js

ANFORDERUNGEN:
- Axios Client mit Interceptors
- JWT Token Management
- Error Handling
- Alle CRUD-Operationen
- TypeScript Interfaces (optional)

WICHTIG:
- Base URL: http://localhost:5000/api
- Token in localStorage speichern
- Automatisches Logout bei 401
```

**Schritt 5: Admin-Dashboard Refactoring**
```
AUFGABE: Refactore AdminDashboard.jsx um API zu verwenden
DATEI: admin-dashboard/src/components/AdminDashboard.jsx

ÄNDERUNGEN:
1. Entferne alle mockAccommodations
2. Implementiere useEffect für API-Calls
3. Implementiere Loading/Error States
4. Implementiere CRUD-Funktionen mit API
5. Implementiere Optimistic UI Updates
6. Füge Success/Error Notifications hinzu

BEHALTE BEI:
- Gesamtes UI-Design
- Alle Komponenten (StatCard, AccommodationCard, EditModal)
- Multi-Language Support
- Alle Icons und Styling
```

**Schritt 6: Bild-Upload**
```
AUFGABE: Implementiere Bild-Upload Funktionalität
DATEIEN:
- backend/routes/images.js
- admin-dashboard/src/components/ImageUpload.jsx

ANFORDERUNGEN:
- Supabase Storage für Bilder
- Drag & Drop Upload
- Multiple Files
- Preview vor Upload
- Progress Indicator
- Bildkomprimierung (max 1920px)
```

### 7.3 Phase 3: Kunden-Frontend Integration

**Schritt 7: Vue API Service**
```
AUFGABE: Erstelle den API Service für Vue.js Frontend
DATEI: customer-frontend/src/services/api.js

ANFORDERUNGEN:
- Axios Client
- Multi-Language Support (i18n)
- Nur GET-Requests (kein Admin-Zugriff)
- Caching für Performance
```

**Schritt 8: Vue Components Refactoring**
```
AUFGABE: Refactore alle Vue-Components für API-Nutzung
DATEIEN:
- src/components/AccommodationDetail.vue
- src/components/Booking.vue
- src/views/Accommodations.vue

ÄNDERUNGEN:
1. Entferne alle Mock-Daten
2. Implementiere API-Calls in mounted()
3. Implementiere Loading States
4. Implementiere Error Handling
5. Implementiere Auto-Refresh bei Language-Wechsel

BEHALTE BEI:
- Alle UI-Components
- Alle Styles
- InteractiveMap Integration
- Booking-Formular Logik
```

### 7.4 Phase 4: Echtzeit-Synchronisation (Optional)

**Schritt 9: WebSocket Integration**
```
AUFGABE: Implementiere WebSocket für Echtzeit-Updates
DATEIEN:
- backend/services/websocket.js
- admin-dashboard/src/services/websocket.js
- customer-frontend/src/services/websocket.js

FUNKTIONALITÄT:
- Server sendet Updates bei Änderungen
- Admin-Dashboard erhält Benachrichtigungen
- Kunden-Frontend aktualisiert automatisch
- Optimistische UI-Updates

8. Validierung & Testing
8.1 Backend-Tests
bash# Unit Tests
npm run test

# Integration Tests
npm run test:integration

# API Tests mit curl
curl http://localhost:5000/api/accommodations
curl http://localhost:5000/api/accommodations/1
```

### 8.2 Frontend-Tests

**Admin-Dashboard:**
1. Login durchführen
2. Neue Unterkunft erstellen
3. Unterkunft bearbeiten (Name, Preis, Bilder)
4. Unterkunft deaktivieren
5. Unterkunft löschen
6. Multi-Language testen

**Kunden-Frontend:**
1. Unterkünfte-Liste anzeigen
2. Unterkunft-Detail öffnen
3. Verfügbarkeit prüfen
4. Buchung durchführen
5. Language-Wechsel testen
6. Verifizieren dass Admin-Änderungen sichtbar sind

### 8.3 End-to-End Test-Szenario
```
SZENARIO: "Neue Unterkunft erstellen und buchen"

1. ADMIN öffnet Dashboard
2. ADMIN erstellt neue Unterkunft mit ID 11
   - Name: "Test Apartment"
   - Preis: 80€
   - Standort: "Zentrum"
   - 3 Gäste
3. ADMIN aktiviert Unterkunft

4. KUNDE öffnet Website
5. KUNDE sieht neue Unterkunft in Liste
6. KUNDE öffnet Detail-Seite (ID 11)
7. KUNDE wählt Datum und bucht

8. ADMIN sieht Buchung im Dashboard
9. ADMIN ändert Preis auf 85€

10. KUNDE aktualisiert Seite
11. KUNDE sieht neuen Preis 85€

✅ ERFOLG: Vollständige Integration funktioniert

9. Deployment
9.1 Environment Variables
Backend (.env)
bashPORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-jwt-secret
NODE_ENV=production
ADMIN_EMAIL=admin@dsk-ug.de
ADMIN_PASSWORD=secure-password
Admin-Dashboard (.env)
bashREACT_APP_API_URL=https://api.dsk-ug-leipzig.de/api
REACT_APP_WS_URL=wss://api.dsk-ug-leipzig.de
Kunden-Frontend (.env)
bashVUE_APP_API_URL=https://api.dsk-ug-leipzig.de/api
VUE_APP_WS_URL=wss://api.dsk-ug-leipzig.de
9.2 Build-Befehle
bash# Backend starten
cd backend
npm install
npm run start

# Admin-Dashboard bauen
cd admin-dashboard
npm install
npm run build

# Kunden-Frontend bauen
cd customer-frontend
npm install
npm run build

10. Checkliste für KI-Implementation
✅ Backend

 Supabase Datenbank-Tabellen erstellt
 Express.js Server implementiert
 Alle REST API Endpoints funktionieren
 Admin-Authentifizierung implementiert
 Input-Validierung aktiv
 Error Handling vollständig
 CORS konfiguriert
 Logging implementiert
 Tests geschrieben und bestanden

✅ Admin-Dashboard

 API Service erstellt
 AdminDashboard.jsx refactored
 CRUD-Operationen funktionieren
 Bild-Upload implementiert
 Loading States implementiert
 Error Handling implementiert
 Success Notifications implementiert
 Multi-Language funktioniert
 Alle Mock-Daten entfernt

✅ Kunden-Frontend

 API Service erstellt
 AccommodationDetail.vue refactored
 Booking.vue refactored
 Accommodations.vue refactored
 Loading States implementiert
 Error Handling implementiert
 Language-Switching funktioniert
 Verfügbarkeitsprüfung funktioniert
 Alle Mock-Daten entfernt

✅ Integration

 Admin kann Unterkunft erstellen → Kunde sieht sie
 Admin kann Unterkunft bearbeiten → Kunde sieht Änderungen
 Admin kann Unterkunft deaktivieren → Kunde sieht sie nicht mehr
 Buchungen werden korrekt gespeichert
 IDs sind konsistent über alle Systeme
 Multi-Language funktioniert überall

✅ Testing

 Backend Unit Tests bestanden
 Backend Integration Tests bestanden
 Admin-Dashboard manuell getestet
 Kunden-Frontend manuell getestet
 End-to-End Szenario erfolgreich
 Performance akzeptabel (<2s Ladezeit)


11. Zeitplan
PhaseAufgabenGeschätzte ZeitPhase 1Backend-Setup4-6 StundenPhase 2Admin-Dashboard Integration4-6 StundenPhase 3Kunden-Frontend Integration3-4 StundenPhase 4Testing & Bugfixes2-3 StundenPhase 5Deployment1-2 StundenTotal14-21 Stunden

12. Erfolgs-Kriterien
✅ Muss-Kriterien:

Admin kann Unterkünfte über Dashboard verwalten
Alle Änderungen sind sofort im Kunden-Frontend sichtbar
Konsistente IDs über alle Systeme (1-10 initial, erweiterbar)
Keine Mock-Daten mehr im produktiven Code
Multi-Language funktioniert überall
Buchungen werden korrekt gespeichert


        
PRD: Admin Frontend Optimierung für Unterkunftsverwaltung
## 1. Zusammenfassung
Dokumentation zur Optimierung des Accommodation-New-Forms im Admin Frontend (http://localhost:5175/accommodations/new). Fünf kritische UX-Funktionen sollen intelligent implementiert werden mit Fokus auf Automatisierung, moderner UI und KI-Integration.


## 2. Kernfunktionen & Implementierungsdetails
F1: Postleitzahl-basierte Bezirksautomatik
Ziel: Bei Eingabe der PLZ sofort automatische Zuordnung zu stadtbezirksbasierten Regionen (Zentrum, Nord, Ost, Süd) für Leipzig und Chemnitz.
Technische Spezifikation:
TypeScript
Copy
// PLZ-Datenbank (statische JSON)
const plzDatabase: Record<string, { district: string; city: string }> = {
  // Leipzig
  '04103': { district: 'Zentrum', city: 'Leipzig' },
  '04105': { district: 'Zentrum', city: 'Leipzig' },
  '04107': { district: 'Zentrum', city: 'Leipzig' },
  '04109': { district: 'Zentrum', city: 'Leipzig' },
  '04155': { district: 'Nord', city: 'Leipzig' },
  '04157': { district: 'Nord', city: 'Leipzig' },
  '04159': { district: 'Nord', city: 'Leipzig' },
  '04275': { district: 'Ost', city: 'Leipzig' },
  '04277': { district: 'Ost', city: 'Leipzig' },
  '04279': { district: 'Ost', city: 'Leipzig' },
  '04288': { district: 'Ost', city: 'Leipzig' },
  '04315': { district: 'Süd', city: 'Leipzig' },
  '04316': { district: 'Süd', city: 'Leipzig' },
  '04317': { district: 'Süd', city: 'Leipzig' },
  '04318': { district: 'Süd', city: 'Leipzig' },
  '04319': { district: 'Süd', city: 'Leipzig' },
  '04328': { district: 'Süd', city: 'Leipzig' },
  '04329': { district: 'Süd', city: 'Leipzig' },
  '04356': { district: 'Ost', city: 'Leipzig' },
  '04357': { district: 'Ost', city: 'Leipzig' },
  
  // Chemnitz
  '09001': { district: 'Zentrum', city: 'Chemnitz' },
  '09002': { district: 'Zentrum', city: 'Chemnitz' },
  '09111': { district: 'Zentrum', city: 'Chemnitz' },
  '09112': { district: 'Zentrum', city: 'Chemnitz' },
  '09113': { district: 'Zentrum', city: 'Chemnitz' },
  '09116': { district: 'Nord', city: 'Chemnitz' },
  '09117': { district: 'Nord', city: 'Chemnitz' },
  '09119': { district: 'Nord', city: 'Chemnitz' },
  '09120': { district: 'Ost', city: 'Chemnitz' },
  '09122': { district: 'Ost', city: 'Chemnitz' },
  '09123': { district: 'Ost', city: 'Chemnitz' },
  '09125': { district: 'Süd', city: 'Chemnitz' },
  '09126': { district: 'Süd', city: 'Chemnitz' }
};

// React Hook Implementierung
const useDistrictLookup = () => {
  const [district, setDistrict] = useState<string>('');
  
  const lookupDistrict = (plz: string) => {
    const result = plzDatabase[plz];
    setDistrict(result ? result.district : '');
    return result?.district || '';
  };
  
  return { district, lookupDistrict };
};
UI-Anforderung:
PLZ-Inputfeld mit onBlur oder onChange (nach 5 Ziffern) Event
Direkt darunter Anzeige: Bezirk: [Automatisch ermittelt] (Readonly, grau hinterlegt)
Falls PLZ nicht gefunden: Rotes Ausrufezeichen mit Tooltip "PLZ nicht in Leipzig/Chemnitz"
F2: Bild-Upload & Management System
Ziel: Erweiterter, größerer Upload-Bereich mit Drag & Drop Sortierung und Titelbild-Funktionalität.
UI/UX Anforderungen:
tsx
Copy
// React Component Struktur
<AccommodationImageManager 
  maxImages={15}
  maxFileSizeMB={10}
  acceptedFormats={['jpg', 'jpeg', 'png', 'webp']}
/>
Layout-Spezifikation:
Container: Mindesthöhe 400px, Breite 100% des Formulars
Grid: 4x4 Grid (16 Platzhalter) bei leerem Zustand, responsive auf 2x8 mobile
Einzelne Bild-Karte: 150x150px, border-radius: 12px, box-shadow: md
Sortierung: React-DnD oder @dnd-kit Integration
Titelbild: Goldener Rahmen + Stern-Icon overlay, per Klick auswählbar
Aktionen:
Hover: Delete-Icon (Mülleimer)
Click: Titelbild-Icon (Stern)
Drag: Sortier-Handle erscheint (6-Punkte-Icon)
State Management:
TypeScript
Copy
interface AccommodationImage {
  id: string;
  file: File;
  previewUrl: string;
  isTitle: boolean;
  sortOrder: number;
}

const [images, setImages] = useState<AccommodationImage[]>([]);
Akzeptanzkriterien:
✅ Upload per Drag & Drop oder Click (native input)
✅ Sofortige Vorschau nach Auswahl
✅ Visuelle Sortierung per Drag & Drop
✅ Titelbild-Auswahl mit sofortiger visueller Rückmeldung
✅ Löschen mit Confirm-Dialog
✅ Progressbar für Upload (>5MB Dateien)
✅ Fehleranzeige: "Max. 15 Bilder", "Datei zu groß"
F3 & F4: Moderner, interaktiver Verfügbarkeitskalender
Ziel: Kalender mit sofortiger visueller Rückmeldung bei Sperrungen und modernem Design-System.
Design-Vorgaben (Modern):
css
Copy
/* Tailwind CSS Konfiguration */
.calendar-day {
  @apply w-12 h-12 rounded-lg transition-all duration-200;
  @apply hover:scale-105 hover:bg-gray-100;
}

.calendar-day.available {
  @apply bg-green-100 text-green-800 border border-green-300;
}

.calendar-day.blocked {
  @apply bg-red-100 text-red-800 border border-red-300;
  @apply line-through opacity-60;
}

.calendar-day.today {
  @apply ring-2 ring-blue-500;
}
Interaktionslogik:
TypeScript
Copy
const [blockedDates, setBlockedDates] = useState<Date[]>([]);

const handleBlockPeriod = (startDate: Date, endDate: Date) => {
  const newBlockedDates = eachDayOfInterval({ start: startDate, end: endDate });
  setBlockedDates(prev => [...prev, ...newBlockedDates]);
  
  // Sofortige visuelle Rückmeldung
  toast.success(`${newBlockedDates.length} Tage gesperrt`, {
    icon: '🔒',
    style: { background: '#ef4444', color: 'white' }
  });
};
Kalender-Komponente:
tsx
Copy
<InteractiveCalendar
  blockedDates={blockedDates}
  onDateClick={(date: Date) => toggleBlockDate(date)}
  mode="range-selection" // Für Zeitraum-Sperrung
  showWeekNumbers={true}
  enableYearSwitch={true}
/>
Layout:
Monatsansicht: 7-Spalten Grid, Header mit Wochentagen (Mo-So)
Navigation: Pfeile für Vor/Zurück, Monat/Jahr Dropdown
Heutiger Tag: Blauer Ring
Sperr-Button: "Zeitraum sperren" öffnet Modal mit DateRange-Picker
Sofort-Update: Nach Sperrung werden Tage ohne Reload rot/durchgestrichen
F5: KI-Generierte Anbindungsbeschreibung optimieren
Ziel: DeepSeek-API-Prompt verbessern für individualisierte, aussagekräftige Anbindungsbeschreibungen statt statischem Template.
Aktuelles Problem:
JavaScript
Copy
// ALT: Statischer Prompt
const prompt = `Beschreibe die Anbindung für ${district} in Leipzig/Chemnitz.`;
// Resultat: Immer gleicher Satz, nur Bezirk variiert
Neuer Prompt-Engineering (Dynamisch):
TypeScript
Copy
// Interfaces für bessere Kontextualisierung
interface AccommodationContext {
  district: string;
  city: 'Leipzig' | 'Chemnitz';
  plz: string;
  hasParking: boolean;
  hasBalcony: boolean;
  amenities: string[]; // wifi, kitchen, parking, etc.
  lat?: number;
  lng?: number;
}

// DeepSeek API Call
const generateConnectivityDescription = async (context: AccommodationContext) => {
  const dynamicPrompt = `
Du bist ein lokaler Immobilienexperte für ${context.city}. 
Analysiere die Anbindung für eine Unterkunft im Stadtteil "${context.district}" (PLZ: ${context.plz}).

Berücksichtige:
- ÖPNV-Nähe (Bus, Bahn, Straßenbahn) für diese PLZ
- Gehwege zu Einkaufsmöglichkeiten (Supermärkte, Bäcker)
- Distanz zum Stadtzentrum
- Parkplatzsituation: ${context.hasParking ? 'Vorhanden' : 'Straßenparken'}
- Besondere Merkmale: ${context.amenities.join(', ')}

Schreibe eine natürliche, ansprechende Beschreibung in 2-3 Sätzen. 
VERMEIDE generische Floskeln. Konkrete Details zur Lage.

Beispiel für gute Beschreibungen:
- "Direkt an der Karl-Liebknecht-Straße: Straßenbahnlinie 10 vor der Tür, 7 Min. bis Augustusplatz."
- "Ruhige Wohnlage in Schönefeld: 5 Gehmin. zur S-Bahn, Rewe 200m entfernt."
  `;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: dynamicPrompt }],
      temperature: 0.7,
      max_tokens: 150
    })
  });

  return response.json();
};
UI-Integration:
tsx
Copy
const ConnectivityField = () => {
  const [description, setDescription] = useState('');
  
  const handleGenerate = async () => {
    const context = {
      district, // aus F1
      plz,      // aus Form
      city: plz.startsWith('04') ? 'Leipzig' : 'Chemnitz',
      hasParking: formValues.amenities.includes('parking'),
      amenities: formValues.amenities
    };
    
    setDescription(await generateConnectivityDescription(context));
  };
  
  return (
    <div>
      <button onClick={handleGenerate} type="button">
        <SparklesIcon className="w-4 h-4 mr-2" />
        KI-Beschreibung generieren
      </button>
      <textarea value={description} readOnly rows={3} className="mt-2" />
    </div>
  );
};
Akzeptanzkriterien:
✅ Prompt enthält mindestens 5 Kontext-Parameter
✅ Antwort unter 150 Tokens, 2-3 Sätze
✅ Unterschiedliche PLZ erzeugen unterschiedliche Beschreibungen
✅ Fallback bei API-Fehler: Anzeige "Manuelle Eingabe erforderlich"
✅ Caching: Gleiche PLZ + Ausstattung -> keine Doppel-API-Calls
3. Technische Architektur
Stack-Voraussetzungen:
Frontend: React 18+, TypeScript, Tailwind CSS 3.x
State Management: React Hook Form + Zustand für Bilder/Kalender
API-Client: Axios/Native Fetch mit Retry-Logic
UI Libraries:
@dnd-kit für Bild-Sortierung
react-day-picker für Kalender
lucide-react für Icons
Datei-Struktur:
Copy
src/
├── components/
│   ├── accommodations/
│   │   ├── new/
│   │   │   ├── PLZAutocomplete.tsx
│   │   │   ├── ImageManager.tsx
│   │   │   ├── InteractiveCalendar.tsx
│   │   │   └── ConnectivityGenerator.tsx
├── hooks/
│   ├── useDistrictLookup.ts
│   └── useDeepSeek.ts
├── utils/
│   └── plzDatabase.ts
├── types/
│   └── accommodation.types.ts
└── services/
    └── deepSeek.service.ts
4. Akzeptanzkriterien Gesamt
Table
Copy
#	Kriterium	Prüfmethode
1	Eingabe PLZ 04109 -> Anzeige "Bezirk: Zentrum"	Unit Test + E2E (Cypress)
2	Upload 8 Bilder -> 8 Karten im Grid, 1x Titelbild wählbar	Manuelle QA + Visueller Test
3	Sperrung 15.-20. -> Sofort 6 rote, durchgestrichene Tage	E2E Test mit Screenshots
4	DeepSeek API mit PLZ 09111 liefert Chemnitz-spezifischen Text	Mock + Live-API-Test
5	Mobile Ansicht: Kalender scrollt horizontal, Bilder 2-spaltig	Responsive-Test (Browser DevTools)
5. Nicht-funktionale Anforderungen
Performance: Kalender-Render < 100ms, Bild-Vorschau < 500ms
Accessibility: ARIA-Labels für alle interaktiven Elemente, Tastaturnavigation
Error Handling: Netzwerk-Failures für DeepSeek mit 3x Retry, dann User-Benachrichtigung
Testing: 80% Code-Coverage für neue Komponenten
6. Implementierungs-Reihenfolge (Priorisierung)
P0: PLZ-Automatik (F1) - Blockiert F5
P0: Bild-Management (F2) - Hoher UX-Impact
P1: Kalender-Modernisierung (F4) - Grundlage für F3
P1: Kalender-Interaktivität (F3) - Nutzer-Feedback wichtig
P2: KI-Prompt-Optimierung (F5) - Verbesserung bestehender Funktion
Hinweis für Trae IDE KI: Generiere zunächst die plzDatabase.ts mit allen Leipzig/Chemnitz PLZ (komplett), dann die React-Komponenten mit entsprechenden Props-Interfaces. Nutze react-hook-form für Form-Integration. Stelle sicher, dass alle Interaktionen sofortige visuelle Rückmeldung geben (Toast-Bibliothek: react-hot-toast).