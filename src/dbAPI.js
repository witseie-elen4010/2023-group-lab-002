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
  name: String,
  members: [String]
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

dbAPI.post('/logout', async function (req, res) {
  req.session.destroy()
  res.set('Cache-Control', 'no-content, must-revalidate, private')
  res.redirect('/login')
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

dbAPI.get('/getMeetings', async function (req, res) {
  let meetings
  if (req.session.user.type === 'lecturer') {
    meetings = await Meeting.find({ lecturer: req.session.user.username })
  } else {
    meetings = await Meeting.find({ organiser: req.session.user.username })
  }
  res.send(meetings)
})

dbAPI.get('/getName/:username/', async function (req, res) {
  const user = await User.findOne({ username: req.params.username })
  res.send(user.name)
})

dbAPI.get('/availability', async function (req, res) {
  const lecturer = await User.findOne({ username: req.session.user.username })
  res.send(lecturer)
})

dbAPI.get('/deleteAvailability/:index', async function (req, res) {
  const lecturer = await User.findOne({ username: req.session.user.username })
  lecturer.day.splice(req.params.index, 1)
  lecturer.time.splice(req.params.index, 1)
  lecturer.duration.splice(req.params.index, 1)
  lecturer.groupSize.splice(req.params.index, 1)
  await lecturer.save()
  res.send('deleted')
})

dbAPI.get('/joinMeeting/:id', async function (req, res) {
  const meeting = await Meeting.findOne({ _id: req.params.id })
  meeting.members.push(req.session.user.username)
  await meeting.save()
  res.send('Joined')
})

dbAPI.get('/getUsername', async function (req, res) {
  res.send(req.session.user.username)
})

dbAPI.get('/getAllMeetings/:lecturer', async function (req, res) {
  const meetings = await Meeting.find({ lecturer: req.params.lecturer })
  res.send(meetings)
})

module.exports = dbAPI
