import { Maximize, Pause, Play, Settings, BarChart } from 'lucide-react'
import { TIME_PARTS } from '@/lib/constants'
import { formatClock, readTimePart } from '@/lib/time'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Logo from '@/components/Logo'

export default function SetupPanel({
  time,
  initialTime,
  isRunning,
  currentPreset,
  presets,
  currentTask,
  focusCycle,
  onPresetChange,
  onTimePart,
  onTaskChange,
  onToggle,
  onToggleCycle,
  onOpenCycle,
  onFullscreen,
  onOpenSettings,
  onOpenStatistics,
}) {
  const primaryLabel = isRunning ? 'Pause' : time === initialTime ? 'Start' : 'Resume'

  return (
    <>
      <div className="brand">
        <Logo />
        <h1 className="brand__title">Focus Timer</h1>
      </div>

      <div className="block">
        <div className="preset-picker">
          <Select value={currentPreset} onValueChange={onPresetChange}>
            <SelectTrigger aria-label="Select a preset">
              <SelectValue placeholder="Select a preset" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset.name} value={preset.name}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="time-grid">
          {TIME_PARTS.map((part) => (
            <div className="field" key={part.id}>
              <label className="label" htmlFor={part.id}>{part.label}</label>
              <Input
                id={part.id}
                type="number"
                inputMode="numeric"
                min={part.min}
                max={part.max}
                value={readTimePart(time, part.id)}
                onChange={(event) => onTimePart(part.id, event.target.value)}
              />
            </div>
          ))}
        </div>

        <p className="clock">{formatClock(time)}</p>
      </div>

      <div className="block block--tight">
        <Input
          type="text"
          placeholder="What are you focusing on?..."
          value={currentTask}
          onChange={(event) => onTaskChange(event.target.value)}
          aria-label="What are you focusing on?"
        />
      </div>

      <div className="actions">
        <Button className="btn--round btn--theme" size="lg" onClick={onToggle}>
          {isRunning ? <Pause className="icon" /> : <Play className="icon" />}
          {primaryLabel}
        </Button>
        <Button
          size="sm"
          variant={focusCycle ? 'default' : 'outline'}
          className="btn--round"
          aria-pressed={focusCycle}
          onClick={onToggleCycle}
        >
          {focusCycle ? 'Сброс цикла' : 'Цикл фокуса'}
        </Button>
        <Button size="sm" variant="outline" className="btn--round" onClick={onOpenCycle}>
          Настройки цикла
        </Button>
        <Button size="icon" variant="outline" className="btn--round" aria-label="Fullscreen" onClick={onFullscreen}>
          <Maximize className="icon" />
        </Button>
        <Button size="icon" variant="outline" className="btn--round" aria-label="Settings" onClick={onOpenSettings}>
          <Settings className="icon" />
        </Button>
        <Button size="icon" variant="outline" className="btn--round" aria-label="Statistics" onClick={onOpenStatistics}>
          <BarChart className="icon" />
        </Button>
      </div>
    </>
  )
}
