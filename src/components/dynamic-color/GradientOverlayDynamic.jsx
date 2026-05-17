'use client';

import dynamic from 'next/dynamic';

/**
 * GradientOverlayDynamic
 *
 * Three.js 기반 GradientOverlay의 Next.js 동적 import 래퍼입니다.
 * SSR을 비활성화하여 서버 렌더링 시 WebGL 오류를 방지합니다.
 *
 * Next.js 페이지에서 GradientOverlay를 사용할 때는 이 래퍼를 import하세요.
 * Storybook에서는 기존 GradientOverlay를 직접 import해도 됩니다.
 *
 * Example usage:
 * import GradientOverlay from '@/components/dynamic-color/GradientOverlayDynamic';
 */
const GradientOverlay = dynamic(
  () => import('./GradientOverlay'),
  { ssr: false }
);

export default GradientOverlay;
