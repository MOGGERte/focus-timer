import { formatClock } from '@/lib/time'
import ControlPanel from '@/components/ControlPanel'

export default function TimerDisplay({
  time,
  initialTime,
  currentTask,
  isRunning,
  isMuted,
  isDarkMode,
  onToggle,
  onReset,
  onToggleFullscreen,
  onToggleMuted,
  onToggleDarkMode,
}) {
  const ratio = initialTime > 0 ? ((initialTime - time) / initialTime) * 100 : 0
  const progress = Math.min(100, Math.max(0, ratio))

  return (
    <>
      <div className="progress" aria-hidden="true">
        <div className="progress__bar" style={{ '--progress': `${progress}%` }} />
      </div>
      <p className="timer__time" role="timer">{formatClock(time)}</p>
      {currentTask ? <p className="timer__task">{currentTask}</p> : null}
      <ControlPanel
        isRunning={isRunning}
        isMuted={isMuted}
        isDarkMode={isDarkMode}
        onToggle={onToggle}
        onReset={onReset}
        onToggleFullscreen={onToggleFullscreen}
        onToggleMuted={onToggleMuted}
        onToggleDarkMode={onToggleDarkMode}
      />
    </>
  )
}
