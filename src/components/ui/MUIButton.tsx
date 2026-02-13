'use client';

import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';

interface MUIButtonProps extends ButtonProps {
  children: ReactNode;
}

export function MUIButton({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'large',
  ...props
}: MUIButtonProps) {
  return (
    <Button variant={variant} color={color} size={size} {...props}>
      {children}
    </Button>
  );
}
