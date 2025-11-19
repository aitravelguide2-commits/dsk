## Änderung
- Ersetze die komplette Methode `loadFeatured()` in `src/components/Home.vue` durch die von dir vorgegebene Implementierung.

## Neue Implementierung
```js
async loadFeatured() {
  try {
    // Wir wollen IMMER die ersten 3 aktiven Unterkünfte nach ID sortiert (aufsteigend)
    const res = await accommodationService.getAll({
      isActive: true,
      limit: 3,               // direkt nur 3 holen → schneller + klarer
      sortBy: 'id',           // falls dein Backend das unterstützt (optional)
      sortOrder: 'asc'        // optional
    })

    let source = Array.isArray(res?.data) ? res.data : []

    // Falls aus irgendeinem Grund weniger als 3 kommen (z. B. API-Fehler)
    if (source.length < 3) {
      console.warn('Weniger als 3 Unterkünfte erhalten:', source.length)
    }

    // Normalisierung (Bild aus images[0] nehmen falls keins gesetzt)
    const normalized = source
      .map(a => {
        if (!a) return null
        if (!a.image && Array.isArray(a.images) && a.images.length > 0) {
          a.image = a.images[0]   // oder a.images[0].url je nach Struktur
        }
        return a
      })
      .filter(a => a && a.id && a.name)

    // Sicherheitssortierung falls Backend nicht sortiert hat
    const sorted = normalized.sort((a, b) => (a.id || 0) - (b.id || 0))

    // Nimm genau die ersten 3
    this.featuredAccommodations = sorted.slice(0, 3)

  } catch (e) {
    console.error('Fehler beim Laden der Featured Unterkünfte:', e)
    this.featuredAccommodations = []
  }
}
```

## Hinweise
- Falls `images[0]` ein Objekt mit `url` ist, passe die Zuweisung auf `a.image = (typeof a.images[0] === 'string' ? a.images[0] : a.images[0].url)` an.
- `sortBy`/`sortOrder` sind optional; wenn das Backend sie ignoriert, greift die lokale Sicherheitssortierung.

## Verifikation
- Startseite lädt genau 3 Einträge (IDs aufsteigend), auch bei variierender Datenlage.
- Bilder erscheinen durch den Fallback zuverlässig.
- Konsole zeigt Warnung, falls weniger als 3 Einträge geliefert werden.