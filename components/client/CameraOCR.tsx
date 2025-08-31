'use client'

import { useState, useRef } from 'react'
import Tesseract from 'tesseract.js'

interface CameraOCRProps {
  onTextDetected: (text: string) => void
  buttonText?: string
  className?: string
}

export default function CameraOCR({ 
  onTextDetected, 
  buttonText = "📷 Kamera ile Oku",
  className = ""
}: CameraOCRProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Arka kamera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error('Kamera erişim hatası:', error)
      alert('Kamera erişimi sağlanamadı. Lütfen kamera izinlerini kontrol edin.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)
    
    try {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      if (!context) return

      // Video boyutlarını canvas'a ayarla
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Video frame'ini canvas'a çiz
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Canvas'tan blob oluştur
      canvas.toBlob(async (blob) => {
        if (!blob) return
        
        try {
          // Tesseract ile OCR işlemi
          const { data: { text } } = await Tesseract.recognize(blob, 'tur', {
            logger: m => console.log(m) // OCR progress log
          })
          
          // Metni temizle ve işle
          const cleanedText = text
            .replace(/[^\w\sÇĞıİÖŞÜçğıöşü]/g, '') // Özel karakterleri temizle
            .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluk yap
            .trim()
          
          if (cleanedText) {
            onTextDetected(cleanedText)
            stopCamera()
          } else {
            alert('Metin algılanamadı. Lütfen tekrar deneyin.')
          }
        } catch (error) {
          console.error('OCR hatası:', error)
          alert('Metin okuma sırasında hata oluştu.')
        } finally {
          setIsProcessing(false)
        }
      }, 'image/jpeg', 0.8)
      
    } catch (error) {
      console.error('Fotoğraf çekme hatası:', error)
      alert('Fotoğraf çekme sırasında hata oluştu.')
      setIsProcessing(false)
    }
  }

  return (
    <div className={className}>
      {!showCamera ? (
        <button
          type="button"
          onClick={startCamera}
          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
        >
          {buttonText}
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">İlaç İsmini Okut</h3>
              <p className="text-sm text-gray-600">İlaç kutusunu kameraya gösterin</p>
            </div>
            
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={captureAndProcess}
                disabled={isProcessing}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isProcessing ? '⏳ İşleniyor...' : '📸 Fotoğraf Çek'}
              </button>
              <button
                onClick={stopCamera}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                ❌
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
