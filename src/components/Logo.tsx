export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  // "Two at the Table": the T as tabletop + leg, two guests seated across. Inherits currentColor.
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="5" />
      <rect x="25" y="33" width="50" height="9" rx="4.5" fill="currentColor" />
      <rect x="45.5" y="42" width="9" height="25" rx="4.5" fill="currentColor" />
      <circle cx="31" cy="56" r="6.5" fill="currentColor" />
      <circle cx="69" cy="56" r="6.5" fill="currentColor" />
    </svg>
  );
}

export function LogoLockup({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-serif text-2xl font-bold tracking-[0.18em] ${light ? "text-white" : "text-berryDark"}`}>
      <LogoMark />
      TABLED
    </span>
  );
}
