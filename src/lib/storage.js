// Utilitaire pour gérer le stockage local (localStorage)

const STORAGE_KEY = 'global_form_submissions'

// Récupérer toutes les soumissions
export function getAllSubmissions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage:', error)
    return []
  }
}

// Sauvegarder une nouvelle soumission
export function saveSubmission(formData) {
  try {
    const submissions = getAllSubmissions()
    const newSubmission = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toISOString()
    }
    submissions.push(newSubmission)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions))
    return { success: true, data: newSubmission }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    return { success: false, error }
  }
}

// Supprimer une soumission
export function deleteSubmission(id) {
  try {
    const submissions = getAllSubmissions()
    const filtered = submissions.filter(sub => sub.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return { success: false, error }
  }
}

// Vider toutes les soumissions
export function clearAllSubmissions() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return { success: true }
  } catch (error) {
    console.error('Erreur lors du vidage:', error)
    return { success: false, error }
  }
}

// Obtenir les statistiques
export function getStats() {
  const submissions = getAllSubmissions()
  const stats = {
    total: submissions.length,
    byType: {
      contact: 0,
      don: 0,
      benevolat: 0,
      info: 0
    }
  }
  
  submissions.forEach(sub => {
    if (stats.byType[sub.type] !== undefined) {
      stats.byType[sub.type]++
    }
  })
  
  return stats
}

