const PART_LIMITS = {
  hours: [0, 23],
  minutes: [0, 59],
  seconds: [0, 59],
}

export function parseInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

export function readTimePart(totalSeconds, part) {
  const safe = Math.max(0, Math.floor(totalSeconds) || 0)
  if (part === 'hours') return Math.floor(safe / 3600)
  if (part === 'minutes') return Math.floor((safe % 3600) / 60)
  return safe % 60
}

export function replaceTimePart(totalSeconds, part, rawValue) {
  const [min, max] = PART_LIMITS[part]
  const next = Math.min(max, Math.max(min, parseInteger(rawValue, min)))
  const hours = part === 'hours' ? next : readTimePart(totalSeconds, 'hours')
  const minutes = part === 'minutes' ? next : readTimePart(totalSeconds, 'minutes')
  const seconds = part === 'seconds' ? next : readTimePart(totalSeconds, 'seconds')
  return hours * 3600 + minutes * 60 + seconds
}

export function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const clock = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  if (hours <= 0) return clock
  return `${String(hours).padStart(2, '0')}:${clock}`
}

export function formatDuration(totalSeconds) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  return `${hours}h ${minutes}m`
}
