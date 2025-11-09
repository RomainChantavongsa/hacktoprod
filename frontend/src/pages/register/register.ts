import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '@services/apiService'
import { isApiSuccess } from '@models/api'

// Types pour la page d'inscription
export interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  nom: string
  prenom?: string
  telephone?: string
  type_entreprise: 'transporteur' | 'donneur_ordre' | ''
  est_particulier?: boolean
  nom_entreprise?: string
  siret?: string
}

export interface RegisterResponse {
  success: boolean
  token?: string
  user?: {
    id: number
    email: string
    name: string
  }
}

export interface RegisterErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  nom?: string
  type_entreprise?: string
  est_particulier?: string
  nom_entreprise?: string
  general?: string
}

export interface RegisterResult {
  success: boolean
  data?: RegisterResponse
  error?: string
}

export interface PasswordStrength {
  score: number
  level: 'faible' | 'moyen' | 'fort'
}

// Fonction de validation
const validateForm = (formData: RegisterFormData): RegisterErrors => {
  const errors: RegisterErrors = {}
  
  if (!formData.username || formData.username.trim().length < 3) {
    errors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
  }
  
  if (!formData.email) {
    errors.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'L\'email n\'est pas valide'
  }
  
  if (!formData.password) {
    errors.password = 'Le mot de passe est requis'
  } else if (formData.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
  }
  
  if (!formData.nom || formData.nom.trim().length < 2) {
    errors.nom = 'Le nom est requis (minimum 2 caractères)'
  }
  
  if (!formData.type_entreprise) {
    errors.type_entreprise = 'Le type de profil est requis'
  }

  // Validation pour donneur d'ordre
  if (formData.type_entreprise === 'donneur_ordre' && formData.est_particulier === undefined) {
    errors.est_particulier = 'Vous devez indiquer si vous êtes un particulier ou une entreprise'
  }

  // Validation nom entreprise
  if (formData.type_entreprise === 'transporteur' || 
      (formData.type_entreprise === 'donneur_ordre' && formData.est_particulier === false)) {
    if (!formData.nom_entreprise || formData.nom_entreprise.trim().length < 2) {
      errors.nom_entreprise = 'Le nom de l\'entreprise est requis'
    }
  }
  
  return errors
}

// Custom Hook - TOUTE LA LOGIQUE ICI
export const useRegister = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    telephone: '',
    type_entreprise: '',
    est_particulier: undefined,
    nom_entreprise: '',
    siret: ''
  })
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Efface les erreurs quand l'utilisateur modifie un champ
    if (Object.keys(errors).length > 0) {
      setErrors({})
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setLoading(true)
    setErrors({})
    
    try {
      // Préparer les données pour l'API (sans confirmPassword)
      const { confirmPassword, ...userData } = formData
      
      // S'assurer que type_entreprise n'est pas vide (TypeScript safety)
      if (userData.type_entreprise !== 'transporteur' && userData.type_entreprise !== 'donneur_ordre') {
        setErrors({ general: 'Veuillez sélectionner un type de profil valide' })
        setLoading(false)
        return
      }
      
      // TypeScript type narrowing après validation
      const validUserData = userData as Omit<RegisterFormData, 'confirmPassword' | 'type_entreprise'> & { 
        type_entreprise: 'transporteur' | 'donneur_ordre' 
      }
      
      const response = await apiService.register(validUserData)
      
      if (isApiSuccess(response)) {
        console.log('✅ Inscription réussie!', response.data)
        // Rediriger vers la page de login après inscription réussie
        navigate('/login', { 
          state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' }
        })
      } else {
        setErrors({ general: response.message || 'Erreur lors de l\'inscription' })
      }
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error)
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    handleChange,
    errors,
    loading,
    handleSubmit
  }
}

// Fonctions utilitaires
export const registerUtils = {
  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      return data.exists || false
    } catch (error) {
      console.error('Erreur de vérification:', error)
      return false
    }
  },

  checkPasswordStrength: (password: string): PasswordStrength => {
    let strength = 0
    
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    
    return {
      score: strength,
      level: strength <= 2 ? 'faible' : strength <= 3 ? 'moyen' : 'fort'
    }
  }
}
