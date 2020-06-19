const db = require('../db')

class EmployeesRepository {
    constructor(db) {
        this.db = db;
    }

    findAll = async () => {
        var result = await db.query('select id, name, salary, age, profile_image as profile_image from employees');
        return result.rows;
    }

    findById = async (id) => {
        var result = await db.query('select id, name, salary, age, profile_image as profile_image from employees where id=$1 ', [id]);
        if (result.rows.length > 0)
            return result.rows[0];
        else
            return null;
    }

    add = async (employee) => {
        var result = await db.query('insert into employees (name, salary, age, profile_image) values ($1, $2, $3, $4) RETURNING id',
            [employee.name, employee.salary, employee.age, employee.profile_image]);
        if (result.rows.length > 0) {
            employee.id = result.rows[0].id;
            console.log(employee);
            return employee;
        }
        else {
            return null;
        }
    }

    update = async (employee) => {
        var result = await db.query('update employees set name=$1, salary=$2, age=$3, profile_image=$4 where id=$5',
            [employee.name, employee.salary, employee.age, employee.profile_image, employee.id]);
        console.log(result);
        if (result.rowCount > 0)
            return employee;
        else
            return null;
    }

    deleteById = async (id) => {
        const employee = this.findById(id);
        if (employee == null)
            return null;
        const result = await db.query('delete from employees where id=$1', [id]);
        return employee;
    }
}

module.exports = new EmployeesRepository(db);