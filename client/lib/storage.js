import { DEFAULT_CYCLE, DEFAULT_STATS } from '@/lib/constants'

export const SETTINGS_KEY = 'focusTimerSettings'
const PRESETS_KEY = 'focusTimerPresets'
const STATS_KEY = 'focusTimerStats'

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function isPresetList(value) {
  return Array.isArray(value) && value.every((item) => (
    item
    && typeof item.name === 'string'
    && item.name.trim().length > 0
    && Number.isFinite(item.duration)
  ))
}

function pickNumbers(source, defaults) {
  return Object.fromEntries(
    Object.keys(defaults).map((key) => {
      const value = source?.[key]
      return [key, Number.isFinite(value) ? value : defaults[key]]
    }),
  )
}

export function loadTimerState(defaults) {
  const settings = readJson(SETTINGS_KEY) ?? {}
  const presets = readJson(PRESETS_KEY)
  const stats = readJson(STATS_KEY) ?? {}

  return {
    isDarkMode: Boolean(settings.isDarkMode),
    isMuted: Boolean(settings.isMuted),
    currentTheme: typeof settings.theme === 'string' ? settings.theme : defaults.currentTheme,
    focusCycle: Boolean(settings.focusCycle),
    cycleSettings: pickNumbers(settings.cycleSettings, defaults.cycleSettings ?? DEFAULT_CYCLE),
    presets: isPresetList(presets) ? presets : defaults.presets,
    stats: pickNumbers(stats, defaults.stats ?? DEFAULT_STATS),
  }
}

export function saveTimerState(state) {
  try {
    writeJson(SETTINGS_KEY, {
      isDarkMode: state.isDarkMode,
      isMuted: state.isMuted,
      theme: state.currentTheme,
      focusCycle: state.focusCycle,
      cycleSettings: state.cycleSettings,
    })
    writeJson(PRESETS_KEY, state.presets)
    writeJson(STATS_KEY, state.stats)
  } catch {
    return
  }
}
