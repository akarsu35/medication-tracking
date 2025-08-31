'use client'

import { useEffect } from 'react'

interface DaySelectionValidatorProps {
  formId: string
}

export default function DaySelectionValidator({ formId }: DaySelectionValidatorProps) {
  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement
    if (!form) return

    const handleSubmit = (e: Event) => {
      const checkboxes = form.querySelectorAll('input[name="days"]:checked') as NodeListOf<HTMLInputElement>
      const selectAllCheckbox = form.querySelector('input[name="selectAll"]:checked') as HTMLInputElement
      
      // "Hepsini Seç" işaretliyse veya en az bir gün seçiliyse geçerli
      if (checkboxes.length === 0 && !selectAllCheckbox) {
        e.preventDefault()
        alert('En az bir gün seçmelisiniz!')
        
        // İlk gün checkbox'ına focus ver
        const firstDayCheckbox = form.querySelector('input[name="days"]') as HTMLInputElement
        if (firstDayCheckbox) {
          firstDayCheckbox.focus()
        }
      }
    }

    form.addEventListener('submit', handleSubmit)
    
    return () => {
      form.removeEventListener('submit', handleSubmit)
    }
  }, [formId])

  return null
}
