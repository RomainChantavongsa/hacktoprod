/**
 * Middleware de validation pour les offres de fret
 */

/**
 * Valide les données de création d'une offre de fret
 */
const validateCreateOffreFret = (req, res, next) => {
  const {
    donneur_ordre_id,
    poids_marchandise_kg,
    type_marchandise,
    adresse_chargement,
    ville_chargement,
    code_postal_chargement,
    adresse_livraison,
    ville_livraison,
    code_postal_livraison,
    date_chargement_prevue
  } = req.body;
  
  const errors = [];

  if (!donneur_ordre_id) {
    errors.push('L\'ID du donneur d\'ordre est requis');
  }

  if (!poids_marchandise_kg || poids_marchandise_kg <= 0) {
    errors.push('Le poids de la marchandise doit être supérieur à 0');
  }

  if (!type_marchandise || type_marchandise.trim() === '') {
    errors.push('Le type de marchandise est requis');
  }

  if (!adresse_chargement || adresse_chargement.trim() === '') {
    errors.push('L\'adresse de chargement est requise');
  }

  if (!ville_chargement || ville_chargement.trim() === '') {
    errors.push('La ville de chargement est requise');
  }

  if (!code_postal_chargement || code_postal_chargement.trim() === '') {
    errors.push('Le code postal de chargement est requis');
  }

  if (!adresse_livraison || adresse_livraison.trim() === '') {
    errors.push('L\'adresse de livraison est requise');
  }

  if (!ville_livraison || ville_livraison.trim() === '') {
    errors.push('La ville de livraison est requise');
  }

  if (!code_postal_livraison || code_postal_livraison.trim() === '') {
    errors.push('Le code postal de livraison est requis');
  }

  if (!date_chargement_prevue) {
    errors.push('La date de chargement prévue est requise');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors
    });
  }

  next();
};

/**
 * Valide les données de mise à jour d'une offre de fret
 */
const validateUpdateOffreFret = (req, res, next) => {
  const { poids_marchandise_kg, statut_offre } = req.body;
  const errors = [];

  if (poids_marchandise_kg !== undefined && poids_marchandise_kg <= 0) {
    errors.push('Le poids de la marchandise doit être supérieur à 0');
  }

  if (statut_offre && !['Publiee', 'Attribuee', 'En_Cours', 'Completee', 'Annulee'].includes(statut_offre)) {
    errors.push('Le statut doit être: Publiee, Attribuee, En_Cours, Completee ou Annulee');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors
    });
  }

  next();
};

/**
 * Valide l'attribution d'un transporteur
 */
const validateAttribuerTransporteur = (req, res, next) => {
  const { transporteur_id } = req.body;
  
  if (!transporteur_id) {
    return res.status(400).json({
      success: false,
      message: 'L\'ID du transporteur est requis'
    });
  }

  next();
};

module.exports = {
  validateCreateOffreFret,
  validateUpdateOffreFret,
  validateAttribuerTransporteur
};
