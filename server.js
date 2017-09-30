const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const config = require('./config')
const mongoose = require('mongoose')
// const MongoClient = require('mongodb').MongoClient

// Problem might occur for mongod v 3.4.9
// to solve : https://github.com/Automattic/mongoose/issues/4587
// is to : add db connection mechanism after db uri :
// mongoose.connect('mongodb://${user}:${pass}@${uri}/${db}?authMechanism=SCRAM-SHA-1')

const app = express()
mongoose.Promise = global.Promise
// mongoose.Promise = require('bluebird')
mongoose.connect(config.database, {useMongoClient : true})
mongoose.connection.once('open', function () {
    console.log('connected to the db')
}).on('error', function (err) {
    console.log('Connection fail ', err)
})

// middleware
app.use(bodyParser.urlencoded({ extended : true}))
app.use(bodyParser.json())
// use morgan to parse the console log
app.use(morgan('dev'))
// to make static public file being rendered
app.use(express.static(__dirname + '/public'))

// use api
const api = require('./app/routes/api')(app, express)
app.use('/api', api)

app.get('*', function (req, res){
    res.sendFile(__dirname + '/public/app/views/index.html')
})

app.listen(config.port, function (err) {
    if(err){
        console.log(err)
    }else{
        console.log("Listening on Port 3000")
    }
})