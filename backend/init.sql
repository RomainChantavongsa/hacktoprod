-- ******************************************************
-- 1. Table : transporteur
-- ******************************************************
CREATE TABLE IF NOT EXISTS transporteur (
    id SERIAL PRIMARY KEY, -- Utilisation de SERIAL
    nom_entreprise VARCHAR(255) NOT NULL,
    type_structure VARCHAR(255) NOT NULL,
    siret VARCHAR(255) UNIQUE,
    email_contact VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(255),
    adresse_siege VARCHAR(255),
    capacite_max_tonnes DECIMAL(10, 2),
    digitalisation_active BOOLEAN DEFAULT TRUE
);

---

-- ******************************************************
-- 2. Table : donneur_ordre
-- ******************************************************
CREATE TABLE IF NOT EXISTS donneur_ordre (
    id SERIAL PRIMARY KEY, -- Utilisation de SERIAL
    nom_entreprise VARCHAR(255) NOT NULL,
    type_acteur VARCHAR(255) NOT NULL,
    siret VARCHAR(255) UNIQUE,
    email_contact VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(255),
    frequence_besoin VARCHAR(255)
);

---

-- ******************************************************
-- 3. Table : utilisateurs (renommée depuis acteurs_plateforme)
-- ******************************************************
CREATE TABLE IF NOT EXISTS utilisateur (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Mot de passe hashé
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255),
    telephone VARCHAR(255),
    role VARCHAR(50) NOT NULL, -- 'transporteur', 'donneur_ordre'
    is_admin BOOLEAN DEFAULT FALSE, -- Flag administrateur (indépendant de l'inscription)
    
    -- Clé étrangère vers la table transporteur (optionnelle)
    transporteur_id INT,
    FOREIGN KEY (transporteur_id) REFERENCES transporteur(id) ON DELETE SET NULL,

    -- Clé étrangère vers la table donneur_ordre (optionnelle)
    donneur_ordre_id INT,
    FOREIGN KEY (donneur_ordre_id) REFERENCES donneur_ordre(id) ON DELETE SET NULL,

    -- Dates de gestion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Contrainte : Si role = 'transporteur', transporteur_id doit être rempli
    -- Si role = 'donneur_ordre', donneur_ordre_id doit être rempli
    CHECK (
        (role = 'transporteur' AND transporteur_id IS NOT NULL AND donneur_ordre_id IS NULL) OR
        (role = 'donneur_ordre' AND donneur_ordre_id IS NOT NULL AND transporteur_id IS NULL)
    )
);

-- ******************************************************
-- 4. Table : offre_fret (Les transactions)
-- ******************************************************
CREATE TABLE IF NOT EXISTS offre_fret (
    id SERIAL PRIMARY KEY,
    donneur_ordre_id INT NOT NULL,
    transporteur_attribue_id INT,
    
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut_offre VARCHAR(50) NOT NULL DEFAULT 'Publiee', -- 'Publiee', 'Attribuee', 'EnCours', 'Completee', 'Annulee'
    
    poids_marchandise_kg DECIMAL(10, 2) NOT NULL,
    volume_m3 DECIMAL(10, 2),
    type_marchandise VARCHAR(100) NOT NULL,
    
    -- Lieux de Chargement
    adresse_chargement VARCHAR(255) NOT NULL,
    ville_chargement VARCHAR(100) NOT NULL,
    code_postal_chargement VARCHAR(10) NOT NULL, -- AJOUT
    
    -- Lieux de Livraison
    adresse_livraison VARCHAR(255) NOT NULL,
    ville_livraison VARCHAR(100) NOT NULL,
    code_postal_livraison VARCHAR(10) NOT NULL, -- AJOUT
    
    type_vehicule_souhaite VARCHAR(100),
    date_chargement_prevue DATE NOT NULL,
    conditions_speciales VARCHAR(500),
    prix_propose DECIMAL(10, 2),
    
    FOREIGN KEY (donneur_ordre_id) REFERENCES donneur_ordre(id),
    FOREIGN KEY (transporteur_attribue_id) REFERENCES transporteur(id)
);