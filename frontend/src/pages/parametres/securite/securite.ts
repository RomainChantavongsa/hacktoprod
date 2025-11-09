import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/apiService'

interface SecuriteFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const useSecurite = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState<SecuriteFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      setIsLoading(false)
      return
    }

    try {
      // Appel API pour changer le mot de passe
      // Note: Vous devrez créer un endpoint spécifique pour le changement de mot de passe
      // Pour l'instant, on utilise updateUser avec un objet contenant le nouveau password
      const response = await apiService.updateUser(user?.id || 0, {
        password: formData.newPassword,
        currentPassword: formData.currentPassword
      } as any)
      
      if (response.success) {
        setSuccess('Mot de passe modifié avec succès !')
        // Réinitialiser le formulaire
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setError(response.message || 'Erreur lors du changement de mot de passe')
      }
      
    } catch (err: any) {
      setError('Erreur lors du changement de mot de passe')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit
  }
}
