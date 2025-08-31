'use client'

import React from 'react'
import { CheckCircle, Clock, Trash2 } from 'lucide-react'

interface Medication {
  id: string
  name: string
  time: string
  onEmptyStomach: string
  days: string[]
  isTaken: boolean
}

interface MedicationListProps {
  medications: Medication[]
  onToggleTaken: (medId: string) => void
  onDeleteMedication: (medId: string) => void
  daysOfWeek: string[]
  type?: 'daily' | 'taken' | 'untaken' | 'approaching' | 'all'
}

const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onToggleTaken,
  onDeleteMedication,
  daysOfWeek,
  type = 'all',
}) => {
  if (medications.length === 0) {
    return (
      <p className="text-center text-gray-500 p-4 border border-gray-200 rounded-xl">
        Bu kategoride ilaç bulunmuyor.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {medications.map((med) => (
        <li
          key={med.id}
          className={`flex items-center justify-between p-4 rounded-xl shadow-sm transition transform hover:translate-y-1 hover:shadow-md ${
            med.isTaken
              ? 'bg-green-100'
              : type === 'untaken'
              ? 'bg-red-50'
              : 'bg-blue-50'
          }`}
        >
          <div className="flex-1 min-w-0">
            <p
              className={`text-lg font-semibold text-blue-800 truncate ${
                med.isTaken ? 'line-through text-gray-500' : ''
              }`}
            >
              {med.name}
            </p>
            <p
              className={`text-sm text-gray-500 ${
                med.isTaken ? 'line-through' : ''
              }`}
            >
              {med.time} -{' '}
              <span className="capitalize">{med.onEmptyStomach}</span> Karnına
              <br />
              <span className="text-xs text-gray-400 mt-1">
                {med.days.length === daysOfWeek.length
                  ? 'Her Gün'
                  : med.days.join(', ')}
              </span>
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleTaken(med.id)}
              className={`p-2 rounded-full ${
                med.isTaken
                  ? 'text-green-500 hover:text-green-700 hover:bg-green-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              } transition`}
              aria-label="Alındı olarak işaretle"
            >
              {med.isTaken ? <CheckCircle size={20} /> : <Clock size={20} />}
            </button>
            <button
              onClick={() => onDeleteMedication(med.id)}
              className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 transition"
              aria-label="İlacı Sil"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default MedicationList
