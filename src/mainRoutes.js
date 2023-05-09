'use strict'

const path = require('path')
const express = require('express')
const mainRouter = express.Router()
mainRouter.get('/', function (req, res) {
  res.send('Hello World. I\'m a Node app.')
})

mainRouter.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
})
mainRouter.get('/lecturerDashboard', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'lecturerDashboard.html'))
})

module.exports = mainRouter
