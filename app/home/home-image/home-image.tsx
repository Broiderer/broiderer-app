'use client'

import landing1 from '../../assets/landing-1.jpg'
import Image from 'next/image'
import styles from './home-image.module.scss'
import { useEffect, useRef } from 'react'

export default function HomeImage() {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    function mouseListener(e: globalThis.MouseEvent) {
      if (!imageRef.current) {
        return
      }
      const rotateY = (e.clientX / window.innerWidth - 0.5) * 10
      const rotateX = -(e.clientY / window.innerHeight - 0.5) * 10
      imageRef.current.style.transform = `perspective(75em) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    document.addEventListener('mousemove', mouseListener)

    return function cleanup() {
      document.removeEventListener('mousemove', mouseListener)
    }
  }, [])

  return (
    <Image
      src={landing1}
      alt=""
      className={styles['home-image1']}
      ref={imageRef}
    ></Image>
  )
}
