'use client';

import React from 'react';

// hero.png esta en /public, se referencia directo
const heroBg = '/hero.png';

export function HeroSection() {
  const handleOpenReserva = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-reserva-modal'));
    }
  };

  return (
    <section style={styles.hero(heroBg)}>
      <div style={styles.heroInner}>
        {/* CONTENEDOR IZQUIERDO */}
        <div style={styles.heroLeft}>
          <h1 style={styles.h1}>
            Resultados naturales,
            <br />
            cuidado profesional
          </h1>
          <p style={styles.p}>
            Tratamientos de medicina estetica disenados para realzar tu belleza de forma sutil,
            segura y armonica.
          </p>

          <button type="button" onClick={handleOpenReserva} style={styles.btnReservar}>
            <svg
              style={{ width: 18, height: 18 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Reservar turno online
          </button>

          <div style={styles.heroNote}>
            <svg
              style={{ width: 16, height: 16, color: '#c97b8a', flexShrink: 0 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Agenda tu cita en menos de 30 segundos
          </div>
        </div>

        {/* CONTENEDOR DERECHO */}
        <div style={styles.heroRight}>
          <span style={styles.doctorTitle}>Dra. Jaquelina Grassetti</span>
          <span style={styles.doctorSpecialty}>medicina estetica</span>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: (bg: string): React.CSSProperties => ({
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: "'Cormorant Garamond', serif",
  }),

  heroInner: {
    width: '100%',
    maxWidth: 1400,
    margin: '0 auto',
    padding: '80px 60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 40,
  } as React.CSSProperties,

  heroLeft: {
    flex: 1,
    maxWidth: 520,
  } as React.CSSProperties,

  h1: {
    fontFamily: "'Bacalisties', cursive",
    fontSize: 'clamp(2.25rem, 3.5vw, 3.45rem)',
    fontWeight: 400,
    color: '#2c2c2c',
    lineHeight: 1.3,
    marginBottom: 24,
  } as React.CSSProperties,

  p: {
    fontSize: '1.02rem',
    fontWeight: 300,
    color: '#555',
    lineHeight: 1.7,
    maxWidth: 360,
    marginBottom: 40,
  } as React.CSSProperties,

  btnReservar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#c97b8a',
    color: 'white',
    padding: '15px 30px',
    borderRadius: 50,
    border: 'none',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '0.98rem',
    fontWeight: 400,
    letterSpacing: '0.03em',
    cursor: 'pointer',
    marginBottom: 16,
  } as React.CSSProperties,

  heroNote: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.9rem',
    color: '#888',
    fontWeight: 300,
  } as React.CSSProperties,

  heroRight: {
    flex: 1,
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  } as React.CSSProperties,

  doctorTitle: {
    fontFamily: "'ArterioNonCommercial', serif",
    fontSize: 'clamp(1.22rem, 2.2vw, 1.85rem)',
    fontWeight: 400,
    color: '#3a3a3a',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    lineHeight: 1.3,
    display: 'block',
  } as React.CSSProperties,

  doctorSpecialty: {
    fontFamily: "'Bacalisties', cursive",
    fontSize: 'clamp(1.35rem, 2.2vw, 2.15rem)',
    fontWeight: 400,
    color: '#555',
    marginTop: 8,
    letterSpacing: '0.02em',
    display: 'block',
  } as React.CSSProperties,
};
