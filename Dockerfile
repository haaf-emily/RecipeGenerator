# 1. Offizielles Node.js-Image als Basis verwenden
FROM node:18

# 2. Arbeitsverzeichnis setzen
WORKDIR /app

# 3. Package-Dateien kopieren und Abhängigkeiten installieren
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# 4. Applikationscode kopieren
COPY . .

# 5. App starten
CMD ["node", "server.js"]

# 6. Port für den Container freigeben
EXPOSE 8000