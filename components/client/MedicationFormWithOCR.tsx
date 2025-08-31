'use client'

import { useState } from 'react'
import CameraOCR from './CameraOCR'

interface MedicationFormWithOCRProps {
  selectedMember?: { id: string; name: string }
  userId: string
  daysOfWeek: string[]
  onSubmit: (formData: FormData) => Promise<void>
}

export default function MedicationFormWithOCR({
  selectedMember,
  userId,
  daysOfWeek,
  onSubmit,
}: MedicationFormWithOCRProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [medicationName, setMedicationName] = useState('')

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedDays(daysOfWeek)
    } else {
      setSelectedDays([])
    }
  }

  const handleDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setSelectedDays(prev => [...prev, day])
    } else {
      setSelectedDays(prev => prev.filter(d => d !== day))
      setSelectAll(false)
    }
  }

  const handleOCRResult = (text: string) => {
    // OCR sonucunu temizle ve ilaç adı olarak ayarla
    const cleanedName = text
      .split('\n')[0] // İlk satırı al
      .replace(/[0-9]/g, '') // Sayıları kaldır
      .replace(/mg|ml|tablet|kapsül|şurup/gi, '') // Dozaj bilgilerini kaldır
      .trim()
    
    if (cleanedName.length > 2) {
      setMedicationName(cleanedName)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    
    // Gün seçimi kontrolü
    if (selectedDays.length === 0) {
      alert('En az bir gün seçmelisiniz!')
      return
    }

    // Seçili günleri form data'ya ekle
    selectedDays.forEach(day => {
      formData.append('days', day)
    })

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Form sıfırlama
      e.currentTarget.reset()
      setSelectedDays([])
      setSelectAll(false)
      setMedicationName('')
    } catch (error) {
      console.error('Form submission error:', error)
      alert('İlaç eklenirken bir hata oluştu!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-700">
        İlaç Ekle: {selectedMember?.name}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İlaç Adı <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="name"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder="İlaç Adı"
                className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                disabled={isSubmitting}
              />
              <CameraOCR 
                onTextDetected={handleOCRResult}
                buttonText="📷"
                className="flex-shrink-0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saat <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="time"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mide Durumu
            </label>
            <select
              name="onEmptyStomach"
              defaultValue="aç"
              className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isSubmitting}
            >
              <option value="aç">Aç Karnına</option>
              <option value="tok">Tok Karnına</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="font-semibold text-gray-700 mb-2">
            Alınacak Günler: <span className="text-red-500">*</span>
          </p>
          
          {/* Hepsini Seç Seçeneği */}
          <div className="mb-3">
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition border border-blue-200">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="form-checkbox text-blue-600 rounded"
                disabled={isSubmitting}
              />
              <span className="font-semibold text-blue-700">🗓️ Hepsini Seç (Her Gün)</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            {daysOfWeek.map((day) => (
              <label
                key={day}
                className={`flex items-center space-x-2 cursor-pointer p-2 rounded-xl transition ${
                  selectedDays.includes(day) 
                    ? 'bg-blue-100 border border-blue-300' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={(e) => handleDayChange(day, e.target.checked)}
                  className="form-checkbox text-blue-600 rounded"
                  disabled={isSubmitting}
                />
                <span className={selectedDays.includes(day) ? 'font-semibold text-blue-700' : ''}>{day}</span>
              </label>
            ))}
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Seçili günler: {selectedDays.length > 0 ? selectedDays.join(', ') : 'Hiçbiri'}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !selectedMember}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span>{isSubmitting ? '⏳' : '➕'}</span>
          <span>{isSubmitting ? 'Ekleniyor...' : 'İlaç Ekle'}</span>
        </button>
      </form>
    </div>
  )
}
