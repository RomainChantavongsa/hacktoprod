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
-- 2. Table : donneurs_ordre
-- ******************************************************
CREATE TABLE IF NOT EXISTS donneurs_ordre (
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
CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Mot de passe hashé
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255),
    role VARCHAR(50) NOT NULL, -- 'admin', 'transporteur', 'donneur_ordre'
    
    -- Clé étrangère vers la table transporteur (optionnelle)
    transporteur_id INT,
    FOREIGN KEY (transporteur_id) REFERENCES transporteur(id) ON DELETE SET NULL,

    -- Clé étrangère vers la table donneurs_ordre (optionnelle)
    donneur_ordre_id INT,
    FOREIGN KEY (donneur_ordre_id) REFERENCES donneurs_ordre(id) ON DELETE SET NULL,

    -- Dates de gestion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Contrainte : Si role = 'transporteur', transporteur_id doit être rempli
    -- Si role = 'donneur_ordre', donneur_ordre_id doit être rempli
    -- Si role = 'admin', les deux peuvent être NULL
    CHECK (
        (role = 'admin') OR
        (role = 'transporteur' AND transporteur_id IS NOT NULL AND donneur_ordre_id IS NULL) OR
        (role = 'donneur_ordre' AND donneur_ordre_id IS NOT NULL AND transporteur_id IS NULL)
    )
);