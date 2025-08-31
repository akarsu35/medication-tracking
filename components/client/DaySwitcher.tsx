'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface DaySwitcherProps {
  daysOfWeek: string[]
  todayIndex: number
}

function getDateForDay(
  today: Date,
  todayIndex: number,
  targetIndex: number
): Date {
  const diff = targetIndex - todayIndex
  const date = new Date(today)
  date.setDate(today.getDate() + diff)
  return date
}

function formatDateTR(date: Date) {
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function DaySwitcher({
  daysOfWeek,
  todayIndex,
}: DaySwitcherProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dayParam = searchParams.get('day')
  const dayIndex = dayParam ? daysOfWeek.indexOf(dayParam) : todayIndex

  const handlePrev = () => {
    const newIndex = dayIndex === 0 ? daysOfWeek.length - 1 : dayIndex - 1
    router.replace(
      `?${new URLSearchParams({
        ...Object.fromEntries(searchParams),
        day: daysOfWeek[newIndex],
      })}`
    )
  }
  const handleNext = () => {
    const newIndex = dayIndex === daysOfWeek.length - 1 ? 0 : dayIndex + 1
    router.replace(
      `?${new URLSearchParams({
        ...Object.fromEntries(searchParams),
        day: daysOfWeek[newIndex],
      })}`
    )
  }

  // Tarihi hesapla
  const today = new Date()
  const selectedDate = getDateForDay(today, todayIndex, dayIndex)
  const formattedDate = formatDateTR(selectedDate)

  return (
    <div className="flex items-center justify-center mb-4 gap-4">
      <button type="button" onClick={handlePrev}>
        ◀
      </button>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          {formattedDate} - {daysOfWeek[dayIndex]}
        </h2>
      </div>
      <button type="button" onClick={handleNext}>
        ▶
      </button>
    </div>
  )
}
