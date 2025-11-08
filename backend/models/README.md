# Modèles de Base de Données

Ce dossier contient tous les modèles (classes) qui interagissent avec la base de données PostgreSQL.

## Structure

```
models/
├── BaseModel.js       # Classe de base avec opérations CRUD
├── Transporteur.js    # Modèle pour la table transporteur
├── DonneurOrdre.js    # Modèle pour la table donneurs_ordre
├── Utilisateur.js     # Modèle pour la table utilisateurs
└── index.js           # Point d'entrée pour importer tous les modèles
```

## Pattern Active Record (comme PHP)

Les modèles utilisent le **pattern Active Record** : vous créez une instance d'objet, modifiez ses propriétés, puis appelez `save()` sans argument, exactement comme en PHP !

### Méthodes d'instance (sur l'objet)

- `save()` - Sauvegarde l'instance (crée ou met à jour automatiquement)
- `delete()` - Supprime l'instance de la base

### Méthodes statiques (sur la classe)

- `Modele.create()` - Crée une nouvelle instance vide (sans sauvegarder)
- `Modele.where(column, operator, value)` - Recherche avec condition
- `Modele.getFromId(id)` - Trouve par ID
- `Modele.getAll()` - Récupère tous les enregistrements

## Utilisation

### Import des modèles

```javascript
const { Transporteur, DonneurOrdre, Utilisateur } = require('./models');
```

### Style PHP - Active Record (RECOMMANDÉ)

#### 1. Créer et sauvegarder comme en PHP

```javascript
// Créer une nouvelle instance (vide ou avec new)
const transporteur = Transporteur.create(); // ou : new Transporteur()

// Utiliser les setters/propriétés
transporteur.nom_entreprise = 'Transport Express';
transporteur.siret = '12345678901234';
transporteur.type_vehicule = 'camion';
transporteur.capacite_max_tonnes = 20;

// Sauvegarder (sans argument, comme $objet->save() en PHP)
await transporteur.save();

console.log('ID créé:', transporteur.id); // L'ID est automatiquement ajouté
```

#### 2. Modifier et sauvegarder

```javascript
// Récupérer un enregistrement
const transporteur = await Transporteur.getFromId(1);

// Modifier les propriétés
transporteur.nom_entreprise = 'Nouveau Nom';
transporteur.capacite_max_tonnes = 30;

// Sauvegarder les modifications
await transporteur.save();
```

#### 3. Supprimer l'instance

```javascript
const transporteur = await Transporteur.getFromId(1);

// Supprimer comme en PHP
await transporteur.delete();
```

### Méthodes statiques de recherche

#### 1. Rechercher par ID - `Modele.getFromId(id)`

```javascript
const transporteur = await Transporteur.getFromId(1);
console.log(transporteur.nom_entreprise);
```

#### 2. Rechercher avec condition - `Modele.where(column, operator, value)`

**Opérateurs supportés:** `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IN`, `NOT IN`

```javascript
// Égalité
const camions = await Transporteur.where('type_vehicule', '=', 'camion');

// Comparaison
const gros = await Transporteur.where('capacite_max_tonnes', '>=', 20);

// LIKE (texte partiel)
const express = await Transporteur.where('nom_entreprise', 'LIKE', '%Express%');

// IN (plusieurs valeurs)
const types = await Transporteur.where('type_vehicule', 'IN', ['camion', 'fourgon']);
```

#### 3. Récupérer tous - `Modele.getAll()`

```javascript
const tous = await Transporteur.getAll();
console.log(`${tous.length} transporteurs trouvés`);
```



### Exemples complets par modèle

#### Transporteur - Style PHP

```javascript
const { Transporteur } = require('./models');

// Créer un nouveau transporteur
const transporteur = Transporteur.create(); // ou : new Transporteur()
transporteur.nom_entreprise = 'LogisExpress';
transporteur.siret = '12345678901234';
transporteur.type_vehicule = 'camion';
transporteur.capacite_max_tonnes = 30;
await transporteur.save(); // Comme en PHP !

console.log('ID:', transporteur.id); // ID automatiquement ajouté

// Récupérer et modifier
const t = await Transporteur.getFromId(1);
t.capacite_max_tonnes = 35;
await t.save(); // Met à jour automatiquement

// Rechercher
const camions = await Transporteur.where('type_vehicule', '=', 'camion');
for (const camion of camions) {
  console.log(camion.nom_entreprise);
}

// Supprimer
await t.delete();
```

#### DonneurOrdre - Style PHP

```javascript
const { DonneurOrdre } = require('./models');

// Créer
const donneur = DonneurOrdre.create();
donneur.nom_entreprise = 'Entreprise ABC';
donneur.siret = '98765432109876';
donneur.type_acteur = 'pme';
donneur.frequence_besoin = 'hebdomadaire';
donneur.volume_moyen_tonnes = 15;
await donneur.save();

// Modifier
donneur.volume_moyen_tonnes = 20;
await donneur.save();

// Rechercher les PME
const pmes = await DonneurOrdre.where('type_acteur', '=', 'pme');

// Tous les donneurs d'ordre
const tous = await DonneurOrdre.getAll();
```

#### Utilisateur - Style PHP

```javascript
const { Utilisateur } = require('./models');

// Créer
const user = Utilisateur.create();
user.email = 'john@example.com';
user.password = 'hashed_password'; // Pensez à hasher !
user.nom = 'Doe';
user.prenom = 'John';
user.role = 'transporteur';
await user.save();

// Trouver par ID
const u = await Utilisateur.getFromId(user.id);
console.log(u.email);

// Modifier
u.prenom = 'Jane';
await u.save();

// Rechercher par rôle
const admins = await Utilisateur.where('role', '=', 'admin');
```

## Variables d'environnement requises

Assurez-vous que `DATABASE_URL` est définie dans votre fichier `.env` :

```
DATABASE_URL=postgres://myuser:mypassword@db:5432/mydatabase
```

## Dépendances

Les modèles utilisent le package suivant :
- `pg` - Client PostgreSQL

Installez-le avec :
```bash
npm install pg
```

## Créer vos propres modèles

Pour créer un nouveau modèle, étendez la classe `BaseModel` :

```javascript
const BaseModel = require('./BaseModel');

class MonModele extends BaseModel {
  constructor() {
    super('ma_table'); // Nom de la table dans la base de données
  }
}

// Export une instance unique (singleton)
module.exports = new MonModele();
```

N'oubliez pas de l'ajouter à `index.js` pour l'export :

```javascript
const MonModele = require('./MonModele');

module.exports = {
  BaseModel,
  Transporteur,
  DonneurOrdre,
  Utilisateur,
  MonModele // Ajoutez votre nouveau modèle ici
};
```

## API Complète

### Méthodes d'instance (appelées sur un objet)

#### `save()`
Sauvegarde l'instance actuelle. Si elle a un `id`, met à jour l'enregistrement existant, sinon en crée un nouveau.

```javascript
const t = new Transporteur();
t.nom = 'Test';
await t.save(); // Crée

t.nom = 'Test modifié';
await t.save(); // Met à jour
```

#### `delete()`
Supprime l'instance de la base de données.

```javascript
const t = await Transporteur.getFromId(1);
await t.delete();
```

### Méthodes statiques (appelées sur la classe)

#### `Modele.create()`
Crée une nouvelle instance vide (sans la sauvegarder). Alternative à `new Modele()`.

```javascript
const t = Transporteur.create();
t.nom_entreprise = 'Test';
await t.save();
```

#### `Modele.getFromId(id)`
Trouve un enregistrement par ID et retourne une instance ou null.

```javascript
const t = await Transporteur.getFromId(1);
```

#### `Modele.getAll()`
Retourne toutes les instances de la table.

```javascript
const tous = await Transporteur.getAll();
```

#### `Modele.where(column, operator, value)`
Recherche selon une condition. Retourne un tableau d'instances.

- `column` : nom de la colonne
- `operator` : `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IN`, `NOT IN`
- `value` : valeur (tableau pour `IN` et `NOT IN`)

```javascript
const results = await Transporteur.where('capacite_max_tonnes', '>=', 20);
```


