import React from 'react'
import type { ItemStatus } from '../models'

export default function StatusBadge({ status }: { status: ItemStatus | string }) {
  const color =
    status === 'reported' ? '#f59e0b' : status === 'claimed' ? '#3b82f6' : status === 'verified' ? '#10b981' : status === 'returned' ? '#6b7280' : '#374151'
  const style: React.CSSProperties = { padding: '4px 8px', borderRadius: 8, background: color, color: '#fff', fontWeight: 600, fontSize: 12 }
  return <span style={style}>{String(status)}</span>
}
