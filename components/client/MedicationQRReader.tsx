'use client'
import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function MedicationQRReader({
  onDetected,
}: {
  onDetected: (data: string) => void
}) {
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!qrRef.current) return
    const qrCode = new Html5Qrcode(qrRef.current.id)
    qrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        onDetected(decodedText)
        qrCode.stop()
      },
      (errorMessage) => {
        // Hata yönetimi (isteğe bağlı)
        console.error(`QR kod okuma hatası: ${errorMessage}`)
      }
    )
    return () => {
      qrCode.stop().catch(() => {})
    }
  }, [onDetected])

  return (
    <div
      id="qr-reader"
      ref={qrRef}
      style={{
        width: 300,
        height: 300,
        border: '1px solid #ccc',
        margin: 'auto',
      }}
    />
  )
}
