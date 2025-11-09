import { useVehicules } from './vehicules.ts'
import DataTable from '@components/DataTable.jsx'
import './vehicules.scss'

export default function VehiculesPage() {
  const { vehicules, conducteurs, loading, error, form, handleChange, create, remove, submitting, resetForm } = useVehicules()

  return (
    <div className="vehicules-page">
      <div className="page-header">
        <h1>Gestion des véhicules</h1>
        <p className="subtitle">Flotte connectée à la base de données</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="add-form-container">
        <form onSubmit={(e) => { create(e); }} className="vehicule-add-bar" aria-label="Ajouter un véhicule">
          <div className="add-bar">
            <div className="field">
              <input name="type_vehicule" value={form.type_vehicule} onChange={handleChange} placeholder="Type (Fourgon)" required />
            </div>
            <div className="field">
              <input name="plaque_immatriculation" value={form.plaque_immatriculation} onChange={handleChange} placeholder="Plaque" required />
            </div>
            <div className="field">
              <select name="conducteur_attitre" value={form.conducteur_attitre} onChange={handleChange}>
                <option value="">Aucun conducteur</option>
                {conducteurs.map(c => (
                  <option key={c.id} value={`${c.prenom} ${c.nom}`}>
                    {c.prenom} {c.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <input type="number" step="0.1" name="capacite_tonnes" value={form.capacite_tonnes} onChange={handleChange} placeholder="Capacité (t)" />
            </div>
            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={submitting}>Ajouter</button>
              <button className="btn btn-sm" type="button" onClick={() => { resetForm(); }} disabled={submitting}>Annuler</button>
            </div>
          </div>
        </form>
      </div>

      <DataTable
        columns={[
          { key: 'type_vehicule', header: 'Type', sortable: true },
          { key: 'plaque_immatriculation', header: 'Plaque', sortable: true },
          { key: 'conducteur_attitre', header: 'Conducteur', sortable: true },
          { key: 'capacite_tonnes', header: 'Capacité (t)', sortable: true, render: (r) => r.capacite_tonnes ?? '-' },
          { key: 'actions', header: 'Actions', render: (r) => (
              <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>Supprimer</button>
            ) }
        ]}
        data={vehicules}
        loading={loading}
        emptyMessage="Aucun véhicule"
        defaultPageSize={10}
      />
    </div>
  )
}