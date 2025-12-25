'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="fa" dir="rtl">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            خطایی رخ داده است
          </h1>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            متأسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  )
}

