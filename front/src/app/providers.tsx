'use client';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createEmotionCache } from '@/theme/emotionCache';
import theme from '@/theme/theme';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

const cache = createEmotionCache();

export function Providers({ children }: ProvidersProps) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
