import Link from 'next/link';

export const metadata = {
  title: 'Not Found — Lumenstate',
};

export default function NotFound() {
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
      <h1 style={ { fontFamily: '"Tiempos Headline", serif', fontSize: '3rem', margin: 0 } }>
        404
      </h1>
      <p style={ { opacity: 0.7, margin: 0 } }>
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link href="/" style={ { textDecoration: 'underline', color: 'inherit' } }>
        홈으로 돌아가기
      </Link>
    </main>
  );
}
