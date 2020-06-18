const express = require('express');
const router = express.Router();
const service = require('../services/EmployeesService');
const { json } = require('body-parser');

// GET api/employees
router.get('/', (req, res) => {
    const employees = service.findAll();
    res.json(employees);
});

// GET api/employees/:id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const employee = service.findById(id);
    if (!employee) {
        return res.status(404).json({ error: 'Employee not found!' })
    }
    return res.json(employee);
});

// POST api/employees
router.post('/', (req, res) => {
    const { name = null, profile_image = null } = req.body;
    const salary = parseFloat(req.body.salary) || null;
    const age = parseInt(req.body.age) || null;
    if (!name) {
        return res.status(400).json({ error: "'name' field is required " });
    }
    const employee = { id: null, name, salary, age, profile_image };
    service.add(employee);
    return res.json(employee);
});

// PUT api/employees/:id
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name = null, profile_image = null } = req.body;
    const salary = parseFloat(req.body.salary) || null;
    const age = parseInt(req.body.age) || null;
    if (!name) {
        return res.status(400).json({ error: "'name' field is required " });
    }
    const employee = { id, name, salary, age, profile_image };
    const result = service.update(employee);
    if (!result) {
        return res.status(404).json({ error: 'Employee not found!' })
    }
    return res.json(result);
});

// DELETE api/employees/:id
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const result = service.deleteById(id);
    if (!result) {
        return res.status(404).json({ error: 'Employee not found!' })
    }
    return res.json(result);
});

module.exports = router;