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

  test('POST /login - Correct credentials, redirect to lecturerDashboard', async () => {
    // Perform the login request
    const response = await request(app)
      .post('/login')
      .send({ username: 'Alli', password: 'test' })

    // Assert the response
    expect(response.status).toBe(302) // Redirect status code
    expect(response.headers.location).toBe('/studentdashboard')
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
      .send({ day: 1, time: '11:30', duration: 90 })
    expect(response1.status).toBe(302)
    expect(response1.headers.location).toBe('/lecturerDashboard')

    await agent
      .post('/delete')
      .send({ username: 'NewUser' })
  })
})
