'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

export default function ArticleClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from('.article-section-official', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      })

      gsap.from('.article-section-commentary', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.4
      })

      gsap.from('.article-footer-nav', {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        delay: 0.8
      })
    })

    return () => ctx.revert()
  }, [])

  return <>{children}</>
}
