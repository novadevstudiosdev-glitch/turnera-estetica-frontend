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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    if (name === 'phone') {
      if (!/^\d*$/.test(value)) {
        setErrors((prev) => ({ ...prev, phone: 'Solo números' }));
        return;
      } else {
        setErrors((prev) => ({ ...prev, phone: '' }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Campo obligatorio';
    if (!formData.email.trim()) newErrors.email = 'Campo obligatorio';
    if (!formData.phone.trim()) newErrors.phone = 'Campo obligatorio';
    if (!formData.service.trim()) newErrors.service = 'Campo obligatorio';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
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
      setErrors({});
    } catch {
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

  const labelStyle = {
    sx: {
      color: '#D4A5A5',
      '&.Mui-focused': { color: '#D4A5A5' },
    },
  };

  return (
    <Box id="contacto" component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionTitle
          title="Ponte en Contacto"
          subtitle="Contáctanos para agendar tu cita o resolver cualquier duda"
        />

        <Box sx={{ mt: 2 }}>
          {/* Contact cards */}
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
                <Card
                  key={index}
                  component="a"
                  href={option.href}
                  target={option.title === 'Email' ? undefined : '_blank'}
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E9E4E2',
                    textAlign: 'center',
                    p: 3,
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Icon sx={{ fontSize: '2.5rem', color: '#D4A5A5', mb: 2 }} />
                  <Typography fontWeight={700}>{option.title}</Typography>
                  <Typography variant="body2">{option.value}</Typography>
                </Card>
              );
            })}
          </Box>

          {/* Form */}
          <Card sx={{ borderRadius: '16px', p: 4, backgroundColor: '#FFFFFF', border: '1px solid #E9E4E2' }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Formulario de Contacto
            </Typography>

            {submitStatus.type && (
              <Alert severity={submitStatus.type} sx={{ mb: 3 }}>
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
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  InputLabelProps={labelStyle}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                  InputLabelProps={labelStyle}
                />

                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputLabelProps={labelStyle}
                />

                <TextField
                  fullWidth
                  label="Servicio de Interés"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  error={!!errors.service}
                  helperText={errors.service}
                  InputLabelProps={labelStyle}
                />

                {/* Mensaje + botón */}
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <TextField
                    fullWidth
                    label="Mensaje"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={6}
                    InputLabelProps={labelStyle}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      borderRadius: '999px',
                      borderColor: '#EEBBC3',
                      color: '#3A3A3A',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#EEBBC3',
                        borderColor: '#FFB8C6',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Enviar Mensaje'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

