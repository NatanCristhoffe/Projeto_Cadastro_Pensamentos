const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("toughts", "root", "", {
    host:"localhost",
    dialect: "mysql",
})

try {
    sequelize.authenticate()
    console.log("Conectamos ao banco toughts")
} catch(err){
    console.log(`Não foi possivel conectar conectarÇ ${err}`)
}

module.exports = sequelize