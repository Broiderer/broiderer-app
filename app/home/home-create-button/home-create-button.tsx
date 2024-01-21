'use client'
import { useRouter } from 'next/navigation'

export default function HomeCreateButton() {
  const { push } = useRouter()

  function navigateToEditor() {
    push('create')
  }

  return (
    <button
      type="button"
      className="bro-button bro-button-primary"
      onClick={navigateToEditor}
    >
      ✨ Start Creating
    </button>
  )
}
