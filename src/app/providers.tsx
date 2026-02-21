'use client';

import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '@/theme/emotionCache';
import theme from '@/theme/theme';
import { useServerInsertedHTML } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [cache] = useState(() => {
    const emotionCache = createEmotionCache();
    emotionCache.compat = true;
    return emotionCache;
  });

  useServerInsertedHTML(() => {
    const inserted = Object.keys(cache.inserted);
    if (inserted.length === 0) return null;

    const styles = inserted
      .map((key) => cache.inserted[key])
      .filter((item): item is string => typeof item === 'string')
      .join('');

    return (
      <style
        data-emotion={`${cache.key} ${inserted.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
