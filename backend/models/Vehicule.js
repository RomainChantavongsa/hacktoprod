const BaseModel = require('./BaseModel');

class Vehicule extends BaseModel {
  constructor(data = {}) {
    super('vehicule', data);
  }

  getId() { return this.id; }
  getEntrepriseId() { return this.entreprise_id; }
  getTypeVehicule() { return this.type_vehicule; }
  getPlaque() { return this.plaque_immatriculation; }
  getConducteur() { return this.conducteur_attitre; }
  getCapaciteTonnes() { return this.capacite_tonnes; }

  setEntrepriseId(v) { this.entreprise_id = v; return this; }
  setTypeVehicule(v) { this.type_vehicule = v; return this; }
  setPlaque(v) { this.plaque_immatriculation = v; return this; }
  setConducteur(v) { this.conducteur_attitre = v; return this; }
  setCapaciteTonnes(v) { this.capacite_tonnes = v; return this; }

  toSafeObject() {
    return {
      id: this.id,
      entreprise_id: this.entreprise_id,
      type_vehicule: this.type_vehicule,
      plaque_immatriculation: this.plaque_immatriculation,
      conducteur_attitre: this.conducteur_attitre,
      capacite_tonnes: this.capacite_tonnes,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Vehicule;
