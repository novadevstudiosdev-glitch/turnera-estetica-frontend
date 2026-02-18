'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SectionTitle } from '../ui/SectionTitle';
import { products, type Product } from '@/lib/data';

export function ProductsCarouselSection() {
  const [openProductsModal, setOpenProductsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const displayedProducts = [...products, ...products];
  const productsByCategory = useMemo(() => {
    return products.reduce<Record<string, typeof products>>((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }, []);

  const handleViewAllProducts = () => {
    setOpenProductsModal(true);
  };

  return (
    <Box
      id="productos-destacados"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#FCFAF8',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Productos Destacados"
          subtitle="Conoce una seleccion de dermocosmetica profesional recomendada para tu rutina diaria"
        />

        <Box
          sx={{
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2.5,
              animation: 'productsScroll 36s linear infinite',
              '@keyframes productsScroll': {
                '0%': {
                  transform: 'translateX(0)',
                },
                '100%': {
                  transform: 'translateX(-50%)',
                },
              },
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {displayedProducts.map((product, index) => (
              <Box
                key={`${product.id}-${index}`}
              sx={{
                flex: '0 0 auto',
                width: { xs: 260, sm: 280, md: 300 },
                minHeight: 340,
                borderRadius: '16px',
                border: '1px solid #ECE7E3',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2.5, md: 3 },
                transition: 'all 0.25s ease',
                '&:hover': {
                  boxShadow: '0 14px 28px rgba(26, 26, 26, 0.08)',
                  transform: 'translateY(-4px)',
                },
              }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 140,
                    objectFit: 'cover',
                    borderRadius: '10px',
                    mb: 1.2,
                  }}
                />
                <Typography sx={{ fontSize: '2rem', mb: 1 }}>{product.icon}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 1, minHeight: 64 }}>
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666666',
                    lineHeight: 1.7,
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: 72,
                  }}
                >
                  {product.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ backgroundColor: '#F0E7EA', color: '#8F5161' }}
                  />
                </Stack>
                <Typography variant="subtitle1" sx={{ mt: 'auto', fontWeight: 700, color: '#C48A9A' }}>
                  {product.price}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 3, gap: 2 }}
        >
          <Typography sx={{ fontSize: '0.92rem', color: '#666666', textAlign: 'center' }}>
            Desliza o espera: el carrusel se mueve automaticamente
          </Typography>

          <Button
            variant="contained"
            onClick={handleViewAllProducts}
            sx={{
              borderRadius: '999px',
              px: 3,
              py: 1,
              backgroundColor: '#EEBBC3',
              color: '#2C2C2C',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#FFB8C6',
              },
            }}
          >
            Ver todos los productos
          </Button>
        </Stack>
      </Container>

      <Dialog
        open={openProductsModal}
        onClose={() => setOpenProductsModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ pr: 6 }}>
          Todos los productos por categoria
          <IconButton
            onClick={() => setOpenProductsModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Cerrar"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <Box key={category}>
                <Typography sx={{ fontWeight: 700, color: '#8F5161', mb: 1.5 }}>
                  {category}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                      md: 'repeat(3, minmax(0, 1fr))',
                    },
                    gap: 1.5,
                  }}
                >
                  {categoryProducts.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        border: '1px solid #ECE7E3',
                        borderRadius: '12px',
                        p: 1.5,
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: '8px',
                          mb: 1,
                        }}
                      />
                      <Typography sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                        {product.icon} {product.name}
                      </Typography>
                      <Typography sx={{ color: '#666666', fontSize: '0.88rem', mt: 0.4 }}>
                        {product.description}
                      </Typography>
                      <Typography sx={{ color: '#C48A9A', fontWeight: 700, mt: 0.8 }}>
                        {product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setSelectedProduct(product)}
                        sx={{
                          mt: 1.2,
                          borderRadius: '999px',
                          px: 2,
                          py: 0.7,
                          fontSize: '0.82rem',
                          backgroundColor: '#EEBBC3',
                          color: '#2C2C2C',
                          '&:hover': {
                            backgroundColor: '#FFB8C6',
                          },
                        }}
                      >
                        Ver detalle
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pr: 6 }}>
          Detalle del producto
          <IconButton
            onClick={() => setSelectedProduct(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Cerrar detalle"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct ? (
            <Box>
              <Box
                component="img"
                src={selectedProduct.image}
                alt={selectedProduct.name}
                sx={{
                  width: '100%',
                  height: 220,
                  objectFit: 'cover',
                  borderRadius: '12px',
                  mb: 1.5,
                }}
              />
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>{selectedProduct.icon}</Typography>
              <Typography sx={{ fontWeight: 700, color: '#1A1A1A', mb: 1.2 }}>
                {selectedProduct.name}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={selectedProduct.category}
                  size="small"
                  sx={{ backgroundColor: '#F0E7EA', color: '#8F5161' }}
                />
                <Chip
                  label={selectedProduct.presentation}
                  size="small"
                  sx={{ backgroundColor: '#EFEDEB', color: '#555555' }}
                />
              </Stack>
              <Typography sx={{ color: '#666666', lineHeight: 1.7 }}>
                {selectedProduct.description}
              </Typography>
              <Typography sx={{ color: '#C48A9A', fontWeight: 700, mt: 1.5 }}>
                {selectedProduct.price}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ color: '#1A1A1A', fontWeight: 700, mb: 1 }}>
                Beneficios
              </Typography>
              <Stack spacing={0.7}>
                {selectedProduct.benefits.map((benefit) => (
                  <Typography key={benefit} sx={{ color: '#666666', fontSize: '0.92rem' }}>
                    - {benefit}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
