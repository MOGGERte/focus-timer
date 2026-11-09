export const DEFAULT_PRESETS = [
  { name: 'Focus 30m', duration: 30 * 60 },
  { name: 'Short Break', duration: 5 * 60 },
  { name: 'Long Break', duration: 15 * 60 },
  { name: 'Break 1h', duration: 60 * 60 },
]

export const DEFAULT_CYCLE = {
  focusDuration: 30 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
}

export const DEFAULT_STATS = {
  sessions: 0,
  totalFocusTime: 0,
  streak: 0,
}

export const THEME_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'forest', label: 'Forest' },
]

export const TIME_PARTS = [
  { id: 'hours', label: 'Hours', min: 0, max: 23 },
  { id: 'minutes', label: 'Minutes', min: 0, max: 59 },
  { id: 'seconds', label: 'Seconds', min: 0, max: 59 },
]

export const CYCLE_FIELDS = [
  { name: 'focusDuration', label: 'Фокус (минуты)', inMinutes: true },
  { name: 'shortBreakDuration', label: 'Короткий перерыв (минуты)', inMinutes: true },
  { name: 'longBreakDuration', label: 'Длинный перерыв (минуты)', inMinutes: true },
  { name: 'longBreakInterval', label: 'Сессий до длинного перерыва', inMinutes: false },
]
