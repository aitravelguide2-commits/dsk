## Ziel
- Admin-Dashboard-Login vollständig über Supabase Auth betreiben.
- Rollen („admin“, „editor“, „viewer“) aus einer `profiles`-Tabelle in Supabase beziehen.
- Backend akzeptiert Supabase-JWTs und setzt `req.user` inkl. Rolle.

## Änderungen im Frontend (Admin)
- `admin-frontend/src/stores/auth.js:8` – Login-Flow von `POST /auth/login` auf Supabase `signInWithPassword` umstellen.
  - Nach Login: Session aus Supabase lesen, `access_token` im Speicher halten.
  - `me()` über Supabase `auth.getUser()` und Abfrage `public.profiles` (eigener Datensatz) befüllen.
- `admin-frontend/src/services/api.js:6-13` – `Authorization`-Header mit Supabase `access_token` setzen statt eigenem JWT.
- `admin-frontend/src/router/index.js:27-33` – Guards bleiben, beziehen `auth.isAuth`/`auth.canEdit` aus Supabase/`profiles`.

## Änderungen im Backend
- `backend/middleware/auth.js:5-18` – Supabase-JWT verifizieren statt lokalem `JWT_SECRET`:
  - JWT gegen Supabase JWKS (`/auth/v1/keys`) prüfen oder `@supabase/auth-helpers-node` nutzen.
  - Aus dem verifizierten Token `sub`/`uid` lesen.
  - Mit Service-Role (`SUPABASE_SERVICE_ROLE`) die `public.profiles` nach `id = uid` laden und `req.user = { id, email, name?, role }` setzen.
- `backend/middleware/auth.js:20-21` – `permit(...roles)` unverändert weiterverwenden (nutzt `req.user.role`).
- `backend/routes/auth.js:11-18` – `POST /api/auth/login` wird obsolet; optional stilllegen oder nur `me` bereitstellen.

## Supabase SQL (Profile & Rollen)
Führe diese SQL-Befehle in Supabase aus (SQL-Editor). Ersetzt keine Secrets; Service-Role nur serverseitig nutzen.

```sql
-- 1) Tabelle für Benutzerprofile und Rollen
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  role text not null check (role in ('admin','editor','viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Updated-at Trigger
create extension if not exists moddatetime schema extensions;
create trigger profiles_updated_at before update on public.profiles
for each row execute procedure moddatetime(updated_at);

-- 3) Row Level Security aktivieren
alter table public.profiles enable row level security;

-- 4) Policies: Eigene Daten lesen/bearbeiten
create policy "read own profile" on public.profiles
for select to authenticated
using (auth.uid() = id);

create policy "update own profile" on public.profiles
for update to authenticated
using (auth.uid() = id);

-- 5) Policy: Admins dürfen alle Profile lesen
create policy "admins read all" on public.profiles
for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- 6) Initiale Profile anlegen (Service-Role erforderlich)
-- Zuerst Benutzer in Supabase Auth erstellen (UI oder API), dann dessen UUID verwenden:
-- Beispiel: Admin-Rolle setzen
-- update public.profiles set role = 'admin' where email = 'admin@beispiel.de';
```

## Konfiguration
- `.env` enthält bereits `SUPABASE_PROJECT_URL`, `SUPABASE_ANON`, `SUPABASE_SERVICE_ROLE`.
- Client (Admin-Frontend) nutzt nur `SUPABASE_PROJECT_URL` und `SUPABASE_ANON`.
- Server (Backend) nutzt `SUPABASE_PROJECT_URL` und `SUPABASE_SERVICE_ROLE` zum Laden der `profiles`.

## Migrationspfad
1) Supabase SQL ausführen, Profile/Policies erstellen, Admin-User anlegen.
2) Frontend-Login in `auth.js` auf Supabase umstellen, Axios-Token aus Supabase-Session setzen.
3) Backend-Middleware auf Supabase-JWT-Verifizierung umbauen, `req.user` aus `profiles` befüllen.
4) `POST /api/auth/login` entfernen/deaktivieren; `GET /api/auth/me` belassen (nutzt Middleware).
5) Smoke-Test: Login im Admin-Dashboard, Zugriff auf `meta.edit`-Routen, 401/403 korrekt.

## Sicherheit
- Service-Role-Key niemals ins Frontend bundlen; ausschließlich im Backend.
- Keine Secrets in Logs ausgeben; Tokens nur im Speicher verarbeiten.

## Verifikation
- Manuell: Login mit Admin, Zugriff auf Edit-Routen; Login mit Viewer, Edit blockiert.
- Backend: Geschützte Endpunkte liefern 401 ohne Token, 403 ohne ausreichende Rolle.

Bestätige bitte, dann setze ich die Änderungen exakt an den genannten Stellen um und teste den Flow Ende-zu-Ende.