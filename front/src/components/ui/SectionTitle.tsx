'use client';

import { Typography, Box } from '@mui/material';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionTitle({ title, subtitle, centered = true }: SectionTitleProps) {
  return (
    <Box
      sx={{
        textAlign: centered ? 'center' : 'left',
        mb: 6,
      }}
    >
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontWeight: 700,
          color: '#1A1A1A',
          mb: subtitle ? 2 : 0,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: '#666666',
            fontSize: '1.1rem',
            maxWidth: '600px',
            mx: centered ? 'auto' : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
