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
        console.log(this.db.Employee);
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