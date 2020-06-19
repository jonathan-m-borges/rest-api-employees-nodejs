//const repository = require('../persistence/EmployeesRepositoryMemory');
const repository = require('../persistence/EmployeesRepositoryPgSql');


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