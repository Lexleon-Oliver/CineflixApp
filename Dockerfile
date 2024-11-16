# Use a imagem base do Node.js
FROM node:20-alpine

# Defina o diretório de trabalho para a aplicação Angular
WORKDIR /app

# Copie os arquivos de dependência do pacote para o contêiner
COPY package*.json ./

# Instale as dependências do pacote
RUN npm install

# Copie todos os arquivos da aplicação Angular para o contêiner
COPY . .

# Execute o comando para construir a aplicação Angular
RUN npm run build

# Use a imagem Nginx como imagem base
FROM nginx:alpine

# Copie os arquivos da build da aplicação Angular para o diretório de distribuição do Nginx
COPY --from=0 /app/dist/Netflix /usr/share/nginx/html

# Copie o arquivo de configuração do Nginx para o contêiner
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie o arquivo de autenticação para a pasta .well-known/pki-validation/
#COPY well-known /usr/share/nginx/html/.well-known

# Exponha a porta 80
EXPOSE 80
