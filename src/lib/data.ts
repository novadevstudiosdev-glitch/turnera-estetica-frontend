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
    icon: '💉',
    image: '/portada.png',
  },
  {
    id: 2,
    name: 'Bioestimuladores',
    description:
      'Sustancias que estimulan la produccion natural de colageno. Mejoran firmeza, elasticidad y calidad de piel de manera progresiva. Ideal para flacidez facial y corporal.',
    icon: '✨',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 3,
    name: 'Tratamientos faciales y corporales con Acido Hialuronico',
    description:
      'Rellenos que aportan volumen, definicion e hidratacion profunda. Se utilizan para labios, pomulos, menton, ojeras y tambien para mejorar contorno corporal.',
    icon: '💧',
    image: '/imagenes/relleno.webp',
  },
  {
    id: 4,
    name: 'Plasma Rico en Plaquetas (Facial, Corporal y Capilar)',
    description:
      'Procedimiento regenerativo que utiliza factores de crecimiento obtenidos de la propia sangre del paciente. Mejora textura, luminosidad, cicatrices y estimula el crecimiento capilar.',
    icon: '🩸',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 5,
    name: 'Mesoterapia Facial, Corporal y Capilar',
    description:
      'Microinyecciones con vitaminas, minerales y activos especificos segun el objetivo: rejuvenecimiento facial, reduccion de grasa localizada o fortalecimiento capilar.',
    icon: '💉',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 6,
    name: 'Skinbooster',
    description:
      'Microinyecciones de acido hialuronico de baja densidad para hidratar profundamente la piel desde adentro. Mejora brillo, suavidad y elasticidad sin aportar volumen.',
    icon: '💦',
    image: '/imagenes/hidratacion-profunda-de-la-piel.jpg',
  },
  {
    id: 7,
    name: 'Peelings Quimicos',
    description:
      'Aplicacion de sustancias quimicas que exfolian capas superficiales de la piel. Reduce manchas, acne, poros dilatados y lineas finas. Renueva la piel y mejora su textura.',
    icon: '🧪',
    image: '/imagenes/Peeling-quimico-en-madrid.webp',
  },
  {
    id: 8,
    name: 'Dermaplaning',
    description:
      'Exfoliacion mecanica que elimina celulas muertas y vello fino del rostro. Deja la piel mas lisa, luminosa y mejora la penetracion de activos.',
    icon: '✨',
    image: '/imagenes/limpieza facial.png',
  },
  {
    id: 9,
    name: 'Mesoterapia Suiza',
    description:
      'Version premium de mesoterapia con principios activos de alta calidad y protocolos europeos. Enfoque en revitalizacion intensiva y resultados visibles en menor tiempo.',
    icon: '🇨🇭',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 10,
    name: 'Microneedling',
    description:
      'Tratamiento con microagujas que estimula la produccion de colageno y elastina. Mejora cicatrices, manchas, arrugas y textura general de la piel.',
    icon: '🎯',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 11,
    name: 'Exosomas',
    description:
      'Terapia avanzada de regeneracion celular. Potencia la reparacion de tejidos, mejora firmeza, calidad de piel y acelera recuperacion post procedimientos.',
    icon: '🧬',
    image: '/portada.png',
  },
  {
    id: 12,
    name: 'Enzimas',
    description:
      'Aplicacion de enzimas especificas para disolver grasa localizada o mejorar fibrosis. Se usa en rostro y cuerpo para redefinir contornos sin cirugia.',
    icon: '💊',
    image: '/imagenes/relleno.jpg',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'María García',
    role: 'Cliente desde 2023',
    comment:
      'Excelente atención y resultados increíbles. El equipo de MOK es muy profesional y dedicado. ¡Recomiendo ampliamente!',
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
    name: 'Serum Reafirmante',
    category: 'Anti-edad',
    description: 'Con peptidos y acido hialuronico para mejorar firmeza y elasticidad.',
    presentation: '30 ml',
    price: '$39.900',
    benefits: [
      'Reduce lineas de expresion',
      'Mejora la textura en 4 semanas',
      'Aporta hidratacion profunda',
    ],
    icon: '🧴',
    image: '/imagenes/hidratacion-profunda-de-la-piel.jpg',
  },
  {
    id: 2,
    name: 'Protector Solar Derma+',
    category: 'Fotoproteccion',
    description: 'Protector SPF 50+ de amplio espectro, acabado liviano no graso.',
    presentation: '50 ml',
    price: '$24.900',
    benefits: [
      'Protege contra UVA y UVB',
      'Ayuda a prevenir manchas',
      'Ideal para uso diario post-tratamiento',
    ],
    icon: '☀️',
    image: '/portada.png',
  },
  {
    id: 3,
    name: 'Crema Despigmentante Noche',
    category: 'Manchas',
    description: 'Formula renovadora con niacinamida y acidos suaves para tono uniforme.',
    presentation: '40 g',
    price: '$34.500',
    benefits: [
      'Unifica el tono de la piel',
      'Aporta luminosidad progresiva',
      'Compatible con rutinas sensibles',
    ],
    icon: '🌙',
    image: '/imagenes/Peeling-quimico-en-madrid.webp',
  },
  {
    id: 4,
    name: 'Gel Limpiador Dermobalance',
    category: 'Limpieza',
    description: 'Limpieza profunda sin resecar. Controla brillo y respeta barrera cutanea.',
    presentation: '200 ml',
    price: '$19.900',
    benefits: [
      'Remueve impurezas y maquillaje',
      'Ayuda a equilibrar piel mixta/grasa',
      'Uso diario manana y noche',
    ],
    icon: '🫧',
    image: '/imagenes/limpieza facial.png',
  },
  {
    id: 5,
    name: 'Ampollas Revitalizantes',
    category: 'Shock',
    description: 'Concentrado para eventos y recuperacion post-procedimientos esteticos.',
    presentation: 'Caja x7',
    price: '$29.900',
    benefits: [
      'Efecto glow inmediato',
      'Mejora aspecto de fatiga',
      'Refuerza hidratacion y suavidad',
    ],
    icon: '✨',
    image: '/mesoterapia-facial-piel-1620x1080.jpg',
  },
  {
    id: 6,
    name: 'Contorno de Ojos Pro',
    category: 'Ojos',
    description: 'Tratamiento con cafeina y activos drenantes para bolsas y ojeras.',
    presentation: '15 ml',
    price: '$27.900',
    benefits: [
      'Disminuye apariencia de bolsas',
      'Suaviza lineas finas',
      'Mejora luminosidad del contorno',
    ],
    icon: '👁️',
    image: '/imagenes/relleno.webp',
  },
];

export const contactInfo = {
  phone: '+54 341 751-1529',
  whatsapp: '+54 9 261 XXXXXXX',
  email: 'info@mok-consultorio.com',
  address: 'Junín 191 • Alto Buró • Rosario. Argentina',
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


