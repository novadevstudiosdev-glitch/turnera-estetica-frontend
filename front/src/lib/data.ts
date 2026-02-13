export interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
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
}

export const services: Service[] = [
  {
    id: 1,
    name: 'Botox y Rellenos',
    description:
      'Tratamientos con materiales premium para eliminar arrugas y restaurar volumen facial con resultados naturales.',
    icon: '💉',
  },
  {
    id: 2,
    name: 'Limpieza Facial',
    description:
      'Limpieza profunda y tratamiento dermatológico personalizado para revitalizar y purificar la piel.',
    icon: '✨',
  },
  {
    id: 3,
    name: 'Depilación Láser',
    description:
      'Depilación permanente con tecnología láser de última generación. Segura, rápida y efectiva.',
    icon: '🔆',
  },
  {
    id: 4,
    name: 'Microblading',
    description:
      'Tatuaje semi-permanente de cejas con técnica artesanal para realzar la belleza natural.',
    icon: '🎨',
  },
  {
    id: 5,
    name: 'Hidratación Profunda',
    description:
      'Tratamientos con ácido hialurónico y serums especializados para devolver brillo y elasticidad.',
    icon: '💧',
  },
  {
    id: 6,
    name: 'Peeling Químico',
    description:
      'Exfoliación controlada para renovar la piel, reducir manchas y mejorar la textura facial.',
    icon: '🧪',
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
  },
];

export const contactInfo = {
  phone: '+34 912 345 678',
  whatsapp: '+34 612 345 678',
  email: 'info@mok-consultorio.com',
  address: 'Calle Principal, 123, Madrid, 28001',
  hours: {
    weekday: '09:00 - 20:00',
    saturday: '10:00 - 14:00',
    sunday: 'Cerrado',
  },
};
