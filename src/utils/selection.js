export function toNumericId(val) {
  try {
    const num = parseInt(String(val).replace(/\D/g, ''))
    return isNaN(num) ? null : num
  } catch {
    return null
  }
}

export function isValidId(id) {
  return typeof id === 'number' && id > 0 && Number.isInteger(id)
}

export function persistSelection(id) {
  try {
    if (isValidId(id)) localStorage.setItem('selectedAccommodationId', String(id))
  } catch {}
}

export function readPersistedSelection() {
  try {
    const v = localStorage.getItem('selectedAccommodationId')
    const n = toNumericId(v)
    return isValidId(n) ? n : null
  } catch {
    return null
  }
}