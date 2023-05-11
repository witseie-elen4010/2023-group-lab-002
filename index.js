'use strict'

// const path = require('path')
const express = require('express')
const app = express()

const mainRouter = require('./src/mainRoutes.js')

app.use('/', mainRouter)

app.use('/cdn', express.static('src/public'))

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
