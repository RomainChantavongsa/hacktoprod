const BaseModel = require('./BaseModel');

class Remorque extends BaseModel {
  constructor(data = {}) {
    super('remorque', data);
  }

  getId() { return this.id; }
  getEntrepriseId() { return this.entreprise_id; }
  getTypeRemorque() { return this.type_remorque; }
  getPlaque() { return this.plaque_immatriculation; }
  getCapaciteTonnes() { return this.capacite_tonnes; }

  setEntrepriseId(v) { this.entreprise_id = v; return this; }
  setTypeRemorque(v) { this.type_remorque = v; return this; }
  setPlaque(v) { this.plaque_immatriculation = v; return this; }
  setCapaciteTonnes(v) { this.capacite_tonnes = v; return this; }

  toSafeObject() {
    return {
      id: this.id,
      entreprise_id: this.entreprise_id,
      type_remorque: this.type_remorque,
      plaque_immatriculation: this.plaque_immatriculation,
      capacite_tonnes: this.capacite_tonnes,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Remorque;
