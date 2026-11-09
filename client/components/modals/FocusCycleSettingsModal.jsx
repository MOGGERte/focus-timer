import { CYCLE_FIELDS } from '@/lib/constants'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function FocusCycleSettingsModal({ open, onClose, settings, onSettingChange }) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Настройки цикла фокуса</DialogTitle>
        </DialogHeader>
        <div className="stack">
          {CYCLE_FIELDS.map((field) => {
            const value = field.inMinutes ? settings[field.name] / 60 : settings[field.name]
            return (
              <div className="field" key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={value}
                  onChange={(event) => onSettingChange(field.name, event.target.value, field.inMinutes)}
                />
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
