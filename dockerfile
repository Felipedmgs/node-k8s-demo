FROM node:20-alpine

# diretório de trabalho dentro do container
WORKDIR /usr/src/app

# copiar package.json / package-lock
COPY package*.json ./

# instalar dependências em modo produção
RUN npm ci --only=production || npm install --only=production

# copiar o restante do código
COPY . .

# expor a porta do app
EXPOSE 3000

# comando padrão
CMD ["npm", "start"]
