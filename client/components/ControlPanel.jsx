import { Minimize, Moon, Pause, Play, RotateCcw, Sun, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ControlPanel({
  isRunning,
  isMuted,
  isDarkMode,
  onToggle,
  onReset,
  onToggleFullscreen,
  onToggleMuted,
  onToggleDarkMode,
}) {
  return (
    <div className="controls">
      <div className="controls__group">
        <Button
          size="icon"
          className="btn--round btn--play"
          aria-label={isRunning ? 'Pause' : 'Start'}
          onClick={onToggle}
        >
          {isRunning ? <Pause className="icon icon--lg" /> : <Play className="icon icon--lg" />}
        </Button>
        <Button size="icon" className="btn--round btn--reset" aria-label="Reset" onClick={onReset}>
          <RotateCcw className="icon icon--lg" />
        </Button>
        <Button size="icon" className="btn--round btn--screen" aria-label="Exit fullscreen" onClick={onToggleFullscreen}>
          <Minimize className="icon icon--lg" />
        </Button>
        <Button
          size="icon"
          className="btn--round btn--sound"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          aria-pressed={isMuted}
          onClick={onToggleMuted}
        >
          {isMuted ? <VolumeX className="icon icon--lg" /> : <Volume2 className="icon icon--lg" />}
        </Button>
        <Button
          size="icon"
          className="btn--round btn--mode"
          aria-label={isDarkMode ? 'Light mode' : 'Dark mode'}
          aria-pressed={isDarkMode}
          onClick={onToggleDarkMode}
        >
          {isDarkMode ? <Sun className="icon icon--lg" /> : <Moon className="icon icon--lg" />}
        </Button>
      </div>
    </div>
  )
}
