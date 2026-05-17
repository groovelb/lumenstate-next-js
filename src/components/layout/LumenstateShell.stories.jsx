import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LumenstateShell } from './LumenstateShell';
import { TimelineProvider } from '../media/useTimeline';
import { CartProvider } from '../cart/CartContext';
import Placeholder from '../../common/ui/Placeholder';

export default {
  title: 'Component/8. Layout/LumenstateShell',
  component: LumenstateShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## LumenstateShell

실제 \`app/(shell)/layout.jsx\` 에서 사용되는 Lumenstate 전용 앱 레이아웃 쉘.

### 구성
- **Day/Night 배경 블렌딩** — \`useTimeline\` 의 timeline 값(0~1)에 따라 \`#E8E5E1\` ↔ \`#12100E\` 페이드
- **LumenstateGNB** — 로고 + Cart 아이콘 (\`useCart\` 의 totalItems 뱃지)
- **Footer** — 뉴스레터 구독 + 소셜 링크
- **FloatingTimeline** — 화면 우하단의 전역 타임라인 컨트롤러

### Provider 의존성
이 컴포넌트는 \`CartProvider\` 와 \`TimelineProvider\` 안에서만 동작한다.
스토리에서는 두 Provider 를 decorator 로 감싸 제공한다.
        `,
      },
    },
  },
  argTypes: {
    onCartClick: {
      action: 'cartClicked',
      description: 'Cart 아이콘 클릭 핸들러',
    },
    onSubscribe: {
      action: 'subscribed',
      description: '뉴스레터 구독 핸들러',
    },
    headerHeight: {
      control: { type: 'number', min: 48, max: 120, step: 4 },
      description: '헤더 높이 (px)',
    },
    hasHeaderBorder: {
      control: 'boolean',
      description: '헤더 하단 보더 표시 여부',
    },
    isHeaderSticky: {
      control: 'boolean',
      description: '헤더 sticky 고정 여부',
    },
    isHeaderTransparent: {
      control: 'boolean',
      description: '헤더 투명 배경 여부',
    },
    hideHeaderUntilScroll: {
      control: 'boolean',
      description: '모바일에서 히어로(80vh) 스크롤 지나야 헤더 노출 (랜딩 전용)',
    },
    children: {
      control: false,
      description: '메인 콘텐츠 영역',
    },
    sx: {
      control: false,
      description: '추가 스타일 (MUI sx)',
    },
  },
  decorators: [
    (Story) => (
      <CartProvider>
        <TimelineProvider initialTimeline={ 0 }>
          <Story />
        </TimelineProvider>
      </CartProvider>
    ),
  ],
};

/**
 * ## 기본 사용법
 *
 * 실제 페이지에 적용된 형태. GNB + 메인 콘텐츠 + Footer + FloatingTimeline 이 모두 마운트된다.
 * 우하단 FloatingTimeline 을 조작하면 배경이 Day → Night 으로 블렌딩된다.
 */
export const Default = {
  args: {
    headerHeight: 64,
    hasHeaderBorder: true,
    isHeaderSticky: true,
    isHeaderTransparent: false,
    hideHeaderUntilScroll: false,
  },
  render: (args) => (
    <LumenstateShell { ...args }>
      <Box sx={ { px: { xs: 2, sm: 3, md: 4 }, py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 } }>
        <Typography variant="h3" sx={ { fontWeight: 700, mb: 2 } }>
          Lumenstate Shell
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 6, maxWidth: 560 } }>
          실제 페이지에 적용된 레이아웃 쉘입니다. 우하단 타임라인을 조작해 Day/Night 블렌딩을 확인하세요.
        </Typography>
        <Placeholder.Box label="Main Content" sx={ { height: 360 } } />
      </Box>
    </LumenstateShell>
  ),
};

/**
 * ## 랜딩 모드 (히어로 위 헤더 숨김)
 *
 * \`hideHeaderUntilScroll\` 활성화. 모바일에서 히어로 섹션(80vh)을 지나야 GNB 가 슬라이드 인된다.
 * 데스크탑에서는 항상 노출되므로 차이가 없을 수 있다.
 */
export const HideHeaderUntilScroll = {
  args: {
    headerHeight: 64,
    hasHeaderBorder: true,
    isHeaderSticky: true,
    isHeaderTransparent: false,
    hideHeaderUntilScroll: true,
  },
  render: (args) => (
    <LumenstateShell { ...args }>
      <Box
        sx={ {
          position: 'relative',
          zIndex: 1,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        } }
      >
        <Typography variant="h2" sx={ { fontWeight: 700, color: 'inherit' } }>
          Hero Section
        </Typography>
      </Box>
      <Box sx={ { px: { xs: 2, sm: 3, md: 4 }, py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 } }>
        <Placeholder.Box label="Scroll Content" sx={ { height: 600 } } />
      </Box>
    </LumenstateShell>
  ),
};

/**
 * ## 투명 헤더
 *
 * 헤더 배경을 투명하게 두고 하단 보더를 제거한다. 히어로 위에 헤더를 얹는 구성에 적합.
 */
export const TransparentHeader = {
  args: {
    headerHeight: 64,
    hasHeaderBorder: false,
    isHeaderSticky: true,
    isHeaderTransparent: true,
    hideHeaderUntilScroll: false,
  },
  render: (args) => (
    <LumenstateShell { ...args }>
      <Box sx={ { px: { xs: 2, sm: 3, md: 4 }, py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 } }>
        <Placeholder.Box label="Transparent Header Demo" sx={ { height: 480 } } />
      </Box>
    </LumenstateShell>
  ),
};

/**
 * ## Night 모드 시작
 *
 * \`TimelineProvider\` 의 \`initialTimeline\` 을 1 로 두고 시작.
 * 배경이 Night 색(\`#12100E\`)으로 페이드된 상태에서 마운트된다.
 */
export const NightMode = {
  args: {
    headerHeight: 64,
    hasHeaderBorder: true,
    isHeaderSticky: true,
    isHeaderTransparent: false,
    hideHeaderUntilScroll: false,
  },
  decorators: [
    (Story) => (
      <CartProvider>
        <TimelineProvider initialTimeline={ 1 }>
          <Story />
        </TimelineProvider>
      </CartProvider>
    ),
  ],
  render: (args) => (
    <LumenstateShell { ...args }>
      <Box sx={ { px: { xs: 2, sm: 3, md: 4 }, py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 } }>
        <Typography variant="h3" sx={ { fontWeight: 700, mb: 2, color: 'common.white' } }>
          Night Mode
        </Typography>
        <Typography variant="body1" sx={ { mb: 6, maxWidth: 560, color: 'grey.400' } }>
          타임라인이 1.0 인 상태에서 마운트됩니다.
        </Typography>
        <Placeholder.Box label="Main Content" sx={ { height: 360 } } />
      </Box>
    </LumenstateShell>
  ),
};
