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