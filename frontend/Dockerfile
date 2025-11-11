# Utiliser une image Node.js
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json
COPY package.json ./

# Installer les dépendances avec npm
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port Vite (5173)
EXPOSE 5173

# Commande pour lancer l'application en mode dev avec host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]