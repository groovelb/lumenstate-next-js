'use client';

import { useEffect } from 'react';

/**
 * Root error boundary
 *
 * App Router의 error.jsx는 클라이언트 컴포넌트여야 한다.
 * (shell) 그룹 내부의 에러는 이 boundary가 잡지 않을 수 있으므로
 * 필요 시 (shell)/error.jsx도 별도로 추가 가능.
 *
 * Props:
 * @param {Error} error - 발생한 에러 [Required]
 * @param {function} reset - 에러 boundary 리셋 핸들러 [Required]
 */
export default function RootError({ error, reset }) {
  useEffect(() => {
    // 운영 환경에서는 외부 로깅 서비스(Sentry 등)로 전송하는 위치
    console.error('[RootError]', error);
  }, [error]);

  return (
    <main
      style={ {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        fontFamily: '"Pretendard Variable", system-ui, sans-serif',
      } }
    >
      <h1 style={ { fontFamily: '"Tiempos Headline", serif', fontSize: '2.5rem', margin: 0 } }>
        Something went wrong
      </h1>
      <p style={ { opacity: 0.7, margin: 0, maxWidth: 480, textAlign: 'center' } }>
        예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={ () => reset() }
        style={ {
          marginTop: 8,
          padding: '12px 24px',
          background: 'transparent',
          border: '1px solid currentColor',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.875rem',
          letterSpacing: '0.02em',
        } }
      >
        Try again
      </button>
    </main>
  );
}
