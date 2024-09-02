# Implementação Técnica

Este projeto implementa parte do sistema de bilheteria para um cassino, baseado na proposta de arquitetura da [parte 01](https://github.com/edsonjuniordev/dfcom-challenge/tree/main/part-01). A solução foi desenvolvida com foco em escalabilidade, desempenho e resiliência.

## 🚀 Funcionalidades

- Login
- Cadastro de eventos
- Listagem de eventos
- Compra de ingressos

## 🛠️ Tecnologias utilizadas

- Nodejs/Nestjs
- MongoDB
- Kafka
- Docker/Docker compose

## ⚙️ Pré requisitos

Antes de rodar o projeto é necessário ter as seguintes ferramentas:

- Docker/Docker compose
- Uma instância MongoDB

## 🔧 Como testar

```bash
npm run test
```

Ou se preferir, rode a aplicação e use as collections do insomnia disponibilizadas aqui.

## 🚧 Como instalar e rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/edsonjuniordev/dfcom-challenge.git
cd dfcom-challenge/part-02
```

### 2. Configurar variáveis de ambiente

No arquivo `docker-compose.yaml` adicione o valor da variável `MONGO_DATABASE_URL` com a url da sua instância do MongoDB.

### 3. Rodar aplicação

```bash
docker compose up
```

## ⚠️ Pontos de atenção

- Foi utilizado Nestjs com uma abordagem modularizada com alguns recursos compartilhados, isso possibilita rodar cada módulo junto ou independente e também facilita posteriormente a remoção de cada módulo para um microsserviço independente.
- Como a aplicação utiliza o recurso de `transaction` do mongodb foi necessário usar uma instância externa para não adicionar complexidade de build na aplicação.
- A implementação não usou todos os recursos propostos na arquitetura pois foi solicitado o uso de Nestjs e MongoDB, além de não adicionar complexidade no desenvolvimento do teste.
- A demora para subir os containers faz com que alguns logs de erros apareçam na aplicação, porém é apenas tentatica de se conectar ao kafka, quando o container sobe os logs encerram.
- A parte de autenticação com login foi feita pensando apenas no funcionamento da aplicação, fica como ponto de melhoria implementar uma autenticação verdadeira.
- Você pode acompanhar o status e as mensagens do Kafka com o `constrol-center` disponibilizado na porta `9021` local.

## 📈 Pontos de melhoria

- Implementar uma estratégia de Cache
- Implementar uma autenticação verdadeira
- Melhorar o tratamento de erros (hoje, todos os erros retornados são 500. Uma estratégia de `custom error handling` resolve o problema)
- Melhorar a estratégia de logs
