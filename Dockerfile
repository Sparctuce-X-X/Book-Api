FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste de l'application
COPY . .

# Créer le dossier logs
RUN mkdir -p logs

# Exposer le port
EXPOSE 4000

# Variable d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=4000

# Commande de démarrage
CMD ["npm", "start"]

