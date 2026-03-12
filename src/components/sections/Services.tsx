'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import { services } from '@/lib/data';

type ModalService = {
  id: number;
  name: string;
  shortDescription: string;
  details: string;
  image: string;
  category: string;
  benefits: string[];
  duration: string;
  frequency: string;
};

const modalServices: ModalService[] = [
  {
    id: 1,
    name: 'Toxina Botulínica',
    shortDescription:
      'Tratamiento inyectable que relaja de forma controlada los músculos responsables de las arrugas de expresión.',
    details:
      'Tratamiento inyectable que relaja de forma controlada los músculos responsables de las arrugas de expresión (frente, entrecejo, patas de gallo). Resultado: rostro más descansado y juvenil, sin perder naturalidad.',
    image: '/toxina%20butolinica.jpeg',
    category: 'Inyectables',
    benefits: ['Suaviza líneas de expresión', 'Resultado natural y controlado', 'Recuperación rápida'],
    duration: '20-30 min',
    frequency: 'cada 4-6 meses',
  },
  {
    id: 2,
    name: 'Bioestimuladores',
    shortDescription:
      'Sustancias que estimulan la producción natural de colágeno para mejorar firmeza y elasticidad.',
    details:
      'Sustancias que estimulan la producción natural de colágeno. Mejoran firmeza, elasticidad y calidad de piel de manera progresiva. Ideal para flacidez facial y corporal.',
    image: '/bioestimuladores.jpeg',
    category: 'Regenerativos',
    benefits: ['Mejora firmeza y elasticidad', 'Efecto progresivo y natural', 'Ideal para flacidez'],
    duration: '30-45 min',
    frequency: 'cada 8-12 meses',
  },
  {
    id: 3,
    name: 'Tratamientos faciales y corporales con Ácido Hialurónico',
    shortDescription:
      'Rellenos que aportan volumen, definición e hidratación profunda en rostro y cuerpo.',
    details:
      'Rellenos que aportan volumen, definición e hidratación profunda. Se utilizan para labios, pómulos, mentón, ojeras y también para mejorar contorno corporal.',
    image: '/%C3%A1cido%20hialuronico.jpeg',
    category: 'Rellenos',
    benefits: ['Aporta volumen y definición', 'hidratación profunda', 'Resultados inmediatos'],
    duration: '30-40 min',
    frequency: 'cada 9-12 meses',
  },
  {
    id: 4,
    name: 'Plasma Rico en Plaquetas (Facial, Corporal y Capilar)',
    shortDescription:
      'Procedimiento regenerativo con factores de crecimiento obtenidos de la sangre del paciente.',
    details:
      'Procedimiento regenerativo que utiliza factores de crecimiento obtenidos de la propia sangre del paciente. Mejora textura, luminosidad, cicatrices y estimula el crecimiento capilar.',
    image: '/Plasma%20rico%20en%20plaquetas.jpeg',
    category: 'Regenerativos',
    benefits: ['Mejora luminosidad y textura', 'Favorece la Reparación', 'Estimula crecimiento capilar'],
    duration: '45-60 min',
    frequency: 'cada 4-6 semanas',
  },
  {
    id: 5,
    name: 'Mesoterapia Facial, Corporal y Capilar',
    shortDescription:
      'Microinyecciones con activos específicos para rejuvenecimiento, reducción localizada o fortalecimiento capilar.',
    details:
      'Microinyecciones con vitaminas, minerales y activos específicos según el objetivo: rejuvenecimiento facial, reducción de grasa localizada o fortalecimiento capilar.',
    image: '/mesoterapia.jpeg',
    category: 'Mesoterapia',
    benefits: ['Aporta activos personalizados', 'Mejora firmeza y brillo', 'Tratamiento progresivo'],
    duration: '30-45 min',
    frequency: 'cada 2-4 semanas',
  },
  {
    id: 6,
    name: 'Skinbooster',
    shortDescription:
      'Microinyecciones de ácido hialurónico de baja densidad para hidratación profunda sin volumen.',
    details:
      'Microinyecciones de ácido hialurónico de baja densidad para hidratar profundamente la piel desde adentro. Mejora brillo, suavidad y elasticidad sin aportar volumen.',
    image: '/skinbooster.jpeg',
    category: 'Hidratación',
    benefits: ['hidratación profunda', 'Mejora elasticidad', 'Efecto glow inmediato'],
    duration: '30 min',
    frequency: 'cada 3-6 meses',
  },
  {
    id: 7,
    name: 'Peelings Quimicos',
    shortDescription:
      'Exfoliación quimica para reducir manchas, acne, poros dilatados y líneas finas.',
    details:
      'Aplicación de sustancias quimicas que exfolian capas superficiales de la piel. Reduce manchas, acne, poros dilatados y líneas finas. Renueva la piel y mejora su textura.',
    image: '/peeling%20quimico.jpeg',
    category: 'Exfoliación',
    benefits: ['Reduce manchas y poros', 'Renueva la piel', 'Mejora textura'],
    duration: '20-30 min',
    frequency: 'cada 3-4 semanas',
  },
  {
    id: 8,
    name: 'Dermaplaning',
    shortDescription:
      'Exfoliación mecánica que elimina células muertas y vello fino del rostro.',
    details:
      'Exfoliación mecánica que elimina células muertas y vello fino del rostro. Deja la piel más lisa, luminosa y mejora la penetración de activos.',
    image: '/dermaplaning.jpeg',
    category: 'Exfoliación',
    benefits: ['Piel más lisa y luminosa', 'Mejor absorción de activos', 'Resultados inmediatos'],
    duration: '30 min',
    frequency: 'cada 3-4 semanas',
  },
  {
    id: 9,
    name: 'Mesoterapia Suiza',
    shortDescription:
      'Versión premium con activos de alta calidad y protocolos europeos.',
    details:
      'Versión premium de mesoterapia con principios activos de alta calidad y protocolos europeos. Enfoque en revitalización intensiva y resultados visibles en menor tiempo.',
    image: '/mesoterapia.jpeg',
    category: 'Mesoterapia',
    benefits: ['Activos premium', 'revitalización intensiva', 'Resultados visibles rápidos'],
    duration: '30-45 min',
    frequency: 'cada 2-4 semanas',
  },
  {
    id: 10,
    name: 'Microneedling',
    shortDescription:
      'Tratamiento con microagujas que estimula colágeno y elastina.',
    details:
      'Tratamiento con microagujas que estimula la producción de colágeno y elastina. Mejora cicatrices, manchas, arrugas y textura general de la piel.',
    image: '/microneedling.jpeg',
    category: 'Regenerativos',
    benefits: ['Estimula colágeno', 'Mejora cicatrices y manchas', 'Piel más uniforme'],
    duration: '40-60 min',
    frequency: 'cada 4-6 semanas',
  },
  {
    id: 11,
    name: 'Exosomás',
    shortDescription:
      'Terapia avanzada de regeneracion celular para mejorar calidad de piel y Recuperación.',
    details:
      'Terapia avanzada de regeneracion celular. Potencia la Reparación de tejidos, mejora firmeza, calidad de piel y acelera Recuperación post procedimientos.',
    image: '/exomás.jpeg',
    category: 'Regenerativos',
    benefits: ['Reparación celular avanzada', 'Mejora firmeza', 'Recuperación más rápida'],
    duration: '45-60 min',
    frequency: 'cada 6-8 semanas',
  },
  {
    id: 12,
    name: 'Enzimás',
    shortDescription:
      'Aplicación de enzimás para disolver grasa localizada o mejorar fibrosis.',
    details:
      'Aplicación de enzimás específicas para disolver grasa localizada o mejorar fibrosis. Se usa en rostro y cuerpo para redefinir contornos sin cirugía.',
    image: '/enzimás.jpeg',
    category: 'Enzimáticos',
    benefits: ['Ayuda a reducir grasa localizada', 'Mejora fibrosis', 'Define contornos'],
    duration: '30-45 min',
    frequency: 'cada 2-4 semanas',
  },
];

export function ServicesSection() {
  const [openServicesModal, setOpenServicesModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ModalService | null>(null);

  const openBaseServiceDetail = (service: (typeof services)[number]) => {
    const match = modalServices.find((item) => item.id === service.id);
    if (match) {
      setSelectedService(match);
      return;
    }
    setSelectedService({
      id: service.id,
      name: service.name,
      shortDescription: service.description,
      details: service.description,
      image: service.image ?? '/portada.png',
      category: 'Tratamiento',
      benefits: [],
      duration: '',
      frequency: '',
    });
  };

  const renderServiceCard = (service: (typeof services)[number]) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 26px rgba(0, 0, 0, 0.08)',
        },
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9E4E2',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {service.image && (
          <Box
            component="img"
            src={service.image}
            alt={service.name}
            sx={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '12px 12px 0 0',
              mb: 2,
            }}
          />
        )}

        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontWeight: 600,
            color: '#3A3A3A',
            mb: 2,
          }}
        >
          {service.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#7A7A7A',
            lineHeight: 1.8,
            flexGrow: 1,
          }}
        >
          {service.description}
        </Typography>

        <Button
          variant="contained"
          onClick={() => openBaseServiceDetail(service)}
          sx={{
            mt: 'auto',
            alignSelf: 'flex-start',
            width: 'fit-content',
            borderRadius: '999px',
            px: 2,
            py: 0.8,
            fontSize: '0.82rem',
            backgroundColor: '#EEBBC3',
            color: '#2C2C2C',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#FFB8C6',
            },
          }}
        >
          Ver más
        </Button>
      </CardContent>
    </Card>
  );

  const renderModalServiceCard = (service: ModalService) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: '14px',
        border: '1px solid #E9E4E2',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="img"
        src={service.image}
        alt={service.name}
        sx={{
          width: '100%',
          height: 170,
          objectFit: 'cover',
          borderRadius: '14px 14px 0 0',
        }}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography sx={{ fontWeight: 700, color: '#3A3A3A', mb: 1 }}>
          {service.name}
        </Typography>
        <Typography sx={{ color: '#6E6E6E', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {service.shortDescription}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setSelectedService(service)}
          sx={{
            mt: 'auto',
            alignSelf: 'flex-start',
            borderRadius: '999px',
            px: 2,
            py: 0.8,
            fontSize: '0.82rem',
            backgroundColor: '#EEBBC3',
            color: '#2C2C2C',
            '&:hover': {
              backgroundColor: '#FFB8C6',
            },
          }}
        >
          Ver más detalles
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box
      id="servicios"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'transparent',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Tratamientos"
          subtitle="Descubre nuestro amplio catálogo de tratamientos estéticos especializados"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
            mt: 2,
          }}
        >
          {services.map((service) => (
            <Box key={service.id}>{renderServiceCard(service)}</Box>
          ))}
        </Box>

        <Box sx={{ mt: 4 }} />
      </Container>

      <Dialog
        open={openServicesModal}
        onClose={() => {
          setOpenServicesModal(false);
          setSelectedService(null);
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ pr: 6 }}>
          Todos los servicios
          <IconButton
            onClick={() => {
              setOpenServicesModal(false);
              setSelectedService(null);
            }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Cerrar servicios"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 2.5,
            }}
          >
            {modalServices.map((service) => (
              <Box key={`modal-${service.id}`}>{renderModalServiceCard(service)}</Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pr: 6 }}>
          {selectedService?.name ?? 'Detalle del servicio'}
          <IconButton
            onClick={() => setSelectedService(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Cerrar detalle de servicio"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedService ? (
            <Box>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={selectedService.category}
                    size="small"
                    sx={{
                      backgroundColor: '#F1E4E8',
                      color: '#8F5161',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2C2C', mb: 1 }}>
                    {selectedService.name}
                  </Typography>
                  <Typography sx={{ color: '#6E6E6E', lineHeight: 1.75 }}>
                    {selectedService.details}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 1 }}>
                    Beneficios clinicos
                  </Typography>
                  {selectedService.benefits.length > 0 ? (
                    <Stack spacing={0.7}>
                      {selectedService.benefits.map((benefit) => (
                        <Typography key={benefit} sx={{ color: '#6E6E6E', fontSize: '0.92rem' }}>
                          {benefit}
                        </Typography>
                      ))}
                    </Stack>
                  ) : (
                    <Typography sx={{ color: '#9A8F8F', fontSize: '0.9rem' }}>
                      Beneficios personalizados según evaluación profesional.
                    </Typography>
                  )}
                </Box>

              </Stack>
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

