'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

type Point = { x: number; y: number };

const STORAGE_KEY = 'feedback_fab_pos_v1';
const DRAG_THRESHOLD = 6;
const PAD = 12;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function FloatingFeedbackButtonDraggable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const startRef = useRef<{ pointerId: number; start: Point; initial: Point } | null>(null);
  const movedEnoughRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [pos, setPos] = useState<Point | null>(null);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const readAuth = () => {
      if (typeof window === 'undefined') return;
      const user = localStorage.getItem('turnera_user');
      const token = localStorage.getItem('turnera_access_token');
      setIsAuthed(Boolean(user || token));
    };
    readAuth();
    window.addEventListener('auth-changed', readAuth);
    window.addEventListener('storage', readAuth);
    return () => {
      window.removeEventListener('auth-changed', readAuth);
      window.removeEventListener('storage', readAuth);
    };
  }, [mounted]);

  useEffect(() => {
    if (!isAuthed) {
      setOpen(false);
    }
  }, [isAuthed]);

  const defaultPos = useMemo<Point>(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const approxSize = isMobile ? 52 : 56;
    return { x: vw - approxSize - 24, y: vh - approxSize - 120 };
  }, [isMobile]);

  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Point;
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          setPos(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    setPos(defaultPos);
  }, [mounted, defaultPos]);

  useEffect(() => {
    if (!mounted) return;
    const onResize = () => {
      if (!btnRef.current || !pos) return;
      const rect = btnRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width - PAD;
      const maxY = window.innerHeight - rect.height - PAD;
      setPos({
        x: clamp(pos.x, PAD, maxX),
        y: clamp(pos.y, PAD, maxY),
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mounted, pos]);

  if (!mounted || !isAuthed || !pos) return null;

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!btnRef.current) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    setDragging(true);
    movedEnoughRef.current = false;
    startRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      initial: { ...pos },
    };
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!startRef.current || startRef.current.pointerId !== event.pointerId) return;
    if (!btnRef.current) return;

    const dx = event.clientX - startRef.current.start.x;
    const dy = event.clientY - startRef.current.start.y;

    if (!movedEnoughRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      movedEnoughRef.current = true;
    }

    const rect = btnRef.current.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - PAD;
    const maxY = window.innerHeight - rect.height - PAD;
    const nextX = clamp(startRef.current.initial.x + dx, PAD, maxX);
    const nextY = clamp(startRef.current.initial.y + dy, PAD, maxY);
    setPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (!startRef.current || startRef.current.pointerId !== event.pointerId) return;
    setDragging(false);

    if (btnRef.current && pos) {
      const rect = btnRef.current.getBoundingClientRect();
      const leftSnap = PAD;
      const rightSnap = window.innerWidth - rect.width - PAD;
      const mid = window.innerWidth / 2;
      const snappedX = pos.x + rect.width / 2 < mid ? leftSnap : rightSnap;
      const snapped = { x: snappedX, y: pos.y };
      setPos(snapped);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapped));
      } catch {
        // ignore
      }
    }

    if (!movedEnoughRef.current) {
      setOpen(true);
    }

    startRef.current = null;
  };

  return (
    <>
      <Tooltip title="Dejar comentario" placement="left" arrow disableHoverListener={isMobile}>
        <IconButton
          ref={btnRef}
          aria-label="Dejar comentario"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          sx={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            zIndex: 1395,
            backgroundColor: '#EEBBC3',
            color: '#FFFFFF',
            borderRadius: '50%',
            border: '1px solid rgba(212, 165, 165, 0.65)',
            boxShadow:
              '0 14px 28px rgba(238, 187, 195, 0.35), 0 6px 10px rgba(0, 0, 0, 0.08)',
            width: { xs: 52, sm: 56 },
            height: { xs: 52, sm: 56 },
            touchAction: 'none',
            cursor: dragging ? 'grabbing' : 'grab',
            transition: dragging
              ? 'none'
              : 'left 0.2s ease, top 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
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
              transform: dragging ? 'none' : 'translateY(-2px) scale(1.04)',
            },
            '&:active': {
              transform: dragging ? 'none' : 'translateY(-1px) scale(0.98)',
            },
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Tooltip>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
