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

-- ******************************************************
-- 3. Table : offre_fret (Les transactions)
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