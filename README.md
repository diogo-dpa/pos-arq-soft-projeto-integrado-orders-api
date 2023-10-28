# Pós Graduação de Arquitetura de Software Distribuído - Disciplina Projeto Integrado

## 🎨 Sobre o projeto - Order API

Trata-se de uma API REST, que faz parte de uma estrutura de microsserviços e é consumida pelo [Partner Poral WEB](<[https://github.com/diogo-dpa/pos-arq-soft-projeto-integrado-orders-api](https://github.com/diogo-dpa/pos-arq-soft-projeto-integrado-partner-portal-web)>), utilizando um banco de dado NoSQL para armazenamento. Seu objetivo é realizar a gestão dos pedidos para a Prova de Conceito proposta pelo trabalho.

A responsabilidade desse repositório é atribuída ao microsserviço destinado a Pedidos do projeto final. Logo, tem-se as seguintes rotas:

1. POST /orders
2. GET /orders
3. GET /orders/:batchId
4. PUT /orders/:batchId
5. POST /orders/complete/:batchId

## 🔑 Tecnologias Utilizadas

No projeto utilizou-se:

- **Typescript** para escrita do código
- **Express** como biblioteca para criação da API
- **Mongoose** como conexão para criar e manipular o banco de dados por meio de queries pré processadas
- **MongoDB** como banco de dados não relacional
- **Cloud AMQP** como ferramenta gestão de eventos

## 🕹 Como rodar o projeto

Primeiramente, no terminal instale as dependências do projeto com

```
npm install
```

Por último, escreva

```
npm run dev
```

para iniciar a aplicação.
