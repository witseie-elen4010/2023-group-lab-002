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
    fetchMock.mock('/db/getMeetings', {
      status: 200,
      body: [{
        organiser: 'test',
        lecturer: 'test',
        date: new Date().toISOString().slice(0, 10),
        time: '12:00',
        duration: 30,
        groupSize: 5,
        name: 'test'
      }]
    })
    window.fetch = fetchMock.sandbox()
    window.eval(fs.readFileSync('./src/public/scripts/calendar.js', 'utf-8'))
  })

  afterEach(() => {
    fetchMock.reset()
  })

  it('Check if the day of meeting has class meeting-day', async () => {
    await sleep(100)
    const day = document.querySelector('.current-meeting-day')
    expect(day).toBeTruthy()
    const prevBtn = document.querySelector('#previous-btn')
    prevBtn.click()
    await sleep(100)
    const day2 = document.querySelector('.meeting-day')
    expect(day2).not.toBeTruthy()
  })
})
