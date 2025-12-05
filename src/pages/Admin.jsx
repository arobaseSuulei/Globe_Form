import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllSubmissions, deleteSubmission, clearAllSubmissions, getStats } from '../lib/storage'

export default function Admin() {
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = () => {
    const data = getAllSubmissions()
    setSubmissions(data)
    setStats(getStats())
  }

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette soumission ?')) {
      deleteSubmission(id)
      loadSubmissions()
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer TOUTES les soumissions ? Cette action est irréversible.')) {
      clearAllSubmissions()
      loadSubmissions()
    }
  }

  const formTypeLabels = {
    contact: 'Contact',
    don: 'Don',
    benevolat: 'Bénévolat',
    info: 'Information'
  }

  const formTypeColors = {
    contact: 'bg-blue-100 text-blue-800',
    don: 'bg-green-100 text-green-800',
    benevolat: 'bg-purple-100 text-purple-800',
    info: 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-600 mt-1">Gestion des soumissions de formulaires</p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Retour à l'accueil
          </Link>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.byType.contact}</div>
              <div className="text-sm text-gray-600">Contact</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">{stats.byType.don}</div>
              <div className="text-sm text-gray-600">Don</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.byType.benevolat}</div>
              <div className="text-sm text-gray-600">Bénévolat</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.byType.info}</div>
              <div className="text-sm text-gray-600">Info</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={loadSubmissions}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Actualiser
          </button>
          {submissions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Tout supprimer
            </button>
          )}
        </div>

        {/* Liste des soumissions */}
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Aucune soumission pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((submission) => (
                <div key={submission.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${formTypeColors[submission.type] || 'bg-gray-100 text-gray-800'}`}>
                        {formTypeLabels[submission.type] || submission.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(submission.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(submission.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(submission)
                      .filter(([key]) => !['id', 'type', 'timestamp'].includes(key))
                      .map(([key, value]) => (
                        <div key={key}>
                          <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                            {key}
                          </div>
                          <div className="text-gray-900">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

