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

export const services: Service[] = [
  {
    id: 1,
    name: 'Botox y Rellenos',
    description:
      'Tratamientos con materiales premium para eliminar arrugas y restaurar volumen facial con resultados naturales.',
    icon: '💉',
    image: '/imagenes/relleno.jpg',
  },
  {
    id: 2,
    name: 'Limpieza Facial',
    description:
      'Limpieza profunda y tratamiento dermatológico personalizado para revitalizar y purificar la piel.',
    icon: '✨',
    image: '/imagenes/limpieza facial.png',
  },
  {
    id: 3,
    name: 'Depilación Láser',
    description:
      'Depilación permanente con tecnología láser de última generación. Segura, rápida y efectiva.',
    icon: '🔆',
    image: '/imagenes/La-depilación-láser.png',
  },
  {
    id: 4,
    name: 'Microblading',
    description:
      'Tatuaje semi-permanente de cejas con técnica artesanal para realzar la belleza natural.',
    icon: '🎨',
    image: '/imagenes/Microblading.jpeg',
  },
  {
    id: 5,
    name: 'Hidratación Profunda',
    description:
      'Tratamientos con ácido hialurónico y serums especializados para devolver brillo y elasticidad.',
    icon: '💧',
    image: '/imagenes/hidratacion-profunda-de-la-piel.jpg',
  },
  {
    id: 6,
    name: 'Peeling Químico',
    description:
      'Exfoliación controlada para renovar la piel, reducir manchas y mejorar la textura facial.',
    icon: '🧪',
    image: '/imagenes/Peeling-quimico-en-madrid.webp',
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

export const contactInfo = {
  phone: '+54 261 XXXXXXX',
  whatsapp: '+54 9 261 XXXXXXX',
  email: 'info@mok-consultorio.com',
  address: 'Calle Almirante Brown 1871, Tunuyán, Mendoza, Argentina',
  hours: {
    weekday: '09:00 - 20:00',
    saturday: '10:00 - 14:00',
    sunday: 'Cerrado',
  },
};
