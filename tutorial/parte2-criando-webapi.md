# Criando uma WebAPI com NodeJS

## Parte 2 - Criando a WebAPI

Nesta etapa será implementada uma WebAPI simples, utilizando o NodeJS.

Consulte as [referências](#referências) para mais informações sobre NodeJS.


---
### Resultado esperado

Será criada uma WebAPI muito simples para cadastro de Empregados.

As operações esperadas na WebAPI são:

- GET /api/employees -> lista todos os empregados cadastrados
- GET /api/employees/:id -> busca um empregado cadastrado, pelo id
- POST /api/employees -> cadastra um novo empregado
- PUT  /api/employees/:id -> atualiza os dados de um empregado já cadastrado
- DELETE /api/employees/:id -> excluir um empregado cadastrado

**[Acesse a documentação completa da API, para mais detalhes](https://employees38.docs.apiary.io/)**


---
### Criando o projeto

#### Criando a estrutura básica do projeto com o framework express

- Crie um novo diretório para o seu projeto e abra o VSCode neste diretório.
  > Pela linha de comando ficaria:
  ```console
  cd c:\temp
  mkdir rest-ai-employees
  cd rest-ai-employees
  code .
  ```
- Inicie o projeto NodeJS com a linha de comando:
  ```console
  npm init -y
  ```
  > o arquivo **package.json** será criado.
- Adicione os pacotes utlilizados na aplicação, com a linha de comando:
  ```console
  npm install express cors body-parser --save
  ```
  > observe que os pacotes foram incluídos no arquivo **package.json**
- Adicione a linha ```"start": "node index.js"``` no arquivo **package.json**:
  ```json
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  ...
  ```
- Instale os pacotes da aplicação executando:
  ```console
  npm install
  ```
  > Observe que será gerado um diretório **node_modules** com todas as bibliotecas utilizadas na aplicação.
- Crie o arquivo index.js com o conteúdo:
  ```js
  const express = require('express');
  const cors = require('cors');
  const bodyParser = require('body-parser');

  const app = express();
  const port = 3000;
  app.use(cors({ origin: true }));
  app.use(bodyParser.json({ type: 'application/json' }));

  app.get('/', (req, res) => res.send('Hello World!'));

  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
  ```
- Rode a aplicação para verificar se tudo deu certo:
  ```console
  npm start
  ```
  > Abra seu navegador web e acesse http://localhost:3000/
- Para facilitar o desenvolvimento, é possível carregar a aplicação quando algum arquivo é alterado.
  - Adicione a biblioteca nodemon:
    ```console
    npm install --save-dev nodemon
    ```
  - Adicione a linha ```"debug": "nodemon index.js"``` no arquivo **package.json**:
    ```json
    ...
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "node index.js",
      "dev": "nodemon index.js"
    },
    ...
    ```
  - Execute a aplicação com o comando:
    ```console
    npm run dev
    ```
    > Abra seu navegador web e acesse http://localhost:3000/


#### Criando a classe de persitência dos dados em memória: EmployeesRepositoryMemory
 
Esta classe mantêm os dados dos empregados na memória da aplicação. Ou seja, caso a aplicação seja reiniciada, os dados são perdidos.

- Crie o diretório para organizar seu código:
  ```console
  mkdir persistence
  ```
- Crie o arquivo EmployeesRepositoryMemory.js dentro do diretório persistence:
  ```js
  class EmployeesRepository {
      static idCount = 0;
      static dados = [];
      
      constructor() {
          if (!this.idCount) this.idCount = 0;
          if (!this.dados) this.dados = [];
      }

      findAll = () => {
          return this.dados;
      }

      findById = (id) => {
          var employees = this.dados.filter(x => x.id == id);
          if (employees.length > 0)
              return employees[0];
          else
              return null;
      }

      add = (employee) => {
          this.idCount++;
          employee.id = this.idCount;
          this.dados.push(employee);
          return employee;
      }

      update = (employee) => {
          console.log(employee.id);
          const index = this.dados.findIndex(x => x.id == employee.id);
          if (index > -1) {
              this.dados[index] = employee;
              return employee;
          }
          return null;
      }

      deleteById = (id) => {
          const index = this.dados.findIndex(x => x.id == id);
          if (index > -1) {
              const employee = this.dados[index];
              this.dados.splice(index, 1);
              return employee;
          }
          return null;
      }
  }
  module.exports = new EmployeesRepository();
  ```

#### Criando a classe de serviço: EmployeesService
 
Esta classe mantêm as regras de negócio da aplicação.

- Crie o diretório para organizar seu código:
  ```console
  mkdir services
  ```
- Crie o arquivo EmployeesService.js dentro do diretório services:
  ```js
  const repository = require('../persistence/EmployeesRepositoryMemory');
  class EmployeesService {
      constructor(repository) {
          this.repository = repository;
      }

      findAll = async () => {
          //TODO: regras de negocio adicional
          return await this.repository.findAll();
      }

      findById = async (id) => {
          //TODO: regras de negocio adicional
          return await this.repository.findById(id);
      }

      add = async (employee) => {
          //TODO: regras de negocio adicional
          return await this.repository.add(employee);
      }

      update = async (employee) => {
          //TODO: regras de negocio adicional
          return await this.repository.update(employee);
      }

      deleteById = async (id) => {
          //TODO: regras de negocio adicional
          return await this.repository.deleteById(id);
      }
  }
  module.exports = new EmployeesService(repository);
  ```


#### Criando o controller EmployeesController

Esta classe é responsável por receber e responder as requisições do usuário.

- Crie o diretório para organizar seu código:
  ```console
  mkdir controllers
  ```
- Crie o arquivo EmployeesController.js dentro do diretório controllers:
  ```js
  const express = require('express');
  const router = express.Router();
  const service = require('../services/EmployeesService');

  // GET api/employees
  router.get('/', async (req, res) => {
      const employees = await service.findAll();
      res.json(employees);
  });

  // GET api/employees/:id
  router.get('/:id', async (req, res) => {
      const id = parseInt(req.params.id) || null;
      const employee = await service.findById(id);
      if (!employee) {
          return res.status(404).json({ error: 'Employee not found!' })
      }
      return res.json(employee);
  });

  // POST api/employees
  router.post('/', async (req, res) => {
      const { name = null, profile_image = null } = req.body;
      const salary = parseFloat(req.body.salary) || null;
      const age = parseInt(req.body.age) || null;
      if (!name) {
          return res.status(400).json({ error: "'name' field is required " });
      }
      const employee = { id: null, name, salary, age, profile_image };
      const result = await service.add(employee);
      return res.json(result);
  });

  // PUT api/employees/:id
  router.put('/:id', async (req, res) => {
      const id = parseInt(req.params.id) || null;
      const { name = null, profile_image = null } = req.body;
      const salary = parseFloat(req.body.salary) || null;
      const age = parseInt(req.body.age) || null;
      if (!name) {
          return res.status(400).json({ error: "'name' field is required " });
      }
      const employee = { id, name, salary, age, profile_image };
      const result = await service.update(employee);
      if (!result) {
          return res.status(404).json({ error: 'Employee not found!' })
      }
      return res.json(result);
  });

  // DELETE api/employees/:id
  router.delete('/:id', async (req, res) => {
      const id = parseInt(req.params.id) || null;
      const result = await service.deleteById(id);
      if (!result) {
          return res.status(404).json({ error: 'Employee not found!' })
      }
      return res.json(result);
  });

  module.exports = router;
  ```


#### Ajuste o arquivo index.js para utilizar o controller EmployeesController

- Altere o arquivo index.js com o conteúdo:
  ```js
  const express = require('express');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const EmployeesController = require('./controllers/EmployeesController');

  const app = express();
  const port = 3000;

  app.use(cors({ origin: true }));
  app.use(bodyParser.json({ type: 'application/json' }));

  app.get('/', (req, res) => res.send('<h1>rest-api-employees</h1><a href="https://employees38.docs.apiary.io/">Acesse a documentação da API<a>'));
  app.use('/api/employees', EmployeesController);

  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
  ```


#### Execute a aplicação

Nesta etapa vamos compilar e executar a aplicação.

- Rode a aplicação para verificar se tudo deu certo:
  ```console
  npm start
  ```
  > Abra seu navegador web e acesse http://localhost:3000/


#### Testando a aplicação com o Postman

Para testar os endpoints da aplicação, vamos utilizar o Postman

- Instale o Postman caso ainda não tenha instalado. [Site Postman](https://postman.com/) e consuma os endpoints da aplicação.
- A aplicação estará rodando nas urls:
  - http://localhost:3000/api/employees


---
### Referências
 
 - [NodeJS - w3schools](https://www.w3schools.com/nodejs/default.asp)
 - [ExpressJS](https://expressjs.com/)
 
