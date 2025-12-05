import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Globe from '../components/Globe'
import DynamicForm from '../components/DynamicForm'

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [selectedFormType, setSelectedFormType] = useState('contact')
  const navigate = useNavigate()

  const handlePlanetClick = (point) => {
    console.log('Planet clicked!', point)
    // Choisir un type de formulaire aléatoirement
    const formTypes = ['contact', 'don', 'benevolat', 'info']
    const randomType = formTypes[Math.floor(Math.random() * formTypes.length)]
    setSelectedFormType(randomType)
    setShowForm(true)
  }

  const handleFormSubmit = (formData) => {
    setShowForm(false)
    navigate('/confirmation', { state: { formData } })
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            Global Form
          </h1>
          <p className="text-blue-200 text-center mt-2 text-sm md:text-base">
            Cliquez sur la planète pour commencer
          </p>
        </div>
      </header>

      {/* Globe Container */}
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full h-full relative">
          <Globe />
        </div>
      </div>

      {/* Form Overlay */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{ zIndex: 9999 }}
        >
          <DynamicForm
            formType={selectedFormType}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-0 right-0 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-black bg-opacity-50 rounded-lg p-4 text-white text-center text-sm">
            <p className="mb-2">💡 Cliquez sur la planète pour ouvrir un formulaire</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs mb-2">
              <span className="px-2 py-1 bg-blue-600 rounded">Contact</span>
              <span className="px-2 py-1 bg-green-600 rounded">Don</span>
              <span className="px-2 py-1 bg-purple-600 rounded">Bénévolat</span>
              <span className="px-2 py-1 bg-orange-600 rounded">Info</span>
            </div>
            <button
              onClick={() => {
                const formTypes = ['contact', 'don', 'benevolat', 'info']
                const randomType = formTypes[Math.floor(Math.random() * formTypes.length)]
                setSelectedFormType(randomType)
                setShowForm(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
            >
              Test: Ouvrir le formulaire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

