// const Sequelize = require('sequelize')
// const db = {}
// const sequelize = new Sequelize('express', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   operatorsAliases: false,

//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// })

// db.sequelize = sequelize
// db.Sequelize = Sequelize

// module.exports = db


// const mongoose = require('mongoose');
// const db = {}

// const mongo = mongoose.connect(
//   process.env.DB_CONNECTION_STRING,
//   {useUnifiedTopology:true,useNewUrlParser:true},
//   (req,res)=>{
//   console.log("db connected");
// });

// module.exports = db.mongo