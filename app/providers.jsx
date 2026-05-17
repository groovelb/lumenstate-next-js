'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { defaultTheme } from '@/styles/themes';
import { CartProvider } from '@/components/cart/CartContext';
import { TimelineProvider } from '@/components/media/useTimeline';
import { SharedTransitionProvider } from '@/components/motion/SharedTransitionContext';

function ThemeRegistry({ children }) {
  return (
    <AppRouterCacheProvider options={ { key: 'mui' } }>
      <ThemeProvider theme={ defaultTheme }>
        <CssBaseline />
        <CartProvider>
          <TimelineProvider initialTimeline={ 0 }>
            <SharedTransitionProvider>
              { children }
            </SharedTransitionProvider>
          </TimelineProvider>
        </CartProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default ThemeRegistry;
