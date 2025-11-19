<template>
  <div class="trust-section">
    <!-- Trust Badges -->
    <div class="trust-badges-container">
      <div class="trust-badges">
        <div class="trust-badge" v-for="badge in trustBadges" :key="badge.id">
          <div class="badge-icon" v-html="badge.icon"></div>
          <div class="badge-content">
            <div class="badge-title">{{ $t(badge.title) }}</div>
            <div class="badge-subtitle">{{ $t(badge.subtitle) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Statistics -->
    <div class="live-stats-container">
      <div class="live-stats">
        <div class="stat-item" v-for="stat in liveStats" :key="stat.id">
          <div class="stat-number" :data-target="stat.value">{{ animatedStats[stat.id] || 0 }}</div>
          <div class="stat-label">{{ $t(stat.label) }}</div>
        </div>
      </div>
    </div>

    <!-- Testimonials -->
    <div class="testimonials-container">
      <h3 class="testimonials-title">{{ $t('trust.testimonials.title') }}</h3>
      <div class="testimonials-grid">
        <div 
          class="testimonial-card" 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          :class="{ active: activeTestimonial === testimonial.id }"
        >
          <div class="testimonial-content">
            <div class="quote-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>
            <p class="testimonial-text">{{ $t(testimonial.text) }}</p>
            <div class="testimonial-author">
              <div class="author-info">
                <div class="author-name">{{ testimonial.author }}</div>
                <div class="author-company">{{ testimonial.company }}</div>
              </div>
              <div class="rating">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= testimonial.rating }">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Testimonial Navigation -->
      <div class="testimonial-nav">
        <button 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          class="nav-dot"
          :class="{ active: activeTestimonial === testimonial.id }"
          @click="setActiveTestimonial(testimonial.id)"
        ></button>
      </div>
    </div>

    <!-- Security & Certifications -->
    <div class="security-section">
      <h4 class="security-title">{{ $t('trust.security.title') }}</h4>
      <div class="security-badges">
        <div class="security-badge" v-for="cert in certifications" :key="cert.id">
          <div class="cert-icon" v-html="cert.icon"></div>
          <div class="cert-name">{{ $t(cert.name) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrustElements',
  data() {
    return {
      activeTestimonial: 1,
      animatedStats: {},
      trustBadges: [
        {
          id: 1,
          icon: `<svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"/>
                </svg>`,
          title: 'trust.badges.verified.title',
          subtitle: 'trust.badges.verified.subtitle'
        },
        {
          id: 2,
          icon: `<svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V19H9V17H5V15H11V13H5V11H9V9H5V7H13.09L19 12.91V15H21V13H23V11H21M15 3L19 7H15V3M13 19V23L16 20L13 19M18 19C16.34 19 15 20.34 15 22S16.34 25 18 25 21 23.66 21 22 19.66 19 18 19Z"/>
                </svg>`,
          title: 'trust.badges.licensed.title',
          subtitle: 'trust.badges.licensed.subtitle'
        },
        {
          id: 3,
          icon: `<svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2M12 17L15.09 20.26L22 21L15.09 21.74L12 25L8.91 21.74L2 21L8.91 20.26L12 17Z"/>
                </svg>`,
          title: 'trust.badges.quality.title',
          subtitle: 'trust.badges.quality.subtitle'
        },
        {
          id: 4,
          icon: `<svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"/>
                </svg>`,
          title: 'trust.badges.support.title',
          subtitle: 'trust.badges.support.subtitle'
        }
      ],
      liveStats: [
        { id: 'bookings', value: 2847, label: 'trust.stats.bookings' },
        { id: 'satisfaction', value: 98, label: 'trust.stats.satisfaction' },
        { id: 'accommodations', value: 156, label: 'trust.stats.accommodations' },
        { id: 'years', value: 12, label: 'trust.stats.years' }
      ],
      testimonials: [
        {
          id: 1,
          text: 'trust.testimonials.testimonial1.text',
          author: 'Michael Weber',
          company: 'Bauunternehmen Weber GmbH',
          rating: 5
        },
        {
          id: 2,
          text: 'trust.testimonials.testimonial2.text',
          author: 'Sandra Müller',
          company: 'Elektro Müller & Co',
          rating: 5
        },
        {
          id: 3,
          text: 'trust.testimonials.testimonial3.text',
          author: 'Thomas Schmidt',
          company: 'Schmidt Montage Services',
          rating: 5
        }
      ],
      certifications: [
        {
          id: 1,
          icon: `<svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"/>
                </svg>`,
          name: 'trust.security.ssl'
        },
        {
          id: 2,
          icon: `<svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12L11 14L15 10M21 12C21 16.97 17.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z"/>
                </svg>`,
          name: 'trust.security.gdpr'
        },
        {
          id: 3,
          icon: `<svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>`,
          name: 'trust.security.certified'
        }
      ]
    }
  },
  mounted() {
    this.animateStats()
    this.startTestimonialRotation()
  },
  methods: {
    animateStats() {
      this.liveStats.forEach(stat => {
        this.animateNumber(stat.id, stat.value)
      })
    },
    animateNumber(statId, target) {
      const duration = 2000
      const start = 0
      const increment = target / (duration / 16)
      let current = start
      
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        this.animatedStats[statId] = Math.floor(current)
      }, 16)
    },
    setActiveTestimonial(id) {
      this.activeTestimonial = id
    },
    startTestimonialRotation() {
      setInterval(() => {
        const currentIndex = this.testimonials.findIndex(t => t.id === this.activeTestimonial)
        const nextIndex = (currentIndex + 1) % this.testimonials.length
        this.activeTestimonial = this.testimonials[nextIndex].id
      }, 5000)
    }
  }
}
</script>

<style scoped>
.trust-section {
  padding: 4rem 0;
}

/* Trust Badges */
.trust-badges-container {
  margin-bottom: 4rem;
}

.trust-badges {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.trust-badge {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.trust-badge:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.badge-icon {
  width: 48px;
  height: 48px;
  margin-right: 1rem;
  color: #3b82f6;
  flex-shrink: 0;
}

.badge-icon svg {
  width: 100%;
  height: 100%;
}

.badge-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.badge-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Live Statistics */
.live-stats-container {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 3rem 2rem;
  margin-bottom: 4rem;
}

.live-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.stat-item {
  padding: 1rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Testimonials */
.testimonials-container {
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 0 2rem;
}

.testimonials-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 3rem;
}

.testimonials-grid {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.testimonial-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transform: translateX(100px);
  transition: all 0.6s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.testimonial-card.active {
  opacity: 1;
  transform: translateX(0);
}

.quote-icon {
  width: 40px;
  height: 40px;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.quote-icon svg {
  width: 100%;
  height: 100%;
}

.testimonial-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #374151;
  margin-bottom: 2rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.1rem;
}

.author-company {
  color: #6b7280;
  font-size: 0.9rem;
}

.rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  font-size: 1.2rem;
  transition: color 0.2s ease;
}

.star.filled {
  color: #fbbf24;
}

/* Testimonial Navigation */
.testimonial-nav {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: #d1d5db;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-dot.active {
  background: #3b82f6;
  transform: scale(1.2);
}

.nav-dot:hover {
  background: #6b7280;
}

/* Security Section */
.security-section {
  text-align: center;
  padding: 2rem;
  background: rgba(249, 250, 251, 0.8);
  border-radius: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.security-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2rem;
}

.security-badges {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.security-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  transition: transform 0.3s ease;
}

.security-badge:hover {
  transform: translateY(-4px);
}

.cert-icon {
  width: 48px;
  height: 48px;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.cert-icon svg {
  width: 100%;
  height: 100%;
}

.cert-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

/* Responsive Design */
@media (max-width: 768px) {
  .trust-badges {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
  
  .live-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    justify-items: center;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-number {
    font-size: 2.25rem;
    background: none;
    -webkit-text-fill-color: currentColor;
    color: #ffffff;
    font-weight: 800;
    line-height: 1.1;
  }
  
  .stat-label {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 600;
    letter-spacing: 0.3px;
  }
  
  .testimonials-title {
    font-size: 2rem;
  }
  
  .testimonial-text {
    font-size: 1rem;
  }
  
  .testimonial-author {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .security-badges {
    gap: 1rem;
  }
}

/* Animation for stats */
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-item {
  animation: countUp 0.6s ease-out;
}
</style>
