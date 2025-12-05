import { useState, useEffect } from 'react'
import { saveSubmission } from '../lib/storage'

const FORM_TYPES = {
  contact: {
    label: 'Contact',
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'sujet', label: 'Sujet', type: 'text', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true }
    ]
  },
  don: {
    label: 'Don',
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'montant', label: 'Montant (€)', type: 'number', required: true, min: 1 },
      { name: 'recurrence', label: 'Récurrence', type: 'select', required: true, options: ['Unique', 'Mensuel', 'Trimestriel', 'Annuel'] },
      { name: 'message', label: 'Message (optionnel)', type: 'textarea', required: false }
    ]
  },
  benevolat: {
    label: 'Bénévolat',
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'telephone', label: 'Téléphone', type: 'tel', required: true },
      { name: 'domaine', label: 'Domaine d\'intérêt', type: 'select', required: true, options: ['Éducation', 'Environnement', 'Santé', 'Social', 'Autre'] },
      { name: 'disponibilite', label: 'Disponibilité', type: 'text', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: false }
    ]
  },
  info: {
    label: 'Information',
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'sujet', label: 'Sujet de votre demande', type: 'text', required: true },
      { name: 'message', label: 'Votre demande', type: 'textarea', required: true }
    ]
  }
}

export default function DynamicForm({ formType, onClose, onSubmit }) {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  const currentForm = FORM_TYPES[formType] || FORM_TYPES.contact

  useEffect(() => {
    // Initialiser les champs
    const initialData = {}
    currentForm.fields.forEach(field => {
      initialData[field.name] = ''
    })
    setFormData(initialData)
    setErrors({})
  }, [formType])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors = {}

    // Anti-spam : honeypot
    if (honeypot) {
      newErrors.honeypot = 'Spam détecté'
      return false
    }

    currentForm.fields.forEach(field => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} est requis`
      }
      if (field.type === 'email' && formData[field.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.name])) {
        newErrors[field.name] = 'Email invalide'
      }
      if (field.type === 'number' && formData[field.name] && parseFloat(formData[field.name]) < (field.min || 0)) {
        newErrors[field.name] = `Le montant doit être supérieur à ${field.min || 0}`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Sauvegarder dans localStorage
      const submissionData = {
        type: formType,
        ...formData
      }
      
      const result = saveSubmission(submissionData)
      
      if (!result.success) {
        throw new Error('Erreur lors de la sauvegarde')
      }
      
      // Simuler un délai pour l'UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (onSubmit) {
        onSubmit(result.data)
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field) => {
    const hasError = errors[field.name]

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
          {hasError && <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>}
        </div>
      )
    }

    if (field.type === 'select') {
      return (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          >
            <option value="">Sélectionnez...</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {hasError && <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>}
        </div>
      )
    }

    return (
      <div key={field.name} className="mb-4">
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          value={formData[field.name] || ''}
          onChange={handleChange}
          min={field.min}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasError ? 'border-red-500' : 'border-gray-300'
          }`}
          required={field.required}
        />
        {hasError && <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>}
      </div>
    )
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        zIndex: 10000,
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 
          className="text-2xl font-bold text-gray-900"
          style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}
        >
          Formulaire {currentForm.label}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot anti-spam (caché) */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex="-1"
          autoComplete="off"
        />

        {currentForm.fields.map(renderField)}

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  )
}

