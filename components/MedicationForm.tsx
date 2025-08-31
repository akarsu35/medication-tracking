'use client'

import React from 'react'
import { PlusCircle } from 'lucide-react'
import MedicationQRReader from './client/MedicationQRReader'

interface NewMedication {
  name: string
  time: string
  onEmptyStomach: string
  days: string[]
}

interface MedicationFormProps {
  selectedMemberName?: string
  newMedication: NewMedication
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onDayChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  daysOfWeek: string[]
}

const MedicationForm: React.FC<MedicationFormProps> = ({
  selectedMemberName,
  newMedication,
  onInputChange,
  onDayChange,
  onSubmit,
  daysOfWeek,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-700">
        İlaç Ekle: {selectedMemberName}
      </h3>
     
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={newMedication.name}
            onChange={onInputChange}
            placeholder="İlaç Adı"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
          <input
            type="time"
            name="time"
            value={newMedication.time}
            onChange={onInputChange}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
          <select
            name="onEmptyStomach"
            value={newMedication.onEmptyStomach}
            onChange={onInputChange}
            className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="aç">Aç Karnına</option>
            <option value="tok">Tok Karnına</option>
          </select>
        </div>
        <div className="mt-4">
          <p className="font-semibold text-gray-700 mb-2">Alınacak Günler:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            {daysOfWeek.map((day) => (
              <label
                key={day}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                <input
                  type="checkbox"
                  value={day}
                  checked={newMedication.days.includes(day)}
                  onChange={onDayChange}
                  className="form-checkbox text-blue-600 rounded"
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105"
        >
          <PlusCircle size={20} />
          <span>İlaç Ekle</span>
        </button>
      </form>
    </div>
  )
}

export default MedicationForm
