/* eslint-env jest */

const request = require('supertest')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')

// Import your Express router
const dbAPI = require('../src/dbAPI')

afterAll(async () => {
  await mongoose.disconnect()
})

describe('Login Route Tests', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('POST /login - Correct credentials, redirect to studentDashboard', async () => {
    // Perform the login request
    const response = await request(app)
      .post('/login')
      .send({ username: 'Alli', password: 'test' })

    // Assert the response
    expect(response.status).toBe(302) // Redirect status code
    expect(response.headers.location).toBe('/studentdashboard')
  })

  test('POST /login - Correct credentials, redirect to studentDashboard', async () => {
    // Perform the login request
    const response = await request(app)
      .post('/login')
      .send({ username: 'Pkala', password: '12345678' })

    // Assert the response
    expect(response.status).toBe(302) // Redirect status code
    expect(response.headers.location).toBe('/lecturerDashboard')
  })

  test('POST /login - Incorrect username, redirect to login with error', async () => {
    // Perform the login request with incorrect username
    const response = await request(app)
      .post('/login')
      .send({ username: 'nonexistent', password: 'testpassword' })
      .set('Cookie', ['connect.sid=123456']) // Set a mock session cookie

    // Assert the response
    expect(response.status).toBe(302) // Redirect status code
    expect(response.headers.location).toBe('/login')
  })

  test('POST /login - Incorrect password, redirect to login with error', async () => {
    // Perform the login request with incorrect password
    const response = await request(app)
      .post('/login')
      .send({ username: 'Alli', password: 'incorrectpassword' })

    // Assert the response
    expect(response.status).toBe(302) // Redirect status code
    expect(response.headers.location).toBe('/login')
    expect(response.header['set-cookie']).toBeTruthy()
  })
})

describe('Signup Route Tests', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('GET /signup - Check if username is available', async () => {
    const response = await request(app).get('/checkUsername/Alli')
    expect(response.status).toBe(200)
    expect(response.text).toBe('true')
  })

  test('GET /signup - Check if username is available', async () => {
    // Assuming the username "nonExistingUser" does not exist in the database
    const response = await request(app).get('/checkUsername/nonExistingUser')
    expect(response.status).toBe(200)
    expect(response.text).toBe('false')
  })

  test('GET /signup - Check is email is available', async () => {
    const response = await request(app).get('/checkEmail/pj.kala97@gmail.com')
    expect(response.status).toBe(200)
    expect(response.text).toBe('true')
  })

  it('GET /signup - Check is email is available', async () => {
    // Assuming the email "nonexisting@example.com" does not exist in the database
    const response = await request(app).get('/checkEmail/nonexisting@example.com')
    expect(response.status).toBe(200)
    expect(response.text).toBe('false')
  })

  test('POST /signup - Check if a new user is added to database', async () => {
    // Perform the signup request
    const response = await request(app)
      .post('/signup')
      .send({ name: 'New User', username: 'NewUser', password: 'abcd1234', email: 'newuser@testexample.com', position: 'student' })

    // Assert the response
    expect(response.status).toBe(302) // Redirect status code
    expect(response.headers.location).toBe('/dashboard')
  })

  test('Get /incorrectLogin - Check if errorLogin is set', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 'Alli', password: 'osiufhg' })

    const response = await agent.get('/incorrectLogin')
    expect(response.text).toBe('true')

    await request(app)
      .post('/delete')
      .send({ username: 'NewUser' })
  })
})

describe('Set Availabiltiy Tests', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('POST /setAvailability - Check if available times are being set', async () => {
    const agent = request.agent(app)
    await agent
      .post('/signup')
      .send({ name: 'New User', username: 'NewUser', password: 'abcd1234', email: 'newuser@testexample.com', position: 'lecturer' })

    const response1 = await agent
      .post('/setAvailability')
      .send({ day: 1, time: '11:30', duration: 90, groupSize: 5 })
    expect(response1.status).toBe(302)
    expect(response1.headers.location).toBe('/lecturerDashboard')

    await agent
      .post('/delete')
      .send({ username: 'NewUser' })
  })
})

describe('Get all lectuerers test', () => {
  let app
  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('GET /getLectuerers - Check if lectuerers are accessible', async () => {
    const response = await request(app).get('/getLecturers')
    expect(response.body[0].username).toBe('Pkala')
    expect(response.body[1].username).toBe('l')
    expect(response.body[2].username).toBe('MigsHunter')
  })
})

describe('booking a meeting', () => {
  let app
  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('POST /bookMeeting - Check if students can book a meeting', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 's', password: ']' })

    const response = await agent
      .post('/bookMeeting')
      .send({ lecturer: 'l', date: '2023-05-23', day: 2, time: '09:30', name: 'software consult' })

    expect(response.headers.location).toBe('/studentdashboard')
    await agent
      .post('/deleteMeeting')
      .send({ lecturer: 'l', date: '2023-05-23', time: '09:30' })
  })
})

describe('Get all meetings test', () => {
  let app
  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('GET /getMeetings - Check if meetings are accessible for student', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 's', password: ']' })

    const response = await agent.get('/getMeetings')
    expect(response.body.length).toBeGreaterThan(2)
  })
  test('GET /getMeetings - Check if meetings are accessible for lecturer', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 'l', password: ']' })

    const response = await agent.get('/getMeetings')
    expect(response.body.length).toBeGreaterThan(1)
  })
})

describe('Get Name Function', () => {
  let app
  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('GET /getName - Check if name is accessible', async () => {
    const response = await request(app).get('/getName/s')
    expect(response.text).toBe('Test Student')
  })
})

describe('Login Route Tests', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('POST /logout - Student is redirected to login page', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 's', password: ']' })
    const response = await agent.post('/logout')
    expect(response.headers.location).toBe('/login')

    await agent
      .post('/login')
      .send({ username: 'l', password: ']' })
    const response2 = await agent.post('/logout')
    expect(response2.headers.location).toBe('/login')
  })
})

describe('Tests the get Availability request', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('GET /availibility - Get the lecturers available times', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 'l', password: ']' })
    const response = await agent.get('/availability')
    expect(response.body.day[0]).toBe(2)
    expect(response.body.time[0]).toBe('09:30')
    expect(response.body.duration[0]).toBe(30)
    expect(response.body.groupSize[0]).toBe(5)
  })
})

describe('Tests delete availability', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('GET /availibility - Get the lecturers available times', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 'l', password: ']' })

    await agent
      .post('/setAvailability')
      .send({ day: 4, time: '10:30', duration: 60, groupSize: 5 })

    const response = await agent.get('/availability')
    expect(response.body.day.length).toBe(2)

    await agent.get('/deleteAvailability/1')

    const response2 = await agent.get('/availability')
    expect(response2.body.day.length).toBe(1)
  })
})

describe('Test joining functionality', () => {
  let app
  beforeAll(() => {
    app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }))
    app.use('/', dbAPI)
  })

  test('GET /joinMeeting, /leaveMeeting - Add members to members array of meeting and leave the meeting', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 's', password: ']' })

    const response = await agent
      .get('/joinMeeting/646f2677ba252a3e536f167d')

    expect(await response.text).toBe('Joined')

    const response2 = await agent.get('/leaveMeeting/646f2677ba252a3e536f167d')
    expect(await response2.text).toBe('Left')
  })

  test('GET /getAllMeetings - Return all meetings', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 's', password: ']' })

    const response = await agent
      .get('/getAllMeetings/l')
    expect(response.body.length).toBeGreaterThan(0)
  })

  test('GET /getUsername - Return username of user', async () => {
    const agent = request.agent(app)
    await agent
      .post('/login')
      .send({ username: 's', password: ']' })
    const response = await agent
      .get('/getUsername')
    expect(response.text).toBe('s')
  })
})
