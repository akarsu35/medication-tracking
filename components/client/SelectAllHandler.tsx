'use client'

import { useEffect } from 'react'

interface SelectAllHandlerProps {
  formId: string
}

export default function SelectAllHandler({ formId }: SelectAllHandlerProps) {
  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement
    if (!form) return

    const selectAllCheckbox = form.querySelector('input[name="selectAll"]') as HTMLInputElement
    const dayCheckboxes = form.querySelectorAll('input[name="days"]') as NodeListOf<HTMLInputElement>

    if (!selectAllCheckbox) return

    const handleSelectAllChange = () => {
      const isChecked = selectAllCheckbox.checked
      dayCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked
      })
    }

    const handleDayCheckboxChange = () => {
      const checkedDays = form.querySelectorAll('input[name="days"]:checked').length
      const totalDays = dayCheckboxes.length
      
      if (checkedDays === totalDays) {
        selectAllCheckbox.checked = true
      } else if (checkedDays === 0) {
        selectAllCheckbox.checked = false
      } else {
        selectAllCheckbox.checked = false
      }
    }

    // Event listeners
    selectAllCheckbox.addEventListener('change', handleSelectAllChange)
    dayCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', handleDayCheckboxChange)
    })

    return () => {
      selectAllCheckbox.removeEventListener('change', handleSelectAllChange)
      dayCheckboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', handleDayCheckboxChange)
      })
    }
  }, [formId])

  return null
}
