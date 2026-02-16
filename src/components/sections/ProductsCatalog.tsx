'use client';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { products, type Product } from '@/lib/data';

function ProductDetail({ product }: { product: Product }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '2rem', mb: 1 }}>{product.icon}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 1 }}>
        {product.name}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Chip label={product.category} size="small" sx={{ backgroundColor: '#F0E7EA', color: '#8F5161' }} />
        <Chip label={product.presentation} size="small" sx={{ backgroundColor: '#EFEDEB', color: '#555555' }} />
      </Stack>
      <Typography variant="body1" sx={{ color: '#555555', lineHeight: 1.7, mb: 2 }}>
        {product.description}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#C48A9A', mb: 2 }}>
        {product.price}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" sx={{ color: '#1A1A1A', fontWeight: 700, mb: 1 }}>
        Beneficios
      </Typography>
      <Stack spacing={1}>
        {product.benefits.map((benefit) => (
          <Typography key={benefit} variant="body2" sx={{ color: '#666666' }}>
            - {benefit}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

export function ProductsCatalogSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleClose = () => setSelectedProduct(null);

  return (
    <Box
      id="catalogo"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#FCFAF8',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Catalogo de Productos"
          subtitle="Dermocosmetica profesional para potenciar y mantener tus resultados en casa"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              sx={{
                borderRadius: '16px',
                border: '1px solid #ECE7E3',
                backgroundColor: '#FFFFFF',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                '&:hover': {
                  boxShadow: '0 14px 28px rgba(26, 26, 26, 0.08)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 }, flexGrow: 1 }}>
                <Typography sx={{ fontSize: '2rem', mb: 1 }}>{product.icon}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 1 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.7, mb: 2 }}>
                  {product.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ backgroundColor: '#F0E7EA', color: '#8F5161' }}
                  />
                </Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#C48A9A', mb: 2 }}>
                  {product.price}
                </Typography>
                <Box
                  component="button"
                  onClick={() => setSelectedProduct(product)}
                  sx={{
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#1A1A1A',
                    color: '#FFFFFF',
                    px: 2,
                    py: 1,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#2B2B2B',
                    },
                  }}
                >
                  Ver detalle
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Dialog
        open={!isMobile && Boolean(selectedProduct)}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pr: 6 }}>
          Detalle del producto
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Cerrar"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct ? <ProductDetail product={selectedProduct} /> : null}
        </DialogContent>
      </Dialog>

      <Drawer
        anchor="bottom"
        open={isMobile && Boolean(selectedProduct)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            maxHeight: '85vh',
            p: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Detalle del producto
          </Typography>
          <IconButton onClick={handleClose} aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ overflowY: 'auto', pb: 1 }}>{selectedProduct ? <ProductDetail product={selectedProduct} /> : null}</Box>
      </Drawer>
    </Box>
  );
}
