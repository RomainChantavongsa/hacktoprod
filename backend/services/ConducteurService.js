const Conducteur = require('../models/Conducteur');

class ConducteurService {
  async create(entrepriseId, data) {
    const c = Conducteur.create();
    c.setEntrepriseId(entrepriseId)
      .setNom(data.nom)
      .setPrenom(data.prenom)
      .setEmail(data.email || null)
      .setTelephone(data.telephone || null)
      .setNumeroPermis(data.numero_permis)
      .setDateNaissance(data.date_naissance || null)
      .setDateEmbauche(data.date_embauche || null)
      .setStatut(data.statut || 'actif');
    await c.save();
    return c.toSafeObject();
  }

  async update(id, entrepriseId, data) {
    const c = await Conducteur.getFromId(id);
    if (!c || c.getEntrepriseId() !== entrepriseId) {
      const err = new Error('Conducteur introuvable');
      err.statusCode = 404;
      throw err;
    }
    if (data.nom !== undefined) c.setNom(data.nom);
    if (data.prenom !== undefined) c.setPrenom(data.prenom);
    if (data.email !== undefined) c.setEmail(data.email);
    if (data.telephone !== undefined) c.setTelephone(data.telephone);
    if (data.numero_permis !== undefined) c.setNumeroPermis(data.numero_permis);
    if (data.date_naissance !== undefined) c.setDateNaissance(data.date_naissance);
    if (data.date_embauche !== undefined) c.setDateEmbauche(data.date_embauche);
    if (data.statut !== undefined) c.setStatut(data.statut);
    await c.save();
    return c.toSafeObject();
  }

  async list(entrepriseId) {
    const items = await Conducteur.where('entreprise_id', '=', entrepriseId);
    return items.map(i => i.toSafeObject());
  }

  async get(id, entrepriseId) {
    const c = await Conducteur.getFromId(id);
    if (!c || c.getEntrepriseId() !== entrepriseId) {
      const err = new Error('Conducteur introuvable');
      err.statusCode = 404;
      throw err;
    }
    return c.toSafeObject();
  }

  async delete(id, entrepriseId) {
    const c = await Conducteur.getFromId(id);
    if (!c || c.getEntrepriseId() !== entrepriseId) {
      const err = new Error('Conducteur introuvable');
      err.statusCode = 404;
      throw err;
    }
    await c.delete();
    return { message: 'Conducteur supprimé' };
  }
}

module.exports = new ConducteurService();
