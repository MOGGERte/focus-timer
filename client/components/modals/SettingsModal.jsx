'use client'

import { useState } from 'react'
import { THEME_OPTIONS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SettingsModal({
  open,
  onClose,
  presets,
  onAddPreset,
  onRemovePreset,
  currentTheme,
  onThemeChange,
  isDarkMode,
  onToggleDarkMode,
}) {
  const [name, setName] = useState('')
  const [minutes, setMinutes] = useState('')

  const handleAdd = () => {
    if (!onAddPreset(name, minutes)) return
    setName('')
    setMinutes('')
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="stack">
          <div className="field">
            <Label htmlFor="theme">Theme</Label>
            <Select value={currentTheme} onValueChange={onThemeChange}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {THEME_OPTIONS.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="inline">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <Button id="darkMode" onClick={onToggleDarkMode}>
              {isDarkMode ? 'Disable' : 'Enable'}
            </Button>
          </div>
          <div className="field">
            <Label>Presets</Label>
            {presets.length === 0 ? <p className="muted">No presets yet</p> : null}
            <div className="preset-list">
              {presets.map((preset) => (
                <div key={preset.name} className="preset">
                  <span>{preset.name} ({Math.floor(preset.duration / 60)} minutes)</span>
                  <Button size="sm" variant="destructive" onClick={() => onRemovePreset(preset.name)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="field">
            <Label htmlFor="newPresetName">New Preset Name</Label>
            <Input
              id="newPresetName"
              value={name}
              placeholder="Enter preset name"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="field">
            <Label htmlFor="newPresetDuration">New Preset Duration (minutes)</Label>
            <Input
              id="newPresetDuration"
              type="number"
              inputMode="numeric"
              min="1"
              value={minutes}
              placeholder="Enter duration in minutes"
              onChange={(event) => setMinutes(event.target.value)}
            />
          </div>
          <Button onClick={handleAdd}>Add Preset</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
