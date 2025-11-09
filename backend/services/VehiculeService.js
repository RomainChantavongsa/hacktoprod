const Vehicule = require('../models/Vehicule');

class VehiculeService {
  async create(entrepriseId, data) {
    const v = Vehicule.create();
    v.setEntrepriseId(entrepriseId)
      .setTypeVehicule(data.type_vehicule)
      .setPlaque(data.plaque_immatriculation)
      .setConducteur(data.conducteur_attitre || null)
      .setCapaciteTonnes(data.capacite_tonnes || null);
    await v.save();
    return v.toSafeObject();
  }

  async update(id, entrepriseId, data) {
    const v = await Vehicule.getFromId(id);
    if (!v || v.getEntrepriseId() !== entrepriseId) {
      const err = new Error('Véhicule introuvable');
      err.statusCode = 404;
      throw err;
    }
    if (data.type_vehicule !== undefined) v.setTypeVehicule(data.type_vehicule);
    if (data.plaque_immatriculation !== undefined) v.setPlaque(data.plaque_immatriculation);
    if (data.conducteur_attitre !== undefined) v.setConducteur(data.conducteur_attitre);
    if (data.capacite_tonnes !== undefined) v.setCapaciteTonnes(data.capacite_tonnes);
    await v.save();
    return v.toSafeObject();
  }

  async list(entrepriseId) {
    const items = await Vehicule.where('entreprise_id', '=', entrepriseId);
    return items.map(i => i.toSafeObject());
  }

  async get(id, entrepriseId) {
    const v = await Vehicule.getFromId(id);
    if (!v || v.getEntrepriseId() !== entrepriseId) {
      const err = new Error('Véhicule introuvable');
      err.statusCode = 404;
      throw err;
    }
    return v.toSafeObject();
  }

  async delete(id, entrepriseId) {
    const v = await Vehicule.getFromId(id);
    if (!v || v.getEntrepriseId() !== entrepriseId) {
      const err = new Error('Véhicule introuvable');
      err.statusCode = 404;
      throw err;
    }
    await v.delete();
    return { message: 'Véhicule supprimé' };
  }
}

module.exports = new VehiculeService();
