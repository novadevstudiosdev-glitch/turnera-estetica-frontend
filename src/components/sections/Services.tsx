'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
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
};

const modalServices: ModalService[] = [
  {
    id: 101,
    name: 'Armonizacion facial personalizada',
    shortDescription: 'Balance y proporcion de rasgos para un resultado natural.',
    details:
      'Analisis integral del rostro para definir armonia en menton, pomulos, labios y perfil, con enfoque medico personalizado.',
    image: '/imagenes/relleno.jpg',
  },
  {
    id: 102,
    name: 'Toxina botulinica (Botox)',
    shortDescription: 'Tratamiento para lineas de expresion y arrugas dinamicas.',
    details:
      'Aplicacion precisa en zonas estrategicas para suavizar arrugas y prevenir su progresion sin perder naturalidad en el gesto.',
    image: '/portada.png',
  },
  {
    id: 103,
    name: 'Rellenos dermicos (acido hialuronico)',
    shortDescription: 'Pomulos, labios y surcos nasogenianos con efecto armonico.',
    details:
      'Tecnicas de relleno para restaurar volumen y mejorar contornos faciales con productos biocompatibles de alta calidad.',
    image: '/imagenes/relleno.webp',
  },
  {
    id: 104,
    name: 'Medicina regenerativa',
    shortDescription: 'Estimulo de tejidos para mejorar textura y calidad de piel.',
    details:
      'Protocolos regenerativos orientados a mejorar firmeza, luminosidad y reparacion de la piel con enfoque progresivo.',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 105,
    name: 'Diagnostico con ecografia cutanea',
    shortDescription: 'Evaluacion anatomica previa para mayor precision y seguridad.',
    details:
      'Estudio ecografico para planificar tratamientos, identificar estructuras y reducir riesgos en procedimientos esteticos.',
    image: '/portada.png',
  },
  {
    id: 106,
    name: 'Asesoramiento medico estetico clinico',
    shortDescription: 'Diagnostico medico y plan de tratamiento por objetivos.',
    details:
      'Consulta profesional para definir prioridades, tiempos y combinaciones terapeuticas segun la necesidad de cada paciente.',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 107,
    name: 'Skincare medico personalizado',
    shortDescription: 'Rutina indicada segun tipo de piel y necesidades reales.',
    details:
      'Seleccion de productos y frecuencia de uso para potenciar resultados clinicos y mantener la salud cutanea en casa.',
    image: '/imagenes/hidratacion-profunda-de-la-piel.jpg',
  },
  {
    id: 108,
    name: 'Tratamientos preventivos antiedad',
    shortDescription: 'Prevencion temprana para sostener juventud y elasticidad.',
    details:
      'Planes de mantenimiento para retrasar signos de envejecimiento y preservar calidad de piel a largo plazo.',
    image: '/imagenes/hidratacion-profunda-de-la-piel.jpg',
  },
  {
    id: 109,
    name: 'Medicina funcional y ortomolecular',
    shortDescription: 'Integracion sistemica para optimizar resultados esteticos.',
    details:
      'Abordaje complementario con evaluacion integral de habitos y soporte nutricional orientado al bienestar y la piel.',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
];

export function ServicesSection() {
  const [openServicesModal, setOpenServicesModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ModalService | null>(null);

  const openBaseServiceDetail = (service: (typeof services)[number]) => {
    setSelectedService({
      id: service.id,
      name: service.name,
      shortDescription: service.description,
      details: service.description,
      image: service.image ?? '/portada.png',
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
      <CardContent sx={{ flexGrow: 1 }}>
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
          }}
        >
          {service.description}
        </Typography>

        <Button
          variant="contained"
          onClick={() => openBaseServiceDetail(service)}
          sx={{
            mt: 2.2,
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
          Ver mas
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
          Ver mas detalles
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
          title="Nuestros Servicios"
          subtitle="Descubre nuestro amplio catalogo de tratamientos esteticos especializados"
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

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => setOpenServicesModal(true)}
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
            Ver todos los servicios
          </Button>
        </Box>
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
              <Box
                component="img"
                src={selectedService.image}
                alt={selectedService.name}
                sx={{
                  width: '100%',
                  height: 220,
                  objectFit: 'cover',
                  borderRadius: '12px',
                  mb: 2,
                }}
              />
              <Typography sx={{ color: '#666666', lineHeight: 1.8, mb: 1.2 }}>
                {selectedService.shortDescription}
              </Typography>
              <Typography sx={{ color: '#3A3A3A', lineHeight: 1.8 }}>
                {selectedService.details}
              </Typography>
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
