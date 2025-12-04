import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/" 
          element={
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Global Form
              </h1>
              <p className="text-red-400">
                Projet initialisé avec Vite, React Router, Tailwind CSS et Supabase
              </p>
            </div>
          } 
        />
      </Routes>
    </div>
  )
}

export default App
