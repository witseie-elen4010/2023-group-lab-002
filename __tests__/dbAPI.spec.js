/* eslint-env jest */

const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Import your Express router
const dbAPI = require('../src/dbAPI');


afterAll(async () => {
  await mongoose.disconnect();
});


describe('Login Route Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: false }));
    app.use('/', dbAPI);
  });

  test('POST /login - Correct credentials, redirect to lecturerDashboard', async () => {

    // Perform the login request
    const response = await request(app)
      .post('/login')
      .send({ username: 'Alli', password: 'test' })

    // Assert the response
    expect(response.status).toBe(302); // Redirect status code
    expect(response.headers.location).toBe('/studentdashboard');
  });

  test('POST /login - Incorrect username, redirect to login with error', async () => {
    // Perform the login request with incorrect username
    const response = await request(app)
      .post('/login')
      .send({ username: 'nonexistent', password: 'testpassword' })
      .set('Cookie', ['connect.sid=123456']); // Set a mock session cookie

    // Assert the response
    expect(response.status).toBe(302); // Redirect status code
    expect(response.headers.location).toBe('/login');

  });

  test('POST /login - Incorrect password, redirect to login with error', async () => {

    // Perform the login request with incorrect password
    const response = await request(app)
      .post('/login')
      .send({ username: 'Alli', password: 'incorrectpassword' });

    // Assert the response
    expect(response.status).toBe(302); // Redirect status code
    expect(response.headers.location).toBe('/login');
    expect(response.header['set-cookie']).toBeTruthy();

  });
})