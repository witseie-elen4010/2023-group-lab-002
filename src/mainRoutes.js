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

mainRouter.get('/studentdashboard', function(req,res){
  res.sendFile(path.join(__dirname,'views','studentdashboard.html'))
})

module.exports = mainRouter

mainRouter.post('/api/studentdashboard', function (req, res) {
  res.redirect(req.baseUrl + '/studentdashboard')
  })