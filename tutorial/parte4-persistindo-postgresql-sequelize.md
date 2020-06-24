# Criando uma WebAPI com NodeJS

## Parte 3 - Persistindo os dados no banco de dados PostgreSQL - com Sequelize

Nesta etapa vamos persistir os dados dos empregados no banco de dados PostgreSQL, utilizando o framework ORM **Sequelize**.

Para mais detalhes consulte as [referências](#referências).

> Esta é uma aplicação simples sem referências entre entidades. Para consultar sobre associações com o Sequelize, acesse [este link](https://sequelize.org/master/manual/assocs.html).


---
### Adicionando bibliotecas na aplicação

As bibliotecas **sequelize** e **pg** são necessárias na aplicação.

- Na linha de comando no diretório raiz da aplicação e execute:
  ```console
  npm install pg sequelize --save
  ```


---
### Configurando Sequelize

- Organizando diretórios da aplicação:
  ```console
  mkdir db
  ```
- Crie o arquivo pgSequelize.js dentro do diretório db:
  ```js
  const Sequelize = require('sequelize');
  require('dotenv').config();

  const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING);

  // model Employee
  const Employee = sequelize.define("employees", {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      salary: Sequelize.DECIMAL,
      age: Sequelize.INTEGER,
      profile_image: Sequelize.STRING
  }, {
      timestamps: false // desabilita campos `createdAt` and `updatedAt`
  });

  //other models...
  //etc...

  const db = {
      Employee
  }

  module.exports = db;
  ```


---
### Criando a classe EmployeesRepositoryPgSequelize

- Organizando diretórios da aplicação:
  ```console
  mkdir persistence
  ```
- Crie o arquivo EmployeesRepositoryPgSequelize.js dentro do diretório persistence:
  ```js
  const db = require('../db/pgSequelize');

  class EmployeesRepositoryPgSequelize {
      constructor(db) {
          this.db = db;
      }
  
      findAll = async () => {
          const result = await this.db.Employee.findAll();
          return result;
      }
  
      findById = async (id) => {
          const result = await this.db.Employee.findByPk(id);
          return result;
      }
  
      add = async (employee) => {
          const result = await this.db.Employee.create(employee);
          return result;
      }
  
      update = async (employee) => {
          const result = await this.db.Employee.update(employee, {
              where: { id: employee.id }
          });
          if (result > 0)
              return employee;
          else
              return null;
      }
  
      deleteById = async (id) => {
          const employee = await this.db.Employee.findByPk(id);
          if (!employee)
              return null;
          await this.db.Employee.destroy({ where: { id: id } });
          return employee;
      }
  }
  
  module.exports = new EmployeesRepositoryPgSequelize(db);
  ```


---
### Ajustando a classe EmployeesService para utilizar a classe EmployeesRepositoryPgSequelize

- Altere o início do arquivo services\EmployeesService.js:
  ```js
  //const repository = require('../persistence/EmployeesRepositoryMemory');
  //const repository = require('../persistence/EmployeesRepositoryPgSql');
  const repository = require('../persistence/EmployeesRepositoryPgSequelize');
  
  ... continuação...
  ```


---
### Execute a aplicação

Nesta etapa vamos compilar e executar a aplicação:

- Para executar a aplicação, basta executar na linha de comando: ```npm start``` ou ```npm run dev```:


---
### Testando a aplicação com o Postman

Para testar os endpoints da aplicação, vamos utilizar o Postman.

Em paralelo, execute os comandos SQL no Postird para verificar que os dados foram persistidos no banco.


---
### Referências
 - [Configurando o ORM Sequelize](https://blog.rocketseat.com.br/nodejs-express-sequelize/)
 - [Sequelize - Documentação oficial - v5](https://sequelize.org/v5/index.html)
 - [Sequelize - Documentação oficial - v6](https://sequelize.org/master/index.html)
 - [Sequelize - Referência](https://sequelize.org/master/identifiers.html)
 - [Sequelize - Associações - documentação oficial](https://sequelize.org/master/manual/assocs.html)
 