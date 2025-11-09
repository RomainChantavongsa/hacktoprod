-- ******************************************************
-- 1. Table : entreprise (Unifié pour transporteurs et donneurs d'ordre)
-- ******************************************************
CREATE TABLE IF NOT EXISTS entreprise (
    id SERIAL PRIMARY KEY,
    nom_entreprise VARCHAR(255) NOT NULL,
    type_entreprise VARCHAR(50) NOT NULL, -- 'transporteur' ou 'donneur_ordre'
    est_particulier BOOLEAN DEFAULT FALSE, -- TRUE si particulier, FALSE si entreprise
    
    -- Informations légales (optionnelles pour particuliers)
    siret VARCHAR(255) UNIQUE,
    tva VARCHAR(255),
    registre_commerce VARCHAR(255),
    
    -- Contact entreprise
    email_contact VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(255),
    
    -- Adresse du siège
    adresse_siege VARCHAR(255),
    complement_adresse VARCHAR(255),
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'France',
    
    -- Branding
    logo_url VARCHAR(500),
    
    -- Champs spécifiques transporteur
    type_structure VARCHAR(255), -- 'Individuel', 'SARL', 'SAS', etc.
    capacite_max_tonnes DECIMAL(10, 2),
    digitalisation_active BOOLEAN DEFAULT TRUE,
    
    -- Flotte de véhicules
    nombre_vehicules INT DEFAULT 0,
    types_vehicules TEXT[], -- Array: ['Fourgon', 'Camion 20T', 'Semi-remorque']
    
    -- Zones géographiques
    zones_intervention TEXT[], -- Array: ['Île-de-France', 'National', 'International']
    rayon_action_km INT, -- Rayon d'action en km
    
    -- Certifications & assurances
    licence_transport VARCHAR(255), -- Numéro de licence transport
    assurance_marchandises VARCHAR(255), -- Nom de l'assurance
    numero_assurance VARCHAR(255),
    date_expiration_assurance DATE,
    certifications TEXT[], -- Array: ['ISO 9001', 'CMR', 'ADR']
    
    -- Spécialités transport
    transport_frigorifique BOOLEAN DEFAULT FALSE,
    transport_express BOOLEAN DEFAULT FALSE,
    transport_volumineux BOOLEAN DEFAULT FALSE,
    transport_dangereuses BOOLEAN DEFAULT FALSE, -- Matières dangereuses ADR
    transport_international BOOLEAN DEFAULT FALSE,
    
    -- Équipements
    hayon_elevateur BOOLEAN DEFAULT FALSE,
    gerbeur BOOLEAN DEFAULT FALSE,
    transpalette BOOLEAN DEFAULT FALSE,
    
    -- Champs spécifiques donneur d'ordre
    type_acteur VARCHAR(255), -- 'Entreprise', 'Industrie', 'Commerce', etc.
    frequence_besoin VARCHAR(255), -- 'Quotidien', 'Hebdomadaire', 'Mensuel', 'Ponctuel'
    
    -- Dates
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

-- ******************************************************
-- 2. Table : utilisateur
-- ******************************************************
CREATE TABLE IF NOT EXISTS utilisateur (
    id SERIAL PRIMARY KEY,
    
    -- Identifiants personnels
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Mot de passe hashé
    email VARCHAR(255) UNIQUE NOT NULL, -- Email personnel
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255),
    telephone VARCHAR(255), -- Téléphone personnel
    
    -- Lien avec l'entreprise
    entreprise_id INT NOT NULL,
    FOREIGN KEY (entreprise_id) REFERENCES entreprise(id) ON DELETE CASCADE,
    
    -- Rôle dans l'entreprise
    role_entreprise VARCHAR(50) NOT NULL DEFAULT 'employe', -- 'admin', 'employe', 'viewer'
    
    -- Rôle plateforme (admin global)
    is_admin BOOLEAN DEFAULT FALSE,
    
    -- Dates
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

-- ******************************************************
-- 3. Table : document (Documents des entreprises)
-- ******************************************************
CREATE TABLE IF NOT EXISTS document (
    id SERIAL PRIMARY KEY,
    
    -- Lien avec l'entreprise
    entreprise_id INT NOT NULL,
    FOREIGN KEY (entreprise_id) REFERENCES entreprise(id) ON DELETE CASCADE,
    
    -- Informations du fichier
    nom_fichier_original VARCHAR(255) NOT NULL, -- Nom du fichier tel qu'uploadé par l'utilisateur
    nom_fichier_stockage VARCHAR(255) NOT NULL UNIQUE, -- Nom unique généré pour le stockage (évite les conflits)
    chemin_stockage VARCHAR(500) NOT NULL, -- Chemin complet où le fichier est stocké
    
    -- Métadonnées du document
    type_document VARCHAR(100) NOT NULL, -- 'Licence de transport', 'Assurance', 'Kbis', 'Carte grise', 'Permis', 'Facture', 'CMR', 'Autre'
    categorie VARCHAR(100), -- 'Legal', 'Assurance', 'Vehicule', 'Conducteur', 'Commercial', 'Autre'
    description TEXT, -- Description optionnelle du document
    
    -- Informations techniques du fichier
    extension VARCHAR(10) NOT NULL, -- '.pdf', '.jpg', '.png', '.docx', etc.
    taille_octets BIGINT NOT NULL, -- Taille du fichier en octets
    mime_type VARCHAR(100), -- 'application/pdf', 'image/jpeg', etc.
    
    -- Gestion des versions
    version INT DEFAULT 1, -- Numéro de version du document
    document_parent_id INT, -- Référence au document original si c'est une nouvelle version
    FOREIGN KEY (document_parent_id) REFERENCES document(id) ON DELETE SET NULL,
    
    -- Métadonnées de validité
    date_emission DATE, -- Date d'émission du document
    date_expiration DATE, -- Date d'expiration (pour licences, assurances, etc.)
    est_valide BOOLEAN DEFAULT TRUE, -- Si le document est encore valide
    
    -- Utilisateur ayant uploadé le document
    uploade_par INT, -- ID de l'utilisateur qui a uploadé
    FOREIGN KEY (uploade_par) REFERENCES utilisateur(id) ON DELETE SET NULL,
    
    -- Métadonnées de recherche
    tags TEXT[], -- Array de tags pour faciliter la recherche
    
    -- Dates de gestion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_document_entreprise ON document (entreprise_id);
CREATE INDEX IF NOT EXISTS idx_document_type ON document (type_document);
CREATE INDEX IF NOT EXISTS idx_document_categorie ON document (categorie);
CREATE INDEX IF NOT EXISTS idx_document_expiration ON document (date_expiration);
CREATE INDEX IF NOT EXISTS idx_document_parent ON document (document_parent_id);

---

-- ******************************************************
-- 4. Table : vehicule (flotte de l'entreprise)
-- ******************************************************
CREATE TABLE IF NOT EXISTS vehicule (
    id SERIAL PRIMARY KEY,
    entreprise_id INT NOT NULL,
    type_vehicule VARCHAR(100) NOT NULL, -- ex: Fourgon, 12T, Semi, etc.
    plaque_immatriculation VARCHAR(50) UNIQUE NOT NULL,
    conducteur_attitre VARCHAR(255), -- nom du conducteur principal
    capacite_tonnes DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entreprise_id) REFERENCES entreprise(id) ON DELETE CASCADE
);

-- Index utiles
CREATE INDEX IF NOT EXISTS idx_vehicule_entreprise ON vehicule (entreprise_id);

---

-- ******************************************************
-- 5. Table : remorque (rattachée à une entreprise)
-- ******************************************************
CREATE TABLE IF NOT EXISTS remorque (
    id SERIAL PRIMARY KEY,
    entreprise_id INT NOT NULL,
    type_remorque VARCHAR(100) NOT NULL, -- ex: Plateau, Frigo, Tautliner
    plaque_immatriculation VARCHAR(50) UNIQUE NOT NULL,
    capacite_tonnes DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entreprise_id) REFERENCES entreprise(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_remorque_entreprise ON remorque (entreprise_id);

---

-- ******************************************************
-- 6. Table : conducteur (conducteurs de l'entreprise)
-- ******************************************************
CREATE TABLE IF NOT EXISTS conducteur (
    id SERIAL PRIMARY KEY,
    entreprise_id INT NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telephone VARCHAR(20),
    numero_permis VARCHAR(50) NOT NULL,
    date_naissance DATE,
    date_embauche DATE,
    statut VARCHAR(50) DEFAULT 'actif', -- 'actif', 'inactif', 'conge', 'suspendu'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entreprise_id) REFERENCES entreprise(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conducteur_entreprise ON conducteur (entreprise_id);

---

-- ******************************************************
-- 7. Table : offre_fret (Les transactions)
-- ******************************************************
CREATE TABLE IF NOT EXISTS offre_fret (
    id SERIAL PRIMARY KEY,
    
    -- Entreprises impliquées
    entreprise_donneur_ordre_id INT NOT NULL,
    entreprise_transporteur_id INT,
    
    -- Utilisateur qui a créé l'offre
    createur_id INT NOT NULL,
    
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut_offre VARCHAR(50) NOT NULL DEFAULT 'Publiee', -- 'Publiee', 'Attribuee', 'EnCours', 'Completee', 'Annulee'
    
    poids_marchandise_kg DECIMAL(10, 2) NOT NULL,
    volume_m3 DECIMAL(10, 2),
    type_marchandise VARCHAR(100) NOT NULL,
    
    -- Lieux de Chargement
    adresse_chargement VARCHAR(255) NOT NULL,
    ville_chargement VARCHAR(100) NOT NULL,
    code_postal_chargement VARCHAR(10) NOT NULL,
    
    -- Lieux de Livraison
    adresse_livraison VARCHAR(255) NOT NULL,
    ville_livraison VARCHAR(100) NOT NULL,
    code_postal_livraison VARCHAR(10) NOT NULL,
    
    type_vehicule_souhaite VARCHAR(100),
    date_chargement_prevue DATE NOT NULL,
    conditions_speciales VARCHAR(500),
    prix_propose DECIMAL(10, 2),
    
    FOREIGN KEY (entreprise_donneur_ordre_id) REFERENCES entreprise(id) ON DELETE CASCADE,
    FOREIGN KEY (entreprise_transporteur_id) REFERENCES entreprise(id) ON DELETE SET NULL,
    FOREIGN KEY (createur_id) REFERENCES utilisateur(id) ON DELETE SET NULL
);