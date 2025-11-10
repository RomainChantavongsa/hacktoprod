const BaseModel = require('./BaseModel');

class Conducteur extends BaseModel {
  constructor(data = {}) {
    super('conducteur', data);
  }

  getId() { return this.id; }
  getEntrepriseId() { return this.entreprise_id; }
  getNom() { return this.nom; }
  getPrenom() { return this.prenom; }
  getEmail() { return this.email; }
  getTelephone() { return this.telephone; }
  getNumeroPermis() { return this.numero_permis; }
  getDateNaissance() { return this.date_naissance; }
  getDateEmbauche() { return this.date_embauche; }
  getStatut() { return this.statut; }

  setEntrepriseId(v) { this.entreprise_id = v; return this; }
  setNom(v) { this.nom = v; return this; }
  setPrenom(v) { this.prenom = v; return this; }
  setEmail(v) { this.email = v; return this; }
  setTelephone(v) { this.telephone = v; return this; }
  setNumeroPermis(v) { this.numero_permis = v; return this; }
  setDateNaissance(v) { this.date_naissance = v; return this; }
  setDateEmbauche(v) { this.date_embauche = v; return this; }
  setStatut(v) { this.statut = v; return this; }

  toSafeObject() {
    return {
      id: this.id,
      entreprise_id: this.entreprise_id,
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      numero_permis: this.numero_permis,
      date_naissance: this.date_naissance,
      date_embauche: this.date_embauche,
      statut: this.statut,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Conducteur;
