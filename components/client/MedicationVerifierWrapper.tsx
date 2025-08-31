'use client'

import { useState } from 'react'
import MedicationVerifier from './MedicationVerifier'
import { toggleMedicationStatus } from '@/lib/actions'

interface MedicationVerifierWrapperProps {
  medicationName: string
  medicationId: string
  userId: string
  memberId?: string
  className?: string
}

export default function MedicationVerifierWrapper({ 
  medicationName, 
  medicationId,
  userId,
  memberId,
  className = ""
}: MedicationVerifierWrapperProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleVerificationResult = async (isCorrect: boolean, detectedText?: string) => {
    if (isCorrect && memberId) {
      setIsProcessing(true)
      try {
        await toggleMedicationStatus(userId, memberId, medicationId)
      } catch (error) {
        console.error('İlaç durumu güncellenirken hata:', error)
        alert('İlaç durumu güncellenirken bir hata oluştu.')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <div className={className}>
      <MedicationVerifier 
        medicationName={medicationName}
        onVerificationResult={handleVerificationResult}
      />
      {isProcessing && (
        <p className="text-xs text-blue-600 mt-1">Güncelleniyor...</p>
      )}
    </div>
  )
}
