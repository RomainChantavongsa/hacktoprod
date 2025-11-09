import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

// Types pour la page d'inscription
export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
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
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
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
const validateForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): RegisterErrors => {
  const errors: RegisterErrors = {}
  
  if (!name || name.trim().length < 2) {
    errors.name = 'Le nom doit contenir au moins 2 caractères'
  }
  
  if (!email) {
    errors.email = 'L\'email est requis'
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'L\'email n\'est pas valide'
  }
  
  if (!password) {
    errors.password = 'Le mot de passe est requis'
  } else if (password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
  }
  
  return errors
}

// Fonction d'API
const submitRegister = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResult> => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erreur d\'inscription')
    }
    
    const data: RegisterResponse = await response.json()
    
    // Optionnel : connecter automatiquement après l'inscription
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}

// Custom Hook - TOUTE LA LOGIQUE ICI
export const useRegister = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    const validationErrors = validateForm(name, email, password, confirmPassword)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setLoading(true)
    setErrors({})
    
    // Soumission
    const result = await submitRegister(name, email, password)
    
    if (result.success) {
      console.log('Inscription réussie!')
      navigate('/')
    } else {
      setErrors({ general: result.error })
    }
    
    setLoading(false)
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
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
