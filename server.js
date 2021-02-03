var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true }))
app.use(bodyParser.raw());

var Users = require('./routes/Users')
app.use('/users', Users)

const mongoose = require('mongoose');
require("dotenv/config");
mongoose.connect(
    process.env.DB_CONNECTION_STRING,
    {useUnifiedTopology:true,useNewUrlParser:true},
    (req,res)=>{
    console.log("db connected");
});

var port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})