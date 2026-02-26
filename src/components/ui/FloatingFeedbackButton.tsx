'use client';

import { useEffect, useState } from 'react';
import { IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { FeedbackModal } from './FeedbackModal';

export function FloatingFeedbackButton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const readAuth = () => {
      if (typeof window === 'undefined') return;
      const user = localStorage.getItem('turnera_user');
      const token = localStorage.getItem('turnera_access_token');
      setIsAuthenticated(Boolean(user || token));
    };
    readAuth();
    window.addEventListener('auth-changed', readAuth);
    window.addEventListener('storage', readAuth);
    return () => {
      window.removeEventListener('auth-changed', readAuth);
      window.removeEventListener('storage', readAuth);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isAuthenticated) {
      setOpen(false);
    }
  }, [isAuthenticated]);

  if (!isMounted || !isAuthenticated) return null;

  return (
    <>
      <Tooltip title="Dejar comentario" placement="left" arrow disableHoverListener={isMobile}>
        <IconButton
          aria-label="Dejar comentario"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            right: { xs: 16, md: 24 },
            bottom: { xs: 16, md: 24 },
            zIndex: 1395,
            backgroundColor: '#EEBBC3',
            color: '#FFFFFF',
            borderRadius: '50%',
            border: '1px solid rgba(212, 165, 165, 0.65)',
            boxShadow:
              '0 14px 28px rgba(238, 187, 195, 0.35), 0 6px 10px rgba(0, 0, 0, 0.08)',
            width: { xs: 54, sm: 58 },
            height: { xs: 54, sm: 58 },
            textTransform: 'none',
            fontWeight: 600,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
            overflow: 'visible',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              background: 'rgba(238, 187, 195, 0.28)',
              filter: 'blur(10px)',
              opacity: 0.65,
              zIndex: -1,
            },
            '&:hover': {
              backgroundColor: '#E6A8B2',
              boxShadow:
                '0 18px 34px rgba(238, 187, 195, 0.45), 0 8px 14px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px) scale(1.04)',
            },
            '&:active': {
              transform: 'translateY(-1px) scale(0.98)',
            },
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 26 }} />
        </IconButton>
      </Tooltip>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
