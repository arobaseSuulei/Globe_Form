import { useLocation, Link } from 'react-router-dom'

export default function Confirmation() {
  const location = useLocation()
  const { formData } = location.state || {}
  const currentYear = new Date().getFullYear()

  const formTypeLabels = {
    contact: 'Contact',
    don: 'Don',
    benevolat: 'Bénévolat',
    info: 'Information'
  }

  const impactMessages = {
    contact: 'Votre message a été reçu et sera traité dans les plus brefs délais.',
    don: 'Votre générosité contribue directement à nos projets et permet de faire une réelle différence.',
    benevolat: 'Votre engagement est précieux et nous permet d\'amplifier notre impact sur le terrain.',
    info: 'Nous vous recontacterons rapidement avec les informations demandées.'
  }

  const projectFollowUp = {
    contact: `En ${currentYear}, nous continuons à développer nos programmes et votre retour est essentiel pour nous améliorer.`,
    don: `Grâce aux dons reçus en ${currentYear}, nous avons pu financer plusieurs projets majeurs. Vous recevrez un rapport détaillé de l'utilisation de votre contribution.`,
    benevolat: `En ${currentYear}, nos bénévoles ont permis de réaliser des actions concrètes dans plusieurs domaines. Votre participation renforcera notre équipe.`,
    info: `En ${currentYear}, nous développons de nouveaux projets et initiatives. Nous partagerons avec vous toutes les informations pertinentes.`
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">Aucune donnée de formulaire trouvée.</p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Merci {formData.nom ? formData.nom.split(' ')[0] : ''} !
          </h1>
          <p className="text-lg text-gray-600">
            Votre demande de <strong>{formTypeLabels[formData.type] || 'Contact'}</strong> a été envoyée avec succès
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Message de confirmation</h2>
          <p className="text-gray-700 mb-4">
            {impactMessages[formData.type] || impactMessages.contact}
          </p>
          <p className="text-gray-700">
            {projectFollowUp[formData.type] || projectFollowUp.contact}
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type d'action :</span>
              <span className="font-medium text-gray-900">{formTypeLabels[formData.type] || 'Contact'}</span>
            </div>
            {formData.nom && (
              <div className="flex justify-between">
                <span className="text-gray-600">Nom :</span>
                <span className="font-medium text-gray-900">{formData.nom}</span>
              </div>
            )}
            {formData.email && (
              <div className="flex justify-between">
                <span className="text-gray-600">Email :</span>
                <span className="font-medium text-gray-900">{formData.email}</span>
              </div>
            )}
            {formData.montant && (
              <div className="flex justify-between">
                <span className="text-gray-600">Montant :</span>
                <span className="font-medium text-gray-900">{formData.montant} €</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Année :</span>
              <span className="font-medium text-gray-900">{currentYear}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

