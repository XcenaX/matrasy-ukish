"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'

import {
  fallbackLandingSettings,
  fetchLandingSettingsFromStrapi,
  type LandingSettings,
} from '@/lib/landing-content'

export function LandingProductionMedia({
  initialSettings = fallbackLandingSettings,
}: {
  initialSettings?: LandingSettings
}) {
  const [settings, setSettings] = useState(initialSettings)
  const video = settings.productionVideo
  const poster = settings.productionFallbackImage.url
  const alt = settings.productionAlt || settings.productionFallbackImage.alt || 'Производство матрасов UKISH'

  useEffect(() => {
    let mounted = true

    fetchLandingSettingsFromStrapi().then((nextSettings) => {
      if (mounted) setSettings(nextSettings)
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="relative aspect-video overflow-hidden md:aspect-auto md:h-full md:min-h-[420px]">
      {video?.url ? (
        <video
          key={video.url}
          className="absolute inset-0 h-full w-full object-contain object-top grayscale"
          muted
          loop
          autoPlay
          controls
          controlsList="nodownload"
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={alt}
        >
          <source src={video.url} type={video.mime || 'video/mp4'} />
        </video>
      ) : (
        <Image src={poster} alt={alt} fill className="object-cover grayscale" sizes="(min-width: 1024px) 50vw, 100vw" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
    </div>
  )
}
