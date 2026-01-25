# Usa immagine Node LTS
FROM node:20-alpine

WORKDIR /app

# Copia package.json e installa le dipendenze
COPY package.json package-lock.json* ./
RUN npm install

# Copia il resto dei file
COPY . .

# Espone la porta di default di Vite
EXPOSE 5173

# Avvia il server di sviluppo esposto sulla rete (flag --host)
CMD ["npm", "run", "dev", "--", "--host"]