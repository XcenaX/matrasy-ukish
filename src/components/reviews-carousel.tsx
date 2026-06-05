"use client"

import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

import { fallbackReviews, fetchReviewsFromStrapi, type CustomerReview } from '@/lib/landing-content'

export function ReviewsCarousel({ initialReviews = fallbackReviews }: { initialReviews?: CustomerReview[] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true

    fetchReviewsFromStrapi().then((items) => {
      if (mounted) setReviews(items)
    })

    return () => {
      mounted = false
    }
  }, [])

  const orderedReviews = useMemo(
    () => [...reviews].sort((a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100)),
    [reviews],
  )

  const scrollReviews = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return

    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.86, 280),
      behavior: 'smooth',
    })
  }

  if (!orderedReviews.length) return null

  return (
    <div className="relative mt-16">
      <button
        type="button"
        className="absolute left-0 top-1/2 z-[2] hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-slate-200 bg-white text-[#111827] shadow-sm shadow-black/5 hover:border-[var(--gold)] md:inline-flex"
        aria-label="Предыдущие отзывы"
        onClick={() => scrollReviews(-1)}
      >
        <ChevronLeft size={20} strokeWidth={1.7} />
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {orderedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <button
        type="button"
        className="absolute right-0 top-1/2 z-[2] hidden h-12 w-12 -translate-y-1/2 translate-x-1/2 items-center justify-center border border-slate-200 bg-white text-[#111827] shadow-sm shadow-black/5 hover:border-[var(--gold)] md:inline-flex"
        aria-label="Следующие отзывы"
        onClick={() => scrollReviews(1)}
      >
        <ChevronRight size={20} strokeWidth={1.7} />
      </button>

      <div className="mt-5 flex justify-center gap-3 md:hidden">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-slate-200 bg-white text-[#111827]"
          aria-label="Предыдущие отзывы"
          onClick={() => scrollReviews(-1)}
        >
          <ChevronLeft size={18} strokeWidth={1.7} />
        </button>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-slate-200 bg-white text-[#111827]"
          aria-label="Следующие отзывы"
          onClick={() => scrollReviews(1)}
        >
          <ChevronRight size={18} strokeWidth={1.7} />
        </button>
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <article className="flex min-h-[420px] w-[86%] shrink-0 snap-start flex-col overflow-hidden bg-white shadow-sm shadow-black/5 sm:w-[46%] lg:w-[31.5%]">
      {review.photos.length ? <ReviewPhotos review={review} /> : null}

      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center gap-1 text-[var(--gold)]" aria-label={`${review.rating} из 5`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={17}
              strokeWidth={1.6}
              className={index < review.rating ? 'fill-[var(--gold)]' : 'text-slate-200'}
            />
          ))}
        </div>

        <p className="mt-8 text-base leading-7 text-slate-700">“{review.text}”</p>

        <div className="mt-auto flex items-center gap-5 pt-10">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3eee8] text-sm font-semibold text-[#2a1f1a]">
            {review.name.slice(0, 1)}
          </span>
          <div>
            <h3 className="font-semibold text-[#111827]">{review.name}</h3>
            {review.city ? <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{review.city}</p> : null}
          </div>
        </div>
      </div>
    </article>
  )
}

function ReviewPhotos({ review }: { review: CustomerReview }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const pointerStartX = useRef<number | null>(null)
  const hasMultiplePhotos = review.photos.length > 1

  const goToPhoto = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + review.photos.length) % review.photos.length)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasMultiplePhotos) return
    pointerStartX.current = event.clientX
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return

    const diff = event.clientX - pointerStartX.current
    pointerStartX.current = null

    if (Math.abs(diff) < 36) return
    goToPhoto(diff > 0 ? -1 : 1)
  }

  return (
    <div className="relative h-64 overflow-hidden bg-[#2a1f1a]">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null
        }}
      >
        {review.photos.map((photo, index) => (
          <div key={`${photo.url}-${index}`} className="relative h-64 w-full flex-[0_0_100%]">
            <Image
              src={photo.url}
              alt={photo.alt || `Фото к отзыву ${review.name}`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 86vw"
            />
          </div>
        ))}
      </div>

      {hasMultiplePhotos ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/60 bg-white/85 text-[#111827] shadow-sm shadow-black/15 backdrop-blur hover:bg-white"
            aria-label={`Предыдущее фото отзыва ${review.name}`}
            onClick={() => goToPhoto(-1)}
          >
            <ChevronLeft size={18} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/60 bg-white/85 text-[#111827] shadow-sm shadow-black/15 backdrop-blur hover:bg-white"
            aria-label={`Следующее фото отзыва ${review.name}`}
            onClick={() => goToPhoto(1)}
          >
            <ChevronRight size={18} strokeWidth={1.7} />
          </button>
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {review.photos.map((photo, index) => (
            <button
              key={`${photo.url}-dot-${index}`}
              type="button"
              className={`h-1.5 w-8 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/45'
              }`}
              aria-label={`Показать фото ${index + 1} отзыва ${review.name}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
