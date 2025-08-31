import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth'

// Firebase yapılandırması
const firebaseConfig = {
  // Bu değerler environment variables'dan gelecek
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Firebase app'i başlat
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }

// Aile üyesi işlemleri
export const familyMemberService = {
  // Tüm aile üyelerini getir
  async getFamilyMembers(userId: string) {
    const familyMembersRef = collection(db, `users/${userId}/familyMembers`)
    const snapshot = await getDocs(familyMembersRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  // Yeni aile üyesi ekle
  async addFamilyMember(userId: string, memberData: { name: string; medications: any[] }) {
    const familyMembersRef = collection(db, `users/${userId}/familyMembers`)
    const docRef = await addDoc(familyMembersRef, memberData)
    return docRef.id
  },

  // Aile üyesini güncelle
  async updateFamilyMember(userId: string, memberId: string, data: any) {
    const memberRef = doc(db, `users/${userId}/familyMembers`, memberId)
    await updateDoc(memberRef, data)
  },

  // Aile üyesini sil
  async deleteFamilyMember(userId: string, memberId: string) {
    const memberRef = doc(db, `users/${userId}/familyMembers`, memberId)
    await deleteDoc(memberRef)
  }
}

// İlaç işlemleri
export const medicationService = {
  // İlaç ekle
  async addMedication(userId: string, memberId: string, medication: any) {
    const memberRef = doc(db, `users/${userId}/familyMembers`, memberId)
    // Önce mevcut verileri al
    const memberDoc = await getDoc(memberRef)
    if (memberDoc.exists()) {
      const currentData = memberDoc.data()
      const updatedMedications = [...(currentData.medications || []), {
        ...medication,
        id: `${Date.now()}-${Math.random()}`,
        isTaken: false
      }]
      await updateDoc(memberRef, { medications: updatedMedications })
    }
  },

  // İlaç durumunu güncelle (alındı/alınmadı)
  async toggleMedicationStatus(userId: string, memberId: string, medicationId: string) {
    const memberRef = doc(db, `users/${userId}/familyMembers`, memberId)
    const memberDoc = await getDoc(memberRef)
    if (memberDoc.exists()) {
      const currentData = memberDoc.data()
      const updatedMedications = currentData.medications.map((med: any) =>
        med.id === medicationId ? { ...med, isTaken: !med.isTaken } : med
      )
      await updateDoc(memberRef, { medications: updatedMedications })
    }
  },

  // İlaç sil
  async deleteMedication(userId: string, memberId: string, medicationId: string) {
    const memberRef = doc(db, `users/${userId}/familyMembers`, memberId)
    const memberDoc = await getDoc(memberRef)
    if (memberDoc.exists()) {
      const currentData = memberDoc.data()
      const updatedMedications = currentData.medications.filter((med: any) => med.id !== medicationId)
      await updateDoc(memberRef, { medications: updatedMedications })
    }
  },

  // Günlük ilaç durumlarını sıfırla
  async resetDailyMedications(userId: string) {
    const familyMembersRef = collection(db, `users/${userId}/familyMembers`)
    const snapshot = await getDocs(familyMembersRef)
    
    const updatePromises = snapshot.docs.map(async (memberDoc) => {
      const memberData = memberDoc.data()
      const updatedMedications = memberData.medications.map((med: any) => ({
        ...med,
        isTaken: false
      }))
      await updateDoc(memberDoc.ref, { medications: updatedMedications })
    })

    await Promise.all(updatePromises)
  }
}

// Auth işlemleri
export const authService = {
  // Anonim giriş yap
  async signInAnonymously() {
    return await signInAnonymously(auth)
  },

  // Custom token ile giriş yap
  async signInWithCustomToken(token: string) {
    return await signInWithCustomToken(auth, token)
  },

  // Auth state değişikliklerini dinle
  onAuthStateChanged(callback: (user: any) => void) {
    return onAuthStateChanged(auth, callback)
  }
}
