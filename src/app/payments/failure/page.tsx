import Link from 'next/link';

type SearchParams = Record<string, string | string[] | undefined>;

const getValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.join(', ') : value;

export default function PaymentFailurePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const details = [
    { label: 'Estado', value: getValue(searchParams?.status) },
    { label: 'Pago', value: getValue(searchParams?.payment_id) },
    { label: 'Orden', value: getValue(searchParams?.merchant_order_id) },
    { label: 'Referencia', value: getValue(searchParams?.external_reference) },
    { label: 'Preferencia', value: getValue(searchParams?.preference_id) },
  ].filter((item) => item.value);

  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 60px',
        background: 'linear-gradient(180deg, #FFF7F8 0%, #FFFFFF 55%, #FFF5F7 100%)',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 640,
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(212,165,165,0.2)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0, color: '#2C2C2C', fontSize: '1.9rem' }}>
          Pago rechazado
        </h1>
        <p style={{ color: '#6B6B6B', lineHeight: 1.7, marginTop: 12 }}>
          No se pudo completar el pago. Podés intentar nuevamente o contactarnos.
        </p>

        {details.length > 0 ? (
          <dl
            style={{
              margin: '20px auto 0',
              textAlign: 'left',
              background: '#FFF9FA',
              padding: '16px 18px',
              borderRadius: 14,
              border: '1px solid #F2E0E3',
            }}
          >
            {details.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  fontSize: '0.95rem',
                  padding: '6px 0',
                }}
              >
                <dt style={{ color: '#8B6B6B' }}>{item.label}</dt>
                <dd style={{ margin: 0, color: '#2C2C2C', fontWeight: 600 }}>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div
          style={{
            marginTop: 26,
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 26px',
              borderRadius: 999,
              background: '#EEBBC3',
              color: '#2C2C2C',
              textDecoration: 'none',
              fontWeight: 600,
              border: '1px solid #D4A5A5',
            }}
          >
            Volver al inicio
          </Link>
          <Link
            href="/#turnos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 26px',
              borderRadius: 999,
              background: '#FFFFFF',
              color: '#7A5A5A',
              textDecoration: 'none',
              fontWeight: 600,
              border: '1px solid #E9E4E2',
            }}
          >
            Reintentar pago
          </Link>
        </div>
      </section>
    </main>
  );
}
