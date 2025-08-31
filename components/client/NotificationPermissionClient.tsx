'use client'

import { useState, useEffect } from 'react'

export default function NotificationPermissionClient() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  const handleRequestPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission)
      })
    }
  }

  if (notificationPermission === 'granted') {
    return null
  }

  return (
    <div className="bg-yellow-50 p-4 rounded-xl text-center shadow-md">
      <p className="text-yellow-800 font-medium mb-3">
        Bildirimleri almak için izin verin.
      </p>
      <button
        onClick={handleRequestPermission}
        className="py-2 px-4 bg-yellow-400 text-yellow-900 rounded-xl font-semibold hover:bg-yellow-500 transition transform hover:scale-105"
      >
        Bildirimlere İzin Ver
      </button>
    </div>
  )
}
