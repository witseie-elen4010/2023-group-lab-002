/* eslint-env jest */

const jsdom = require('jsdom')
const fs = require('fs')
const { JSDOM } = jsdom
const fetchMock = require('fetch-mock').sandbox()

function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

describe('Test Lecturer Dashboard page', () => {
  let dom
  let document
  let window

  beforeEach(() => {
    dom = new JSDOM(fs.readFileSync('./src/views/lecturerDashboard.html', 'utf-8'), {
      runScripts: 'dangerously',
      resources: 'usable'
    })
    document = dom.window.document
    window = dom.window
    fetchMock.mock('/db/availability', {
      status: 200,
      body: {
        name: 'Test Lecturer',
        username: 'TestLect',
        password: '123456780',
        day: [1, 2],
        time: ['12:00', '14:00'],
        duration: [60, 45],
        groupSize: [20, 10]
      }
    })
    window.fetch = fetchMock.sandbox()
    window.eval(fs.readFileSync('./src/public/scripts/lecturerDashboard.js', 'utf-8'))
  })
  afterEach(() => {
    fetchMock.reset()
  })
  it('Check if rows of table matches number of available times', async () => {
    await sleep(1000)
    const table = document.querySelector('#availability table')
    console.log(table.rows[2].cells[0].textContent)
    expect(table.rows.length).toBe(4)
    expect(table.rows[2].cells[0].textContent).toBe('Monday')
    expect(table.rows[3].cells[0].textContent).toBe('Tuesday')
  })
})
