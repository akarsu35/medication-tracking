'use client'

import { useState } from 'react'

interface DeleteConfirmButtonProps {
  onConfirm: () => void
  memberName: string
}

export default function DeleteConfirmButton({ onConfirm, memberName }: DeleteConfirmButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    if (window.confirm(`${memberName} adlı üyeyi silmek istediğinizden emin misiniz?`)) {
      onConfirm()
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
      title="Sil"
    >
      🗑️
    </button>
  )
}
