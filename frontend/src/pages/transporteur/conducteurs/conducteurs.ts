import { useEffect, useState } from 'react'
import apiService from '@services/apiService'

export interface Conducteur {
  id: number
  entreprise_id: number
  nom: string
  prenom: string
  email?: string
  telephone?: string
  numero_permis: string
  date_naissance?: string
  date_embauche?: string
  statut: 'actif' | 'inactif' | 'conge' | 'suspendu'
  created_at?: string
  updated_at?: string
}

export const useConducteurs = () => {
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    numero_permis: '',
    date_naissance: '',
    date_embauche: '',
    statut: 'actif' as 'actif' | 'inactif' | 'conge' | 'suspendu'
  })

  const load = async () => {
    setLoading(true)
    setError('')
    const res = await apiService.getConducteurs()
    
    if (res.success) {
      setConducteurs(res.data)
    } else {
      setError(res.message)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    
    const payload = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email || undefined,
      telephone: form.telephone || undefined,
      numero_permis: form.numero_permis,
      date_naissance: form.date_naissance || undefined,
      date_embauche: form.date_embauche || undefined,
      statut: form.statut
    }
    
    const res = await apiService.createConducteur(payload)
    if (res.success) {
      setForm({ 
        nom: '', 
        prenom: '', 
        email: '', 
        telephone: '', 
        numero_permis: '', 
        date_naissance: '', 
        date_embauche: '', 
        statut: 'actif' 
      })
      await load()
    } else {
      setError(res.message)
    }
    setSubmitting(false)
  }

  const remove = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce conducteur ?')) return
    
    const res = await apiService.deleteConducteur(id)
    if (res.success) {
      await load()
    } else {
      setError(res.message)
    }
  }

  const resetForm = () => {
    setForm({ 
      nom: '', 
      prenom: '', 
      email: '', 
      telephone: '', 
      numero_permis: '', 
      date_naissance: '', 
      date_embauche: '', 
      statut: 'actif' 
    })
  }

  return { 
    conducteurs, 
    loading, 
    error, 
    form, 
    handleChange, 
    create, 
    remove, 
    reload: load, 
    submitting, 
    resetForm 
  }
}
