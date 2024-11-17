'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PublicPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/landing')
  }, [router])

  return null
} 