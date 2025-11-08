# Utiliser une image Node.js
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json ET yarn.lock
COPY package.json ./
COPY yarn.lock ./

# Installer les dépendances avec Yarn
RUN yarn install

# Copier le reste du code source
COPY . .

# Exposer le port que nous avons défini dans package.json
EXPOSE 3000

# Commande pour lancer l'application en mode dev
CMD ["yarn", "dev"]