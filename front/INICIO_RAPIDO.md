# 🚀 INICIO RÁPIDO - MOK Landing Page

## Pasos Inmediatos (2 minutos)

### 1️⃣ Inicia el servidor

```bash
cd c:/Users/miran/Desktop/consultorio-estetica-landing/front
npm run dev
```

### 2️⃣ Abre en el navegador

http://localhost:3000

¡Ya puedes ver la landing page en vivo!

---

## Primeras Personalizaciones (10 minutos)

### 📞 Cambiar teléfono y email

Abre: `src/lib/data.ts`

Busca y edita:

```typescript
export const contactInfo = {
  phone: '+34 912 345 678', // ← CAMBIA ESTO
  whatsapp: '+34 612 345 678', // ← CAMBIA ESTO
  email: 'info@mok-consultorio.com', // ← CAMBIA ESTO
  address: 'Calle Principal, 123, Madrid, 28001', // ← CAMBIA ESTO
};
```

### 🎨 Cambiar color principal

Abre: `src/theme/theme.ts`

Busca en las líneas 5-8:

```typescript
const PRIMARY_COLOR = '#C48A9A'; // Rosa viejo - CAMBIA EL CÓDIGO HEX
const SECONDARY_COLOR = '#8A7C8A'; // Rosa secundario
const BACKGROUND_COLOR = '#F8F5F2'; // Crema
const TEXT_COLOR = '#1A1A1A'; // Negro
```

### ✏️ Cambiar servicios

En `src/lib/data.ts`, busca `export const services`:

```typescript
export const services: Service[] = [
  {
    id: 1,
    name: 'Tu Servicio', // ← NOMBRE
    description: 'Descripción...', // ← DESCRIPCIÓN
    icon: '💉', // ← EMOJI
  },
  // ... más servicios
];
```

### ⭐ Cambiar testimonios

En `src/lib/data.ts`, busca `export const testimonials`:

```typescript
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Cliente Real', // ← NOMBRE
    role: 'Profesión/Ocupación', // ← PROFESIÓN
    comment: 'Su comentario aquí...', // ← COMENTARIO
    rating: 5, // ← RATING (1-5)
  },
  // ... más testimonios
];
```

---

## Próximas Mejoras (30 minutos)

### 🖼️ Agregar Imágenes

1. Ve a `public/images/`
2. Sube tus fotos (jpg, png)
3. En componentes, usa:

```tsx
import Image from 'next/image';

<Image src="/images/mi-foto.jpg" alt="Descripción" width={400} height={300} />;
```

### 🗺️ Integrar Google Maps

En `src/components/sections/Location.tsx`, busca el comentario:

```tsx
{
  /* Código para integrar Google Maps real */
}
```

Descomenta y reemplaza `YOUR_EMBED_CODE` con el tuyo de:
https://www.google.com/maps

### 📧 Conectar Formulario a Email

En `src/components/sections/Contact.tsx`, busca `handleSubmit`:

Opción 1 - Usar Resend (gratis):

```bash
npm install resend
```

```tsx
const response = await fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify(formData),
});
```

Crea `src/app/api/contact/route.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const data = await request.json();

  const result = await resend.emails.send({
    from: 'noreply@tudominio.com',
    to: 'admin@tudominio.com',
    subject: 'Nuevo contacto de MOK',
    html: `<p>Nombre: ${data.name}</p><p>Email: ${data.email}</p><p>Mensaje: ${data.message}</p>`,
  });

  return Response.json(result);
}
```

En `.env.local`:

```env
RESEND_API_KEY=tu_clave_aqui
```

---

## Estructura de Carpetas Importante

```
front/
├── src/
│   ├── app/               # Rutas y layouts
│   ├── components/        # Componentes React
│   ├── theme/            # Estilos y colores
│   ├── lib/              # Datos y utilidades
│   └── public/           # Imágenes y assets
├── GUIA_COMPLETA.md      # Documentación extensa
├── RESUMEN_PROYECTO.md   # Resumen técnico
└── package.json          # Dependencias
```

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev                # Ver cambios en tiempo real

# Producción
npm run build              # Compilar
npm run start              # Iniciar servidor

# Lint
npm run lint              # Verificar código

# Buscar algo
grep -r "texto" src/     # Buscar en código
```

---

## Control de Cambios

### Cada vez que edites:

1. Guarda el archivo (Ctrl+S)
2. El navegador recarga automáticamente
3. Si hay errores, aparecen en la terminal

### Si algo se "rompe":

1. Abre la consola del navegador (F12)
2. Revisa los errores
3. Busca en `GUIA_COMPLETA.md`

---

## Links Importantes

- 📖 [Documentación Next.js](https://nextjs.org/docs)
- 🎨 [Material-UI Components](https://mui.com/material-ui/all-components/)
- 🎯 [Tailwind Utilities](https://tailwindcss.com/docs/utility-first)
- 📱 [Responsive Design](https://nextjs.org/docs/pages/building-your-application/styling/responsive-design)

---

## Checklist Final Antes de Lanzar

- [ ] Cambié teléfono y email
- [ ] Personalicé servicios
- [ ] Agregué testimonios reales
- [ ] Subí fotos de calidad
- [ ] Integré Google Maps
- [ ] Conecté formulario a email
- [ ] Probé en móvil
- [ ] Revisé todos los links
- [ ] Cambié colores según marca
- [ ] Añadí favicon (opcional)

---

## Emergencias

**¿El servidor no inicia?**

```bash
# Limpia todo e instala de nuevo
rm -rf node_modules .next
npm install
npm run dev
```

**¿Hay error de TypeScript?**

```bash
# Intenta compilar
npm run build
# Verifica la salida
```

**¿Cambios no se ven?**

```bash
# Hard refresh en navegador
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

---

## Siguientes Pasos

1. ✅ Edita contenido básico (3-5 min)
2. ✅ Agrega tus imágenes (10 min)
3. ✅ Integra Google Maps (5 min)
4. ✅ Conecta email (15 min)
5. ✅ Prueba en móvil (5 min)
6. ✅ Sube a GitHub (5 min)
7. ✅ Despliega en Vercel (2 min)

**Total: ~45 minutos para una landing page lista!**

---

## Preguntas Comunes

**¿Cómo cambio el nombre "MOK"?**

- Header.tsx (línea ~35)
- Footer.tsx (línea ~45)
- layout.tsx (línea ~24)

**¿Cómo agrego más servicios?**

- data.ts → `services` array → agrega nuevo objeto

**¿Cómo cambio el orden de secciones?**

- page.tsx → mueve componentes `<ServicesSection />` etc.

**¿Puedo usar mi propio CMS?**

- Sí! Reemplaza datos mock en `data.ts` con llamadas API

---

## 🎉 ¡Listo!

Tu landing page está funcionando. Ahora es cuestión de:

- Editar contenido
- Agrega imágenes
- Personaliza colores
- ¡Lanza! 🚀

**¡Éxito con MOK!**

---

_Última actualización: Enero 2026_
