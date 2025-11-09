import { useRemorques } from './remorques.ts'
import DataTable from '@components/DataTable.jsx'
import './remorques.scss'

export default function RemorquesPage() {
  const { remorques, loading, error, form, handleChange, create, remove, submitting, resetForm } = useRemorques()

  return (
    <div className="remorques-page">
      <div className="page-header">
        <h1>Gestion des remorques</h1>
        <p className="subtitle">Connecté à la base de données</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="add-form-container">
        <form onSubmit={create} className="remorque-add-bar" aria-label="Ajouter une remorque">
          <div className="add-bar">
            <div className="field">
              <input name="type_remorque" value={form.type_remorque} onChange={handleChange} placeholder="Type" required />
            </div>
            <div className="field">
              <input name="plaque_immatriculation" value={form.plaque_immatriculation} onChange={handleChange} placeholder="Plaque" required />
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
          { key: 'type_remorque', header: 'Type', sortable: true },
          { key: 'plaque_immatriculation', header: 'Plaque', sortable: true },
          { key: 'capacite_tonnes', header: 'Capacité (t)', sortable: true, render: (r) => r.capacite_tonnes ?? '-' },
          { key: 'actions', header: 'Actions', render: (r) => (
              <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>Supprimer</button>
            ) }
        ]}
        data={remorques}
        loading={loading}
        emptyMessage="Aucune remorque"
        defaultPageSize={10}
      />
    </div>
  )
}