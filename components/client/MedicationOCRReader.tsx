'use client'
import { useRef, useState } from 'react'
import Tesseract from 'tesseract.js'

export default function MedicationOCRReader({
  onTextDetected,
}: {
  onTextDetected: (text: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const { data } = await Tesseract.recognize(file, 'tur') // Türkçe için 'tur'
    setLoading(false)
    onTextDetected(data.text)
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-2 rounded bg-blue-600 text-white"
      >
        {loading ? 'Okunuyor...' : 'Kamera ile İlaç İsmini Oku'}
      </button>
    </div>
  )
}
