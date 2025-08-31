'use client'

import React, { useState, useEffect } from 'react'
import {
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import FamilyMemberSelector from '../components/FamilyMemberSelector'
import MedicationForm from '../components/MedicationForm'
import SearchBar from '../components/SearchBar'
import MedicationList from '../components/MedicationList'
import NavigationBar from '../components/NavigationBar'
import NotificationPermissionComponent from '../components/NotificationPermission'
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth'

const App = () => {
  // Uygulamanın farklı görünümleri arasında geçiş yapmak için kullanılan state.
  const [currentView, setCurrentView] = useState('dailyProgram')

  // Haftanın günlerini Pazartesi'den başlatacak şekilde tanımlar.
  const daysOfWeek = [
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
    'Pazar',
  ]

  // Seçilen tarihi yönetmek için state. Başlangıçta bugünün tarihi.
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Aile üyelerini ve onların ilaç listelerini yöneten ana state.
  const [familyMembers, setFamilyMembers] = useState<any[]>([])

  // Seçilen aile üyesini tutan state.
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<string | null>(null)

  // Yeni ilaç eklemek için form verileri.
  const [newMedication, setNewMedication] = useState({
    name: '',
    time: '',
    onEmptyStomach: 'aç',
    days: [],
  })

  // Yeni aile üyesi eklemek için form verisi.
  const [newFamilyMemberName, setNewFamilyMemberName] = useState('')

  // Arama sorgusunu tutan state.
  const [searchQuery, setSearchQuery] = useState('')

  // Bildirim izni durumu
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  // Firebase state'leri
  const [db, setDb] = useState(null)
  const [auth, setAuth] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Notification permission'ı client-side'da kontrol etmek için useEffect
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Uygulama ve Firebase'i başlatmak için useEffect hook'u.
  useEffect(() => {
    // Firebase yapılandırması
    const firebaseConfig = (() => {
      try {
        if (typeof window !== 'undefined' && (window as any).__firebase_config) {
          return JSON.parse((window as any).__firebase_config)
        }
        return {}
      } catch (error) {
        console.warn('Firebase config parse hatası:', error)
        return {}
      }
    })()
    const appId = typeof window !== 'undefined' && (window as any).__app_id !== 'undefined' 
      ? (window as any).__app_id 
      : 'default-app-id'
    const initialAuthToken =
      typeof window !== 'undefined' && (window as any).__initial_auth_token !== 'undefined' 
        ? (window as any).__initial_auth_token 
        : null

    try {
      const app = initializeApp(firebaseConfig)
      const firestore = getFirestore(app)
      const firebaseAuth = getAuth(app)
      setDb(firestore)
      setAuth(firebaseAuth)

      const handleAuth = async () => {
        if (initialAuthToken) {
          await signInWithCustomToken(firebaseAuth, initialAuthToken)
        } else {
          await signInAnonymously(firebaseAuth)
        }
      }

      handleAuth()

      onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setUserId(user.uid)
        } else {
          // Eğer kullanıcı yoksa anonim olarak giriş yap.
          signInAnonymously(firebaseAuth)
        }
        setIsLoading(false)
      })
    } catch (error) {
      console.error('Firebase başlatılırken bir hata oluştu:', error)
      setIsLoading(false)
    }
  }, [])

  // Firebase'den verileri çekmek için useEffect hook'u.
  useEffect(() => {
    if (!db || !userId) return

    // Aile üyeleri koleksiyonuna referans.
    const familyMembersColRef = collection(
      db,
      `artifacts/${
        typeof window !== 'undefined' && (window as any).__app_id !== 'undefined' 
          ? (window as any).__app_id 
          : 'default-app-id'
      }/users/${userId}/familyMembers`
    )

    const unsubscribe = onSnapshot(familyMembersColRef, (snapshot) => {
      const membersData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      setFamilyMembers(membersData)

      // Seçili aile üyesi yoksa ilk üyeyi seç veya "Sen" üyesini varsayılan yap.
      if (
        !selectedFamilyMemberId ||
        !membersData.find((m) => m.id === selectedFamilyMemberId)
      ) {
        setSelectedFamilyMemberId(
          membersData.length > 0 ? membersData[0].id : null
        )
      }
    })

    // Temizleme fonksiyonu
    return () => unsubscribe()
  }, [db, userId, selectedFamilyMemberId])

  // Bildirimleri zamanlamak için useEffect hook'u.
  useEffect(() => {
    if (notificationPermission === 'granted' && selectedFamilyMemberId) {
      const timers = []
      const now = new Date()
      // JavaScript'te günlerin index'i 0 (Pazar) ile başlar, bizim dizimiz Pazartesi ile.
      const currentDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1
      const currentDayName = daysOfWeek[currentDayIndex]

      const selectedMember = familyMembers.find(
        (member) => member.id === selectedFamilyMemberId
      )
      if (selectedMember) {
        selectedMember.medications.forEach((med) => {
          if (!med.isTaken && med.days.includes(currentDayName)) {
            const [hour, minute] = med.time.split(':')
            const medTime = new Date()
            medTime.setHours(parseInt(hour, 10))
            medTime.setMinutes(parseInt(minute, 10))
            medTime.setSeconds(0)
            medTime.setMilliseconds(0)

            if (medTime.getTime() > now.getTime()) {
              const timeUntilMed = medTime.getTime() - now.getTime()
              const timer = setTimeout(() => {
                new Notification(`İlaç Saati: ${selectedMember.name}`, {
                  body: `${med.name} ilacını alma zamanı geldi. Lütfen ${med.onEmptyStomach} karnına almayı unutmayın.`,
                  icon: 'https://placehold.co/128x128/087CFA/FFFFFF?text=💊',
                  silent: false,
                })
              }, timeUntilMed)
              timers.push(timer)
            }
          }
        })
      }

      return () => {
        timers.forEach((timer) => clearTimeout(timer))
      }
    }
  }, [familyMembers, selectedFamilyMemberId, notificationPermission])

  // Her gün 'isTaken' durumunu sıfırlayan useEffect hook'u.
  useEffect(() => {
    const storedResetDate = localStorage.getItem('lastResetDate')
    const today = new Date().toDateString()

    if (storedResetDate !== today && familyMembers.length > 0) {
      const resetMedications = async () => {
        for (const member of familyMembers) {
          const docRef = doc(
            db,
            `artifacts/${
              typeof window !== 'undefined' && (window as any).__app_id !== 'undefined' 
                ? (window as any).__app_id 
                : 'default-app-id'
            }/users/${userId}/familyMembers`,
            member.id
          )
          const updatedMedications = member.medications.map((med) => ({
            ...med,
            isTaken: false,
          }))
          await updateDoc(docRef, { medications: updatedMedications })
        }
        localStorage.setItem('lastResetDate', today)
      }
      if (db && userId) {
        resetMedications()
      }
    }
  }, [familyMembers, db, userId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-700 animate-pulse">
          Veriler yükleniyor...
        </p>
      </div>
    )
  }

  const selectedMember =
    familyMembers.find((member) => member.id === selectedFamilyMemberId) ||
    familyMembers[0]
  const medications = selectedMember ? selectedMember.medications : []

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewMedication((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleNewFamilyMemberNameChange = (e) => {
    setNewFamilyMemberName(e.target.value)
  }

  const handleAddFamilyMember = async (e) => {
    e.preventDefault()
    if (newFamilyMemberName.trim() && db && userId) {
      const newMember = {
        name: newFamilyMemberName.trim(),
        medications: [],
      }
      const familyMembersColRef = collection(
        db,
        `artifacts/${
          typeof window !== 'undefined' && (window as any).__app_id !== 'undefined' 
            ? (window as any).__app_id 
            : 'default-app-id'
        }/users/${userId}/familyMembers`
      )
      try {
        await addDoc(familyMembersColRef, newMember)
        setNewFamilyMemberName('')
      } catch (error) {
        console.error('Aile üyesi eklenirken bir hata oluştu: ', error)
      }
    }
  }

  const handleDayChange = (e) => {
    const { value, checked } = e.target
    setNewMedication((prevState) => {
      if (checked) {
        return { ...prevState, days: [...prevState.days, value] }
      } else {
        return {
          ...prevState,
          days: prevState.days.filter((day) => day !== value),
        }
      }
    })
  }

  const handleAddMedication = async (e) => {
    e.preventDefault()
    if (
      newMedication.name &&
      newMedication.time &&
      newMedication.days.length > 0 &&
      selectedMember &&
      db
    ) {
      // İlaçlara benzersiz kimlik (id) ekleyelim.
      const newMed = {
        ...newMedication,
        isTaken: false,
        id: `${Date.now()}-${Math.random()}`,
      }
      const updatedMedications = [...selectedMember.medications, newMed]
      const docRef = doc(
        db,
        `artifacts/${
          typeof window !== 'undefined' && (window as any).__app_id !== 'undefined' 
            ? (window as any).__app_id 
            : 'default-app-id'
        }/users/${userId}/familyMembers`,
        selectedMember.id
      )
      try {
        await updateDoc(docRef, { medications: updatedMedications })
        setNewMedication({ name: '', time: '', onEmptyStomach: 'aç', days: [] })
      } catch (error) {
        console.error('İlaç eklenirken bir hata oluştu: ', error)
      }
    }
  }

  const handleDeleteMedication = async (medId) => {
    if (selectedMember && db) {
      const docRef = doc(
        db,
        `artifacts/${
          typeof window !== 'undefined' && (window as any).__app_id !== 'undefined' 
            ? (window as any).__app_id 
            : 'default-app-id'
        }/users/${userId}/familyMembers`,
        selectedMember.id
      )
      const updatedMedications = selectedMember.medications.filter(
        (med) => med.id !== medId
      )
      try {
        await updateDoc(docRef, { medications: updatedMedications })
      } catch (error) {
        console.error('İlaç silinirken bir hata oluştu: ', error)
      }
    }
  }

  const handleToggleTaken = async (medId) => {
    if (selectedMember && db) {
      const docRef = doc(
        db,
        `artifacts/${
          typeof window !== 'undefined' && (window as any).__app_id !== 'undefined' 
            ? (window as any).__app_id 
            : 'default-app-id'
        }/users/${userId}/familyMembers`,
        selectedMember.id
      )
      const updatedMedications = selectedMember.medications.map((med) =>
        med.id === medId ? { ...med, isTaken: !med.isTaken } : med
      )
      try {
        await updateDoc(docRef, { medications: updatedMedications })
      } catch (error) {
        console.error('İlaç durumu güncellenirken bir hata oluştu: ', error)
      }
    }
  }

  const handleRequestPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission)
      })
    }
  }

  const getDisplayDate = (date) => {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    // JavaScript'te günlerin index'i 0 (Pazar) ile başlar, bizim dizimiz Pazartesi ile.
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1
    const dayName = daysOfWeek[dayIndex]

    if (date.toDateString() === today.toDateString()) {
      return `Bugün (${dayName})`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Yarın (${dayName})`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Dün (${dayName})`
    } else {
      return `${dayName}, ${date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
      })}`
    }
  }

  // Seçilen güne göre ilaçları filtreler, arama sorgusuna göre süzgeçten geçirir ve sıralar.
  const getFilteredAndSortedMeds = (date) => {
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1
    const dayName = daysOfWeek[dayIndex]
    // Önce güne göre filtrele
    const filteredByDay = medications.filter((med) =>
      med.days.includes(dayName)
    )

    // Sonra arama sorgusuna göre filtrele (büyük/küçük harf duyarlı değil)
    const filteredBySearch = filteredByDay.filter((med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return [...filteredBySearch].sort((a, b) => a.time.localeCompare(b.time))
  }

  const selectedDayMedications = getFilteredAndSortedMeds(selectedDate)
  const now = new Date()
  const timeNow = now.getHours() * 60 + now.getMinutes()

  const approachingMeds = selectedDayMedications.filter((med) => {
    const [hour, minute] = med.time.split(':')
    const medTimeInMinutes = parseInt(hour, 10) * 60 + parseInt(minute, 10)
    return (
      !med.isTaken &&
      selectedDate.toDateString() === now.toDateString() &&
      medTimeInMinutes >= timeNow
    )
  })

  const takenMeds = selectedDayMedications.filter((med) => med.isTaken)

  const untakenMeds = selectedDayMedications.filter((med) => {
    const [hour, minute] = med.time.split(':')
    const medTimeInMinutes = parseInt(hour, 10) * 60 + parseInt(minute, 10)
    return (
      !med.isTaken &&
      selectedDate.toDateString() === now.toDateString() &&
      medTimeInMinutes < timeNow
    )
  })


  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-6 md:p-8 space-y-8 relative">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-2">
            İlaç Takip Programı
          </h1>
          <p className="text-gray-500 text-lg">
            Yeğeninizin ilaç takibini kolaylaştırın.
          </p>
        </header>

        <FamilyMemberSelector
          familyMembers={familyMembers}
          selectedFamilyMemberId={selectedFamilyMemberId}
          onSelectMember={setSelectedFamilyMemberId}
          newFamilyMemberName={newFamilyMemberName}
          onNewMemberNameChange={handleNewFamilyMemberNameChange}
          onAddFamilyMember={handleAddFamilyMember}
        />

        <NotificationPermissionComponent
          notificationPermission={notificationPermission}
          onRequestPermission={handleRequestPermission}
        />

        <MedicationForm
          selectedMemberName={selectedMember?.name}
          newMedication={newMedication}
          onInputChange={handleInputChange}
          onDayChange={handleDayChange}
          onSubmit={handleAddMedication}
          daysOfWeek={daysOfWeek}
        />

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`${selectedMember?.name} için ilaç ara...`}
        />

        {/* Ana İçerik Alanı */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Günlük Program görünümü */}
          {currentView === 'dailyProgram' && (
            <>
              <div className="flex items-center justify-between my-4">
                <button
                  onClick={() =>
                    setSelectedDate((prev) => {
                      const newDate = new Date(prev)
                      newDate.setDate(prev.getDate() - 1)
                      return newDate
                    })
                  }
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold text-gray-700 text-center">
                  {getDisplayDate(selectedDate)}
                </h2>
                <button
                  onClick={() =>
                    setSelectedDate((prev) => {
                      const newDate = new Date(prev)
                      newDate.setDate(prev.getDate() + 1)
                      return newDate
                    })
                  }
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="mt-4">
                {selectedDayMedications.length === 0 ? (
                  <p className="text-center text-gray-500 p-4 border border-gray-200 rounded-xl">
                    Bu gün alınacak ilaç bulunmuyor.
                  </p>
                ) : (
                  <MedicationList
                    medications={selectedDayMedications}
                    onToggleTaken={handleToggleTaken}
                    onDeleteMedication={handleDeleteMedication}
                    daysOfWeek={daysOfWeek}
                    type="daily"
                  />
                )}
              </div>
            </>
          )}

          {/* Durum Takibi görünümü */}
          {currentView === 'statusTracking' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-700">
                Bugünkü Durum Takibi: {selectedMember?.name}
              </h2>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center space-x-2">
                  <Clock size={20} /> Yaklaşan İlaçlar
                </h3>
                <MedicationList
                  medications={approachingMeds}
                  onToggleTaken={handleToggleTaken}
                  onDeleteMedication={handleDeleteMedication}
                  daysOfWeek={daysOfWeek}
                  type="approaching"
                />
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center space-x-2">
                  <CheckCircle size={20} /> Kullanılan İlaçlar
                </h3>
                <MedicationList
                  medications={takenMeds}
                  onToggleTaken={handleToggleTaken}
                  onDeleteMedication={handleDeleteMedication}
                  daysOfWeek={daysOfWeek}
                  type="taken"
                />
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center space-x-2">
                  <XCircle size={20} /> Kullanılmayan İlaçlar
                </h3>
                <MedicationList
                  medications={untakenMeds}
                  onToggleTaken={handleToggleTaken}
                  onDeleteMedication={handleDeleteMedication}
                  daysOfWeek={daysOfWeek}
                  type="untaken"
                />
              </div>
            </div>
          )}

          {/* Tüm İlaçlar görünümü */}
          {currentView === 'allMedications' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-700">
                Tüm İlaçlar: {selectedMember?.name}
              </h2>
              {medications.length === 0 ? (
                <p className="text-center text-gray-500 p-4 border border-gray-200 rounded-xl">
                  Henüz ilaç eklenmedi.
                </p>
              ) : (
                <MedicationList
                  medications={medications.filter((med) =>
                    med.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )}
                  onToggleTaken={handleToggleTaken}
                  onDeleteMedication={handleDeleteMedication}
                  daysOfWeek={daysOfWeek}
                  type="all"
                />
              )}
            </div>
          )}
        </div>

        <NavigationBar
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
    </div>
  )
}

export default App
