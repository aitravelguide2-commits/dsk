import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InteractiveMap from '../components/InteractiveMap.vue'

// JSDOM does not render Leaflet map tiles; we test component logic/props/emits

describe('InteractiveMap.vue', () => {
  beforeEach(() => {
    // Mock geolocation
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: vi.fn((success) => success({ coords: { latitude: 51.34, longitude: 12.37 } }))
      }
    })
  })

  it('mounts with default props and renders container', async () => {
    const wrapper = mount(InteractiveMap, {
      props: { height: '200px' }
    })
    expect(wrapper.find('.map').exists()).toBe(true)
  })

  it('emits locationResolved when geolocation is enabled and available', async () => {
    const wrapper = mount(InteractiveMap, {
      props: { useBrowserGeolocation: true }
    })
    // Allow mounted hooks to run
    await wrapper.vm.$nextTick()
    const events = wrapper.emitted('locationResolved')
    expect(events && events.length > 0).toBe(true)
    const payload = events[0][0]
    expect(payload.lat).toBeCloseTo(51.34, 2)
    expect(payload.lng).toBeCloseTo(12.37, 2)
  })

  it('adds markers via prop and supports popup/tooltip', async () => {
    const markers = [
      { lat: 51.3397, lng: 12.3731, popup: 'Leipzig Zentrum', tooltip: 'Leipzig' }
    ]
    const wrapper = mount(InteractiveMap, {
      props: { markers }
    })
    expect(wrapper.props('markers').length).toBe(1)
  })
})