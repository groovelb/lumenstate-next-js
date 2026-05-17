import LandingPage from '@/stories/page/LandingPage';

const LANDING_TITLE = 'Lumenstate — Light defines the space.';
const LANDING_DESCRIPTION = '공간을 정의하는 빛. Lumenstate는 건축과 하나가 되는 조명을 만듭니다. 하루의 흐름에 맞춰 자연스럽게 이어지는 빛으로 일상을 감쌉니다.';
const LANDING_OG_IMAGE = '/og/landing.jpg';

export const metadata = {
  title: {
    absolute: LANDING_TITLE,
  },
  description: LANDING_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Lumenstate',
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    url: '/',
    locale: 'ko_KR',
    images: [
      {
        url: LANDING_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Lumenstate — Light defines the space.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    images: [LANDING_OG_IMAGE],
  },
};

export default function HomePage() {
  return <LandingPage />;
}
