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

describe('Test Student Dashboard page', () => {
  let dom
  let document
  let window

  beforeEach(() => {
    dom = new JSDOM(fs.readFileSync('./src/views/studentdashboard.html', 'utf-8'), {
      runScripts: 'dangerously',
      resources: 'usable'
    })

    document = dom.window.document
    window = dom.window
    fetchMock.mock('/db/getLecturers', {
      status: 200,
      body: [{
        name: 'Test Lecturer',
        username: 'TestLect',
        password: '123456780',
        day: [1, 2],
        time: ['12:00', '14:00'],
        duration: [60, 45],
        groupSize: [20, 10]
      }]
    })
    window.fetch = fetchMock.sandbox()
    window.eval(fs.readFileSync('./src/public/scripts/studentdashboard.js', 'utf-8'))
  })

  afterEach(() => {
    fetchMock.reset()
  })

  it('Check if lecturers from database is in dropdown', async () => {
    const lecturerDropdown = document.querySelector('#lecturerDropdown')
    await sleep(100)
    expect(lecturerDropdown.options.length).toBeGreaterThan(1)

    expect(lecturerDropdown.options[1].textContent).toBe('Test Lecturer')

    expect(lecturerDropdown.options[1].value).toBe('TestLect')
  })

  it('Check if chosen lecturer available times are shown', async () => {
    const lecturerDropdown = document.querySelector('#lecturerDropdown')
    await sleep(100)
    lecturerDropdown.value = 'TestLect'
    const scheduleDiv = document.querySelector('#scheduleDiv')
    lecturerDropdown.dispatchEvent(new window.Event('change'))
    expect(scheduleDiv.hasChildNodes('table')).toBe(true)
  })
})
