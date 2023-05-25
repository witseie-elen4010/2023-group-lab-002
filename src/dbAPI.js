'use strict'

const express = require('express')
const dbAPI = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.connect('mongodb+srv://consultation:Em73gnZ6CfElljU1@consultation-web.mp2vkpc.mongodb.net/consultation?retryWrites=true&w=majority')
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  type: String,
  name: String,
  email: String,
  day: [Number],
  time: [String],
  duration: [Number],
  groupSize: [Number]
})
const User = mongoose.model('User', userSchema)

const meetingSchema = mongoose.Schema({
  lecturer: String,
  organiser: String,
  date: String,
  time: String,
  duration: Number,
  groupSize: Number,
  name: String
})
const Meeting = mongoose.model('Meeting', meetingSchema)

dbAPI.post('/login', async function (req, res) {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    req.session.errorLogin = true
    res.redirect('/login')
  } else if (bcrypt.compareSync(req.body.password, user.password)) {
    req.session.user = user
    if (user.type === 'lecturer') {
      res.redirect('/lecturerDashboard')
    } else {
      res.redirect('/studentdashboard')
    }
  } else {
    req.session.errorLogin = true
    res.redirect('/login')
  }
})

dbAPI.get('/incorrectLogin', function (req, res) {
  res.send(req.session.errorLogin)
})

dbAPI.get('/checkUsername/:username', async function (req, res) {
  const user = await User.findOne({ username: req.params.username })
  if (user) {
    res.send('true')
  } else {
    res.send('false')
  }
})

dbAPI.get('/checkEmail/:email', async function (req, res) {
  const user = await User.findOne({ email: req.params.email })
  if (user) {
    res.send('true')
  } else {
    res.send('false')
  }
})

dbAPI.post('/signup', async function (req, res) {
  const hashPassword = await bcrypt.hash(req.body.password, 12)
  const newUser = new User({ name: req.body.name, username: req.body.username, email: req.body.email, password: hashPassword, type: req.body.position })
  await newUser.save()
  req.session.user = newUser
  res.redirect('/dashboard')
})

// Use later for deleting existing accounts
dbAPI.post('/delete', async function (req, res) {
  await User.deleteOne({ username: req.body.username })
  res.redirect('/login')
})

dbAPI.post('/setAvailability', async function (req, res) {
  const username = req.session.user.username
  const lecturer = await User.findOne({ username })
  lecturer.day.push(req.body.day)
  lecturer.time.push(req.body.time)
  lecturer.duration.push(req.body.duration)
  lecturer.groupSize.push(req.body.groupSize)
  await lecturer.save()
  res.redirect('/lecturerDashboard')
})

dbAPI.get('/getLecturers', async function (req, res) {
  const lecturers = await User.find({ type: 'lecturer' })
  res.send(lecturers)
})

dbAPI.post('/bookMeeting', async function (req, res) {
  const lecturer = await User.findOne({ username: req.body.lecturer })
  console.log(lecturer)
  const day = new Date(req.body.date).getDay()
  let groupSize
  let duration
  for (let i = 0; i < lecturer.day.length; i++) {
    if (lecturer.day[i] === day) {
      if (lecturer.time[i] === req.body.time) {
        groupSize = lecturer.groupSize[i]
        duration = lecturer.duration[i]
        break
      }
    }
  }
  const newMeeting = new Meeting({ organiser: req.session.user.username, lecturer: req.body.lecturer, date: req.body.date, time: req.body.time, duration, groupSize, name: req.body.name })
  await newMeeting.save()
  res.redirect('/studentdashboard')
})

dbAPI.post('/deleteMeeting', async function (req, res) {
  await Meeting.deleteOne({ lecturer: req.body.lecturer, date: req.body.date, time: req.body.time })
  res.redirect(req.baseUrl)
})

module.exports = dbAPI
