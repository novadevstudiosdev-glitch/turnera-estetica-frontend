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
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { SectionTitle } from '../ui/SectionTitle';
import { products, type Product } from '@/lib/data';

export function ProductsCarouselSection() {
  const [openProductsModal, setOpenProductsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc'>('name-asc');
  const displayedProducts = [...products, ...products];
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((product) => product.category)));
    return ['Todos', ...unique];
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    let list = [...products];

    if (selectedCategory !== 'Todos') {
      list = list.filter((product) => product.category === selectedCategory);
    }

    if (normalizedSearch) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch),
      );
    }

    list.sort((a, b) =>
      sortBy === 'name-desc'
        ? b.name.localeCompare(a.name, 'es-AR')
        : a.name.localeCompare(b.name, 'es-AR'),
    );

    return list;
  }, [searchTerm, selectedCategory, sortBy]);

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
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2.5,
              animation: 'productsScroll 28s linear infinite',
              '@keyframes productsScroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
              '&:hover': { animationPlayState: 'paused' },
            }}
          >
            {displayedProducts.map((product, index) => (
              <Box
                key={`${product.id}-${index}`}
                sx={{
                  flex: '0 0 auto',
                  width: { xs: 240, sm: 260, md: 280 },
                  minHeight: 300,
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
                    height: 200,
                    objectFit: 'contain',
                    borderRadius: '10px',
                    backgroundColor: '#F5F0F0',
                    p: 0,
                    mb: 1.2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: '#1A1A1A', mb: 1, minHeight: 64 }}
                >
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
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      <Dialog
        open={openProductsModal}
        onClose={() => setOpenProductsModal(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: '18px',
          },
        }}
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
              gap: { xs: 3, md: 4 },
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 1.6 }}>
                Categorias
              </Typography>
              <Stack spacing={1.2}>
                {categories.map((category) => {
                  const active = category === selectedCategory;
                  return (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={active ? 'contained' : 'outlined'}
                      sx={{
                        justifyContent: 'center',
                        borderRadius: '999px',
                        textTransform: 'none',
                        fontWeight: 600,
                        backgroundColor: active ? '#EEBBC3' : '#FFFFFF',
                        color: '#2C2C2C',
                        borderColor: active ? '#E7B1B9' : '#E6DEDA',
                        '&:hover': {
                          backgroundColor: active ? '#FFB8C6' : '#FFF6F7',
                          borderColor: '#E7B1B9',
                        },
                      }}
                    >
                      {category}
                    </Button>
                  );
                })}
              </Stack>
            </Box>

            <Box sx={{ display: 'grid', gap: 2.5 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1.3fr 0.5fr 0.5fr' },
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <TextField
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#B78E95' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />

                <TextField
                  select
                  label="Categoria"
                  size="small"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={`category-${category}`} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Ordenar por"
                  size="small"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as 'name-asc' | 'name-desc')}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                >
                  <MenuItem value="name-asc">Nombre (A-Z)</MenuItem>
                  <MenuItem value="name-desc">Nombre (Z-A)</MenuItem>
                </TextField>
              </Box>

              {filteredProducts.length === 0 ? (
                <Box
                  sx={{
                    borderRadius: '16px',
                    border: '1px dashed #E6E0DD',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography sx={{ color: '#6B6B6B' }}>
                    No se encontraron productos con esos filtros.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                      lg: 'repeat(3, minmax(0, 1fr))',
                    },
                    gap: 2,
                  }}
                >
                  {filteredProducts.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        border: '1px solid #ECE7E3',
                        borderRadius: '16px',
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        display: 'grid',
                        gap: 1.2,
                        boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'contain',
                          borderRadius: '12px',
                          backgroundColor: '#F5F0F0',
                          p: 0,
                        }}
                      />
                      <Typography sx={{ fontWeight: 700, color: '#2C2C2C' }}>
                        {product.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#666666',
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.description}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{ backgroundColor: '#F1E4E8', color: '#8F5161' }}
                        />
                        <Button
                          variant="outlined"
                          onClick={() => setSelectedProduct(product)}
                          sx={{
                            borderRadius: '999px',
                            px: 2,
                            py: 0.4,
                            textTransform: 'none',
                            borderColor: '#E2D4D2',
                            color: '#6B5A5A',
                            fontSize: '0.8rem',
                            '&:hover': {
                              borderColor: '#D4A5A5',
                              backgroundColor: '#FFF6F7',
                            },
                          }}
                        >
                          Ver detalle
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
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
                  height: 280,
                  objectFit: 'contain',
                  borderRadius: '12px',
                  backgroundColor: '#F5F0F0',
                  p: 0,
                  mb: 1.5,
                }}
              />
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
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ color: '#1A1A1A', fontWeight: 700, mb: 1 }}>Beneficios</Typography>
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
