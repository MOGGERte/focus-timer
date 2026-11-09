'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import SetupPanel from '@/components/SetupPanel'
import TimerDisplay from '@/components/TimerDisplay'
import FocusCycleSettingsModal from '@/components/modals/FocusCycleSettingsModal'
import SettingsModal from '@/components/modals/SettingsModal'
import StatisticsModal from '@/components/modals/StatisticsModal'
import { useFocusTimer } from '@/hooks/useFocusTimer'

const SPRING = { type: 'spring', stiffness: 300, damping: 25 }

export default function FocusTimer() {
  const timer = useFocusTimer()
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion ? { duration: 0 } : SPRING

  return (
    <div className="app" ref={timer.fullscreenRef}>
      <AnimatePresence mode="wait">
        {timer.isFullscreen ? (
          <motion.div
            key="focus"
            className="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <TimerDisplay
              time={timer.time}
              initialTime={timer.initialTime}
              currentTask={timer.currentTask}
              isRunning={timer.isRunning}
              isMuted={timer.isMuted}
              isDarkMode={timer.isDarkMode}
              onToggle={timer.toggleTimer}
              onReset={timer.resetTimer}
              onToggleFullscreen={timer.toggleFullscreen}
              onToggleMuted={timer.toggleMuted}
              onToggleDarkMode={timer.toggleDarkMode}
            />
          </motion.div>
        ) : (
          <motion.section
            key="setup"
            className="card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={transition}
          >
            <SetupPanel
              time={timer.time}
              initialTime={timer.initialTime}
              isRunning={timer.isRunning}
              currentPreset={timer.currentPreset}
              presets={timer.presets}
              currentTask={timer.currentTask}
              focusCycle={timer.focusCycle}
              onPresetChange={timer.selectPreset}
              onTimePart={timer.updateTimePart}
              onTaskChange={timer.setCurrentTask}
              onToggle={timer.toggleTimer}
              onToggleCycle={timer.toggleFocusCycle}
              onOpenCycle={() => timer.setCycleOpen(true)}
              onFullscreen={timer.toggleFullscreen}
              onOpenSettings={() => timer.setSettingsOpen(true)}
              onOpenStatistics={() => timer.setStatisticsOpen(true)}
            />
          </motion.section>
        )}
      </AnimatePresence>

      <SettingsModal
        open={timer.settingsOpen}
        onClose={() => timer.setSettingsOpen(false)}
        presets={timer.presets}
        onAddPreset={timer.addPreset}
        onRemovePreset={timer.removePreset}
        currentTheme={timer.currentTheme}
        onThemeChange={timer.setCurrentTheme}
        isDarkMode={timer.isDarkMode}
        onToggleDarkMode={timer.toggleDarkMode}
      />
      <StatisticsModal
        open={timer.statisticsOpen}
        onClose={() => timer.setStatisticsOpen(false)}
        stats={timer.stats}
      />
      <FocusCycleSettingsModal
        open={timer.cycleOpen}
        onClose={() => timer.setCycleOpen(false)}
        settings={timer.cycleSettings}
        onSettingChange={timer.updateCycleSetting}
      />
    </div>
  )
}
