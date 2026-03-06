'use client';

import { useState } from 'react';

interface GiftCardForm {
  amount: string;
  buyerName: string;
  buyerEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  delivery: string;
}

const INITIAL: GiftCardForm = {
  amount: '',
  buyerName: '',
  buyerEmail: '',
  recipientName: '',
  recipientEmail: '',
  message: '',
  delivery: '',
};

const HOW_STEPS = [
  {
    num: '01',
    title: 'Completás',
    desc: 'Llenás el formulario con los datos del regalo y el monto que querés regalar.',
  },
  {
    num: '02',
    title: 'Abonás',
    desc: 'Realizás el pago de forma segura con tarjeta, transferencia o efectivo.',
  },
  {
    num: '03',
    title: 'Enviamos',
    desc: 'El beneficiario recibe su gift card según la opción que elegiste.',
  },
  { num: '04', title: 'Disfruta', desc: 'Agenda su turno cuando quiera y vive la experiencia.' },
];

export default function GiftCardsPage() {
  const [form, setForm] = useState<GiftCardForm>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    // TODO: conectar con tu backend / API
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid rgba(196,122,133,0.28)',
    borderRadius: '10px',
    padding: '12px 15px',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '12px',
    fontWeight: 300,
    color: '#2b1f20',
    background: 'rgba(255,255,255,0.75)',
    letterSpacing: '0.3px',
    outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
  };

  return (
    <>
      <style>{`
        .font-bacalisties { font-family: 'Bacalisties', cursive; }
        .font-cormorant   { font-family: 'Cormorant Garamond', serif; }
        .font-poppins     { font-family: 'Poppins', sans-serif; }

        .gc-input:focus {
          border-color: #c47a85 !important;
          box-shadow: 0 0 0 3px rgba(196,122,133,0.10) !important;
        }
        .gc-input::placeholder { color: #c4a0a5; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up  { animation: fadeUp .65s ease both; }
        .delay-1  { animation-delay: .12s; }
        .delay-2  { animation-delay: .22s; }
        .delay-3  { animation-delay: .32s; }
        .delay-4  { animation-delay: .42s; }

        /* scrollbar del formulario si es largo en mobile */
        .form-scroll { overflow-y: auto; }
        .form-scroll::-webkit-scrollbar { width: 4px; }
        .form-scroll::-webkit-scrollbar-thumb { background: rgba(196,122,133,0.3); border-radius: 4px; }
      `}</style>

      <main
        className="bg-[#faf6f4] min-h-screen overflow-x-hidden"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* ══════════════════════════════════════════════════════
            HERO — dos columnas igual que la home
        ══════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-[92vh] flex items-center overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 75% 40%, rgba(209,168,172,0.22) 0%, transparent 65%), #faf6f4',
          }}
        >
          {/* textura mármol rosado — lado derecho, igual que la home */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 55% 70% at 80% 50%, rgba(217,149,158,0.16) 0%, rgba(240,218,218,0.10) 40%, transparent 70%)',
            }}
          />
          {/* línea diagonal decorativa */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none hidden md:block"
            style={{
              left: '50%',
              width: '1px',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(196,122,133,0.15) 30%, rgba(196,122,133,0.15) 70%, transparent 100%)',
            }}
          />

          <div className="relative z-10 w-full max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-16 md:px-20 lg:px-24 xl:px-28 2xl:px-32 py-20">
            {/* ── COLUMNA IZQUIERDA — texto ── */}
            <div className="flex flex-col justify-center md:pr-8">
              <p
                className="fade-up flex items-center gap-3 mb-6 text-[#c47a85]"
                style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase' }}
              >
                <span className="block w-8 h-px bg-[#c47a85]" />
                Regala bienestar
              </p>

              <h1
                className="fade-up delay-1 font-bacalisties text-[#2b1f20] leading-[1.1] mb-6"
                style={{ fontSize: 'clamp(50px, 6vw, 82px)' }}
              >
                El regalo
                <br />
                más especial
              </h1>

              <p
                className="fade-up delay-2 text-[#6b4f50] mb-8 max-w-sm"
                style={{ fontSize: '13px', fontWeight: 300, lineHeight: '1.9' }}
              >
                Sorprendé a quien más querés con una experiencia de medicina estética de lujo. Cada
                gift card es un gesto de cuidado y elegancia.
              </p>

              {/* bullets informativos */}
              <div className="fade-up delay-3 space-y-3 mb-10">
                {[
                  'Monto libre a tu elección',
                  'Entrega digital o en caja premium',
                  'Válida para cualquier tratamiento',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="text-[#c47a85]" style={{ fontSize: '10px' }}>
                      ✦
                    </span>
                    <span className="text-[#6b4f50]" style={{ fontSize: '12px', fontWeight: 300 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* ornamento */}
              <div className="fade-up delay-4 flex items-center gap-4">
                <span className="block w-12 h-px bg-[#c47a85]/40" />
                <span
                  className="font-cormorant text-[#c47a85]/60"
                  style={{
                    fontSize: '18px',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    fontWeight: 300,
                  }}
                >
                  JG
                </span>
                <span className="block w-12 h-px bg-[#c47a85]/40" />
              </div>
            </div>

            {/* ── COLUMNA DERECHA — formulario ── */}
            <div className="flex flex-col justify-center mt-12 md:mt-0 md:pl-8">
              {submitted ? (
                /* Éxito */
                <div
                  className="text-center"
                  style={{
                    background: 'rgba(255,255,255,0.80)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(196,122,133,0.2)',
                    borderRadius: '24px',
                    padding: '52px 36px',
                    boxShadow: '0 12px 50px rgba(196,122,133,0.10)',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: 'rgba(196,122,133,0.10)',
                      border: '1px solid rgba(196,122,133,0.25)',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>✦</span>
                  </div>
                  <h3 className="font-bacalisties text-[#2b1f20] mb-3" style={{ fontSize: '42px' }}>
                    ¡Gift Card creada!
                  </h3>
                  <p
                    className="text-[#6b4f50] mb-8"
                    style={{ fontSize: '13px', fontWeight: 300, lineHeight: '1.9' }}
                  >
                    Recibimos tu solicitud. En breve te contactamos para coordinar el pago y el
                    envío.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="transition-all duration-200 hover:scale-[1.03]"
                    style={{
                      background: '#c47a85',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '13px 36px',
                      fontSize: '10px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      fontFamily: "'Poppins', sans-serif",
                      cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(196,122,133,0.35)',
                    }}
                  >
                    Crear otra
                  </button>
                </div>
              ) : (
                /* Formulario */
                <div
                  className="relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(18px)',
                    border: '1px solid rgba(196,122,133,0.18)',
                    borderRadius: '24px',
                    padding: '40px 36px',
                    boxShadow: '0 12px 50px rgba(196,122,133,0.10)',
                  }}
                >
                  {/* deco interna */}
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(196,122,133,0.08) 0%, transparent 70%)',
                    }}
                  />

                  {/* título del form */}
                  <div className="mb-6 text-center">
                    <h2
                      className="font-bacalisties text-[#2b1f20]"
                      style={{ fontSize: 'clamp(28px, 3vw, 38px)' }}
                    >
                      Personalizá tu regalo
                    </h2>
                    <p
                      className="text-[#6b4f50]/60 mt-1"
                      style={{ fontSize: '11px', fontWeight: 300 }}
                    >
                      Completá los datos a continuación
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* monto */}
                    <div>
                      <GCLabel>Monto del regalo ($)</GCLabel>
                      <input
                        type="number"
                        name="amount"
                        placeholder="Ej: 100.000"
                        value={form.amount}
                        onChange={handleChange}
                        className="gc-input"
                        style={inputStyle}
                      />
                    </div>

                    {/* comprador */}
                    <GCDivider label="Comprador" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <GCLabel>Nombre</GCLabel>
                        <input
                          type="text"
                          name="buyerName"
                          placeholder="Tu nombre"
                          value={form.buyerName}
                          onChange={handleChange}
                          className="gc-input"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <GCLabel>Email</GCLabel>
                        <input
                          type="email"
                          name="buyerEmail"
                          placeholder="tu@email.com"
                          value={form.buyerEmail}
                          onChange={handleChange}
                          className="gc-input"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* beneficiario */}
                    <GCDivider label="Beneficiario" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <GCLabel>Nombre</GCLabel>
                        <input
                          type="text"
                          name="recipientName"
                          placeholder="Nombre de quien recibe"
                          value={form.recipientName}
                          onChange={handleChange}
                          className="gc-input"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <GCLabel>Email</GCLabel>
                        <input
                          type="email"
                          name="recipientEmail"
                          placeholder="email@beneficiario.com"
                          value={form.recipientEmail}
                          onChange={handleChange}
                          className="gc-input"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* entrega */}
                    <div>
                      <GCLabel>¿Cómo entregarlo?</GCLabel>
                      <select
                        name="delivery"
                        value={form.delivery}
                        onChange={handleChange}
                        className="gc-input"
                        style={inputStyle}
                      >
                        <option value="" disabled>
                          Seleccioná una opción
                        </option>
                        <option value="digital">Digital por email</option>
                        <option value="impreso">Impreso en sobre</option>
                        <option value="caja">Caja regalo premium</option>
                      </select>
                    </div>

                    {/* mensaje */}
                    <div>
                      <GCLabel>Mensaje personal (opcional)</GCLabel>
                      <textarea
                        name="message"
                        placeholder="Escribí algo especial para el beneficiario..."
                        value={form.message}
                        onChange={handleChange}
                        rows={3}
                        className="gc-input"
                        style={{ ...inputStyle, resize: 'none' }}
                      />
                    </div>

                    {/* submit */}
                    <div className="pt-1 text-center">
                      <button
                        onClick={handleSubmit}
                        className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(196,122,133,0.45)]"
                        style={{
                          background: 'linear-gradient(135deg, #c47a85 0%, #a5616e 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50px',
                          padding: '15px 36px',
                          fontSize: '11px',
                          letterSpacing: '2.5px',
                          textTransform: 'uppercase',
                          fontFamily: "'Poppins', sans-serif",
                          boxShadow: '0 8px 28px rgba(196,122,133,0.38)',
                          cursor: 'pointer',
                        }}
                      >
                        Crear mi Gift Card
                      </button>
                      <p
                        className="text-[#6b4f50]/45 mt-3"
                        style={{ fontSize: '10px', fontWeight: 300 }}
                      >
                        ✦ Te contactamos en menos de 24 hs para coordinar el pago
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CÓMO FUNCIONA
        ══════════════════════════════════════════════════════ */}
        <section
          className="px-8 md:px-20 py-20"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(196,122,133,0.07) 0%, transparent 70%), #f5e8e8',
          }}
        >
          <div className="text-center mb-14">
            <p
              className="flex items-center justify-center gap-4 text-[#c47a85] mb-4"
              style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase' }}
            >
              <span className="block w-12 h-px bg-[#c47a85]" />
              Simple y rápido
              <span className="block w-12 h-px bg-[#c47a85]" />
            </p>
            <h2
              className="font-bacalisties text-[#2b1f20]"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
            >
              ¿Cómo funciona?
            </h2>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-3xl relative">
              <div
                className="hidden md:block absolute top-7 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(196,122,133,0.30), transparent)',
                }}
              />
              {HOW_STEPS.map((step) => (
                <div key={step.num} className="text-center relative">
                  <div
                    className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center relative z-10"
                    style={{ background: '#faf6f4', border: '1px solid rgba(196,122,133,0.25)' }}
                  >
                    <span
                      className="font-cormorant text-[#c47a85]"
                      style={{ fontSize: '20px', fontWeight: 300 }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h4
                    className="font-cormorant text-[#2b1f20] mb-2"
                    style={{ fontSize: '18px', fontWeight: 400 }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="text-[#6b4f50]"
                    style={{ fontSize: '11px', fontWeight: 300, lineHeight: '1.9' }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* nota final */}
        <div className="text-center px-6 py-12 bg-[#faf6f4]">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="block w-16 h-px bg-[#c47a85]/25" />
            <span
              className="font-cormorant text-[#c47a85]/40"
              style={{ fontSize: '18px', letterSpacing: '5px' }}
            >
              JG
            </span>
            <span className="block w-16 h-px bg-[#c47a85]/25" />
          </div>
          <p className="text-[#6b4f50]/60" style={{ fontSize: '12px', fontWeight: 300 }}>
            ¿Tenés dudas? Escribinos por{' '}
            <a
              href="https://wa.me/"
              className="text-[#c47a85] hover:opacity-75 transition-opacity"
              style={{ borderBottom: '1px solid rgba(196,122,133,0.35)' }}
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      </main>
    </>
  );
}

/* ── Helpers ── */
function GCLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[#6b4f50]/60 mb-[6px]"
      style={{
        fontSize: '9px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {children}
    </label>
  );
}

function GCDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[#c47a85]/12" />
      <p
        className="text-[#c47a85]/70 whitespace-nowrap"
        style={{
          fontSize: '9px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {label}
      </p>
      <div className="flex-1 h-px bg-[#c47a85]/12" />
    </div>
  );
}
