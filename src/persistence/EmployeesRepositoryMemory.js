class EmployeesRepository {
    static idCount = 0;
    static dados = [];

    constructor(repository) {
        this.repository = repository;
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