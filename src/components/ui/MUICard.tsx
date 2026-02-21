'use client';

import { Card, CardContent, CardProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface MUICardProps extends CardProps {
  title?: string;
  children: ReactNode;
}

export function MUICard({ title, children, ...props }: MUICardProps) {
  return (
    <Card {...props}>
      <CardContent>
        {title && (
          <Typography variant="h5" component="div" gutterBottom sx={{ mb: 2 }}>
            {title}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
