// Type definitions for the medicine tracking app

export interface Medication {
  id: string
  name: string
  time: string
  onEmptyStomach: string
  days: string[]
  isTaken: boolean
}

export interface FamilyMember {
  id: string
  name: string
  medications: Medication[]
}

export interface SearchParams {
  userId?: string
  view?: string
  selectedMember?: string
  search?: string
}

export interface PageProps {
  searchParams: SearchParams
}
