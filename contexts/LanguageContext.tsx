'use client'

import { createContext, useContext, useState, useMemo, ReactNode } from 'react'

type Language = 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.rentals': 'Rentals',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.testimonials': 'Testimonials',
    'nav.terms': 'Terms',
    
    // Home Page
    'hero.title': 'Zip Through Tulum',
    'hero.subtitle': 'Rent Scooters & Cars Easily!',
    'hero.cta': 'Browse Rentals',
    'hero.discount.title': 'SPECIAL DISCOUNTS',
    'hero.discount.line1': '10% off 3+ days',
    'hero.discount.line2': '15% off weekly rentals',
    'vehicles.title': 'Our Vehicles',
    'vehicles.description': 'Choose from our selection of scooters and cars, perfect for exploring Tulum and the surrounding areas.',
    'vehicles.scooters': 'Scooters',
    'vehicles.cars': 'Cars',
    'vehicle.viewDetails': 'View Details',
    
    // Testimonials
    'testimonials.title': 'What Our Customers Say',
    'testimonials.viewAll': 'View All Reviews',
    'testimonials.clickToView': 'Click to view larger',
    
    // Vehicle Detail
    'vehicle.features': 'Features',
    'vehicle.fullyInsured': 'Fully insured',
    'vehicle.roadsideAssistance': '24/7 roadside assistance',
    'vehicle.deliveryAvailable': 'Delivery available',
    'vehicle.checkAvailability': 'Check Availability',
    'vehicle.calendar.available': 'Available',
    'vehicle.calendar.booked': 'Booked',
    'vehicle.calendar.selected': 'Selected',
    'vehicle.delivery.title': 'Delivery to Your Location',
    'vehicle.delivery.description': 'We can deliver your rental directly to you. Additional fee may apply based on distance.',
    'vehicle.booking.summary': 'Booking Summary',
    'vehicle.booking.rentalPeriod': 'Rental Period:',
    'vehicle.booking.days': 'Days:',
    'vehicle.booking.subtotal': 'Subtotal:',
    'vehicle.booking.discount': 'Discount',
    'vehicle.booking.deliveryFee': 'Delivery Fee:',
    'vehicle.booking.total': 'Total:',
    'vehicle.booking.bookNow': 'Book Now',
    'vehicle.booking.selectDates': 'Select your rental dates above to see pricing and book',
    
    // Booking Modal
    'booking.title': 'Complete Your Booking',
    'booking.details': 'Booking Details',
    'booking.name': 'Full Name',
    'booking.email': 'Email',
    'booking.phone': 'Phone',
    'booking.deliveryAddress': 'Delivery Address',
    'booking.paymentOptions': 'Payment Options',
    'booking.mercadoPago': 'Pay with Mercado Pago',
    'booking.whatsapp': 'Message on WhatsApp',
    'booking.selectDates': 'Please select your rental dates',
    'booking.fillFields': 'Please fill in all required fields',
    'booking.enterAddress': 'Please enter your delivery address',
    
    // About Page
    'about.title': 'About Tulum OnWheels',
    'about.story': 'Our Story',
    'about.delivery': 'Delivery Service',
    'about.hours': 'Operating Hours',
    'about.monSat': 'Monday - Saturday:',
    'about.sunday': 'Sunday:',
    'about.emergency': "We're available for emergency roadside assistance 24/7",
    'about.whyChoose': 'Why Choose Us?',
    'about.fleet': 'Well-Maintained Fleet',
    'about.fleetDesc': 'All our vehicles undergo regular maintenance and safety inspections to ensure reliability.',
    'about.prices': 'Competitive Prices',
    'about.pricesDesc': 'Transparent pricing with no hidden fees. Best value in Tulum.',
    'about.flexible': 'Flexible Delivery',
    'about.flexibleDesc': "We'll bring your rental directly to you, making your trip even more convenient.",
    'about.support': '24/7 Support',
    'about.supportDesc': 'Our team is always here to help, whether you need assistance or have questions.',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.sendMessage': 'Send Us a Message',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.getInTouch': 'Get in Touch',
    'contact.address': 'Address',
    'contact.hours': 'Hours',
    
    // Footer
    'footer.description': 'Your trusted partner for scooter and car rentals in Tulum.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.hours': 'Operating Hours: 8AM - 6PM',
    'footer.location': 'Tulum, Mexico',
    'footer.rights': 'All rights reserved.',
    
    // Terms
    'terms.title': 'Terms & Conditions',
    'terms.age': 'Age Requirements',
    'terms.ageDesc': 'All renters must be at least 21 years of age with a valid driver\'s license. A valid credit card is required for security deposit.',
    'terms.insurance': 'Insurance & Liability',
    'terms.insuranceDesc1': 'All vehicles are fully insured for third-party liability as required by Mexican law.',
    'terms.insuranceDesc2': 'The renter is responsible for any damage to the vehicle during the rental period. A security deposit will be held until the vehicle is returned in good condition.',
    'terms.insuranceDesc3': 'We recommend purchasing additional coverage for peace of mind during your rental period.',
    'terms.rental': 'Rental Period & Payment',
    'terms.rentalDesc1': 'Rental periods are calculated on a 24-hour basis. Late returns may incur additional charges.',
    'terms.rentalDesc2': 'Payment is due in full at the time of booking. We accept credit cards and cash payments.',
    'terms.rentalDesc3': 'Refunds for cancellations are subject to our cancellation policy. Cancellations made 48 hours in advance receive a full refund.',
    'terms.restrictions': 'Vehicle Use Restrictions',
    'terms.restrictions1': 'Vehicles must be driven only on paved roads unless otherwise specified',
    'terms.restrictions2': 'No smoking in any rental vehicle',
    'terms.restrictions3': 'Vehicles may not be used for commercial purposes or transporting goods for business',
    'terms.restrictions4': 'Maximum number of passengers as specified for each vehicle',
    'terms.restrictions5': 'Vehicles must not leave Mexico without prior written authorization',
    'terms.fuel': 'Fuel Policy',
    'terms.fuelDesc': 'Vehicles are provided with a full tank of fuel. Renters are expected to return the vehicle with the same fuel level or pay for refueling.',
    'terms.damage': 'Damage & Accidents',
    'terms.damageDesc1': 'In case of an accident or damage, renters must immediately contact our 24/7 emergency line and file a police report if required.',
    'terms.damageDesc2': 'Renters are responsible for all costs associated with damage, towing, and repairs not covered by insurance.',
    'terms.liability': 'Limitation of Liability',
    'terms.liabilityDesc': 'Tulum OnWheels is not liable for any personal injury, loss, or damage to personal property while using our rental vehicles. Renters are responsible for their own safety and the safety of their passengers.',
    'terms.changes': 'Changes to Terms',
    'terms.changesDesc': 'We reserve the right to modify these terms and conditions at any time. Current terms apply to all active rentals.',
    'terms.agree': 'By booking a rental with Tulum OnWheels, you agree to these terms and conditions. If you have any questions, please',
    'terms.contactLink': 'contact us',
    
    // Newsletter
    'newsletter.title': 'Get 10% Off Your First Rental!',
    'newsletter.description': 'Subscribe to our newsletter and receive exclusive offers and travel tips for Tulum.',
    'newsletter.claim': 'Claim Discount',
    'newsletter.noThanks': 'No thanks, maybe later',
    'newsletter.thanks': 'Thank You!',
    'newsletter.checkEmail': 'Check your email for your 10% discount code!',
    
    // Calendar
    'calendar.january': 'January',
    'calendar.february': 'February',
    'calendar.march': 'March',
    'calendar.april': 'April',
    'calendar.may': 'May',
    'calendar.june': 'June',
    'calendar.july': 'July',
    'calendar.august': 'August',
    'calendar.september': 'September',
    'calendar.october': 'October',
    'calendar.november': 'November',
    'calendar.december': 'December',
    'calendar.sun': 'Sun',
    'calendar.mon': 'Mon',
    'calendar.tue': 'Tue',
    'calendar.wed': 'Wed',
    'calendar.thu': 'Thu',
    'calendar.fri': 'Fri',
    'calendar.sat': 'Sat',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.rentals': 'Rentas',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.testimonials': 'Testimonios',
    'nav.terms': 'Términos',
    
    // Home Page
    'hero.title': 'Recorre Tulum',
    'hero.subtitle': '¡Renta Motos y Autos Fácilmente!',
    'hero.cta': 'Ver Rentas',
    'hero.discount.title': 'DESCUENTOS ESPECIALES',
    'hero.discount.line1': '10% desc. 3+ días',
    'hero.discount.line2': '15% desc. renta semanal',
    'vehicles.title': 'Nuestros Vehículos',
    'vehicles.description': 'Elige entre nuestra selección de motos y autos, perfectos para explorar Tulum y sus alrededores.',
    'vehicles.scooters': 'Motos',
    'vehicles.cars': 'Autos',
    'vehicle.viewDetails': 'Ver Detalles',
    
    // Testimonials
    'testimonials.title': 'Lo Que Dicen Nuestros Clientes',
    'testimonials.viewAll': 'Ver Todas las Reseñas',
    'testimonials.clickToView': 'Haz clic para ver más grande',
    
    // Vehicle Detail
    'vehicle.features': 'Características',
    'vehicle.fullyInsured': 'Totalmente asegurado',
    'vehicle.roadsideAssistance': 'Asistencia en carretera 24/7',
    'vehicle.deliveryAvailable': 'Entrega disponible',
    'vehicle.checkAvailability': 'Ver Disponibilidad',
    'vehicle.calendar.available': 'Disponible',
    'vehicle.calendar.booked': 'Reservado',
    'vehicle.calendar.selected': 'Seleccionado',
    'vehicle.delivery.title': 'Entrega a Tu Ubicación',
    'vehicle.delivery.description': 'Podemos entregar tu vehículo directamente a ti. Puede aplicarse un cargo adicional según la distancia.',
    'vehicle.booking.summary': 'Resumen de Reserva',
    'vehicle.booking.rentalPeriod': 'Período de Renta:',
    'vehicle.booking.days': 'Días:',
    'vehicle.booking.subtotal': 'Subtotal:',
    'vehicle.booking.discount': 'Descuento',
    'vehicle.booking.deliveryFee': 'Cargo por Entrega:',
    'vehicle.booking.total': 'Total:',
    'vehicle.booking.bookNow': 'Reservar Ahora',
    'vehicle.booking.selectDates': 'Selecciona tus fechas de renta arriba para ver precios y reservar',
    
    // Booking Modal
    'booking.title': 'Completa Tu Reserva',
    'booking.details': 'Detalles de Reserva',
    'booking.name': 'Nombre Completo',
    'booking.email': 'Correo Electrónico',
    'booking.phone': 'Teléfono',
    'booking.deliveryAddress': 'Dirección de Entrega',
    'booking.paymentOptions': 'Opciones de Pago',
    'booking.mercadoPago': 'Pagar con Mercado Pago',
    'booking.whatsapp': 'Enviar Mensaje por WhatsApp',
    'booking.selectDates': 'Por favor selecciona tus fechas de renta',
    'booking.fillFields': 'Por favor completa todos los campos requeridos',
    'booking.enterAddress': 'Por favor ingresa tu dirección de entrega',
    
    // About Page
        'about.title': 'Acerca de Tulum OnWheels',
    'about.story': 'Nuestra Historia',
    'about.delivery': 'Servicio de Entrega',
    'about.hours': 'Horarios de Operación',
    'about.monSat': 'Lunes - Sábado:',
    'about.sunday': 'Domingo:',
    'about.emergency': 'Estamos disponibles para asistencia de emergencia en carretera 24/7',
    'about.whyChoose': '¿Por Qué Elegirnos?',
    'about.fleet': 'Flotilla Bien Mantenida',
    'about.fleetDesc': 'Todos nuestros vehículos pasan por mantenimiento regular e inspecciones de seguridad para garantizar confiabilidad.',
    'about.prices': 'Precios Competitivos',
    'about.pricesDesc': 'Precios transparentes sin cargos ocultos. Mejor valor en Tulum.',
    'about.flexible': 'Entrega Flexible',
    'about.flexibleDesc': 'Llevaremos tu vehículo directamente a ti, haciendo tu viaje aún más conveniente.',
    'about.support': 'Soporte 24/7',
    'about.supportDesc': 'Nuestro equipo siempre está aquí para ayudar, ya sea que necesites asistencia o tengas preguntas.',
    
    // Contact Page
    'contact.title': 'Contáctanos',
    'contact.sendMessage': 'Envíanos un Mensaje',
    'contact.name': 'Nombre',
    'contact.email': 'Correo Electrónico',
    'contact.phone': 'Teléfono',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar Mensaje',
    'contact.getInTouch': 'Ponerse en Contacto',
    'contact.address': 'Dirección',
    'contact.hours': 'Horarios',
    
    // Footer
    'footer.description': 'Tu socio de confianza para renta de motos y autos en Tulum.',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.contact': 'Contacto',
    'footer.hours': 'Horarios: 8AM - 6PM',
    'footer.location': 'Tulum, México',
    'footer.rights': 'Todos los derechos reservados.',
    
    // Terms
    'terms.title': 'Términos y Condiciones',
    'terms.age': 'Requisitos de Edad',
    'terms.ageDesc': 'Todos los rentistas deben tener al menos 21 años de edad con licencia de conducir válida. Se requiere una tarjeta de crédito válida para el depósito de seguridad.',
    'terms.insurance': 'Seguro y Responsabilidad',
    'terms.insuranceDesc1': 'Todos los vehículos están totalmente asegurados para responsabilidad civil según lo requiere la ley mexicana.',
    'terms.insuranceDesc2': 'El rentista es responsable de cualquier daño al vehículo durante el período de renta. Se retendrá un depósito de seguridad hasta que el vehículo sea devuelto en buenas condiciones.',
    'terms.insuranceDesc3': 'Recomendamos comprar cobertura adicional para mayor tranquilidad durante tu período de renta.',
    'terms.rental': 'Período de Renta y Pago',
    'terms.rentalDesc1': 'Los períodos de renta se calculan en base de 24 horas. Las devoluciones tardías pueden incurrir en cargos adicionales.',
    'terms.rentalDesc2': 'El pago se debe en su totalidad al momento de la reserva. Aceptamos tarjetas de crédito y pagos en efectivo.',
    'terms.rentalDesc3': 'Los reembolsos por cancelaciones están sujetos a nuestra política de cancelación. Las cancelaciones realizadas con 48 horas de anticipación reciben un reembolso completo.',
    'terms.restrictions': 'Restricciones de Uso del Vehículo',
    'terms.restrictions1': 'Los vehículos deben conducirse solo en caminos pavimentados a menos que se especifique lo contrario',
    'terms.restrictions2': 'No fumar en ningún vehículo de renta',
    'terms.restrictions3': 'Los vehículos no pueden usarse para fines comerciales o transporte de mercancías para negocios',
    'terms.restrictions4': 'Número máximo de pasajeros según se especifica para cada vehículo',
    'terms.restrictions5': 'Los vehículos no deben salir de México sin autorización escrita previa',
    'terms.fuel': 'Política de Combustible',
    'terms.fuelDesc': 'Los vehículos se proporcionan con tanque lleno de combustible. Se espera que los rentistas devuelvan el vehículo con el mismo nivel de combustible o paguen el reabastecimiento.',
    'terms.damage': 'Daños y Accidentes',
    'terms.damageDesc1': 'En caso de accidente o daño, los rentistas deben contactar inmediatamente nuestra línea de emergencia 24/7 y presentar un reporte policial si es requerido.',
    'terms.damageDesc2': 'Los rentistas son responsables de todos los costos asociados con daños, remolque y reparaciones no cubiertas por el seguro.',
    'terms.liability': 'Limitación de Responsabilidad',
        'terms.liabilityDesc': 'Tulum OnWheels no es responsable de lesiones personales, pérdida o daño a propiedad personal mientras se usan nuestros vehículos de renta. Los rentistas son responsables de su propia seguridad y la seguridad de sus pasajeros.',
    'terms.changes': 'Cambios a los Términos',
    'terms.changesDesc': 'Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los términos actuales se aplican a todas las rentas activas.',
        'terms.agree': 'Al reservar una renta con Tulum OnWheels, aceptas estos términos y condiciones. Si tienes alguna pregunta, por favor',
    'terms.contactLink': 'contáctanos',
    
    // Newsletter
    'newsletter.title': '¡Obtén 10% de Descuento en tu Primera Renta!',
    'newsletter.description': 'Suscríbete a nuestro boletín y recibe ofertas exclusivas y consejos de viaje para Tulum.',
    'newsletter.claim': 'Reclamar Descuento',
    'newsletter.noThanks': 'No gracias, tal vez después',
    'newsletter.thanks': '¡Gracias!',
    'newsletter.checkEmail': '¡Revisa tu correo para tu código de descuento del 10%!',
    
    // Calendar
    'calendar.january': 'Enero',
    'calendar.february': 'Febrero',
    'calendar.march': 'Marzo',
    'calendar.april': 'Abril',
    'calendar.may': 'Mayo',
    'calendar.june': 'Junio',
    'calendar.july': 'Julio',
    'calendar.august': 'Agosto',
    'calendar.september': 'Septiembre',
    'calendar.october': 'Octubre',
    'calendar.november': 'Noviembre',
    'calendar.december': 'Diciembre',
    'calendar.sun': 'Dom',
    'calendar.mon': 'Lun',
    'calendar.tue': 'Mar',
    'calendar.wed': 'Mié',
    'calendar.thu': 'Jue',
    'calendar.fri': 'Vie',
    'calendar.sat': 'Sáb',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = useMemo(() => {
    return (key: string): string => {
      return translations[language][key as keyof typeof translations.en] || key
    }
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, t]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

