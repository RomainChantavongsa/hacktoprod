# Utiliser une image Node.js
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances (y compris nodemon)
# Assurez-vous que nodemon est dans vos devDependencies
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port de l'API
EXPOSE 3001

# Commande pour lancer l'application en mode dev (ajustez "dev" selon votre package.json)
CMD ["npm", "run", "dev"]