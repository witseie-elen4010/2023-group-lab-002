'use strict'

// const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')


const mainRouter = require('./src/mainRoutes.js')
const dbAPI = require('./src/dbAPI.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'notagoodsecret',
    resave: true,
    saveUninitialized: true
}));

app.use('/', mainRouter)
app.use('/db', dbAPI)

app.use('/cdn', express.static('src/public'))

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
