'use strict'

// const path = require('path')
const express = require('express')
const app = express()

const mainRouter = require('./mainRoutes.js')

app.use('/', mainRouter)
app.use('/cdn', express.static('src/public'))
app.listen(3000)
console.log('Express server running on port 3000')
