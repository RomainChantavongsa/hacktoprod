import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

// Types pour la page de connexion
export interface LoginFormData {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    id: number
    email: string
    name: string
  }
}

export interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

export interface LoginResult {
  success: boolean
  data?: LoginResponse
  error?: string
}

// Fonction de validation
const validateForm = (email: string, password: string): LoginErrors => {
  const errors: LoginErrors = {}
  
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
  
  return errors
}

// Fonction d'API
const submitLogin = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) {
      throw new Error('Erreur de connexion')
    }
    
    const data: LoginResponse = await response.json()
    
    // Stocker le token
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Erreur de connexion:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}

// Custom Hook - TOUTE LA LOGIQUE ICI
export const useLogin = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    const validationErrors = validateForm(email, password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setLoading(true)
    setErrors({})
    
    // Soumission
    const result = await submitLogin(email, password)
    
    if (result.success) {
      console.log('Connexion réussie!')
      navigate('/')
    } else {
      setErrors({ general: result.error })
    }
    
    setLoading(false)
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    handleSubmit
  }
}

// Fonctions utilitaires
export const loginUtils = {
  checkAuth: (): boolean => {
    const token = localStorage.getItem('token')
    return !!token
  },

  logout: (): void => {
    localStorage.removeItem('token')
  }
}
