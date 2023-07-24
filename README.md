# Cineflix App - Catálogo Digital de Filmes e Séries

## Descrição do Projeto

O Cineflix App é um catálogo digital de filmes e séries desenvolvido em Angular e empacotado em um container Docker. O objetivo principal do projeto é fornecer uma plataforma onde os usuários possam visualizar e explorar uma vasta coleção de filmes e séries previamente cadastrados por meio de uma API.

A ideia para o desenvolvimento do Cineflix App surgiu quando iniciei meus estudos em frontend e criei um clone do Netflix utilizando HTML e CSS. Ao completar o modelo frontend, que considero a parte mais desafiadora, o foco se voltou para a criação da API e, posteriormente, a adaptação do código para Angular.

## Funcionalidades

- Visualizar a lista completa de filmes e séries cadastrados previamente pela API.
- Pesquisar por filmes e séries específicos através de um mecanismo de busca integrado.
- Detalhes de filmes e séries, incluindo sinopse, classificação, gênero, entre outras informações relevantes.
- Opção para adicionar filmes e séries à lista de favoritos atraves de um mecanismo de avaliação.

## Tecnologias Utilizadas

- Angular: Utilizado para desenvolver o frontend do aplicativo, proporcionando uma estrutura robusta e componentizada para a criação das páginas e funcionalidades.
- Docker: Utilizado para empacotar o aplicativo em um container, permitindo uma implantação fácil e portátil em diferentes ambientes.
- API (Backend): Desenvolvida em outro projeto

## Como Executar o Projeto

Para executar o Cineflix App localmente, siga as etapas abaixo:

1. Certifique-se de ter o Docker instalado em seu sistema.
2. Clone este repositório em sua máquina local:
``` 
git clone https://github.com/Lexleon-Oliver/CineflixApp.git
```
3. Navegue até o diretório raiz do projeto: 
``` 
cd CineflixApp
```
4. Instale as dependências do projeto: 
``` 
npm install
```
5. Construa o projeto: 
``` 
ng build
```
6. Construa a imagem Docker usando o comando docker build. O comando deve ter a seguinte estrutura: 
``` 
docker build -t nome_da_sua_imagem:tag .
``` 
7. Execute o contêiner a partir da imagem criada usando o comando docker run. Por exemplo: 
``` 
docker run -d -p 3000:80 nome_da_sua_imagem:tag
``` 
8. O aplicativo estará acessível em seu navegador em: 
``` 
http://localhost:3000
``` 
 (ou outra porta definida no comando acima).

## Contribuição

Contribuições são bem-vindas! Caso queira colaborar com o projeto, sinta-se à vontade para abrir um Pull Request explicando suas alterações.

## Aviso Legal

O Cineflix App é um projeto de estudos e não possui qualquer associação oficial com a marca Netflix. Todos os dados de filmes e séries são fictícios e utilizados apenas para fins educacionais.
