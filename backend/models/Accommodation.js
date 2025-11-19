import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Accommodation', {
  // Basisdaten
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  price_per_night: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  max_guests: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },

  // Medien & Ausstattung
  images: { type: DataTypes.JSON, defaultValue: [] },
  amenities: { type: DataTypes.JSON, defaultValue: [] }, // Features für Kunden-Frontend

  // Standort & Anbindung
  location: { type: DataTypes.STRING, allowNull: true }, // z. B. Zentrum, Nord, Süd...
  address: { type: DataTypes.STRING, allowNull: true },
  postal_code: { type: DataTypes.STRING, allowNull: true },
  connectivity: { type: DataTypes.TEXT, allowNull: true }, // Beschreibung der Anbindung

  // Detailtexte
  details: { type: DataTypes.TEXT, allowNull: true },
  about: { type: DataTypes.TEXT, allowNull: true },

  // Zusatzinfos
  house_rules: { type: DataTypes.TEXT, allowNull: true },
  reviews: { type: DataTypes.JSON, defaultValue: [] }
}, {
  hooks: {
    beforeCreate: (acc) => { if (acc.house_rules == null) acc.house_rules = defaultHouseRules() },
    beforeUpdate: (acc) => { if (acc.house_rules == null) acc.house_rules = defaultHouseRules() }
  }
});

function defaultHouseRules() {
  return [
    'Rücksichtnahme: Bitte achten Sie auf Ruhezeiten (22:00–06:00).',
    'Sauberkeit: Unterkunft besenrein verlassen; Müll fachgerecht entsorgen.',
    'Nichtraucher: Rauchen nur im Außenbereich erlaubt.',
    'Tiere: Haustiere nur nach vorheriger Absprache.',
    'Schlüssel: Verlust umgehend melden; kein Weitergeben an Dritte.',
    'Parken: Nur ausgewiesene Flächen nutzen, keine Zufahrten blockieren.'
  ].join('\n')
}
