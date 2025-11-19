# Deployment auf Hostinger VPS - Schritt für Schritt

## Voraussetzungen
- ✅ Sie haben bereits einen VPS bei Hostinger
- ✅ SSH-Zugang zum Server
- ✅ Domain `dsk-ug.de` von IONOS

## Schritt 1: DNS Konfiguration bei IONOS

Loggen Sie sich bei IONOS ein und konfigurieren Sie folgende **A-Records**:

| Name | Typ | Ziel |
|------|-----|------|
| `@` (dsk-ug.de) | A | `IHR_HOSTINGER_VPS_IP` |
| `www` | A | `IHR_HOSTINGER_VPS_IP` |
| `admin` | A | `IHR_HOSTINGER_VPS_IP` |
| `api` | A | `IHR_HOSTINGER_VPS_IP` |

⏱️ **Wartezeit:** DNS-Änderungen können 1-24 Stunden dauern.

## Schritt 2: Auf VPS einloggen

```bash
ssh root@IHR_HOSTINGER_VPS_IP
```

Falls Sie einen anderen Benutzer haben:
```bash
ssh benutzername@IHR_HOSTINGER_VPS_IP
```

## Schritt 3: Prüfen der laufenden Dienste ✅

Da bereits 2 Anwendungen laufen, haben wir die Ports geprüft:

**Ergebnis der Port-Prüfung:**
- ✅ Port 5000 (Backend) - FREI
- ✅ Port 8080 (Admin) - FREI  
- ❌ Port 3000 (Client) - BELEGT

**Lösung:** Wir verwenden folgende Ports für DSK-UG:
- **5000** - Backend API
- **8080** - Admin Frontend
- **3002** - Client Frontend (geändert von 3000)

Die `docker-compose.prod.yml` wurde bereits entsprechend angepasst.

## Schritt 4: Docker installieren (falls nicht vorhanden)

Prüfen Sie ob Docker bereits installiert ist:
```bash
docker --version
docker-compose --version
```

Falls nicht installiert:
```bash
# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose installieren (falls nicht dabei)
apt install docker-compose -y

# Docker beim Systemstart aktivieren
systemctl enable docker
systemctl start docker
```

## Schritt 5: Nginx prüfen/installieren

Da Sie bereits andere Anwendungen haben, ist Nginx wahrscheinlich schon installiert:

```bash
nginx -v
systemctl status nginx
```

Falls nicht installiert:
```bash
apt update
apt install nginx -y
systemctl enable nginx
systemctl start nginx
```

## Schritt 6: Projekt auf Server hochladen

**Option A - Mit Git (empfohlen):**
```bash
cd /var/www/
git clone <IHR_GIT_REPO_URL> dsk-ug
cd dsk-ug
```

**Option B - Mit SFTP/SCP von Ihrem Windows-PC:**

Auf Ihrem Windows-PC (PowerShell):
```powershell
# Navigieren Sie zu Ihrem Projektordner
cd "C:\Users\bjkme\Downloads\dsk-ug_monteurunterkünfte_leipzig_-_mehrsprachige_webseite_j8cds7"

# Kopieren mit SCP (ersetzen Sie IP und Benutzername)
scp -r . root@IHR_HOSTINGER_VPS_IP:/var/www/dsk-ug/
```

Oder verwenden Sie ein SFTP-Tool wie **WinSCP** oder **FileZilla**.

## Schritt 7: Umgebungsvariablen konfigurieren

Auf dem VPS:
```bash
cd /var/www/dsk-ug
nano .env
```

Kopieren Sie Ihre `.env` Datei vom lokalen PC, aber **ändern Sie sensitive Daten** für Produktion:

```env
# Database - STARKE PASSWÖRTER verwenden!
MYSQL_DATABASE=dsk_prod
MYSQL_USER=dsk_user
MYSQL_PASSWORD=HIER_STARKES_PASSWORT
MYSQL_ROOT_PASSWORD=HIER_STARKES_ROOT_PASSWORT

# Backend
JWT_SECRET=HIER_SEHR_LANGER_ZUFÄLLIGER_STRING_MINDESTENS_32_ZEICHEN
PORT=5000

# Ihre API Keys (von lokaler .env übernehmen)
DEEPSEEK_API_KEY=sk-...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
MICROSOFT_TENANT_ID=...
MICROSOFT_MAIL_TO=info@dsk-ug.de
SUPABASE_URL=https://...
SUPABASE_KEY=...
```

Speichern mit `Ctrl+O`, dann `Enter`, beenden mit `Ctrl+X`.

## Schritt 8: Docker Container starten

```bash
cd /var/www/dsk-ug

# Container bauen und starten
docker-compose -f docker-compose.prod.yml up -d --build
```

Dies dauert 5-15 Minuten beim ersten Mal.

Prüfen Sie den Status:
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

Mit `Ctrl+C` stoppen Sie die Log-Anzeige.

## Schritt 9: Nginx Reverse Proxy konfigurieren

Erstellen Sie eine neue Site-Konfiguration:
```bash
nano /etc/nginx/sites-available/dsk-ug.conf
```

Fügen Sie folgende Konfiguration ein (passen Sie Ports an falls geändert):

```nginx
# Backend API
server {
    listen 80;
    server_name api.dsk-ug.de;

    location / {
        proxy_pass http://localhost:5000;  # Falls Port geändert: 5001
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Frontend
server {
    listen 80;
    server_name admin.dsk-ug.de;

    location / {
        proxy_pass http://localhost:8080;  # Falls Port geändert: 8081
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Client Frontend (Hauptwebsite)
server {
    listen 80;
    server_name dsk-ug.de www.dsk-ug.de;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Speichern und aktivieren:
```bash
# Site aktivieren
ln -s /etc/nginx/sites-available/dsk-ug.conf /etc/nginx/sites-enabled/

# Nginx Konfiguration testen
nginx -t

# Nginx neu laden
systemctl reload nginx
```

## Schritt 10: SSL Zertifikate mit Let's Encrypt

Installieren Sie Certbot:
```bash
apt install certbot python3-certbot-nginx -y
```

Zertifikate für alle Domains gleichzeitig beantragen:
```bash
certbot --nginx -d dsk-ug.de -d www.dsk-ug.de -d admin.dsk-ug.de -d api.dsk-ug.de
```

Folgen Sie den Anweisungen:
1. E-Mail-Adresse eingeben
2. Nutzungsbedingungen akzeptieren
3. Optional: Newsletter abonnieren (Nein ist OK)
4. **Wichtig:** Wählen Sie "2" für Redirect HTTP -> HTTPS

Certbot wird automatisch:
- SSL-Zertifikate erstellen
- Nginx-Konfiguration aktualisieren
- Auto-Renewal einrichten

## Schritt 11: Firewall konfigurieren (falls aktiv)

Falls UFW (Firewall) aktiv ist:
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw reload
```

## Schritt 12: Testen

1. **Hauptwebsite:** https://dsk-ug.de
2. **Admin Dashboard:** https://admin.dsk-ug.de
3. **API Health Check:** https://api.dsk-ug.de/api/health

## Wartung & Updates

### Logs anschauen
```bash
cd /var/www/dsk-ug
docker-compose -f docker-compose.prod.yml logs -f
```

### Application neu starten
```bash
cd /var/www/dsk-ug
docker-compose -f docker-compose.prod.yml restart
```

### Updates deployen
```bash
cd /var/www/dsk-ug
git pull  # Falls Git verwendet
docker-compose -f docker-compose.prod.yml up -d --build
```

### Datenbank Backup
```bash
docker exec dsk-ug-db-1 mysqldump -u root -p'MYSQL_ROOT_PASSWORD' dsk_prod > backup-$(date +%Y%m%d).sql
```

### Container stoppen
```bash
docker-compose -f docker-compose.prod.yml down
```

## Troubleshooting

### Container läuft nicht
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs backend
```

### SSL Zertifikat erneuern (manuell)
```bash
certbot renew
```

### Nginx Fehler
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

## Wichtige Hinweise für Hostinger VPS

1. **Backups:** Aktivieren Sie automatische VPS-Backups in Hostinger
2. **Monitoring:** Nutzen Sie Hostinger's VPS Monitoring Tools
3. **Ressourcen:** Prüfen Sie RAM/CPU-Auslastung im Hostinger Dashboard
4. **Support:** Bei VPS-Problemen kontaktieren Sie Hostinger Support

## Nächste Schritte

Nach erfolgreichem Deployment sollten Sie:
- [ ] Testen Sie alle Funktionen (Buchung, Admin-Login, Bildupload)
- [ ] Richten Sie Email-Benachrichtigungen ein
- [ ] Konfigurieren Sie regelmäßige Backups
- [ ] Überwachen Sie die Logs für Fehler
