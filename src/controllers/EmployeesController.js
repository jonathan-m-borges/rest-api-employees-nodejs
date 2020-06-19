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