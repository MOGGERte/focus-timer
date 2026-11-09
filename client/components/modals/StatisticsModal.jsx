import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDuration } from '@/lib/time'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart__tooltip">
      <p>{label}</p>
      <p>{payload[0].value}</p>
    </div>
  )
}

export default function StatisticsModal({ open, onClose, stats }) {
  const chartData = [
    { name: 'Sessions', value: stats.sessions },
    { name: 'Minutes', value: Math.floor(stats.totalFocusTime / 60) },
    { name: 'Streak', value: stats.streak },
  ]

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Statistics</DialogTitle>
        </DialogHeader>
        <div className="stack">
          <div className="stats">
            <p>Total Sessions: {stats.sessions}</p>
            <p>Total Focus Time: {formatDuration(stats.totalFocusTime)}</p>
            <p>Current Streak: {stats.streak} days</p>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted)" tick={{ fill: 'var(--text)', fontSize: 12 }} />
                <YAxis stroke="var(--muted)" tick={{ fill: 'var(--text)', fontSize: 12 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'var(--accent)' }} content={<ChartTooltip />} />
                <Bar dataKey="value" fill="var(--theme-start)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
