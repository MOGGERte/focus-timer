'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DEFAULT_CYCLE,
  DEFAULT_PRESETS,
  DEFAULT_STATS,
  THEME_OPTIONS,
} from '@/lib/constants'
import { exitFullscreen, requestFullscreen } from '@/lib/fullscreen'
import { loadTimerState, saveTimerState } from '@/lib/storage'
import { replaceTimePart } from '@/lib/time'

const INITIAL_SECONDS = 25 * 60
const THEME_IDS = new Set(THEME_OPTIONS.map((theme) => theme.value))

function requestNotifications() {
  if (typeof Notification === 'undefined' || Notification.permission !== 'default') return
  Notification.requestPermission().catch(() => {})
}

function playAlarm(audio) {
  if (!audio) return
  audio.currentTime = 0
  audio.play().catch(() => {})
}

function notify(body) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  try {
    new Notification('Focus Timer', { body })
  } catch {
    return
  }
}

export function useFocusTimer() {
  const [time, setTime] = useState(INITIAL_SECONDS)
  const [initialTime, setInitialTime] = useState(INITIAL_SECONDS)
  const [isRunning, setIsRunning] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentPreset, setCurrentPreset] = useState()
  const [presets, setPresets] = useState(DEFAULT_PRESETS)
  const [isBreak, setIsBreak] = useState(false)
  const [focusCycle, setFocusCycle] = useState(false)
  const [cycleStep, setCycleStep] = useState(0)
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [currentTheme, setCurrentTheme] = useState('default')
  const [currentTask, setCurrentTask] = useState('')
  const [cycleSettings, setCycleSettings] = useState(DEFAULT_CYCLE)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [statisticsOpen, setStatisticsOpen] = useState(false)
  const [cycleOpen, setCycleOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [phaseId, setPhaseId] = useState(0)

  const fullscreenRef = useRef(null)
  const audioRef = useRef(null)
  const endsAtRef = useRef(0)
  const sessionCountedRef = useRef(false)
  const phaseLockRef = useRef(false)
  const timeRef = useRef(time)
  const isBreakRef = useRef(isBreak)
  const phaseRef = useRef({})

  timeRef.current = time
  isBreakRef.current = isBreak
  phaseRef.current = {
    isBreak,
    isMuted,
    focusCycle,
    cycleStep,
    cycleSettings,
    initialTime,
  }

  useEffect(() => {
    const saved = loadTimerState({
      isDarkMode: false,
      isMuted: false,
      currentTheme: 'default',
      focusCycle: false,
      cycleSettings: DEFAULT_CYCLE,
      presets: DEFAULT_PRESETS,
      stats: DEFAULT_STATS,
    })

    setIsDarkMode(saved.isDarkMode)
    setIsMuted(saved.isMuted)
    setCurrentTheme(THEME_IDS.has(saved.currentTheme) ? saved.currentTheme : 'default')
    setFocusCycle(saved.focusCycle)
    setCycleSettings(saved.cycleSettings)
    setPresets(saved.presets)
    setStats(saved.stats)
    audioRef.current = new Audio('/alarm.wav')
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveTimerState({
      isDarkMode,
      isMuted,
      currentTheme,
      focusCycle,
      cycleSettings,
      presets,
      stats,
    })
  }, [hydrated, isDarkMode, isMuted, currentTheme, focusCycle, cycleSettings, presets, stats])

  useEffect(() => {
    if (!hydrated) return
    document.documentElement.dataset.mode = isDarkMode ? 'dark' : 'light'
    document.documentElement.dataset.theme = currentTheme
  }, [hydrated, isDarkMode, currentTheme])

  const applyDuration = useCallback((seconds) => {
    setTime(seconds)
    setInitialTime(seconds)
    sessionCountedRef.current = false
    if (isRunning) endsAtRef.current = Date.now() + seconds * 1000
  }, [isRunning])

  const countFocusSession = useCallback(() => {
    setStats((prev) => ({ ...prev, sessions: prev.sessions + 1 }))
    sessionCountedRef.current = true
  }, [])

  const startPhase = useCallback((seconds, { breakMode, countSession, fullscreen }) => {
    setTime(seconds)
    setInitialTime(seconds)
    setIsBreak(breakMode)
    setPhaseId((id) => id + 1)
    setIsRunning(seconds > 0)
    if (!breakMode && countSession && seconds > 0) countFocusSession()
    if (fullscreen && seconds > 0) {
      requestFullscreen(fullscreenRef.current)
      setIsFullscreen(true)
    }
  }, [countFocusSession])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTime(phaseRef.current.initialTime)
    setIsBreak(false)
    setCycleStep(0)
    sessionCountedRef.current = false
  }, [])

  const finishPhase = useCallback(() => {
    const phase = phaseRef.current
    if (!phase.isMuted) playAlarm(audioRef.current)
    notify(phase.isBreak ? 'Break time is over!' : 'Focus session completed!')

    if (!phase.focusCycle) {
      if (phase.isBreak) {
        setIsRunning(false)
        return
      }
      startPhase(phase.cycleSettings.shortBreakDuration, {
        breakMode: true,
        countSession: false,
        fullscreen: true,
      })
      return
    }

    const step = phase.cycleStep
    const settings = phase.cycleSettings
    if (step >= settings.longBreakInterval * 2 - 1) {
      resetTimer()
      return
    }

    setCycleStep(step + 1)
    if (step % 2 === 0) {
      const duration = step === settings.longBreakInterval * 2 - 2
        ? settings.longBreakDuration
        : settings.shortBreakDuration
      startPhase(duration, { breakMode: true, countSession: false, fullscreen: true })
      return
    }

    startPhase(settings.focusDuration, {
      breakMode: false,
      countSession: true,
      fullscreen: true,
    })
  }, [resetTimer, startPhase])

  useEffect(() => {
    if (!isRunning) return undefined

    const startedAt = Date.now()
    endsAtRef.current = startedAt + timeRef.current * 1000
    let accountedAt = startedAt

    const id = window.setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - accountedAt) / 1000)
      if (elapsed > 0) {
        accountedAt += elapsed * 1000
        if (!isBreakRef.current) {
          setStats((prev) => ({ ...prev, totalFocusTime: prev.totalFocusTime + elapsed }))
        }
      }
      const remaining = Math.max(0, Math.ceil((endsAtRef.current - now) / 1000))
      setTime((prev) => (prev === remaining ? prev : remaining))
    }, 250)

    return () => window.clearInterval(id)
  }, [isRunning, phaseId])

  useEffect(() => {
    if (!isRunning || time !== 0) {
      phaseLockRef.current = false
      return
    }
    if (phaseLockRef.current) return
    phaseLockRef.current = true
    finishPhase()
  }, [isRunning, time, finishPhase])

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false)
      return
    }
    if (time <= 0) return
    if (!isBreak && !sessionCountedRef.current) countFocusSession()
    setIsRunning(true)
    requestNotifications()
  }, [isRunning, time, isBreak, countFocusSession])

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen()
      setIsFullscreen(false)
      return
    }
    requestFullscreen(fullscreenRef.current)
    setIsFullscreen(true)
  }, [isFullscreen])

  const toggleFocusCycle = useCallback(() => {
    if (focusCycle) {
      setFocusCycle(false)
      resetTimer()
      return
    }
    setFocusCycle(true)
    setCycleStep(0)
    startPhase(cycleSettings.focusDuration, {
      breakMode: false,
      countSession: true,
      fullscreen: true,
    })
    requestNotifications()
  }, [focusCycle, cycleSettings.focusDuration, resetTimer, startPhase])

  const selectPreset = useCallback((name) => {
    const preset = presets.find((item) => item.name === name)
    if (!preset) return
    setCurrentPreset(name)
    applyDuration(preset.duration)
  }, [presets, applyDuration])

  const updateTimePart = useCallback((part, rawValue) => {
    applyDuration(replaceTimePart(time, part, rawValue))
  }, [time, applyDuration])

  const addPreset = useCallback((name, minutes) => {
    const trimmed = name.trim()
    const duration = Number.parseInt(minutes, 10) * 60
    if (!trimmed || !Number.isFinite(duration) || duration <= 0) return false
    let added = false
    setPresets((prev) => {
      if (prev.some((preset) => preset.name === trimmed)) return prev
      added = true
      return [...prev, { name: trimmed, duration }]
    })
    return added
  }, [])

  const removePreset = useCallback((name) => {
    setPresets((prev) => prev.filter((preset) => preset.name !== name))
  }, [])

  const updateCycleSetting = useCallback((name, rawValue, inMinutes) => {
    const parsed = Number.parseInt(rawValue, 10)
    if (Number.isNaN(parsed) || parsed < 0) return
    setCycleSettings((prev) => ({
      ...prev,
      [name]: inMinutes ? parsed * 60 : parsed,
    }))
  }, [])

  const toggleTimerRef = useRef(toggleTimer)
  const resetTimerRef = useRef(resetTimer)
  toggleTimerRef.current = toggleTimer
  resetTimerRef.current = resetTimer

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement))
    }
    const onKeyDown = (event) => {
      const tag = event.target?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || event.target?.isContentEditable
      if (typing || document.querySelector('[role="dialog"]')) return
      if (event.code === 'Space') {
        if (tag === 'BUTTON') return
        event.preventDefault()
        toggleTimerRef.current()
        return
      }
      if (event.code === 'KeyR' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        resetTimerRef.current()
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return {
    fullscreenRef,
    time,
    initialTime,
    isRunning,
    isMuted,
    isFullscreen,
    isDarkMode,
    currentPreset,
    presets,
    focusCycle,
    stats,
    currentTheme,
    currentTask,
    cycleSettings,
    settingsOpen,
    statisticsOpen,
    cycleOpen,
    setCurrentTask,
    setCurrentTheme,
    setSettingsOpen,
    setStatisticsOpen,
    setCycleOpen,
    toggleTimer,
    resetTimer,
    toggleFullscreen,
    toggleFocusCycle,
    toggleMuted: () => setIsMuted((value) => !value),
    toggleDarkMode: () => setIsDarkMode((value) => !value),
    selectPreset,
    updateTimePart,
    addPreset,
    removePreset,
    updateCycleSetting,
  }
}
