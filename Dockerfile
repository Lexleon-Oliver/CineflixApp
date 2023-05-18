# Use a imagem oficial do Nginx como base
FROM nginx:latest

# Copie os arquivos estáticos do aplicativo Angular para o diretório de conteúdo do Nginx
COPY dist/instituto-gaiia /usr/share/nginx/html

# Copie o arquivo de configuração personalizado do Nginx para o contêiner
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponha a porta 80 para o host
EXPOSE 80

