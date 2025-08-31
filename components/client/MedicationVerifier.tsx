'use client'

import { useState } from 'react'
import CameraOCR from './CameraOCR'

interface MedicationVerifierProps {
  medicationName: string
  onVerificationResult: (isCorrect: boolean, detectedText?: string) => void
  className?: string
}

export default function MedicationVerifier({ 
  medicationName, 
  onVerificationResult,
  className = ""
}: MedicationVerifierProps) {
  const [isVerifying, setIsVerifying] = useState(false)

  const handleOCRResult = (detectedText: string) => {
    setIsVerifying(true)
    
    // Metin temizleme ve karşılaştırma
    const cleanDetected = detectedText
      .toLowerCase()
      .replace(/[^a-zçğıöşü\s]/g, '')
      .trim()
    
    const cleanOriginal = medicationName
      .toLowerCase()
      .replace(/[^a-zçğıöşü\s]/g, '')
      .trim()

    // Benzerlik kontrolü (basit string matching)
    const similarity = calculateSimilarity(cleanDetected, cleanOriginal)
    const isMatch = similarity > 0.7 // %70 benzerlik eşiği

    // Sonucu göster
    const message = isMatch 
      ? `✅ Doğru ilaç! "${medicationName}" doğrulandı.`
      : `❌ Dikkat! Farklı ilaç tespit edildi.\nBeklenen: ${medicationName}\nTespit edilen: ${detectedText}`

    alert(message)
    onVerificationResult(isMatch, detectedText)
    setIsVerifying(false)
  }

  // Basit string benzerlik hesaplama (Levenshtein distance benzeri)
  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1
    if (str1.length === 0 || str2.length === 0) return 0

    // Kelime bazlı karşılaştırma
    const words1 = str1.split(' ').filter(w => w.length > 2)
    const words2 = str2.split(' ').filter(w => w.length > 2)
    
    let matches = 0
    words1.forEach(word1 => {
      if (words2.some(word2 => 
        word2.includes(word1) || word1.includes(word2) || 
        levenshteinDistance(word1, word2) <= 2
      )) {
        matches++
      }
    })

    return words1.length > 0 ? matches / words1.length : 0
  }

  // Levenshtein distance hesaplama
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  return (
    <div className={className}>
      <CameraOCR 
        onTextDetected={handleOCRResult}
        buttonText="🔍 İlaç Doğrula"
      />
      {isVerifying && (
        <p className="text-sm text-blue-600 mt-1">Doğrulanıyor...</p>
      )}
    </div>
  )
}
