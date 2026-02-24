import { Box, Container, Divider, Typography } from '@mui/material';

export default function PrivacyPolicyPage() {
  return (
    <Box component="main" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Pol&iacute;tica de Privacidad
        </Typography>
        <Typography sx={{ color: '#6B6B6B', mb: 4 }}>
          Esta pol&iacute;tica describe c&oacute;mo recopilamos, usamos y protegemos los datos personales
          de quienes visitan el sitio y solicitan turnos.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          1. Responsable del tratamiento
        </Typography>
        <Typography sx={{ color: '#6B6B6B', mb: 3 }}>
          Consultorio M&eacute;dico Est&eacute;tico Dra. Jaquelina Grassetti. Para consultas sobre esta
          pol&iacute;tica pod&eacute;s escribir a info@mok-consultorio.com.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          2. Datos que recopilamos
        </Typography>
        <Typography sx={{ color: '#6B6B6B', mb: 3 }}>
          Recopilamos datos de contacto (nombre, email, tel&eacute;fono o WhatsApp), informaci&oacute;n
          de turnos (servicio solicitado, fecha y hora), mensajes enviados en formularios y datos
          t&eacute;cnicos b&aacute;sicos de navegaci&oacute;n (como direcci&oacute;n IP, navegador y
          dispositivo). Tambi&eacute;n utilizamos reCAPTCHA para prevenir fraudes.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          3. Finalidades del tratamiento
        </Typography>
        <Typography sx={{ color: '#6B6B6B', mb: 3 }}>
          Usamos los datos para responder consultas, gestionar turnos, brindar informaci&oacute;n
          sobre servicios solicitados y mejorar la experiencia del sitio.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          4. Base legal
        </Typography>
        <Typography sx={{ color: '#6B6B6B', mb: 3 }}>
          La base legal es el consentimiento del usuario y la necesidad de gestionar la solicitud
          de turnos o consultas.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          5. Destinatarios y terceros
        </Typography>
        <Typography sx={{ color: '#6B6B6B', mb: 3 }}>
          Podemos compartir datos con proveedores que prestan servicios esenciales (hosting,
          correo, anal&iacute;tica o seguridad) bajo acuerdos de confidencialidad. No vendemos
          datos personales.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          6. Plazos de conservaci&oacute;n
        </Typography>
        <Typography sx={{ color: '#6B6B6B', mb: 3 }}>
          Conservamos la informaci&oacute;n el tiempo necesario para cumplir con las finalidades
          descriptas y obligaciones legales aplicables.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          7. Derechos del usuario
        </Typography>
        <Typography sx={{ color: '#6B6B6B', mb: 3 }}>
          Pod&eacute;s solicitar acceso, rectificaci&oacute;n o eliminaci&oacute;n de tus datos, as&iacute;
          como oponerte al tratamiento. Para ejercer estos derechos escrib&iacute; a
          info@mok-consultorio.com.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          8. Seguridad
        </Typography>
        <Typography sx={{ color: '#6B6B6B', mb: 3 }}>
          Implementamos medidas t&eacute;cnicas y organizativas para proteger tus datos contra
          accesos no autorizados, p&eacute;rdida o alteraci&oacute;n.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          9. Cambios en esta pol&iacute;tica
        </Typography>
        <Typography sx={{ color: '#6B6B6B' }}>
          Podremos actualizar esta pol&iacute;tica cuando sea necesario. La versi&oacute;n vigente
          estar&aacute; publicada en esta p&aacute;gina.
        </Typography>
      </Container>
    </Box>
  );
}
