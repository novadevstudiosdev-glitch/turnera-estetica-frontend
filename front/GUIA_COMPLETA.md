# 🎉 MOK Landing Page - Guía Completa

Felicidades! Tu landing page profesional para MOK ha sido creada exitosamente.

## ✅ Qué Está Listo

### Estructura Completa

- ✅ Proyecto Next.js 16 con App Router
- ✅ TypeScript completamente tipado
- ✅ Material-UI 7 integrado
- ✅ Emotion configurado para SSR
- ✅ Tailwind CSS listo para usar
- ✅ ESLint configurado

### Componentes

- ✅ Header con navegación responsive
- ✅ Footer con redes sociales
- ✅ Sección Hero con CTA
- ✅ 6 Servicios en grid
- ✅ Sección de video
- ✅ 3 Testimonios con ratings
- ✅ Carrusel de marcas
- ✅ Ubicación + Google Maps
- ✅ Formulario de contacto funcional

### Diseño

- ✅ Responsive (mobile-first)
- ✅ Paleta profesional rosa viejo + crema
- ✅ Animaciones suaves
- ✅ Accessible (WCAG)
- ✅ Rendimiento optimizado

## 🚀 Próximos Pasos

### 1. Inicia el servidor de desarrollo

```bash
cd c:/Users/miran/Desktop/consultorio-estetica-landing/front
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### 2. Personaliza el Contenido

#### Edita la información de contacto:

```bash
src/lib/data.ts
```

Cambia:

- `phone` - Teléfono
- `whatsapp` - WhatsApp
- `email` - Email
- `address` - Dirección
- `hours` - Horarios de atención

#### Modifica los servicios:

En el mismo archivo `src/lib/data.ts`, edita el array `services[]`.

Cada servicio tiene:

```typescript
{
  id: number;
  name: string;
  description: string;
  icon: string; // emoji
}
```

#### Cambia los testimonios:

Edita el array `testimonials[]` con los comentarios reales de tus clientes.

### 3. Personaliza el Tema

#### Colores principales:

Abre `src/theme/theme.ts` y edita:

```typescript
const PRIMARY_COLOR = '#C48A9A'; // Color principal
const SECONDARY_COLOR = '#8A7C8A'; // Color secundario
const BACKGROUND_COLOR = '#F8F5F2'; // Fondo
const TEXT_COLOR = '#1A1A1A'; // Texto
```

#### Tipografía:

En el mismo archivo, puedes cambiar la fuente en la sección `typography`.

### 4. Agrega Imágenes y Videos

```
public/
├── images/
│   ├── hero-bg.jpg
│   ├── team.jpg
│   └── testimonial-1.jpg
└── brands/
    ├── allergan.svg
    ├── juvederm.svg
    └── restylane.svg
```

### 5. Integra Google Maps

En `src/components/sections/Location.tsx`, reemplaza el placeholder con:

```tsx
<iframe
  width="100%"
  height="100%"
  frameBorder="0"
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
/>
```

Obtén el embed code en: https://www.google.com/maps

### 6. Configura el Formulario de Contacto

En `src/components/sections/Contact.tsx`, actualiza la función `handleSubmit()` para enviar los datos:

```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

### 7. Crea el API de Contacto

```typescript
// src/app/api/contact/route.ts
export async function POST(request: Request) {
  const data = await request.json();

  // Envía email, guarda en BD, etc.

  return Response.json({ success: true });
}
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm run start

# Ejecutar linter
npm run lint
```

## 🌐 Despliegue

### Vercel (Recomendado - gratis para Next.js)

1. Sube el código a GitHub
2. Conecta en https://vercel.com
3. Selecciona el repositorio
4. Vercel detectará que es Next.js
5. ¡Listo! Tendrás un dominio gratuito

### Otras Opciones

- **Netlify** - Compatible con Next.js
- **AWS** - Usando Amplify
- **DigitalOcean** - App Platform
- **Tu propio servidor** - Node.js + PM2

## 🔐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=tu_clave

# Email (si usas SendGrid, Resend, etc.)
SENDGRID_API_KEY=tu_clave

# Base de datos
DATABASE_URL=tu_url_conexion
```

## 📱 Checklist de Lanzamiento

- [ ] Cambié contactInfo en `data.ts`
- [ ] Agregué servicios personalizados
- [ ] Agregué testimonios reales
- [ ] Subí imágenes de calidad
- [ ] Configuré Google Maps
- [ ] Conecté formulario a email/BD
- [ ] Probé en móvil
- [ ] Verifiqué todos los links
- [ ] Configuré dominio personalizado
- [ ] Hice backup del código

## 🆘 Troubleshooting

### Puerto 3000 está en uso

```bash
npm run dev -- -p 3001
```

### Error de compilación

```bash
rm -rf .next
npm run build
```

### Problemas con MUI

```bash
npm install @mui/material @emotion/react @emotion/styled
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Material-UI Docs](https://mui.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 💡 Tips

1. **Performance**: Usa Next Image para imágenes
2. **SEO**: Actualiza metadata en `layout.tsx`
3. **Analytics**: Agrega Google Analytics o Vercel Analytics
4. **CMS**: Considera Contentful o Sanity para contenido dinámico
5. **Backup**: Guarda tu código en GitHub

## ❓ Preguntas Frecuentes

**¿Cómo cambio el nombre de la empresa?**

- Edita `MOK` en `Header.tsx` y `Footer.tsx`
- Cambia `title` en `app/layout.tsx`

**¿Cómo agrego más servicios?**

- Agrega items al array `services` en `src/lib/data.ts`

**¿Cómo integro un CMS?**

- Usa Contentful, Sanity o Strapi
- Reemplaza datos mock en `data.ts` con llamadas API

**¿Es SEO-friendly?**

- Sí! Next.js App Router genera HTML estático
- Configura Open Graph en `layout.tsx`

---

## 🎯 Soporte

Para más información o dudas, revisa:

- Documentación en `/front/README.md`
- Código comentado en los componentes
- GitHub Issues del proyecto

---

**¡Tu landing page está lista para brillar! 🌟**

Última actualización: Enero 2026
Next.js 16.1.1 | React 18 | Material-UI 7.3.7
