import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import apiService from '@services/apiService'
import { isApiSuccess } from '@models/api'
import { useAuth } from '@/contexts/AuthContext.jsx'

// Types pour les erreurs du formulaire
export interface LoginErrors {
  username?: string
  password?: string
  general?: string
}

// Fonction de validation
const validateForm = (username: string, password: string): LoginErrors => {
  const errors: LoginErrors = {}
  
  if (!username) {
    errors.username = 'Le nom d\'utilisateur est requis'
  }
  
  if (!password) {
    errors.password = 'Le mot de passe est requis'
  } else if (password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  }
  
  return errors
}

// Custom Hook - TOUTE LA LOGIQUE ICI
export const useLogin = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  // Récupérer le message de succès depuis l'état de navigation (après inscription)
  useState(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Nettoyer l'état après 5 secondes
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    const validationErrors = validateForm(username, password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setLoading(true)
    setErrors({})
    
    // Appel API avec le nouveau service
    const response = await apiService.login({ username, password })
    
    if (isApiSuccess(response)) {
      // Le backend retourne token et user directement dans la réponse
      const loginResponse = response as any
      console.log('✅ Connexion réussie!', loginResponse.user)
      
      // Sauvegarder l'utilisateur dans le contexte d'authentification
      login(loginResponse.token, loginResponse.user)
      
      // Rediriger vers la page d'accueil
      navigate('/')
    } else {
      setErrors({ general: response.message || 'Identifiants incorrects' })
    }
    
    setLoading(false)
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    errors,
    loading,
    successMessage,
    handleSubmit
  }
}

// Fonctions utilitaires
export const loginUtils = {
  checkAuth: (): boolean => {
    return !!apiService.getToken()
  },

  logout: (): void => {
    apiService.logout()
  }
}
