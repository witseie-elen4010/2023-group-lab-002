'use strict'

let lecturer
let allMeetings

const lecturerDropdown = document.getElementById('lecturerDropdown')
const dropdownDiv = document.querySelector('.dropdown')
const existingMeetingsDiv = document.querySelector('#existingMeetings')
let allLecturers

function addLecturer(dbLecturer) {
  const option = document.createElement('option')
  option.setAttribute('value', dbLecturer.username)
  const optionText = document.createTextNode(dbLecturer.name)
  option.appendChild(optionText)
  lecturerDropdown.appendChild(option)
}

fetch('/db/getLecturers')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
  })
  .then(data => {
    allLecturers = data
    data.forEach(addLecturer)
  })

document.querySelector('#logout_button').addEventListener('click', function (event) {
  window.history.replaceState({}, '', '/login')
})

fetch('db/getMeetings/')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
  })
  .then(data => {
    allMeetings = data
  })

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

lecturerDropdown.addEventListener('change', async function (Event) {
  lecturer = null
  let i = 0
  while (lecturer === null) {
    if (allLecturers[i].username === lecturerDropdown.value) {
      lecturer = allLecturers[i]
    }
    i++
  }
  if (dropdownDiv.hasChildNodes('table')) {
    dropdownDiv.removeChild(dropdownDiv.lastChild)
  }

  if (existingMeetingsDiv.hasChildNodes('table')) {
    existingMeetingsDiv.removeChild(existingMeetingsDiv.lastChild)
  }
  const table = document.createElement('table')
  const table2 = document.createElement('table')
  table.classList.add('table', 'table-bordered')
  table2.classList.add('table', 'table-bordered')
  const tableHeader = table.insertRow()
  const cell = tableHeader.insertCell()
  cell.textContent = 'Available times'

  const columnNames = table.insertRow()
  let cell1 = columnNames.insertCell()
  let cell2 = columnNames.insertCell()
  let cell3 = columnNames.insertCell()
  let cell4 = columnNames.insertCell()

  cell1.textContent = 'Day'
  cell2.textContent = 'Time'
  cell3.textContent = 'Duration (min)'
  cell4.textContent = 'Group Size'

  table.appendChild(tableHeader)
  table.appendChild(columnNames)

  const columnNames2 = table2.insertRow()
  cell1 = columnNames2.insertCell()
  cell2 = columnNames2.insertCell()
  cell3 = columnNames2.insertCell()
  cell4 = columnNames2.insertCell()

  cell1.textContent = 'Day'
  cell2.textContent = 'Time'
  cell3.textContent = 'Duration (min)'
  cell4.textContent = 'Group Size'

  table2.appendChild(columnNames2)

  let rows = []
  for (let i = 0; i < allMeetings.length; i++) {
    if (allMeetings[i].lecturer === lecturerDropdown.value) {
      const row = table2.insertRow()
      const cell1 = row.insertCell()
      cell1.textContent = allMeetings[i].date
      const cell2 = row.insertCell()
      cell2.textContent = allMeetings[i].time
      const cell3 = row.insertCell()
      cell3.textContent = allMeetings[i].duration
      const cell4 = row.insertCell()
      cell4.textContent = allMeetings[i].groupSize
      const cell6 = row.insertCell()
      const button = document.createElement('button')
      button.classList.add('btn', 'btn-primary')
      const response = await fetch('db/getUsername')
      const username = await response.text()
      if (username === allMeetings[i].organiser) {
        button.disabled = true
      } else if (allMeetings[i].members.includes(username)) {
        button.disabled = true
      } else if (allMeetings[i].members.length === allMeetings[i].groupSize) {
        button.disabled = true
      }
      button.addEventListener('click', async function (event) {
        await fetch(`/db/joinMeeting/${allMeetings[i]._id}`)
        window.location.reload()
      })
      button.textContent = 'Join'
      cell6.appendChild(button)
      rows.push(row)
    }
  }

  rows.sort((rowA, rowB) => {
    const dateA = new Date(rowA.cells[0].textContent)
    const dateB = new Date(rowB.cells[0].textContent)
    return dateA - dateB
  })

  while (table2.rows.length > 1) {
    table2.deleteRow(1)
  }

  rows.forEach(row => {
    table2.appendChild(row)
  })

  // Collect table rows into an array
  rows = []
  for (let i = 0; i < lecturer.day.length; i++) {
    const row = table.insertRow()
    const cell1 = row.insertCell()
    cell1.textContent = days[lecturer.day[i] - 1]
    const cell2 = row.insertCell()
    cell2.textContent = lecturer.time[i]
    const cell3 = row.insertCell()
    cell3.textContent = lecturer.duration[i]
    const cell4 = row.insertCell()
    cell4.textContent = lecturer.groupSize[i]
    rows.push(row)
  }
  rows.sort((a, b) => {
    const dayA = days.indexOf(a.cells[0].textContent) + 1
    const dayB = days.indexOf(b.cells[0].textContent) + 1
    return dayA - dayB
  })
  while (table.rows.length > 2) {
    table.deleteRow(2)
  }
  for (let i = 0; i < rows.length; i++) {
    table.appendChild(rows[i])
  }
  dropdownDiv.appendChild(table)
  existingMeetingsDiv.appendChild(table2)
})

const dateSelect = document.querySelector('#selectDate')
const timesDropdown = document.querySelector('#timesDropdown')

dateSelect.addEventListener('change', function (event) {
  const day = new Date(dateSelect.value).getDay()
  while (timesDropdown.options.length > 1) {
    timesDropdown.removeChild(timesDropdown.lastChild)
  }
  for (let i = 0; i < lecturer.time.length; i++) {
    if (lecturer.day[i] === day) {
      const option = document.createElement('option')
      option.setAttribute('value', lecturer.time[i])
      option.textContent = lecturer.time[i]
      timesDropdown.appendChild(option)
    }
  }
})
