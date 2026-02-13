'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const NAVIGATION_LINKS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Tratamientos', href: '#tratamientos' },
  { label: 'Contacto', href: '#contacto' },
];

export function HeaderHero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerClass = 'mx-auto w-full max-w-[1200px] px-4 md:px-6 xl:px-10';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-black/5 bg-[#F8F6F4]/95 shadow-[0_6px_18px_rgba(0,0,0,0.06)] backdrop-blur'
            : 'bg-[#F8F6F4]'
        }`}
      >
        <div className={`${containerClass} flex h-[88px] items-center justify-between`}>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-2xl tracking-[0.28em] text-[#E1A6A8]">JG</span>
            <span className="font-name text-xs text-[#606060]">Dra. Jaquelina Grassetti</span>
          </div>

          <div className="hidden flex-1 justify-end md:flex">
            <nav className="font-body flex items-center gap-10 text-[11px] uppercase tracking-[0.12em] text-[#606060]">
              {NAVIGATION_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative pb-1 transition hover:text-[#E1A6A8]"
                >
                  <span className="after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#E1A6A8] after:transition-all after:duration-300 hover:after:w-full">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#606060] transition md:hidden"
          >
            <span className="flex h-4 w-5 flex-col justify-between">
              <span
                className={`h-[2px] w-full rounded-full bg-current transition ${
                  mobileOpen ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[2px] w-full rounded-full bg-current transition ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-[2px] w-full rounded-full bg-current transition ${
                  mobileOpen ? '-translate-y-[6px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-black/5 bg-[#F8F6F4]/95 md:hidden">
            <div className={`${containerClass} pb-6 pt-4`}>
              <nav className="font-body flex flex-col gap-4 text-xs uppercase tracking-[0.18em] text-[#606060]">
                {NAVIGATION_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="transition hover:text-[#E1A6A8]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      <section id="hero" aria-label="Imagen destacada" className="relative w-full">
        <div className="relative h-[420px] w-full overflow-hidden bg-[#F1EEEA] sm:h-[460px] md:h-[500px] lg:h-[520px]">
          {imageError ? (
            <div className="h-full w-full bg-[#F1EEEA]" />
          ) : (
            <Image
              src="/portada.png"
              alt="Portada de medicina estética"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </section>

      <section id="tratamientos" className="bg-[#F8F6F4] py-14">
        <div className={containerClass}>
          <div className="text-center">
            <p className="font-heading text-[clamp(2rem,4vw,3rem)] tracking-[0.2em] text-[#606060]">
              SOLICITÁ TU TURNO
            </p>
            <div className="mx-auto mt-4 h-[1px] w-16 bg-[#E1A6A8]" />
          </div>

          <div className="mt-8 flex justify-center">
            <form className="grid w-full max-w-[900px] items-center gap-4 md:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                placeholder="Nombre y apellido"
                className="w-full rounded-[16px] border border-black/15 bg-white px-4 py-3 text-sm text-[#606060] transition focus:border-[#E1A6A8] focus:outline-none focus:ring-2 focus:ring-[#E1A6A8]/20"
              />
              <input
                type="email"
                placeholder="Email o WhatsApp"
                className="w-full rounded-[16px] border border-black/15 bg-white px-4 py-3 text-sm text-[#606060] transition focus:border-[#E1A6A8] focus:outline-none focus:ring-2 focus:ring-[#E1A6A8]/20"
              />
              <button
                type="button"
                className="w-full rounded-[16px] border border-[#E1A6A8] px-8 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#E1A6A8] transition duration-300 hover:bg-[#E1A6A8] hover:text-white md:w-auto"
              >
                Agendar
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
