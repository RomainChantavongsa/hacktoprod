import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext.jsx'
import apiService from '@/services/apiService.ts'

interface SettingsErrors {
  username?: string
  email?: string
  nom?: string
  prenom?: string
  telephone?: string
  general?: string
}

const validateForm = (data: {username: string, email: string, nom: string, prenom: string, telephone: string}): SettingsErrors => {
  const errors: SettingsErrors = {}

  if (!data.username) errors.username = 'Username is required'
  if (!data.email) errors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Invalid email format'
  if (!data.nom) errors.nom = 'Nom is required'
  if (!data.prenom) errors.prenom = 'Prenom is required'
  if (!data.telephone) errors.telephone = 'Telephone is required'

  return errors
}

export const useSettings = () => {
  const { user, updateUser } = useAuth()
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [nom, setNom] = useState<string>('')
  const [prenom, setPrenom] = useState<string>('')
  const [telephone, setTelephone] = useState<string>('')
  const [errors, setErrors] = useState<SettingsErrors>({})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      setUsername(user.username || '')
      setEmail(user.email || '')
      setNom(user.nom || '')
      setPrenom(user.prenom || '')
      setTelephone(user.telephone || '')
    }
  }, [user])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = { username, email, nom, prenom, telephone }
    const validationErrors = validateForm(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const response = await apiService.updateUserProfile(user.id, data)
      if (response.success) {
        updateUser(response.data)
        setErrors({})
      } else {
        setErrors({ general: response.message || 'Erreur lors de la mise à jour' })
      }
    } catch (error) {
      setErrors({ general: 'Erreur réseau lors de la mise à jour' })
    } finally {
      setLoading(false)
    }
  }

  return {
    username,
    setUsername,
    email,
    setEmail,
    nom,
    setNom,
    prenom,
    setPrenom,
    telephone,
    setTelephone,
    errors,
    loading,
    handleSubmit
  }
}