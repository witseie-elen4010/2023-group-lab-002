'use strict'

const path = require('path')
const express = require('express')
const mainRouter = express.Router()
mainRouter.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

mainRouter.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
})
mainRouter.get('/lecturerDashboard', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'lecturerDashboard.html'))
})

mainRouter.get('/studentdashboard', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'studentdashboard.html'))
})

module.exports = mainRouter

mainRouter.post('/api/studentdashboard', function (req, res) {
  res.redirect(req.baseUrl + '/studentdashboard')
})
