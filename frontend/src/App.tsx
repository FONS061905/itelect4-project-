import React, { useState } from 'react'
import ComplaintCard from './components/ComplaintCard'
import StatusBadge from './components/StatusBadge'
import Usercard from './components/Usercard'
import type { Item, ItemStatus, User } from './types'

const mockUsers: User[] = [
  { id: 1, name: 'Ariel Santos', role: 'student', contact: 'ariel@example.com' },
  { id: 2, name: 'Mariel Cruz', role: 'security', contact: 'mariel@example.com' },
]

const mockItems: Item[] = [
  {
    id: 101,
    title: 'Lost ID Card',
    type: 'lost',
    description: 'Student ID card with blue lanyard, lost near the library entrance.',
    location: 'Main library entrance',
    reporterId: 1,
    status: ItemStatus.Reported,
    createdAt: '2026-07-18T09:00:00Z',
  },
  {
    id: 102,
    title: 'Found Wristwatch',
    type: 'found',
    description: 'Silver wristwatch found in the lecture hall foyer.',
    location: 'Lecture hall foyer',
    reporterId: 2,
    status: ItemStatus.Claimed,
    createdAt: '2026-07-18T10:30:00Z',
  },
]

export default function App() {
  const [items] = useState<Item[]>(mockItems)
  const [users] = useState<User[]>(mockUsers)
  const [selected, setSelected] = useState<Item | null>(items[0] ?? null)

  return (
    <div style={{ padding: 24, display: 'grid', gap: 24 }}>
      <div>
        <h1>GT2 Part 1 Demo</h1>
        <p>Rendering three typed components with mock data.</p>
      </div>

      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h2>Complaint Card</h2>
          <ComplaintCard item={items[0]} onSelect={setSelected} />
        </div>

        <div>
          <h2>Status Badge</h2>
          <StatusBadge status={items[0].status} />
        </div>

        <div>
          <h2>User Card</h2>
          <Usercard user={users[0]} />
        </div>
      </div>

      <div>
        <h2>Selected Item</h2>
        {selected ? (
          <div>
            <p><strong>{selected.title}</strong></p>
            <p>{selected.description}</p>
            <p>{selected.location}</p>
          </div>
        ) : (
          <p>No item selected yet.</p>
        )}
      </div>
    </div>
  )
}
