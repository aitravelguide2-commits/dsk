<template>
  <q-page class="modern-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="dashboard-title">Dashboard</h1>
          <p class="dashboard-subtitle">Willkommen zurück! Hier ist eine Übersicht Ihrer Aktivitäten.</p>
        </div>
        <q-btn 
          label="Neue Unterkunft" 
          color="primary" 
          icon="add" 
          @click="$router.push('/accommodations/new')"
          unelevated
          class="add-btn"
        />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-blue" @click="animateCard('bookings')">
        <div class="kpi-icon-container">
          <q-icon name="event_available" size="32px" />
        </div>
        <div class="kpi-content">
          <div class="kpi-label">Buchungen</div>
          <div class="kpi-value">{{ animatedStats.bookings }}</div>
          <div class="kpi-trend">
            <q-icon name="trending_up" size="16px" />
            <span>+12% vs. letzter Monat</span>
          </div>
        </div>
        <div class="kpi-decoration"></div>
      </div>

      <div class="kpi-card kpi-green" @click="animateCard('revenue')">
        <div class="kpi-icon-container">
          <q-icon name="euro" size="32px" />
        </div>
        <div class="kpi-content">
          <div class="kpi-label">Umsatz</div>
          <div class="kpi-value">€ {{ animatedStats.revenue }}</div>
          <div class="kpi-trend">
            <q-icon name="trending_up" size="16px" />
            <span>+8% vs. letzter Monat</span>
          </div>
        </div>
        <div class="kpi-decoration"></div>
      </div>

      <div class="kpi-card kpi-purple" @click="animateCard('accommodations')">
        <div class="kpi-icon-container">
          <q-icon name="hotel" size="32px" />
        </div>
        <div class="kpi-content">
          <div class="kpi-label">Unterkünfte</div>
          <div class="kpi-value">{{ animatedStats.accommodations }}</div>
          <div class="kpi-trend">
            <q-icon name="trending_flat" size="16px" />
            <span>Keine Änderung</span>
          </div>
        </div>
        <div class="kpi-decoration"></div>
      </div>

      <div class="kpi-card kpi-orange" @click="animateCard('pending')">
        <div class="kpi-icon-container">
          <q-icon name="pending_actions" size="32px" />
        </div>
        <div class="kpi-content">
          <div class="kpi-label">Offen</div>
          <div class="kpi-value">{{ animatedStats.pending }}</div>
          <div class="kpi-trend">
            <q-icon name="trending_down" size="16px" />
            <span>-3 seit gestern</span>
          </div>
        </div>
        <div class="kpi-decoration"></div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Bookings Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Buchungen Übersicht</h3>
            <p class="chart-subtitle">Letzte 6 Monate</p>
          </div>
          <q-btn-dropdown 
            flat 
            dense 
            icon="more_vert" 
            dropdown-icon="none"
            class="chart-menu"
          >
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>Exportieren</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Drucken</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Umsatz Entwicklung</h3>
            <p class="chart-subtitle">Letzte 6 Monate</p>
          </div>
          <q-btn-dropdown 
            flat 
            dense 
            icon="more_vert" 
            dropdown-icon="none"
            class="chart-menu"
          >
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>Exportieren</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Drucken</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="chart-container">
          <canvas ref="revenueCanvas"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Bookings Table -->
    <div class="table-card">
      <div class="table-header">
        <div>
          <h3 class="table-title">Letzte Buchungen</h3>
          <p class="table-subtitle">Neueste Aktivitäten</p>
        </div>
        <q-btn 
          flat 
          label="Alle anzeigen" 
          icon-right="arrow_forward"
          @click="$router.push('/bookings')"
          class="view-all-btn"
        />
      </div>
      <q-table 
        :rows="recent" 
        :columns="columns" 
        row-key="id" 
        flat 
        hide-pagination 
        :rows-per-page-options="[10]"
        class="modern-table"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge 
              :color="getStatusColor(props.row.status)" 
              :label="getStatusLabel(props.row.status)"
              class="status-badge"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useDashboard } from '../stores/dashboard.js'
import Chart from 'chart.js/auto'

const dashboard = useDashboard()
const chartCanvas = ref(null)
const revenueCanvas = ref(null)

const animatedStats = reactive({
  bookings: 0,
  revenue: 0,
  accommodations: 0,
  pending: 0
})

const animateValue = (key, target, duration = 1000) => {
  const start = animatedStats[key]
  const range = target - start
  const startTime = performance.now()
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    
    animatedStats[key] = Math.floor(start + range * easeOutQuart)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

const animateCard = (type) => {
  // Add pulse animation on click
  const card = event.currentTarget
  card.style.transform = 'scale(0.95)'
  setTimeout(() => {
    card.style.transform = 'scale(1)'
  }, 150)
}

onMounted(async () => {
  await dashboard.fetchStats()
  await dashboard.fetchChart()
  await dashboard.fetchRecent()
  
  // Animate stats
  setTimeout(() => {
    animateValue('bookings', stats.totalBookings)
    animateValue('revenue', stats.totalRevenue)
    animateValue('accommodations', stats.totalAccommodations)
    animateValue('pending', stats.pendingBookings)
  }, 300)
  
  // Create bookings chart
  if (chartCanvas.value) {
    new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        ...dashboard.chart,
        datasets: dashboard.chart.datasets.map(ds => ({
          ...ds,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            borderRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              font: { size: 12 },
              color: '#64748b'
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: { size: 12 },
              color: '#64748b'
            }
          }
        }
      }
    })
  }
  
  // Create revenue chart
  if (revenueCanvas.value) {
    const revenueData = {
      labels: dashboard.chart.labels,
      datasets: [{
        label: 'Umsatz',
        data: dashboard.chart.datasets[0]?.data.map(v => v * 50) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    }
    
    new Chart(revenueCanvas.value, {
      type: 'bar',
      data: revenueData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            borderRadius: 8,
            callbacks: {
              label: (context) => `€ ${context.parsed.y}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              font: { size: 12 },
              color: '#64748b',
              callback: (value) => `€ ${value}`
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: { size: 12 },
              color: '#64748b'
            }
          }
        }
      }
    })
  }
})

const columns = [
  { name: 'guest_name', field: 'guest_name', label: 'Gast', align: 'left' },
  { name: 'accommodation', field: row => row.Accommodation?.name || '-', label: 'Unterkunft', align: 'left' },
  { name: 'dates', field: row => `${new Date(row.check_in).toLocaleDateString('de-DE')} - ${new Date(row.check_out).toLocaleDateString('de-DE')}`, label: 'Zeitraum', align: 'left' },
  { name: 'total_price', field: 'total_price', label: 'Preis', format: v => `€ ${v}`, align: 'right' },
  { name: 'status', field: 'status', label: 'Status', align: 'center' }
]

const getStatusColor = (status) => {
  const colors = {
    confirmed: 'positive',
    pending: 'warning',
    cancelled: 'negative',
    completed: 'info'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    confirmed: 'Bestätigt',
    pending: 'Ausstehend',
    cancelled: 'Storniert',
    completed: 'Abgeschlossen'
  }
  return labels[status] || status
}

const { stats, recent } = dashboard
</script>

<style scoped>
.modern-dashboard {
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.add-btn {
  height: 48px;
  padding: 0 24px;
  border-radius: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.kpi-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 28px;
  display: flex;
  gap: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.kpi-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  color: white;
  flex-shrink: 0;
}

.kpi-blue .kpi-icon-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.kpi-green .kpi-icon-container {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
}

.kpi-purple .kpi-icon-container {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  box-shadow: 0 8px 16px rgba(139, 92, 246, 0.3);
}

.kpi-orange .kpi-icon-container {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 8px 16px rgba(245, 158, 11, 0.3);
}

.kpi-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kpi-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #10b981;
  font-weight: 600;
}

.kpi-decoration {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  opacity: 0.05;
}

.kpi-blue .kpi-decoration {
  background: #667eea;
}

.kpi-green .kpi-decoration {
  background: #10b981;
}

.kpi-purple .kpi-decoration {
  background: #8b5cf6;
}

.kpi-orange .kpi-decoration {
  background: #f59e0b;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.chart-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.chart-menu {
  color: #64748b;
}

.chart-container {
  height: 300px;
  position: relative;
}

.table-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.table-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.table-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.view-all-btn {
  color: #667eea;
  font-weight: 600;
}

.modern-table {
  box-shadow: none;
}

.modern-table :deep(thead) {
  background: #f8fafc;
}

.modern-table :deep(th) {
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.modern-table :deep(tbody tr) {
  transition: all 0.2s ease;
}

.modern-table :deep(tbody tr:hover) {
  background: #f8fafc;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
}

@media (max-width: 768px) {
  .modern-dashboard {
    padding: 20px;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>