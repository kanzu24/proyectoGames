# Frontend Dockerfile - Multi-stage build

# Etapa 1: Construcción
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación Angular
RUN npm run build --configuration=production

# Etapa 2: Servidor
FROM nginx:alpine

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/dist/games/browser /usr/share/nginx/html

# Exponer el puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]