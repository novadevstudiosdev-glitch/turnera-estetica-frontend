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
// ....
export const services: Service[] = [
  {
    id: 1,
    name: 'Toxina Botulínica',
    description:
      'Tratamiento inyectable que relaja de forma controlada los músculos responsables de las arrugas de expresión (frente, entrecejo, patas de gallo). Resultado: rostro más descansado y juvenil, sin perder naturalidad.',
    icon: '💉',
    image: '/toxina%20butolinica.jpeg',
  },
  {
    id: 2,
    name: 'Bioestimuladores',
    description:
      'Sustancias que estimulan la producción natural de colágeno. Mejoran firmeza, elasticidad y calidad de piel de manera progresiva. Ideal para flacidez facial y corporal.',
    icon: '✨',
    image: '/bioestimuladores.jpeg',
  },
  {
    id: 3,
    name: 'Tratamientos faciales y corporales con Ácido Hialurónico',
    description:
      'Rellenos que aportan volumen, definición e hidratación profunda. Se utilizan para labios, pómulos, mentón, ojeras y también para mejorar contorno corporal.',
    icon: '💧',
    image: '/%C3%A1cido%20hialuronico.jpeg',
  },
  {
    id: 4,
    name: 'Plasma Rico en Plaquetas (Facial, Corporal y Capilar)',
    description:
      'Procedimiento regenerativo que utiliza factores de crecimiento obtenidos de la propia sangre del paciente. Mejora textura, luminosidad, cicatrices y estimula el crecimiento capilar.',
    icon: '🩸',
    image: '/Plasma%20rico%20en%20plaquetas.jpeg',
  },
  {
    id: 5,
    name: 'Mesoterapia Facial, Corporal y Capilar',
    description:
      'Microinyecciones con vitaminas, minerales y activos específicos según el objetivo: rejuvenecimiento facial, reducción de grasa localizada o fortalecimiento capilar.',
    icon: '💉',
    image: '/mesoterapia.jpeg',
  },
  {
    id: 6,
    name: 'Skinbooster',
    description:
      'Microinyecciones de ácido hialurónico de baja densidad para hidratar profundamente la piel desde adentro. Mejora brillo, suavidad y elasticidad sin aportar volumen.',
    icon: '💦',
    image: '/skinbooster.jpeg',
  },
  {
    id: 7,
    name: 'Peelings Químicos',
    description:
      'Aplicación de sustancias químicas que exfolian capas superficiales de la piel. Reduce manchas, acné, poros dilatados y líneas finas. Renueva la piel y mejora su textura.',
    icon: '🧪',
    image: '/peeling%20quimico.jpeg',
  },
  {
    id: 8,
    name: 'Dermaplaning',
    description:
      'Exfoliación mecánica que elimina células muertas y vello fino del rostro. Deja la piel más lisa, luminosa y mejora la penetración de activos.',
    icon: '✨',
    image: '/dermaplaning.jpeg',
  },
  {
    id: 9,
    name: 'Mesoterapia Suiza',
    description:
      'Versión premium de mesoterapia con principios activos de alta calidad y protocolos europeos. Enfoque en revitalización intensiva y resultados visibles en menor tiempo.',
    icon: '🇨🇭',
    image: '/mesoterapia.jpeg',
  },
  {
    id: 10,
    name: 'Microneedling',
    description:
      'Tratamiento con microagujas que estimula la producción de colágeno y elastina. Mejora cicatrices, manchas, arrugas y textura general de la piel.',
    icon: '🎯',
    image: '/microneedling.jpeg',
  },
  {
    id: 11,
    name: 'Exosomas',
    description:
      'Terapia avanzada de regeneración celular. Potencia la reparación de tejidos, mejora firmeza, calidad de piel y acelera recuperación post procedimientos.',
    icon: '🧬',
    image: '/exomas.jpeg',
  },
  {
    id: 12,
    name: 'Enzimas',
    description:
      'Aplicación de enzimas específicas para disolver grasa localizada o mejorar fibrosis. Se usa en rostro y cuerpo para redefinir contornos sin cirugía.',
    icon: '💊',
    image: '/enzimas.jpeg',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'María García',
    role: 'Cliente desde 2023',
    comment:
      'Excelente atención y resultados increíbles. El equipo de JG es muy profesional y dedicado. ¡Recomiendo ampliamente!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    role: 'Cliente desde 2024',
    comment:
      'Cambió mi vida. Los tratamientos son de primera calidad y los resultados superaron mis expectativas. ¡Muy satisfecho!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Laura Fernández',
    role: 'Cliente habitual',
    comment:
      'El mejor consultorio de la zona. Personal amable, instalaciones modernas y resultados impecables. ¡10/10!',
    rating: 5,
  },
];

export const brands: Brand[] = [
  {
    id: 1,
    name: 'Xeomin',
    logo: '/brands/allergan.svg',
  },
  {
    id: 2,
    name: 'Dysport',
    logo: '/brands/juvederm.svg',
  },
  {
    id: 3,
    name: 'Botox',
    logo: '/brands/restylane.svg',
  },
  {
    id: 4,
    name: 'Restylane',
    logo: '/brands/dermatologique.svg',
  },

  {
    id: 5,
    name: 'Belotero',
    logo: '/brands/dermatologique.svg',
  },

  {
    id: 6,
    name: 'Ellanse ',
    logo: '/brands/dermatologique.svg',
  },

  {
    id: 7,
    name: 'Radiesse  ',
    logo: '/brands/dermatologique.svg',
  },

  {
    id: 8,
    name: 'Cellbooster  ',
    logo: '/brands/dermatologique.svg',
  },

  {
    id: 9,
    name: 'Exosomas V-Tech ',
    logo: '/brands/dermatologique.svg',
  },

  {
    id: 10,
    name: 'Enzimas PBSerum',
    logo: '/brands/dermatologique.svg',
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Colageno Fine',
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
    icon: '🧴',
    image: '/Fine-Smooth.jpg.jpeg',
  },
  {
    id: 2,
    name: 'Colágeno Fine ',
    category: 'Colágenos',
    description:
      'Antioxidante con 5 frutas, colágeno y resveratrol. Apoya articulaciones y energía.',
    presentation: 'Sobres',
    price: '$29.900',
    benefits: [
      'Antioxidante potente',
      'Salud articular',
      'Recuperación post ejercicio',
      '1 sobre diario',
    ],
    icon: '✨',
    image: '/finepower.jpg.jpeg',
  },
  {
    id: 3,
    name: 'Protector Solar',
    category: 'Fotoprotección',
    description:
      'Alta protección facial SPF 50+ UVA/UVB. Fórmula ligera, textura fluida y uso diario.',
    presentation: '50 ml',
    price: '$24.900',
    benefits: [
      'Textura fluida y liviana',
      'Hidratación y acción antioxidante',
      'Aplicar 30 min antes del sol',
      'Reaplicar cada 2 horas o tras nadar/sudar',
      'Usar cantidad suficiente en rostro y cuello',
    ],
    icon: '☀️',
    image: '/lg.jpg.jpeg',
  },
];

export const contactInfo = {
  whatsapp: '+54 341 751-1529',
  address: 'Junín 191 - Alto Buró - Rosario. Argentina',
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
