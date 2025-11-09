const Entreprise = require('../models/Entreprise');

/**
 * Service pour gérer la logique métier des entreprises
 */
class EntrepriseService {
  /**
   * Créer une nouvelle entreprise
   */
  async createEntreprise(data) {
    const entreprise = Entreprise.create();
    
    // Champs obligatoires
    entreprise.setNomEntreprise(data.nom_entreprise);
    entreprise.setTypeEntreprise(data.type_entreprise);
    entreprise.setEmailContact(data.email_contact);
    
    // Définir si c'est un particulier
    if (data.est_particulier !== undefined) {
      entreprise.setEstParticulier(data.est_particulier);
    }
    
    // Champs optionnels
    if (data.siret) entreprise.setSiret(data.siret);
    if (data.tva) entreprise.setTva(data.tva);
    if (data.registre_commerce) entreprise.setRegistreCommerce(data.registre_commerce);
    if (data.telephone) entreprise.setTelephone(data.telephone);
    if (data.adresse_siege) entreprise.setAdresseSiege(data.adresse_siege);
    if (data.complement_adresse) entreprise.setComplementAdresse(data.complement_adresse);
    if (data.code_postal) entreprise.setCodePostal(data.code_postal);
    if (data.ville) entreprise.setVille(data.ville);
    if (data.pays) entreprise.setPays(data.pays);
    if (data.logo_url) entreprise.setLogoUrl(data.logo_url);
    
    // Champs spécifiques transporteur
    if (data.type_entreprise === 'transporteur') {
      if (data.type_structure) entreprise.setTypeStructure(data.type_structure);
      if (data.capacite_max_tonnes) entreprise.setCapaciteMaxTonnes(data.capacite_max_tonnes);
      if (data.digitalisation_active !== undefined) entreprise.setDigitalisationActive(data.digitalisation_active);
    }
    
    // Champs spécifiques donneur d'ordre
    if (data.type_entreprise === 'donneur_ordre') {
      if (data.type_acteur) entreprise.setTypeActeur(data.type_acteur);
      if (data.frequence_besoin) entreprise.setFrequenceBesoin(data.frequence_besoin);
    }
    
    await entreprise.save();
    return entreprise.toFullObject();
  }

  /**
   * Récupérer toutes les entreprises
   */
  async getAllEntreprises(type = null) {
    const entreprises = await Entreprise.getAll();
    
    // Filtrer par type si spécifié
    const filtered = type 
      ? entreprises.filter(e => e.getTypeEntreprise() === type)
      : entreprises;
    
    return filtered.map(e => e.toSafeObject());
  }

  /**
   * Récupérer une entreprise par ID
   */
  async getEntrepriseById(id) {
    const entreprise = await Entreprise.getFromId(id);
    
    if (!entreprise) {
      const error = new Error('Entreprise non trouvée');
      error.statusCode = 404;
      throw error;
    }
    
    return entreprise.toFullObject();
  }

  /**
   * Mettre à jour une entreprise
   */
  async updateEntreprise(id, data) {
    const entreprise = await Entreprise.getFromId(id);
    
    if (!entreprise) {
      const error = new Error('Entreprise non trouvée');
      error.statusCode = 404;
      throw error;
    }
    
    // Mettre à jour les champs
    if (data.nom_entreprise) entreprise.setNomEntreprise(data.nom_entreprise);
    if (data.est_particulier !== undefined) entreprise.setEstParticulier(data.est_particulier);
    if (data.siret) entreprise.setSiret(data.siret);
    if (data.tva) entreprise.setTva(data.tva);
    if (data.registre_commerce) entreprise.setRegistreCommerce(data.registre_commerce);
    if (data.email_contact) entreprise.setEmailContact(data.email_contact);
    if (data.telephone) entreprise.setTelephone(data.telephone);
    if (data.adresse_siege) entreprise.setAdresseSiege(data.adresse_siege);
    if (data.complement_adresse) entreprise.setComplementAdresse(data.complement_adresse);
    if (data.code_postal) entreprise.setCodePostal(data.code_postal);
    if (data.ville) entreprise.setVille(data.ville);
    if (data.pays) entreprise.setPays(data.pays);
    if (data.logo_url) entreprise.setLogoUrl(data.logo_url);
    
    // Champs spécifiques selon le type
    if (entreprise.isTransporteur()) {
      if (data.type_structure !== undefined) entreprise.setTypeStructure(data.type_structure);
      if (data.capacite_max_tonnes !== undefined) entreprise.setCapaciteMaxTonnes(
        data.capacite_max_tonnes === null ? null : parseFloat(data.capacite_max_tonnes)
      );
      if (data.digitalisation_active !== undefined) entreprise.setDigitalisationActive(Boolean(data.digitalisation_active));
      if (data.nombre_vehicules !== undefined) entreprise.setNombreVehicules(
        data.nombre_vehicules === null ? null : parseInt(data.nombre_vehicules, 10)
      );
      if (data.types_vehicules !== undefined) entreprise.setTypesVehicules(data.types_vehicules);
      if (data.zones_intervention !== undefined) entreprise.setZonesIntervention(data.zones_intervention);
      if (data.rayon_action_km !== undefined) entreprise.setRayonActionKm(
        data.rayon_action_km === null ? null : parseInt(data.rayon_action_km, 10)
      );
      if (data.licence_transport !== undefined) entreprise.setLicenceTransport(data.licence_transport);
      if (data.assurance_marchandises !== undefined) entreprise.setAssuranceMarchandises(data.assurance_marchandises);
      if (data.numero_assurance !== undefined) entreprise.setNumeroAssurance(data.numero_assurance);
      if (data.date_expiration_assurance !== undefined) entreprise.setDateExpirationAssurance(data.date_expiration_assurance);
      if (data.certifications !== undefined) entreprise.setCertifications(data.certifications);
      if (data.transport_frigorifique !== undefined) entreprise.setTransportFrigorifique(Boolean(data.transport_frigorifique));
      if (data.transport_express !== undefined) entreprise.setTransportExpress(Boolean(data.transport_express));
      if (data.transport_volumineux !== undefined) entreprise.setTransportVolumineux(Boolean(data.transport_volumineux));
      if (data.transport_dangereuses !== undefined) entreprise.setTransportDangereuses(Boolean(data.transport_dangereuses));
      if (data.transport_international !== undefined) entreprise.setTransportInternational(Boolean(data.transport_international));
      if (data.hayon_elevateur !== undefined) entreprise.setHayonElevateur(Boolean(data.hayon_elevateur));
      if (data.gerbeur !== undefined) entreprise.setGerbeur(Boolean(data.gerbeur));
      if (data.transpalette !== undefined) entreprise.setTranspalette(Boolean(data.transpalette));
    } else if (entreprise.isDonneurOrdre()) {
      if (data.type_acteur !== undefined) entreprise.setTypeActeur(data.type_acteur);
      if (data.frequence_besoin !== undefined) entreprise.setFrequenceBesoin(data.frequence_besoin);
    }
    
    await entreprise.save();
    return entreprise.toFullObject();
  }

  /**
   * Supprimer une entreprise
   */
  async deleteEntreprise(id) {
    const entreprise = await Entreprise.getFromId(id);
    
    if (!entreprise) {
      const error = new Error('Entreprise non trouvée');
      error.statusCode = 404;
      throw error;
    }
    
    await entreprise.delete();
    return { message: 'Entreprise supprimée avec succès' };
  }
}

module.exports = new EntrepriseService();
