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

mainRouter.get('/dashboard', function (req, res) {
  if (req.session.user && req.session.user.type === 'student') {
    res.sendFile(path.join(__dirname, 'views', 'studentdashboard.html'))
  } else if (req.session.user && req.session.user.type === 'lecturer') {
    res.sendFile(path.join(__dirname, 'views', 'lecturerDashboard.html'))
  } else {
    res.redirect('/login')
  }
})

mainRouter.get('/lecturerDashboard', function (req, res) {
  if (req.session.user && req.session.user.type === 'lecturer') {
    res.sendFile(path.join(__dirname, 'views', 'lecturerDashboard.html'))
  } else {
    res.sendFile(path.join(__dirname, 'views', 'noAcces.html'))
  }
})

mainRouter.get('/studentdashboard', function (req, res) {
  if (req.session.user && req.session.user.type === 'student') {
    res.sendFile(path.join(__dirname, 'views', 'studentdashboard.html'))
  } else {
    res.sendFile(path.join(__dirname, 'views', 'noAcces.html'))
  }
})

mainRouter.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'))
})

mainRouter.get('/logs', function (req, res) {
  if (req.session.user && req.session.user.type === 'admin') {
    res.sendFile(path.join(__dirname, 'views', 'logs.html'))
  } else {
    res.sendFile(path.join(__dirname, 'views', 'noAcces.html'))
  }
})

module.exports = mainRouter
