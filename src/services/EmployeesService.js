const EmployeesRepository = require('../persistence/EmployeesRepositoryMemory');

class EmployeesService {
    constructor(repository) {
        this.repository = repository;
    }

    findAll = () => {
        //TODO: regras de negocio adicional
        return this.repository.findAll();
    }

    findById = (id) => {
        //TODO: regras de negocio adicional
        return this.repository.findById(id);
    }

    add = (employee) => {
        //TODO: regras de negocio adicional
        return this.repository.add(employee);
    }

    update = (employee) => {
        //TODO: regras de negocio adicional
        return this.repository.update(employee);
    }

    deleteById = (id) => {
        //TODO: regras de negocio adicional
        return this.repository.deleteById(id);
    }
}

module.exports = new EmployeesService(EmployeesRepository);