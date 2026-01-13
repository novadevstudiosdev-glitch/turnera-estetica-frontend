'use client';

import {
  Box,
  Container,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { contactInfo } from '@/lib/data';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simular envío del formulario
    try {
      // Aquí iría la lógica real de envío
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus({
        type: 'success',
        message: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });

      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' });
      }, 5000);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Error al enviar el mensaje. Intenta de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const contactOptions = [
    {
      icon: PhoneIcon,
      title: 'Teléfono',
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone}`,
    },
    {
      icon: WhatsAppIcon,
      title: 'WhatsApp',
      value: contactInfo.whatsapp,
      href: `https://wa.me/${contactInfo.whatsapp.replace(/\s/g, '')}`,
    },
    {
      icon: EmailIcon,
      title: 'Email',
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
  ];

  return (
    <Box
      id="contacto"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#FFFFFF',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Ponte en Contacto"
          subtitle="Contáctanos para agendar tu cita o resolver cualquier duda"
        />

        <Box sx={{ mt: 2 }}>
          {/* Contact Info Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3,
              mb: 4,
            }}
          >
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Box key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      backgroundColor: '#F8F5F2',
                      border: '1px solid #E8E3DF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(196, 138, 154, 0.2)',
                        transform: 'translateY(-4px)',
                        textDecoration: 'none',
                      },
                      cursor: 'pointer',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                    component="a"
                    href={option.href}
                    target={option.title === 'Email' ? undefined : '_blank'}
                  >
                    <Icon
                      sx={{
                        fontSize: '2.5rem',
                        color: '#C48A9A',
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#1A1A1A',
                        mb: 1,
                      }}
                    >
                      {option.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666666',
                        wordBreak: 'break-all',
                      }}
                    >
                      {option.value}
                    </Typography>
                  </Card>
                </Box>
              );
            })}
          </Box>

          {/* Contact Form */}
          <Box sx={{ mt: 4 }}>
            <Card
              sx={{
                borderRadius: '16px',
                p: 4,
                backgroundColor: '#F8F5F2',
                border: '1px solid #E8E3DF',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: '#1A1A1A',
                }}
              >
                Formulario de Contacto
              </Typography>

              {submitStatus.type && (
                <Alert
                  severity={submitStatus.type}
                  sx={{ mb: 3 }}
                  onClose={() => setSubmitStatus({ type: null, message: '' })}
                >
                  {submitStatus.message}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3,
                  }}
                >
                  <Box sx={{ gridColumn: { xs: '1', sm: 'span 1' } }}>
                    <TextField
                      fullWidth
                      label="Nombre Completo"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', sm: 'span 1' } }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', sm: 'span 1' } }}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', sm: 'span 1' } }}>
                    <TextField
                      fullWidth
                      label="Servicio de Interés"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      disabled={loading}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <TextField
                      fullWidth
                      label="Mensaje"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      multiline
                      rows={5}
                      required
                      disabled={loading}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                      sx={{
                        position: 'relative',
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Mensaje'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
