'use client';

import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { contactInfo } from '@/lib/data';

export function WhatsAppFloatingButton() {
  const phone = contactInfo.whatsapp.replace(/[^\d]/g, '');
  const href = `https://wa.me/${phone}`;

  return (
    <Tooltip title="WhatsApp" placement="left" arrow>
      <Fab
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 24 },
          bottom: { xs: 84, md: 96 },
          zIndex: 1400,
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          boxShadow: '0 12px 24px rgba(37, 211, 102, 0.35)',
          '&:hover': {
            backgroundColor: '#1EBE5D',
            boxShadow: '0 16px 30px rgba(37, 211, 102, 0.45)',
          },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 30 }} />
      </Fab>
    </Tooltip>
  );
}
