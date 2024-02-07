# AWS SAM Studies

## 🥅 The goal
This project aims to know what is AWS SAM and how to use it in a real project. The goal is to develop an API and to understand how to use it for local development and how to deploy it into production.

## ✌️ The project
This project is about building an API for a burger restaurant, which it would be possible to do the following features:
- Register ingredients ahd their amount to represent the stock
- Register snacks and it should be possible to show the ingredient amount used in each snack
- Remove snack from the menu
- Create orders
  - When the user ask a snack, the ingredient amount should be removed from the stock amount and, because of that, it should validate if it is possible to continue the order, accordingly the available ingredients in the stock


## ⚙️ Technologies used

* [Docker](https://docs.docker.com/)
* [Docker Compose](https://docs.docker.com/engine/reference/commandline/compose/)
* [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) : Build the project throgh serveless components.
* [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) : Superset of Javascript code language programming.
* [JSON API](https://jsonapi.org/format/) : The way which the API was modeled. Since the request until the responses, all of them needs to be thought and planned.
* [Prisma](https://www.prisma.io/docs/orm/reference/prisma-cli-reference) : ORM responsible for dealing with the database layer, which makes easy to development in daily routine.
* [JEST](https://jestjs.io/pt-BR/) : A library responsible for testing the application. 
* [OPEN API](https://swagger.io/docs/specification/about/) : Tool for API documentation. 


## 💻 How to run locally

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 18](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build your application for the first time, run the following in your shell:

```bash
# It will create the containers for database and its management. Besides that, it will create the network, which is important for the process
docker compose up

# The build for AWS SAM
sam build

# Running locally
sam local start-api --docker-network burguerhouse
```

Important to mention is **burguerhouse** is the name of the network created in the docker compose file for the project.

## 🔝 Improvements to be made
- Automation tests (handler, controller, service) for 
  - Snack flows 
  - Menu flows 
- Implement other features from JSON API, like the query parameters:
  - include
  - page 
  - filter 
  - fields
- Deploy in AWS with success