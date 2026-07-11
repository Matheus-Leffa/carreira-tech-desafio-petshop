# PetVibe

## Objetivo

A PetVibe é uma aplicação Full Stack para apresentação de serviços pet, com landing page institucional, formulário de contato integrado a uma API REST e persistência dos dados em PostgreSQL.

## Arquitetura

O projeto foi organizado em duas camadas principais:

- Frontend: responsável pela interface da landing page, responsividade, validações visuais e envio do formulário.
- Backend: responsável pela API REST, conexão com PostgreSQL, modelagem dos dados e tratamento das requisições.

### Estrutura de Pastas

```text
petvibe/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── icons/
│   └── images/
├── backend/
│   ├── app.js
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── contatoController.js
│   ├── database/
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Contato.js
│   ├── routes/
│   │   └── contatoRoutes.js
│   ├── .env.example
│   ├── node_modules/
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## Tecnologias

### Frontend

- HTML5
- CSS3
- JavaScript
- Lucide Icons
- Google Fonts

### Backend

- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- dotenv
- CORS

## Como Instalar

1. Baixe ou clone o projeto.
2. Abra a pasta raiz no VS Code ou no seu editor preferido.
3. Instale as dependências do backend:

```bash
cd backend
npm install
```

## Como Configurar o PostgreSQL

1. Crie um banco de dados chamado `petvibe` no PostgreSQL.
2. Verifique se o serviço do PostgreSQL está ativo na porta `5432`.
3. Confirme o usuário e a senha utilizados no pgAdmin.
4. Se necessário, ajuste o nome do banco, usuário ou senha no arquivo `.env` do backend.

## Arquivo .env

Crie um arquivo `.env` dentro da pasta `backend` com base em `.env.example`.

Exemplo:

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=petvibe
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_DIALECT=postgres
CORS_ORIGIN=http://localhost:5500
```

## Como Iniciar o Backend

1. Acesse a pasta do backend:

```bash
cd backend
```

2. Inicie em modo desenvolvimento:

```bash
npm run dev
```

3. Para iniciar em modo produção/local simples:

```bash
npm start
```

## Como Iniciar o Frontend

O frontend é estático e pode ser aberto de duas formas:

1. Abrindo o arquivo `index.html` diretamente no navegador.
2. Usando a extensão Live Server no VS Code para servir a aplicação localmente.

Se usar Live Server, mantenha o frontend disponível em uma porta como `5500` para que o CORS funcione corretamente com o backend.

## Endpoints Disponíveis

### API de Contato

- `POST /api/contato` - Cria um novo contato com os dados do formulário.
- `GET /api/contato` - Lista todos os contatos cadastrados, ordenados do mais recente para o mais antigo.

### Observação

A API retorna respostas padronizadas no formato:

```json
{
  "success": true,
  "message": "Mensagem da operação",
  "data": {}
}
```

## Funcionalidades

- Navegação entre seções da página
- Menu responsivo para dispositivos móveis
- Seção institucional com apresentação da marca
- Lista de serviços e planos de assinatura
- Depoimentos com controles de navegação
- Formulário de contato com envio para a API
- Feedback visual para erros e sucesso

## Etapas do Desenvolvimento

1. Estruturação inicial da página com HTML semântico e organização das seções principais.
2. Aplicação do layout visual com CSS, incluindo tipografia, cores, cards e responsividade.
3. Implementação das interações com JavaScript, como menu mobile, carrossel e navegação ativa.
4. Integração do formulário com a API REST e persistência dos dados no PostgreSQL.
5. Ajustes de acessibilidade, tratamento de erros e refinamento do comportamento em telas menores.

## Responsividade

O layout foi desenvolvido para se adaptar a diferentes tamanhos de tela, mantendo boa usabilidade em desktop, tablet e celular. Os blocos são reorganizados conforme a largura disponível, sem comprometer a leitura nem a navegação.

## Autor

Projeto desenvolvido por Matheus Santos Leffa, desenvolvedor fullstack e aluno em Análise e Desenvolvimento de Sistemas.
