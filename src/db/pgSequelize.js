const Sequelize = require('sequelize');

require('dotenv').config();

console.log(process.env.PG_CONNECTION_STRING);
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