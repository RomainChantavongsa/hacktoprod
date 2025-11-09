import { useEffect, useState } from 'react'
import apiService from '@services/apiService'
import type { Vehicule, Conducteur } from '@models/api'

export const useVehicules = () => {
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    type_vehicule: '',
    plaque_immatriculation: '',
    conducteur_attitre: '',
    capacite_tonnes: '' as string | number
  })

  const load = async () => {
    setLoading(true)
    setError('')
    const [vehiculesRes, conducteursRes] = await Promise.all([
      apiService.getVehicules(),
      apiService.getConducteurs()
    ])
    
    if (vehiculesRes.success) setVehicules(vehiculesRes.data)
    else setError(vehiculesRes.message)

    if (conducteursRes.success) setConducteurs(conducteursRes.data)
    else setError(error + (error ? '; ' : '') + conducteursRes.message)

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
      type_vehicule: form.type_vehicule,
      plaque_immatriculation: form.plaque_immatriculation,
      conducteur_attitre: form.conducteur_attitre || undefined,
      capacite_tonnes: form.capacite_tonnes === '' ? undefined : Number(form.capacite_tonnes)
    }
    const res = await apiService.createVehicule(payload)
    if (res.success) {
      setForm({ type_vehicule: '', plaque_immatriculation: '', conducteur_attitre: '', capacite_tonnes: '' })
      await load()
    } else setError(res.message)
    setSubmitting(false)
  }

  const remove = async (id: number) => {
    const res = await apiService.deleteVehicule(id)
    if (res.success) await load()
    else setError(res.message)
  }

  const resetForm = () => setForm({ type_vehicule: '', plaque_immatriculation: '', conducteur_attitre: '', capacite_tonnes: '' })

  return { vehicules, conducteurs, loading, error, form, handleChange, create, remove, reload: load, submitting, resetForm }
}
