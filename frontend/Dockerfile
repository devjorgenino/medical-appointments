FROM node:22-alpine

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto usado por Vite
EXPOSE 5173

# Asegurar que los binarios locales estén disponibles en PATH
ENV PATH="./node_modules/.bin:$PATH"

# Comando por defecto: iniciar Vite en modo desarrollo
CMD ["pnpm", "dev"]
