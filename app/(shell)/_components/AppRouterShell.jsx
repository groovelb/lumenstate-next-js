'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { LumenstateShell } from '@/components/layout/LumenstateShell';
import { SharedElementOverlay } from '@/components/motion/SharedElementOverlay';
import { TimeBlendImage } from '@/components/media/TimeBlendImage';
import { useSharedTransition } from '@/components/motion/SharedTransitionContext';
import { makeScrollKey, makeStorageKey } from '@/utils/scrollKey';
import { LenisRefContext, useLenisRef } from './LenisContext';

const pageVariants = {
  initial: { opacity: 0.01 },
  animate: { opacity: 1 },
  exit: { opacity: 0.01 },
};

const pageTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1],
};

/**
 * ScrollRestorer
 *
 * 셸 안에 마운트되는 페이지에 대해 back-nav 또는 /product/* → 다른 경로 이탈 시
 * 스크롤 위치를 복원. react-router useNavigationType 대신 popstate로 POP 감지.
 *
 * Props:
 * @param {object} scrollMap - scrollY 캐시 ref [Required]
 * @param {string} pathname - 현재 pathname [Required]
 * @param {object} navInfoRef - { from, to } ref [Required]
 * @param {object} navTypeRef - 'PUSH' | 'POP' ref [Required]
 */
function ScrollRestorer({ scrollMap, pathname, navInfoRef, navTypeRef }) {
  const lenisRef = useLenisRef();

  useLayoutEffect(() => {
    const fromPathname = navInfoRef.current?.from;
    const isBack = navTypeRef.current === 'POP';
    const isLogicalReverse = fromPathname?.startsWith('/product/') && !pathname.startsWith('/product/');
    const shouldRestore = isBack || isLogicalReverse;

    let saved = null;
    if (shouldRestore) {
      try {
        const ss = sessionStorage.getItem(makeStorageKey(pathname));
        if (ss) saved = JSON.parse(ss);
      } catch {
        // ignore
      }
      if (!saved) saved = scrollMap.current[makeScrollKey(pathname)];
    }
    const targetY = saved ? saved.scrollY : 0;

    if (saved?.scrollHeight) {
      document.documentElement.style.minHeight = `${saved.scrollHeight}px`;
      document.body.style.minHeight = `${saved.scrollHeight}px`;
      void document.documentElement.offsetHeight;
    }

    window.scrollTo(0, targetY);
    if (lenisRef?.current) {
      lenisRef.current.resize();
      lenisRef.current.scrollTo(targetY, { immediate: true, force: true });
    }

    let rafId;
    const startTime = performance.now();
    const retry = () => {
      if (Math.abs(window.scrollY - targetY) < 2) return;
      if (performance.now() - startTime > 500) return;
      window.scrollTo(0, targetY);
      if (lenisRef?.current) {
        lenisRef.current.scrollTo(targetY, { immediate: true, force: true });
      }
      rafId = requestAnimationFrame(retry);
    };
    rafId = requestAnimationFrame(retry);

    const cleanupTimeout = saved?.scrollHeight
      ? setTimeout(() => {
        document.documentElement.style.minHeight = '';
        document.body.style.minHeight = '';
      }, 1000)
      : null;

    navTypeRef.current = 'PUSH';

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (cleanupTimeout) clearTimeout(cleanupTimeout);
      document.documentElement.style.minHeight = '';
      document.body.style.minHeight = '';
    };
  }, [scrollMap, pathname, lenisRef, navInfoRef, navTypeRef]);

  return null;
}

/**
 * AppRouterShell
 *
 * (shell) route group 내부 페이지를 감싸는 클라이언트 셸.
 * - Lenis 스무스 스크롤 인스턴스의 수명을 잡음 (셸 안에서만 동작)
 * - LumenstateShell(GNB) 마운트, 랜딩에서만 hideHeaderUntilScroll
 * - SharedElementOverlay 마운트 (제품 카드 ↔ 상세 페이지 공유 요소 전환)
 * - AnimatePresence + motion.div 페이지 전환 페이드
 * - ScrollRestorer (back-nav / 제품 이탈 시 스크롤 위치 복원)
 * - 카트 아이콘 클릭 시 /checkout 라우트로 이동
 *
 * Props:
 * @param {React.ReactNode} children - 현재 라우트 페이지 [Required]
 */
function AppRouterShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenisRef = useRef(null);
  const scrollMap = useRef({});
  const prevPathname = useRef(pathname);
  const navInfoRef = useRef({ from: null, to: pathname });
  const navTypeRef = useRef('PUSH');
  const { triggerReverse } = useSharedTransition();

  // Lenis 인스턴스 — 셸이 마운트되는 동안만 활성
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis();
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // popstate(브라우저 뒤로/앞으로) 감지 — useNavigationType('POP') 대체
  useEffect(() => {
    const handler = () => {
      navTypeRef.current = 'POP';
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  // pathname 변경 시 from/to 업데이트 + 이전 위치 스크롤 저장 + reverse 전환 트리거
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      navInfoRef.current = {
        from: prevPathname.current,
        to: pathname,
      };

      scrollMap.current[makeScrollKey(prevPathname.current)] = {
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
      };

      const productMatch = prevPathname.current.match(/^\/product\/([^/]+)/);
      const isLeavingProduct = !pathname.startsWith('/product/');
      if (productMatch && isLeavingProduct) {
        triggerReverse(`product-${productMatch[1]}`);
      }

      prevPathname.current = pathname;
    }
  }, [pathname, triggerReverse]);

  // 스크롤 이벤트마다 현재 pathname으로 저장 (pathname 변경 후 700ms간 lock)
  useEffect(() => {
    const currentPath = pathname;
    const lockedUntil = performance.now() + 700;
    const save = () => {
      if (performance.now() < lockedUntil) return;
      const value = {
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
      };
      scrollMap.current[makeScrollKey(currentPath)] = value;
      try {
        sessionStorage.setItem(makeStorageKey(currentPath), JSON.stringify(value));
      } catch {
        // ignore
      }
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [pathname]);

  const handleCartClick = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  return (
    <LenisRefContext.Provider value={ lenisRef }>
      <LumenstateShell
        onCartClick={ handleCartClick }
        hideHeaderUntilScroll={ pathname === '/' }
      >
        <SharedElementOverlay
          renderContent={ (content) => (
            <TimeBlendImage
              dayImage={ content.day }
              nightImage={ content.night }
              timeline={ content.timeline }
              aspectRatio="3/4"
              objectFit="cover"
              sx={ { width: '100%', height: '100%' } }
            />
          ) }
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={ pathname }
            variants={ pageVariants }
            initial="initial"
            animate="animate"
            exit="exit"
            transition={ pageTransition }
          >
            <ScrollRestorer
              scrollMap={ scrollMap }
              pathname={ pathname }
              navInfoRef={ navInfoRef }
              navTypeRef={ navTypeRef }
            />
            { children }
          </motion.div>
        </AnimatePresence>
      </LumenstateShell>
    </LenisRefContext.Provider>
  );
}

export default AppRouterShell;
export { AppRouterShell };
