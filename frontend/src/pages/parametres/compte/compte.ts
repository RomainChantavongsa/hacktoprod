import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/apiService'

interface CompteFormData {
  username: string
  email: string
  nom: string
  prenom: string
  telephone: string
  role: 'transporteur' | 'donneur_ordre'
  type_entreprise?: string
}

export const useCompte = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState<CompteFormData>({
    username: '',
    email: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: 'transporteur',
    type_entreprise: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Charger les données utilisateur au montage
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const response = await apiService.getUserProfile()
          if (response.success && response.data) {
            setFormData({
              username: response.data.username || '',
              email: response.data.email || '',
              nom: response.data.nom || '',
              prenom: response.data.prenom || '',
              telephone: response.data.telephone || '',
              role: response.data.type_entreprise || 'transporteur',
              type_entreprise: response.data.type_entreprise || ''
            })
          }
        } catch (err) {
          console.error('Erreur lors du chargement du profil:', err)
          // Fallback vers AuthContext si l'API échoue
          setFormData({
            username: user.username || '',
            email: user.email || '',
            nom: user.nom || '',
            prenom: user.prenom || '',
            telephone: user.telephone || '',
            role: user.type_entreprise || user.role || '',
            type_entreprise: user.type_entreprise || ''
          })
        }
      }
    }

    fetchUserProfile()
  }, [user])

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

    try {
      // Appel API pour mettre à jour le profil
      const response = await apiService.updateUser(user?.id || 0, formData)
      
      if (response.success) {
        setSuccess('Informations mises à jour avec succès !')
      } else {
        setError(response.message || 'Erreur lors de la mise à jour')
      }
      
    } catch (err: any) {
      setError('Erreur lors de la mise à jour')
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
