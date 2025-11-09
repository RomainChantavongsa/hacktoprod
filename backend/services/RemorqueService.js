const Remorque = require('../models/Remorque');

class RemorqueService {
  async create(entrepriseId, data) {
    const r = Remorque.create();
    r.setEntrepriseId(entrepriseId)
      .setTypeRemorque(data.type_remorque)
      .setPlaque(data.plaque_immatriculation)
      .setCapaciteTonnes(data.capacite_tonnes || null);
    await r.save();
    return r.toSafeObject();
  }

  async update(id, entrepriseId, data) {
    const r = await Remorque.getFromId(id);
    if (!r || r.getEntrepriseId() !== entrepriseId) {
      const err = new Error('Remorque introuvable');
      err.statusCode = 404;
      throw err;
    }
    if (data.type_remorque !== undefined) r.setTypeRemorque(data.type_remorque);
    if (data.plaque_immatriculation !== undefined) r.setPlaque(data.plaque_immatriculation);
    if (data.capacite_tonnes !== undefined) r.setCapaciteTonnes(data.capacite_tonnes);
    await r.save();
    return r.toSafeObject();
  }

  async list(entrepriseId) {
    const items = await Remorque.where('entreprise_id', '=', entrepriseId);
    return items.map(i => i.toSafeObject());
  }

  async get(id, entrepriseId) {
    const r = await Remorque.getFromId(id);
    if (!r || r.getEntrepriseId() !== entrepriseId) {
      const err = new Error('Remorque introuvable');
      err.statusCode = 404;
      throw err;
    }
    return r.toSafeObject();
  }

  async delete(id, entrepriseId) {
    const r = await Remorque.getFromId(id);
    if (!r || r.getEntrepriseId() !== entrepriseId) {
      const err = new Error('Remorque introuvable');
      err.statusCode = 404;
      throw err;
    }
    await r.delete();
    return { message: 'Remorque supprimée' };
  }
}

module.exports = new RemorqueService();
