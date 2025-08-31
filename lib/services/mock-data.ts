// Mock data service - Firebase olmadan çalışmak için
let mockData: { [userId: string]: any[] } = {
  'demo-user': [
    {
      id: 'member-1',
      name: 'Ahmet',
      medications: [
        {
          id: 'med-1',
          name: 'Aspirin',
          time: '08:00',
          onEmptyStomach: 'tok',
          days: ['Pazartesi', 'Çarşamba', 'Cuma'],
          isTaken: false
        },
        {
          id: 'med-2',
          name: 'Vitamin D',
          time: '20:00',
          onEmptyStomach: 'aç',
          days: ['Her Gün'],
          isTaken: true
        }
      ]
    },
    {
      id: 'member-2',
      name: 'Ayşe',
      medications: [
        {
          id: 'med-3',
          name: 'Omega 3',
          time: '12:00',
          onEmptyStomach: 'tok',
          days: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
          isTaken: false
        }
      ]
    }
  ]
}

export const mockFamilyMemberService = {
  async getFamilyMembers(userId: string) {
    return mockData[userId] || []
  },

  async addFamilyMember(userId: string, memberData: { name: string; medications: any[] }) {
    if (!mockData[userId]) {
      mockData[userId] = []
    }
    const newMember = {
      ...memberData,
      id: `member-${Date.now()}`
    }
    mockData[userId].push(newMember)
    return newMember.id
  },

  async updateFamilyMember(userId: string, memberId: string, data: any) {
    if (!mockData[userId]) return
    const memberIndex = mockData[userId].findIndex(m => m.id === memberId)
    if (memberIndex !== -1) {
      mockData[userId][memberIndex] = { ...mockData[userId][memberIndex], ...data }
    }
  },

  async deleteFamilyMember(userId: string, memberId: string) {
    if (!mockData[userId]) return
    mockData[userId] = mockData[userId].filter(m => m.id !== memberId)
  }
}

export const mockMedicationService = {
  async addMedication(userId: string, memberId: string, medication: any) {
    console.log('Adding medication:', { userId, memberId, medication })
    if (!mockData[userId]) {
      console.log('User not found, creating new user data')
      mockData[userId] = []
      return
    }
    const memberIndex = mockData[userId].findIndex(m => m.id === memberId)
    console.log('Member index:', memberIndex)
    if (memberIndex !== -1) {
      const newMed = {
        ...medication,
        id: `med-${Date.now()}-${Math.random()}`,
        isTaken: false
      }
      console.log('Adding new medication:', newMed)
      mockData[userId][memberIndex].medications.push(newMed)
      console.log('Updated member medications:', mockData[userId][memberIndex].medications)
    } else {
      console.log('Member not found with ID:', memberId)
    }
  },

  async toggleMedicationStatus(userId: string, memberId: string, medicationId: string) {
    if (!mockData[userId]) return
    const member = mockData[userId].find(m => m.id === memberId)
    if (member) {
      const medIndex = member.medications.findIndex((med: any) => med.id === medicationId)
      if (medIndex !== -1) {
        member.medications[medIndex].isTaken = !member.medications[medIndex].isTaken
      }
    }
  },

  async deleteMedication(userId: string, memberId: string, medicationId: string) {
    if (!mockData[userId]) return
    const member = mockData[userId].find(m => m.id === memberId)
    if (member) {
      member.medications = member.medications.filter((med: any) => med.id !== medicationId)
    }
  },

  async resetDailyMedications(userId: string) {
    if (!mockData[userId]) return
    mockData[userId].forEach(member => {
      member.medications.forEach((med: any) => {
        med.isTaken = false
      })
    })
  }
}
