'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import WhatsAppBubble from '@/components/Layout/WhatsAppBubble'

interface SurveyData {
  // Sección 1: Inventario de Vehículos
  scooters: {
    total: string
    types: string
  }
  atvs: {
    total: string
    types: string
  }
  cars: {
    total: string
    types: string
  }
  vehicleCondition: string
  addOns: {
    helmets: { enabled: boolean; price: string }
    gasIncluded: { enabled: boolean; price: string }
    locks: { enabled: boolean; price: string }
    gps: { enabled: boolean; details: string }
  }
  insurance: {
    damage: { enabled: boolean; price: string; coverage: string }
    theft: { enabled: boolean; price: string; coverage: string }
    accidents: { enabled: boolean; price: string; coverage: string }
    mandatory: boolean
    explanation: string
  }
  // Sección 2: Gestión de Reservas y Operaciones
  bookingMethods: string[]
  bookingMethodsOther: string
  availabilitySystem: string
  availabilityTracking: string
  delivery: {
    offered: boolean
    areas: string
    extraCharge: boolean
    extraChargeAmount: string
  }
  operatingHours: string
  staff: string
  customerRequirements: string
  // Sección 3: Sistemas de Pago
  paymentMethods: string[]
  paymentTerminal: string
  paymentMethodsOther: string
  onlinePayment: string
  digitalPaymentSystem: string
  deposits: string
  // Sección 4: Precios y Estructura de Ingresos
  pricing: {
    scooters: { hourly: string; daily: string; weekly: string }
    atvs: { hourly: string; daily: string; weekly: string }
    cars: { hourly: string; daily: string; weekly: string }
    discounts: string
  }
  seasonalPricing: string
  // Sección 5: Marketing y Clientes
  marketingChannels: string[]
  socialMedia: string
  marketingOther: string
  monthlyClients: string
  internationalClients: string
  customerDataCollection: string
  // Sección 6: Desafíos y Mejoras
  challenges: string
  improvements: string
  hasPhotos: boolean
  additionalComments: string
}

const initialFormData: SurveyData = {
  scooters: { total: '', types: '' },
  atvs: { total: '', types: '' },
  cars: { total: '', types: '' },
  vehicleCondition: '',
  addOns: {
    helmets: { enabled: false, price: '' },
    gasIncluded: { enabled: false, price: '' },
    locks: { enabled: false, price: '' },
    gps: { enabled: false, details: '' },
  },
  insurance: {
    damage: { enabled: false, price: '', coverage: '' },
    theft: { enabled: false, price: '', coverage: '' },
    accidents: { enabled: false, price: '', coverage: '' },
    mandatory: false,
    explanation: '',
  },
  bookingMethods: [],
  bookingMethodsOther: '',
  availabilitySystem: '',
  availabilityTracking: '',
  delivery: {
    offered: false,
    areas: '',
    extraCharge: false,
    extraChargeAmount: '',
  },
  operatingHours: '',
  staff: '',
  customerRequirements: '',
  paymentMethods: [],
  paymentTerminal: '',
  paymentMethodsOther: '',
  onlinePayment: '',
  digitalPaymentSystem: '',
  deposits: '',
  pricing: {
    scooters: { hourly: '', daily: '', weekly: '' },
    atvs: { hourly: '', daily: '', weekly: '' },
    cars: { hourly: '', daily: '', weekly: '' },
    discounts: '',
  },
  seasonalPricing: '',
  marketingChannels: [],
  socialMedia: '',
  marketingOther: '',
  monthlyClients: '',
  internationalClients: '',
  customerDataCollection: '',
  challenges: '',
  improvements: '',
  hasPhotos: false,
  additionalComments: '',
}

export default function SurveyPage() {
  const [currentSection, setCurrentSection] = useState(1)
  const [formData, setFormData] = useState<SurveyData>(initialFormData)
  const [showSummary, setShowSummary] = useState(false)

  const totalSections = 6

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('survey-data')
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading saved data:', e)
      }
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('survey-data', JSON.stringify(formData))
  }, [formData])

  const updateFormData = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split('.')
      const newData = { ...prev }
      let current: any = newData

      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleCheckboxChange = (path: string, checked: boolean) => {
    updateFormData(path, checked)
  }

  const handleArrayToggle = (path: string, value: string) => {
    setFormData((prev) => {
      const keys = path.split('.')
      const currentArray = keys.reduce((obj: any, key) => obj[key], prev) as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      
      const newData = { ...prev }
      let current: any = newData
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = newArray
      return newData
    })
  }

  const nextSection = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setShowSummary(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const previousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const copyToClipboard = () => {
    const summary = formatSummary()
    navigator.clipboard.writeText(summary)
    alert('¡Respuestas copiadas al portapapeles!')
  }

  const formatSummary = () => {
    let summary = 'ENCUESTA DE RENTA DE VEHÍCULOS\n'
    summary += '=====================================\n\n'

    // Sección 1
    summary += 'SECCIÓN 1: INVENTARIO DE VEHÍCULOS\n'
    summary += `Scooters total: ${formData.scooters.total}\n`
    summary += `Tipos de scooters: ${formData.scooters.types}\n`
    summary += `ATVs total: ${formData.atvs.total}\n`
    summary += `Tipos de ATVs: ${formData.atvs.types}\n`
    summary += `Autos total: ${formData.cars.total}\n`
    summary += `Tipos de autos: ${formData.cars.types}\n`
    summary += `Condición de vehículos: ${formData.vehicleCondition}\n\n`

    summary += 'Add-ons:\n'
    if (formData.addOns.helmets.enabled) {
      summary += `- Cascos: Sí, Precio: ${formData.addOns.helmets.price} MXN\n`
    }
    if (formData.addOns.gasIncluded.enabled) {
      summary += `- Gasolina incluida: Sí, Precio: ${formData.addOns.gasIncluded.price} MXN\n`
    }
    if (formData.addOns.locks.enabled) {
      summary += `- Candados: Sí, Precio: ${formData.addOns.locks.price} MXN\n`
    }
    if (formData.addOns.gps.enabled) {
      summary += `- GPS: Sí, Detalles: ${formData.addOns.gps.details}\n`
    }
    summary += '\n'

    summary += 'Seguros:\n'
    if (formData.insurance.damage.enabled) {
      summary += `- Seguro contra daños: Sí, Precio: ${formData.insurance.damage.price} MXN, Cobertura: ${formData.insurance.damage.coverage}\n`
    }
    if (formData.insurance.theft.enabled) {
      summary += `- Seguro contra robo: Sí, Precio: ${formData.insurance.theft.price} MXN, Cobertura: ${formData.insurance.theft.coverage}\n`
    }
    if (formData.insurance.accidents.enabled) {
      summary += `- Seguro para accidentes: Sí, Precio: ${formData.insurance.accidents.price} MXN, Cobertura: ${formData.insurance.accidents.coverage}\n`
    }
    summary += `Seguros obligatorios: ${formData.insurance.mandatory ? 'Sí' : 'No'}\n`
    summary += `Explicación: ${formData.insurance.explanation}\n\n`

    // Sección 2
    summary += 'SECCIÓN 2: GESTIÓN DE RESERVAS Y OPERACIONES\n'
    summary += `Métodos de reserva: ${formData.bookingMethods.join(', ')}\n`
    if (formData.bookingMethodsOther) {
      summary += `Otro método: ${formData.bookingMethodsOther}\n`
    }
    summary += `Sistema de disponibilidad: ${formData.availabilitySystem}\n`
    summary += `Rastreo de disponibilidad: ${formData.availabilityTracking}\n`
    summary += `Entrega de vehículos: ${formData.delivery.offered ? 'Sí' : 'No'}\n`
    if (formData.delivery.offered) {
      summary += `Áreas cubiertas: ${formData.delivery.areas}\n`
      summary += `Cargo extra por entrega: ${formData.delivery.extraCharge ? 'Sí' : 'No'}\n`
      if (formData.delivery.extraCharge) {
        summary += `Monto: ${formData.delivery.extraChargeAmount} MXN\n`
      }
    }
    summary += `Horarios de operación: ${formData.operatingHours}\n`
    summary += `Personal adicional: ${formData.staff}\n`
    summary += `Requisitos para clientes: ${formData.customerRequirements}\n\n`

    // Sección 3
    summary += 'SECCIÓN 3: SISTEMAS DE PAGO\n'
    summary += `Métodos de pago: ${formData.paymentMethods.join(', ')}\n`
    if (formData.paymentTerminal) {
      summary += `Terminal de tarjeta: ${formData.paymentTerminal}\n`
    }
    if (formData.paymentMethodsOther) {
      summary += `Otro método: ${formData.paymentMethodsOther}\n`
    }
    summary += `Pago en línea: ${formData.onlinePayment}\n`
    summary += `Sistema digital de pagos: ${formData.digitalPaymentSystem}\n`
    summary += `Depósitos y reembolsos: ${formData.deposits}\n\n`

    // Sección 4
    summary += 'SECCIÓN 4: PRECIOS Y ESTRUCTURA DE INGRESOS\n'
    summary += 'Precios Scooters:\n'
    summary += `  Por hora: ${formData.pricing.scooters.hourly} MXN\n`
    summary += `  Por día: ${formData.pricing.scooters.daily} MXN\n`
    summary += `  Por semana: ${formData.pricing.scooters.weekly} MXN\n`
    summary += 'Precios ATVs:\n'
    summary += `  Por hora: ${formData.pricing.atvs.hourly} MXN\n`
    summary += `  Por día: ${formData.pricing.atvs.daily} MXN\n`
    summary += `  Por semana: ${formData.pricing.atvs.weekly} MXN\n`
    summary += 'Precios Autos:\n'
    summary += `  Por hora: ${formData.pricing.cars.hourly} MXN\n`
    summary += `  Por día: ${formData.pricing.cars.daily} MXN\n`
    summary += `  Por semana: ${formData.pricing.cars.weekly} MXN\n`
    summary += `Descuentos/paquetes: ${formData.pricing.discounts}\n`
    summary += `Variación por temporada: ${formData.seasonalPricing}\n\n`

    // Sección 5
    summary += 'SECCIÓN 5: MARKETING Y CLIENTES\n'
    summary += `Canales de marketing: ${formData.marketingChannels.join(', ')}\n`
    if (formData.socialMedia) {
      summary += `Redes sociales: ${formData.socialMedia}\n`
    }
    if (formData.marketingOther) {
      summary += `Otro canal: ${formData.marketingOther}\n`
    }
    summary += `Clientes por mes: ${formData.monthlyClients}\n`
    summary += `Porcentaje de turistas internacionales: ${formData.internationalClients}\n`
    summary += `Recopilación de datos: ${formData.customerDataCollection}\n\n`

    // Sección 6
    summary += 'SECCIÓN 6: DESAFÍOS Y MEJORAS\n'
    summary += `Desafíos: ${formData.challenges}\n`
    summary += `Mejoras deseadas: ${formData.improvements}\n`
    summary += `Tiene fotos: ${formData.hasPhotos ? 'Sí' : 'No'}\n`
    summary += `Comentarios adicionales: ${formData.additionalComments}\n`

    return summary
  }

  if (showSummary) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              Resumen de Respuestas
            </h1>
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {formatSummary()}
              </pre>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={copyToClipboard}
                className="bg-turquoise hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Copiar Respuestas
              </button>
              <button
                onClick={() => {
                  setShowSummary(false)
                  setCurrentSection(1)
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Editar Encuesta
              </button>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppBubble />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Encuesta de Renta de Vehículos
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Por favor completa todas las secciones. Tus respuestas se guardan automáticamente.
          </p>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Sección {currentSection} de {totalSections}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round((currentSection / totalSections) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-turquoise h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentSection / totalSections) * 100}%` }}
              />
            </div>
          </div>

          {/* Section 1: Inventario de Vehículos */}
          {currentSection === 1 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Sección 1: Inventario de Vehículos
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuántos scooters tienes actualmente disponibles para renta?
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Número total:</label>
                      <input
                        type="number"
                        value={formData.scooters.total}
                        onChange={(e) => updateFormData('scooters.total', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Tipos/modelos (por ejemplo, Honda Wave 125, Italika Vitalia 150, etc., y cuántos de cada uno):
                      </label>
                      <textarea
                        value={formData.scooters.types}
                        onChange={(e) => updateFormData('scooters.types', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        placeholder="Ejemplo: 3 Honda Wave 125, 2 Italika Vitalia 150..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuántos ATVs tienes actualmente disponibles para renta?
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Número total:</label>
                      <input
                        type="number"
                        value={formData.atvs.total}
                        onChange={(e) => updateFormData('atvs.total', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Tipos/modelos (por ejemplo, quad básico, etc., y cuántos de cada uno):
                      </label>
                      <textarea
                        value={formData.atvs.types}
                        onChange={(e) => updateFormData('atvs.types', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        placeholder="Ejemplo: 2 quad básico, 1 quad deportivo..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuántos autos o vehículos tienes actualmente disponibles para renta?
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Número total:</label>
                      <input
                        type="number"
                        value={formData.cars.total}
                        onChange={(e) => updateFormData('cars.total', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Tipos/modelos (por ejemplo, sedan básico, SUV, etc., y cuántos de cada uno):
                      </label>
                      <textarea
                        value={formData.cars.types}
                        onChange={(e) => updateFormData('cars.types', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        placeholder="Ejemplo: 1 sedan básico, 2 SUV..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿En qué condición están los vehículos? (Por ejemplo, nuevos, usados, necesitan mantenimiento frecuente)
                  </label>
                  <textarea
                    value={formData.vehicleCondition}
                    onChange={(e) => updateFormData('vehicleCondition', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Describe la condición de tus vehículos..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    ¿Ofreces add-ons o accesorios? (Por ejemplo, cascos, gasolina incluida, candados)
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.addOns.helmets.enabled}
                        onChange={(e) => {
                          updateFormData('addOns.helmets.enabled', e.target.checked)
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-700 mb-1">Cascos:</label>
                        {formData.addOns.helmets.enabled && (
                          <input
                            type="text"
                            value={formData.addOns.helmets.price}
                            onChange={(e) => updateFormData('addOns.helmets.price', e.target.value)}
                            placeholder="Precio en MXN"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.addOns.gasIncluded.enabled}
                        onChange={(e) => {
                          updateFormData('addOns.gasIncluded.enabled', e.target.checked)
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-700 mb-1">Gasolina incluida:</label>
                        {formData.addOns.gasIncluded.enabled && (
                          <input
                            type="text"
                            value={formData.addOns.gasIncluded.price}
                            onChange={(e) => updateFormData('addOns.gasIncluded.price', e.target.value)}
                            placeholder="Precio en MXN"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.addOns.locks.enabled}
                        onChange={(e) => {
                          updateFormData('addOns.locks.enabled', e.target.checked)
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-700 mb-1">Candados:</label>
                        {formData.addOns.locks.enabled && (
                          <input
                            type="text"
                            value={formData.addOns.locks.price}
                            onChange={(e) => updateFormData('addOns.locks.price', e.target.value)}
                            placeholder="Precio en MXN"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.addOns.gps.enabled}
                        onChange={(e) => {
                          updateFormData('addOns.gps.enabled', e.target.checked)
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-700 mb-1">GPS u otros:</label>
                        {formData.addOns.gps.enabled && (
                          <textarea
                            value={formData.addOns.gps.details}
                            onChange={(e) => updateFormData('addOns.gps.details', e.target.value)}
                            placeholder="Detalles y precio"
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    ¿Ofreces seguros o protecciones adicionales?
                  </label>
                  <div className="space-y-4">
                    <div className="border p-4 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={formData.insurance.damage.enabled}
                          onChange={(e) => {
                            updateFormData('insurance.damage.enabled', e.target.checked)
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Seguro contra daños
                          </label>
                          {formData.insurance.damage.enabled && (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={formData.insurance.damage.price}
                                onChange={(e) => updateFormData('insurance.damage.price', e.target.value)}
                                placeholder="Precio en MXN"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                              />
                              <textarea
                                value={formData.insurance.damage.coverage}
                                onChange={(e) => updateFormData('insurance.damage.coverage', e.target.value)}
                                placeholder="¿Qué cubre?"
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border p-4 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={formData.insurance.theft.enabled}
                          onChange={(e) => {
                            updateFormData('insurance.theft.enabled', e.target.checked)
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Seguro contra robo
                          </label>
                          {formData.insurance.theft.enabled && (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={formData.insurance.theft.price}
                                onChange={(e) => updateFormData('insurance.theft.price', e.target.value)}
                                placeholder="Precio en MXN"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                              />
                              <textarea
                                value={formData.insurance.theft.coverage}
                                onChange={(e) => updateFormData('insurance.theft.coverage', e.target.value)}
                                placeholder="¿Qué cubre?"
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border p-4 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={formData.insurance.accidents.enabled}
                          onChange={(e) => {
                            updateFormData('insurance.accidents.enabled', e.target.checked)
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Seguro para accidentes
                          </label>
                          {formData.insurance.accidents.enabled && (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={formData.insurance.accidents.price}
                                onChange={(e) => updateFormData('insurance.accidents.price', e.target.value)}
                                placeholder="Precio en MXN"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                              />
                              <textarea
                                value={formData.insurance.accidents.coverage}
                                onChange={(e) => updateFormData('insurance.accidents.coverage', e.target.value)}
                                placeholder="¿Qué cubre?"
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Son obligatorios los seguros?
                      </label>
                      <div className="flex gap-6 mb-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="insuranceMandatory"
                            checked={formData.insurance.mandatory === true}
                            onChange={() => updateFormData('insurance.mandatory', true)}
                            className="w-4 h-4"
                          />
                          <span>Sí</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="insuranceMandatory"
                            checked={formData.insurance.mandatory === false}
                            onChange={() => updateFormData('insurance.mandatory', false)}
                            className="w-4 h-4"
                          />
                          <span>No</span>
                        </label>
                      </div>
                      <textarea
                        value={formData.insurance.explanation}
                        onChange={(e) => updateFormData('insurance.explanation', e.target.value)}
                        placeholder="Explicación"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Gestión de Reservas y Operaciones */}
          {currentSection === 2 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Sección 2: Gestión de Reservas y Operaciones
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Cómo manejas las reservas actualmente? (Marca todas las que apliquen)
                  </label>
                  <div className="space-y-2">
                    {['Por teléfono', 'Por WhatsApp', 'En persona (en la ubicación)', 'Google Maps o otro sitio web'].map((method) => (
                      <label key={method} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.bookingMethods.includes(method)}
                          onChange={() => handleArrayToggle('bookingMethods', method)}
                          className="w-4 h-4"
                        />
                        <span>{method}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.bookingMethods.includes('Otro')}
                        onChange={() => handleArrayToggle('bookingMethods', 'Otro')}
                        className="w-4 h-4"
                      />
                      <span>Otro:</span>
                      {formData.bookingMethods.includes('Otro') && (
                        <input
                          type="text"
                          value={formData.bookingMethodsOther}
                          onChange={(e) => updateFormData('bookingMethodsOther', e.target.value)}
                          placeholder="Especifica"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Usas algún sistema o app para rastrear disponibilidad? (Por ejemplo, calendario manual, Excel, software)
                  </label>
                  <input
                    type="text"
                    value={formData.availabilitySystem}
                    onChange={(e) => updateFormData('availabilitySystem', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Ejemplo: Google Calendar, Excel..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cómo rastreas la disponibilidad de vehículos? ¿Cuántas reservas manejas por día/semana?
                  </label>
                  <textarea
                    value={formData.availabilityTracking}
                    onChange={(e) => updateFormData('availabilityTracking', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Describe tu método de rastreo y volumen de reservas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Ofreces entrega de vehículos?
                  </label>
                  <div className="flex gap-6 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={formData.delivery.offered === true}
                        onChange={() => updateFormData('delivery.offered', true)}
                        className="w-4 h-4"
                      />
                      <span>Sí</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={formData.delivery.offered === false}
                        onChange={() => updateFormData('delivery.offered', false)}
                        className="w-4 h-4"
                      />
                      <span>No</span>
                    </label>
                  </div>
                  {formData.delivery.offered && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          ¿Qué áreas cubres? (Por ejemplo, dentro de Tulum, hoteles específicos)
                        </label>
                        <textarea
                          value={formData.delivery.areas}
                          onChange={(e) => updateFormData('delivery.areas', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                          placeholder="Especifica las áreas..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          ¿Cobras extra por entrega?
                        </label>
                        <div className="flex gap-6 mb-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="deliveryExtraCharge"
                              checked={formData.delivery.extraCharge === true}
                              onChange={() => updateFormData('delivery.extraCharge', true)}
                              className="w-4 h-4"
                            />
                            <span>Sí</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="deliveryExtraCharge"
                              checked={formData.delivery.extraCharge === false}
                              onChange={() => updateFormData('delivery.extraCharge', false)}
                              className="w-4 h-4"
                            />
                            <span>No</span>
                          </label>
                        </div>
                        {formData.delivery.extraCharge && (
                          <input
                            type="text"
                            value={formData.delivery.extraChargeAmount}
                            onChange={(e) => updateFormData('delivery.extraChargeAmount', e.target.value)}
                            placeholder="¿Cuánto? (MXN)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuáles son tus horarios de operación? (Por ejemplo, de 8 AM a 6 PM, todos los días). ¿Tienes días de descanso?
                  </label>
                  <textarea
                    value={formData.operatingHours}
                    onChange={(e) => updateFormData('operatingHours', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Describe tus horarios..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Tienes personal adicional? (Por ejemplo, empleados para entregas o mantenimiento). ¿Cuántos?
                  </label>
                  <input
                    type="text"
                    value={formData.staff}
                    onChange={(e) => updateFormData('staff', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Ejemplo: 2 empleados para entregas, 1 para mantenimiento..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuáles son los requisitos para los clientes? (Por ejemplo, edad mínima, licencia de conducir, depósito de seguridad)
                  </label>
                  <textarea
                    value={formData.customerRequirements}
                    onChange={(e) => updateFormData('customerRequirements', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Lista los requisitos..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Sistemas de Pago */}
          {currentSection === 3 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Sección 3: Sistemas de Pago
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Qué métodos de pago aceptas actualmente? (Marca todos los que apliquen)
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes('Efectivo')}
                        onChange={() => handleArrayToggle('paymentMethods', 'Efectivo')}
                        className="w-4 h-4"
                      />
                      <span>Efectivo</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes('Tarjeta')}
                        onChange={() => handleArrayToggle('paymentMethods', 'Tarjeta')}
                        className="w-4 h-4"
                      />
                      <span>Tarjeta</span>
                      {formData.paymentMethods.includes('Tarjeta') && (
                        <input
                          type="text"
                          value={formData.paymentTerminal}
                          onChange={(e) => updateFormData('paymentTerminal', e.target.value)}
                          placeholder="¿Qué terminal usas? (Mercado Pago, etc.)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        />
                      )}
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes('Transferencia bancaria')}
                        onChange={() => handleArrayToggle('paymentMethods', 'Transferencia bancaria')}
                        className="w-4 h-4"
                      />
                      <span>Transferencia bancaria</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes('Otro')}
                        onChange={() => handleArrayToggle('paymentMethods', 'Otro')}
                        className="w-4 h-4"
                      />
                      <span>Otro:</span>
                      {formData.paymentMethods.includes('Otro') && (
                        <input
                          type="text"
                          value={formData.paymentMethodsOther}
                          onChange={(e) => updateFormData('paymentMethodsOther', e.target.value)}
                          placeholder="Especifica"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cobras en línea o solo en persona?
                  </label>
                  <input
                    type="text"
                    value={formData.onlinePayment}
                    onChange={(e) => updateFormData('onlinePayment', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Ejemplo: Solo en persona, También en línea..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Usas algún sistema digital para pagos? (Por ejemplo, Mercado Pago, Stripe, app de banco). Si sí, ¿qué clave API o cuenta tienes? (No compartas contraseñas, solo detalles generales)
                  </label>
                  <textarea
                    value={formData.digitalPaymentSystem}
                    onChange={(e) => updateFormData('digitalPaymentSystem', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Describe tu sistema de pagos digitales..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cobras depósitos o pagos anticipados? ¿Cómo manejas reembolsos o cancelaciones?
                  </label>
                  <textarea
                    value={formData.deposits}
                    onChange={(e) => updateFormData('deposits', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Describe tu política de depósitos y cancelaciones..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Precios y Estructura de Ingresos */}
          {currentSection === 4 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Sección 4: Precios y Estructura de Ingresos
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    ¿Cuáles son tus precios estándar?
                  </label>
                  
                  <div className="space-y-6">
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Scooters:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Por hora (MXN):</label>
                          <input
                            type="text"
                            value={formData.pricing.scooters.hourly}
                            onChange={(e) => updateFormData('pricing.scooters.hourly', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Por día (MXN):</label>
                          <input
                            type="text"
                            value={formData.pricing.scooters.daily}
                            onChange={(e) => updateFormData('pricing.scooters.daily', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Por semana (MXN):</label>
                          <input
                            type="text"
                            value={formData.pricing.scooters.weekly}
                            onChange={(e) => updateFormData('pricing.scooters.weekly', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">ATVs:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Por hora (MXN):</label>
                          <input
                            type="text"
                            value={formData.pricing.atvs.hourly}
                            onChange={(e) => updateFormData('pricing.atvs.hourly', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Por día (MXN):</label>
                          <input
                            type="text"
                            value={formData.pricing.atvs.daily}
                            onChange={(e) => updateFormData('pricing.atvs.daily', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Por semana (MXN):</label>
                          <input
                            type="text"
                            value={formData.pricing.atvs.weekly}
                            onChange={(e) => updateFormData('pricing.atvs.weekly', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Autos:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Por hora (MXN):</label>
                          <input
                            type="text"
                            value={formData.pricing.cars.hourly}
                            onChange={(e) => updateFormData('pricing.cars.hourly', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Por día (MXN):</label>
                          <input
                            type="text"
                            value={formData.pricing.cars.daily}
                            onChange={(e) => updateFormData('pricing.cars.daily', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Por semana (MXN):</label>
                          <input
                            type="text"
                            value={formData.pricing.cars.weekly}
                            onChange={(e) => updateFormData('pricing.cars.weekly', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Tienes descuentos o paquetes? (Por ejemplo, para grupos o largos periodos)
                    </label>
                    <textarea
                      value={formData.pricing.discounts}
                      onChange={(e) => updateFormData('pricing.discounts', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                      placeholder="Describe tus descuentos y paquetes..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cómo varían los precios por temporada? (Por ejemplo, más alto en vacaciones)
                  </label>
                  <textarea
                    value={formData.seasonalPricing}
                    onChange={(e) => updateFormData('seasonalPricing', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Describe la variación de precios por temporada..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Marketing y Clientes */}
          {currentSection === 5 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Sección 5: Marketing y Clientes
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Cómo atraes clientes actualmente? (Marca todos los que apliquen)
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.marketingChannels.includes('Boca en boca')}
                        onChange={() => handleArrayToggle('marketingChannels', 'Boca en boca')}
                        className="w-4 h-4"
                      />
                      <span>Boca en boca</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.marketingChannels.includes('Google Maps o reseñas')}
                        onChange={() => handleArrayToggle('marketingChannels', 'Google Maps o reseñas')}
                        className="w-4 h-4"
                      />
                      <span>Google Maps o reseñas</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.marketingChannels.includes('Redes sociales')}
                        onChange={() => handleArrayToggle('marketingChannels', 'Redes sociales')}
                        className="w-4 h-4"
                      />
                      <span>Redes sociales:</span>
                      {formData.marketingChannels.includes('Redes sociales') && (
                        <input
                          type="text"
                          value={formData.socialMedia}
                          onChange={(e) => updateFormData('socialMedia', e.target.value)}
                          placeholder="¿Cuáles?"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        />
                      )}
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.marketingChannels.includes('Anuncios (por ejemplo, Facebook Ads, carteles)')}
                        onChange={() => handleArrayToggle('marketingChannels', 'Anuncios (por ejemplo, Facebook Ads, carteles)')}
                        className="w-4 h-4"
                      />
                      <span>Anuncios (por ejemplo, Facebook Ads, carteles)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.marketingChannels.includes('Otro')}
                        onChange={() => handleArrayToggle('marketingChannels', 'Otro')}
                        className="w-4 h-4"
                      />
                      <span>Otro:</span>
                      {formData.marketingChannels.includes('Otro') && (
                        <input
                          type="text"
                          value={formData.marketingOther}
                          onChange={(e) => updateFormData('marketingOther', e.target.value)}
                          placeholder="Especifica"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuántos clientes tienes por mes aproximadamente? ¿Qué porcentaje son turistas internacionales?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Clientes por mes:</label>
                      <input
                        type="text"
                        value={formData.monthlyClients}
                        onChange={(e) => updateFormData('monthlyClients', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        placeholder="Ejemplo: 50-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Porcentaje turistas internacionales:</label>
                      <input
                        type="text"
                        value={formData.internationalClients}
                        onChange={(e) => updateFormData('internationalClients', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                        placeholder="Ejemplo: 60%"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Recopilas emails o datos de clientes para marketing? (Por ejemplo, para enviar ofertas). ¿Cómo?
                  </label>
                  <textarea
                    value={formData.customerDataCollection}
                    onChange={(e) => updateFormData('customerDataCollection', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Describe cómo recopilas datos de clientes..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Desafíos y Mejoras */}
          {currentSection === 6 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Sección 6: Desafíos y Mejoras
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuáles son los mayores desafíos en tu negocio? (Por ejemplo, competencia, mantenimiento, bajas temporadas, pagos)
                  </label>
                  <textarea
                    value={formData.challenges}
                    onChange={(e) => updateFormData('challenges', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Describe los desafíos que enfrentas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué te gustaría mejorar? (Por ejemplo, más reservas en línea, pagos digitales, visibilidad en búsquedas, etc.)
                  </label>
                  <textarea
                    value={formData.improvements}
                    onChange={(e) => updateFormData('improvements', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Describe lo que te gustaría mejorar..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Tienes fotos reales de tus vehículos, ubicación o clientes? Si sí, ¿puedes enviarlas? (No las adjuntes aquí, pero confirma)
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="hasPhotos"
                        checked={formData.hasPhotos === true}
                        onChange={() => updateFormData('hasPhotos', true)}
                        className="w-4 h-4"
                      />
                      <span>Sí</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="hasPhotos"
                        checked={formData.hasPhotos === false}
                        onChange={() => updateFormData('hasPhotos', false)}
                        className="w-4 h-4"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¡Gracias por completar esta encuesta! Si tienes comentarios adicionales, escríbelos aquí:
                  </label>
                  <textarea
                    value={formData.additionalComments}
                    onChange={(e) => updateFormData('additionalComments', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    placeholder="Comentarios adicionales..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={previousSection}
              disabled={currentSection === 1}
              className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                currentSection === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={nextSection}
              className="bg-turquoise hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {currentSection === totalSections ? 'Ver Resumen' : 'Siguiente'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppBubble />
    </>
  )
}


