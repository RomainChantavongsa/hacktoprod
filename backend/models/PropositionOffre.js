const BaseModel = require('./BaseModel');

class PropositionOffre extends BaseModel {
  constructor(data = {}) {
    super('proposition_offre', data);
  }

  getId() { return this.id; }
  getOffreFretId() { return this.offre_fret_id; }
  getEntrepriseTransporteurId() { return this.entreprise_transporteur_id; }
  getPrixPropose() { return this.prix_propose; }
  getMessage() { return this.message; }
  getStatutProposition() { return this.statut_proposition; }

  setOffreFretId(v){ this.offre_fret_id = v; return this; }
  setEntrepriseTransporteurId(v){ this.entreprise_transporteur_id = v; return this; }
  setPrixPropose(v){ this.prix_propose = v; return this; }
  setMessage(v){ this.message = v; return this; }
  setStatutProposition(v){ this.statut_proposition = v; return this; }

  async accepter() {
    this.setStatutProposition('Acceptee');
    return this.save();
  }

  async refuser() {
    this.setStatutProposition('Refusee');
    return this.save();
  }

  static async getByOffre(offreId){
    return await PropositionOffre.where('offre_fret_id','=',offreId);
  }

  static async getByTransporteur(transporteurEntrepriseId){
    return await PropositionOffre.where('entreprise_transporteur_id','=',transporteurEntrepriseId);
  }
}

module.exports = PropositionOffre;