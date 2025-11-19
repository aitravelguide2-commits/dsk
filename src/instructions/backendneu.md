import React, { useState, useEffect } from 'react';
import { BarChart3, Hotel, Calendar, Users, TrendingUp, Plus, Edit, Trash2, ImageIcon, Globe, Save, X } from 'lucide-react';

// Simulierte API-Daten (in deiner echten App würdest du Supabase verwenden)
const mockStats = {
  totalBookings: 156,
  totalRevenue: 45230,
  totalAccommodations: 8,
  pendingBookings: 12
};

const mockAccommodations = [
  {
    id: 1,
    name: { de: 'Moderne Monteurwohnung Zentrum', en: 'Modern Worker Apartment Center', pl: 'Nowoczesne mieszkanie centrum', ro: 'Apartament modern centru' },
    price_per_night: 45,
    max_guests: 4,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    is_active: true,
    bookings: 34
  },
  {
    id: 2,
    name: { de: 'Gemütliche 2-Zimmer Wohnung', en: 'Cozy 2-Room Apartment', pl: 'Przytulne 2-pokojowe mieszkanie', ro: 'Apartament confortabil 2 camere' },
    price_per_night: 38,
    max_guests: 3,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    is_active: true,
    bookings: 28
  },
  {
    id: 3,
    name: { de: 'Großzügige Familienwohnung', en: 'Spacious Family Apartment', pl: 'Przestronne mieszkanie rodzinne', ro: 'Apartament spațios pentru familii' },
    price_per_night: 55,
    max_guests: 6,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    is_active: false,
    bookings: 19
  }
];

const mockRecentBookings = [
  { id: 1, guest_name: 'Jan Kowalski', accommodation: 'Moderne Monteurwohnung', check_in: '2025-11-15', check_out: '2025-11-20', total_price: 225, status: 'confirmed' },
  { id: 2, guest_name: 'Maria Ionescu', accommodation: 'Gemütliche 2-Zimmer', check_in: '2025-11-12', check_out: '2025-11-18', total_price: 228, status: 'pending' },
  { id: 3, guest_name: 'Peter Schmidt', accommodation: 'Großzügige Familienwohnung', check_in: '2025-11-10', check_out: '2025-11-15', total_price: 275, status: 'completed' }
];

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLang, setSelectedLang] = useState('de');
  const [accommodations, setAccommodations] = useState(mockAccommodations);
  const [editingAccommodation, setEditingAccommodation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 text-white/90 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );

  const AccommodationCard = ({ accommodation }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="relative h-48 overflow-hidden group">
        <img 
          src={accommodation.images[0]} 
          alt={accommodation.name[selectedLang]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
            accommodation.is_active 
              ? 'bg-green-500/90 text-white' 
              : 'bg-gray-500/90 text-white'
          }`}>
            {accommodation.is_active ? 'Aktiv' : 'Inaktiv'}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {accommodation.name[selectedLang]}
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">bis {accommodation.max_guests} Gäste</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{accommodation.bookings} Buchungen</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-blue-600">€{accommodation.price_per_night}</p>
            <p className="text-xs text-gray-500">pro Nacht</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setEditingAccommodation(accommodation);
                setShowEditModal(true);
              }}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EditModal = () => {
    if (!showEditModal || !editingAccommodation) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Unterkunft bearbeiten</h2>
            <button 
              onClick={() => setShowEditModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Sprachauswahl */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
              {['de', 'en', 'pl', 'ro'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    selectedLang === lang 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name ({selectedLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={editingAccommodation.name[selectedLang]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Unterkunftsname eingeben..."
              />
            </div>

            {/* Preis & Gäste */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preis pro Nacht (€)
                </label>
                <input
                  type="number"
                  value={editingAccommodation.price_per_night}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max. Gäste
                </label>
                <input
                  type="number"
                  value={editingAccommodation.max_guests}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Bilder Upload Zone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bilder
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Bilder hierher ziehen</p>
                <p className="text-sm text-gray-400">oder klicken zum Auswählen</p>
              </div>
              
              {/* Vorhandene Bilder */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {editingAccommodation.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Aktiv Toggle */}
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={editingAccommodation.is_active}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Unterkunft ist aktiv und buchbar
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Speichern
              </button>
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">DSK-UG Admin</h1>
              <p className="text-sm text-gray-500">Monteurunterkünfte</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <select 
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="border-0 bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="de">🇩🇪 Deutsch</option>
                <option value="en">🇬🇧 English</option>
                <option value="pl">🇵🇱 Polski</option>
                <option value="ro">🇷🇴 Română</option>
              </select>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'accommodations', label: 'Unterkünfte', icon: Hotel },
              { id: 'bookings', label: 'Buchungen', icon: Calendar },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentView === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-5 h-5" />
                  Neue Unterkunft
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Gesamt Buchungen"
                  value={mockStats.totalBookings}
                  icon={Calendar}
                  color="from-blue-500 to-blue-600"
                  trend="+12% zum Vormonat"
                />
                <StatCard
                  title="Gesamtumsatz"
                  value={`€${mockStats.totalRevenue.toLocaleString()}`}
                  icon={TrendingUp}
                  color="from-green-500 to-green-600"
                  trend="+8% zum Vormonat"
                />
                <StatCard
                  title="Unterkünfte"
                  value={mockStats.totalAccommodations}
                  icon={Hotel}
                  color="from-purple-500 to-purple-600"
                />
                <StatCard
                  title="Offene Anfragen"
                  value={mockStats.pendingBookings}
                  icon={Users}
                  color="from-orange-500 to-orange-600"
                />
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">Letzte Buchungen</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Gast</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Unterkunft</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Zeitraum</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Preis</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockRecentBookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">{booking.guest_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.accommodation}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(booking.check_in).toLocaleDateString('de-DE')} - {new Date(booking.check_out).toLocaleDateString('de-DE')}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">€{booking.total_price}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {booking.status === 'confirmed' ? 'Bestätigt' :
                               booking.status === 'pending' ? 'Offen' : 'Abgeschlossen'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentView === 'accommodations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Unterkünfte</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-5 h-5" />
                  Neue Unterkunft
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map(acc => (
                  <AccommodationCard key={acc.id} accommodation={acc} />
                ))}
              </div>
            </div>
          )}

          {currentView === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Alle Buchungen</h2>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="p-6">
                  <p className="text-gray-600">Buchungsverwaltung - Coming soon...</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <EditModal />
    </div>
  );
};

export default AdminDashboard;