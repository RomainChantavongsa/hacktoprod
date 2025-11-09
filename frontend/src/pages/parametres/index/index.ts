// Logique pour la page d'accueil des paramètres
// Structure des modèles backend avec leurs méthodes

export interface ModelMethods {
  instanceMethods: string[]
  staticMethods: string[]
}

export interface ModelsStructure {
  BaseModel: ModelMethods
  Utilisateur: ModelMethods
  DonneurOrdre: ModelMethods
  OffreFret: ModelMethods
  Transporteur: ModelMethods
}

export const parametresIndexLogic = {
  models: {
    BaseModel: {
      instanceMethods: [
        'save()',
        'delete()'
      ],
      staticMethods: [
        'create()',
        'where(column, operator, value)',
        'getFromId(id)',
        'getAll()'
      ]
    },
    Utilisateur: {
      instanceMethods: [
        'getId()',
        'getUsername()',
        'getEmail()',
        'getNom()',
        'getPrenom()',
        'getTelephone()',
        'getRole()',
        'getIsAdmin()',
        'getTransporteurId()',
        'getDonneurOrdreId()',
        'getCreatedAt()',
        'getUpdatedAt()',
        'setUsername(value)',
        'setEmail(value)',
        'setNom(value)',
        'setPrenom(value)',
        'setTelephone(value)',
        'setRole(value)',
        'setIsAdmin(value)',
        'setTransporteurId(value)',
        'setDonneurOrdreId(value)',
        'setPassword(plainPassword)',
        'verifyPassword(plainPassword)',
        'toSafeObject()',
        'toFullObject()'
      ],
      staticMethods: [
        'authenticate(username, password)',
        'findByUsername(username)',
        'findByEmail(email)'
      ]
    },
    DonneurOrdre: {
      instanceMethods: [
        'getId()',
        'getNomEntreprise()',
        'getTypeActeur()',
        'getSiret()',
        'getEmailContact()',
        'getTelephone()',
        'getFrequenceBesoin()',
        'setNomEntreprise(value)',
        'setTypeActeur(value)',
        'setSiret(value)',
        'setEmailContact(value)',
        'setTelephone(value)',
        'setFrequenceBesoin(value)'
      ],
      staticMethods: [
        // Hérite des méthodes statiques de BaseModel
      ]
    },
    OffreFret: {
      instanceMethods: [
        'getId()',
        'getDonneurOrdreId()',
        'getTransporteurAttribueId()',
        'getDatePublication()',
        'getStatutOffre()',
        'getPoidsMarchandiseKg()',
        'getVolumeM3()',
        'getTypeMarchandise()',
        'getAdresseChargement()',
        'getVilleChargement()',
        'getCodePostalChargement()',
        'getAdresseLivraison()',
        'getVilleLivraison()',
        'getCodePostalLivraison()',
        'getTypeVehiculeSouhaite()',
        'getDateChargementPrevue()',
        'getConditionsSpeciales()',
        'getPrixPropose()',
        'setDonneurOrdreId(value)',
        'setTransporteurAttribueId(value)',
        'setDatePublication(value)',
        'setStatutOffre(value)',
        'setPoidsMarchandiseKg(value)',
        'setVolumeM3(value)',
        'setTypeMarchandise(value)',
        'setAdresseChargement(value)',
        'setVilleChargement(value)',
        'setCodePostalChargement(value)',
        'setAdresseLivraison(value)',
        'setVilleLivraison(value)',
        'setCodePostalLivraison(value)',
        'setTypeVehiculeSouhaite(value)',
        'setDateChargementPrevue(value)',
        'setConditionsSpeciales(value)',
        'setPrixPropose(value)',
        'isDisponible()',
        'isAttribuee()',
        'isTerminee()',
        'attribuerTransporteur(transporteurId)',
        'marquerEnCours()',
        'marquerCompletee()',
        'annuler()'
      ],
      staticMethods: [
        'getOffresPubliees()',
        'getOffresByDonneurOrdre(donneurOrdreId)',
        'getOffresByTransporteur(transporteurId)'
      ]
    },
    Transporteur: {
      instanceMethods: [
        'getId()',
        'getNomEntreprise()',
        'getTypeStructure()',
        'getSiret()',
        'getEmailContact()',
        'getTelephone()',
        'getAdresseSiege()',
        'getCapaciteMaxTonnes()',
        'getDigitalisationActive()',
        'setNomEntreprise(value)',
        'setTypeStructure(value)',
        'setSiret(value)',
        'setEmailContact(value)',
        'setTelephone(value)',
        'setAdresseSiege(value)',
        'setCapaciteMaxTonnes(value)',
        'setDigitalisationActive(value)'
      ],
      staticMethods: [
        // Hérite des méthodes statiques de BaseModel
      ]
    }
  } as ModelsStructure
}
