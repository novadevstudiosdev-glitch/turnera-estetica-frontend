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
    id: 1,
    name: 'Toxina Botulinica',
    shortDescription:
      'Tratamiento inyectable que relaja de forma controlada los musculos responsables de las arrugas de expresion.',
    details:
      'Tratamiento inyectable que relaja de forma controlada los musculos responsables de las arrugas de expresion (frente, entrecejo, patas de gallo). Resultado: rostro mas descansado y juvenil, sin perder naturalidad.',
    image: '/portada.png',
  },
  {
    id: 2,
    name: 'Bioestimuladores',
    shortDescription:
      'Sustancias que estimulan la produccion natural de colageno para mejorar firmeza y elasticidad.',
    details:
      'Sustancias que estimulan la produccion natural de colageno. Mejoran firmeza, elasticidad y calidad de piel de manera progresiva. Ideal para flacidez facial y corporal.',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 3,
    name: 'Tratamientos faciales y corporales con Acido Hialuronico',
    shortDescription:
      'Rellenos que aportan volumen, definicion e hidratacion profunda en rostro y cuerpo.',
    details:
      'Rellenos que aportan volumen, definicion e hidratacion profunda. Se utilizan para labios, pomulos, menton, ojeras y tambien para mejorar contorno corporal.',
    image: '/imagenes/relleno.webp',
  },
  {
    id: 4,
    name: 'Plasma Rico en Plaquetas (Facial, Corporal y Capilar)',
    shortDescription:
      'Procedimiento regenerativo con factores de crecimiento obtenidos de la sangre del paciente.',
    details:
      'Procedimiento regenerativo que utiliza factores de crecimiento obtenidos de la propia sangre del paciente. Mejora textura, luminosidad, cicatrices y estimula el crecimiento capilar.',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 5,
    name: 'Mesoterapia Facial, Corporal y Capilar',
    shortDescription:
      'Microinyecciones con activos especificos para rejuvenecimiento, reduccion localizada o fortalecimiento capilar.',
    details:
      'Microinyecciones con vitaminas, minerales y activos especificos segun el objetivo: rejuvenecimiento facial, reduccion de grasa localizada o fortalecimiento capilar.',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 6,
    name: 'Skinbooster',
    shortDescription:
      'Microinyecciones de acido hialuronico de baja densidad para hidratacion profunda sin volumen.',
    details:
      'Microinyecciones de acido hialuronico de baja densidad para hidratar profundamente la piel desde adentro. Mejora brillo, suavidad y elasticidad sin aportar volumen.',
    image: '/imagenes/hidratacion-profunda-de-la-piel.jpg',
  },
  {
    id: 7,
    name: 'Peelings Quimicos',
    shortDescription:
      'Exfoliacion quimica para reducir manchas, acne, poros dilatados y lineas finas.',
    details:
      'Aplicacion de sustancias quimicas que exfolian capas superficiales de la piel. Reduce manchas, acne, poros dilatados y lineas finas. Renueva la piel y mejora su textura.',
    image: '/imagenes/Peeling-quimico-en-madrid.webp',
  },
  {
    id: 8,
    name: 'Dermaplaning',
    shortDescription:
      'Exfoliacion mecanica que elimina celulas muertas y vello fino del rostro.',
    details:
      'Exfoliacion mecanica que elimina celulas muertas y vello fino del rostro. Deja la piel mas lisa, luminosa y mejora la penetracion de activos.',
    image: '/imagenes/limpieza facial.png',
  },
  {
    id: 9,
    name: 'Mesoterapia Suiza',
    shortDescription:
      'Version premium con activos de alta calidad y protocolos europeos.',
    details:
      'Version premium de mesoterapia con principios activos de alta calidad y protocolos europeos. Enfoque en revitalizacion intensiva y resultados visibles en menor tiempo.',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 10,
    name: 'Microneedling',
    shortDescription:
      'Tratamiento con microagujas que estimula colageno y elastina.',
    details:
      'Tratamiento con microagujas que estimula la produccion de colageno y elastina. Mejora cicatrices, manchas, arrugas y textura general de la piel.',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 11,
    name: 'Exosomas',
    shortDescription:
      'Terapia avanzada de regeneracion celular para mejorar calidad de piel y recuperacion.',
    details:
      'Terapia avanzada de regeneracion celular. Potencia la reparacion de tejidos, mejora firmeza, calidad de piel y acelera recuperacion post procedimientos.',
    image: '/portada.png',
  },
  {
    id: 12,
    name: 'Enzimas',
    shortDescription:
      'Aplicacion de enzimas para disolver grasa localizada o mejorar fibrosis.',
    details:
      'Aplicacion de enzimas especificas para disolver grasa localizada o mejorar fibrosis. Se usa en rostro y cuerpo para redefinir contornos sin cirugia.',
    image: '/imagenes/relleno.jpg',
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

