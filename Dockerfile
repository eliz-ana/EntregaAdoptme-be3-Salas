
FROM node:20-alpine

WORKDIR /app

# 3. Copio package.json y package-lock.json para instalar deps
COPY package*.json ./

# 4. Instalo dependencias 
RUN npm install

# 5. Copio el resto del código
COPY . .

# 6. Variables de entorno
ENV NODE_ENV=production
ENV PORT=8080

# 7. Documentar el puerto que usa la app
EXPOSE 8080

# 8. Comando por defecto al arrancar el contenedor
CMD ["npm", "start"]
