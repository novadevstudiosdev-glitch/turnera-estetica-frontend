export interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
  image?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  image?: string;
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  presentation: string;
  price: string;
  benefits: string[];
  icon: string;
  image: string;
}

export const services: Service[] = [
  {
    id: 1,
    name: 'Toxina Botulinica',
    description:
      'Tratamiento inyectable que relaja de forma controlada los musculos responsables de las arrugas de expresion (frente, entrecejo, patas de gallo). Resultado: rostro mas descansado y juvenil, sin perder naturalidad.',
    icon: 'ðŸ’‰',
    image: '/toxina%20butolinica.jpeg',
  },
  {
    id: 2,
    name: 'Bioestimuladores',
    description:
      'Sustancias que estimulan la produccion natural de colageno. Mejoran firmeza, elasticidad y calidad de piel de manera progresiva. Ideal para flacidez facial y corporal.',
    icon: 'âœ¨',
    image: '/bioestimuladores.jpeg',
  },
  {
    id: 3,
    name: 'Tratamientos faciales y corporales con Acido Hialuronico',
    description:
      'Rellenos que aportan volumen, definicion e hidratacion profunda. Se utilizan para labios, pomulos, menton, ojeras y tambien para mejorar contorno corporal.',
    icon: 'ðŸ’§',
    image: '/%C3%A1cido%20hialuronico.jpeg',
  },
  {
    id: 4,
    name: 'Plasma Rico en Plaquetas (Facial, Corporal y Capilar)',
    description:
      'Procedimiento regenerativo que utiliza factores de crecimiento obtenidos de la propia sangre del paciente. Mejora textura, luminosidad, cicatrices y estimula el crecimiento capilar.',
    icon: 'ðŸ©¸',
    image: '/Plasma%20rico%20en%20plaquetas.jpeg',
  },
  {
    id: 5,
    name: 'Mesoterapia Facial, Corporal y Capilar',
    description:
      'Microinyecciones con vitaminas, minerales y activos especificos segun el objetivo: rejuvenecimiento facial, reduccion de grasa localizada o fortalecimiento capilar.',
    icon: 'ðŸ’‰',
    image: '/mesoterapia.jpeg',
  },
  {
    id: 6,
    name: 'Skinbooster',
    description:
      'Microinyecciones de acido hialuronico de baja densidad para hidratar profundamente la piel desde adentro. Mejora brillo, suavidad y elasticidad sin aportar volumen.',
    icon: 'ðŸ’¦',
    image: '/skinbooster.jpeg',
  },
  {
    id: 7,
    name: 'Peelings Quimicos',
    description:
      'Aplicacion de sustancias quimicas que exfolian capas superficiales de la piel. Reduce manchas, acne, poros dilatados y lineas finas. Renueva la piel y mejora su textura.',
    icon: 'ðŸ§ª',
    image: '/peeling%20quimico.jpeg',
  },
  {
    id: 8,
    name: 'Dermaplaning',
    description:
      'Exfoliacion mecanica que elimina celulas muertas y vello fino del rostro. Deja la piel mas lisa, luminosa y mejora la penetracion de activos.',
    icon: 'âœ¨',
    image: '/dermaplaning.jpeg',
  },
  {
    id: 9,
    name: 'Mesoterapia Suiza',
    description:
      'Version premium de mesoterapia con principios activos de alta calidad y protocolos europeos. Enfoque en revitalizacion intensiva y resultados visibles en menor tiempo.',
    icon: 'ðŸ‡¨ðŸ‡­',
    image: '/mesoterapia.jpeg',
  },
  {
    id: 10,
    name: 'Microneedling',
    description:
      'Tratamiento con microagujas que estimula la produccion de colageno y elastina. Mejora cicatrices, manchas, arrugas y textura general de la piel.',
    icon: 'ðŸŽ¯',
    image: '/microneedling.jpeg',
  },
  {
    id: 11,
    name: 'Exosomas',
    description:
      'Terapia avanzada de regeneracion celular. Potencia la reparacion de tejidos, mejora firmeza, calidad de piel y acelera recuperacion post procedimientos.',
    icon: 'ðŸ§¬',
    image: '/exomas.jpeg',
  },
  {
    id: 12,
    name: 'Enzimas',
    description:
      'Aplicacion de enzimas especificas para disolver grasa localizada o mejorar fibrosis. Se usa en rostro y cuerpo para redefinir contornos sin cirugia.',
    icon: 'ðŸ’Š',
    image: '/enzimas.jpeg',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'MarÃ­a GarcÃ­a',
    role: 'Cliente desde 2023',
    comment:
      'Excelente atenciÃ³n y resultados increÃ­bles. El equipo de MOK es muy profesional y dedicado. Â¡Recomiendo ampliamente!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Carlos RodrÃ­guez',
    role: 'Cliente desde 2024',
    comment:
      'CambiÃ³ mi vida. Los tratamientos son de primera calidad y los resultados superaron mis expectativas. Â¡Muy satisfecho!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Laura FernÃ¡ndez',
    role: 'Cliente habitual',
    comment:
      'El mejor consultorio de la zona. Personal amable, instalaciones modernas y resultados impecables. Â¡10/10!',
    rating: 5,
  },
];

export const brands: Brand[] = [
  {
    id: 1,
    name: 'Allergan',
    logo: '/brands/allergan.svg',
  },
  {
    id: 2,
    name: 'Juvederm',
    logo: '/brands/juvederm.svg',
  },
  {
    id: 3,
    name: 'Restylane',
    logo: '/brands/restylane.svg',
  },
  {
    id: 4,
    name: 'Dermatologique',
    logo: '/brands/dermatologique.svg',
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Colageno Fine Smooth',
    category: 'Colagenos',
    description:
      'Colageno hidrolizado con centella asiatica, ginkgo biloba y vinagre de sidra. Ayuda a celulitis y drenaje.',
    presentation: 'Sobres',
    price: '$39.900',
    benefits: [
      'Mejora la circulacion',
      'Reduce adiposidad localizada',
      'Apoya el drenaje',
      '1 sobre diario',
    ],
    icon: 'ðŸ§´',
    image: '/Fine-Smooth.jpg.jpeg',
  },
  {
    id: 2,
    name: 'Colageno Fine Power',
    category: 'Colagenos',
    description:
      'Antioxidante con 5 frutas, colageno y resveratrol. Apoya articulaciones y energia.',
    presentation: 'Sobres',
    price: '$29.900',
    benefits: [
      'Antioxidante potente',
      'Salud articular',
      'Recuperacion post ejercicio',
      '1 sobre diario',
    ],
    icon: 'âœ¨',
    image: '/finepower.jpg.jpeg',
  },
  {
    id: 3,
    name: 'Protector Solar',
    category: 'Fotoproteccion',
    description:
      'Alta proteccion facial SPF 50+ UVA/UVB. Formula ligera, textura fluida y uso diario.',
    presentation: '50 ml',
    price: '$24.900',
    benefits: [
      'Textura fluida y liviana',
      'Hidratacion y accion antioxidante',
      'Aplicar 30 min antes del sol',
      'Reaplicar cada 2 horas o tras nadar/sudar',
      'Usar cantidad suficiente en rostro y cuello',
    ],
    icon: 'â˜€ï¸',
    image: '/lg.jpg.jpeg',
  },
];

export const contactInfo = {
  phone: '+54 341 751-1529',
  whatsapp: '+54 9 261 XXXXXXX',
  email: 'info@mok-consultorio.com',
  address: 'JunÃ­n 191 â€¢ Alto BurÃ³ â€¢ Rosario. Argentina',
  hours: {
    rosario: {
      label: 'Rosario',
      schedule: [
        { day: 'Lunes', time: '14:00 - 19:30' },
        { day: 'Jueves', time: '08:00 - 15:00' },
        { day: 'Viernes', time: '08:00 - 14:00' },
      ],
    },
    correa: {
      label: 'Correa',
      schedule: [{ day: 'Martes', time: '07:00 - 16:00' }],
    },
  },
};


