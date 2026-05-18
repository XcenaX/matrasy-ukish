import Link from 'next/link'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link aria-label="UKISH Mattress" href="/" className="inline-flex flex-col items-center leading-none">
      <span
        className={`serif text-[30px] tracking-[0.13em] ${light ? 'text-white' : 'text-[#111827]'}`}
      >
        UKISH
      </span>
      <span className={`mt-1 text-[8px] font-bold tracking-[0.78em] ${light ? 'text-white' : 'text-[var(--gold)]'}`}>
        MATTRESS
      </span>
    </Link>
  )
}
