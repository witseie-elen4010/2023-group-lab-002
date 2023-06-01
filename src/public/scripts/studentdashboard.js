'use strict'

let lecturer
let allMeetings

const lecturerDropdown = document.getElementById('lecturerDropdown')
const dropdownDiv = document.querySelector('.dropdown')
const existingMeetingsDiv = document.querySelector('#existingMeetings')
let allLecturers

function addLecturer (dbLecturer) {
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

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

lecturerDropdown.addEventListener('change', async function () {
  lecturer = null
  let i = 0
  while (lecturer === null) {
    if (allLecturers[i].username === lecturerDropdown.value) {
      lecturer = allLecturers[i]
    }
    i++
  }

  const response = await fetch('/db/getAllMeetings/' + lecturerDropdown.value)
  allMeetings = await response.json()

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
  cell.setAttribute('colspan', '4')
  cell.style.textAlign = 'center'
  cell.style.fontWeight = 'bold'
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

  const tableHeader2 = table2.insertRow()
  const cell6 = tableHeader2.insertCell()
  cell6.innerHTML = '<b>Existing meetings</b>'
  cell6.colSpan = 6
  cell6.align = 'center'

  const columnNames2 = table2.insertRow()
  cell1 = columnNames2.insertCell()
  cell2 = columnNames2.insertCell()
  cell3 = columnNames2.insertCell()
  cell4 = columnNames2.insertCell()
  const cell5 = columnNames2.insertCell()
  const cell7 = columnNames2.insertCell()

  cell1.textContent = 'Day'
  cell2.textContent = 'Time'
  cell3.textContent = 'Duration (min)'
  cell4.textContent = 'Capacity'
  cell5.textContent = 'Meeting Name'

  table2.appendChild(columnNames2)

  let rows = []
  for (let i = 0; i < allMeetings.length; i++) {
    const timeDifference = new Date(allMeetings[i].date) - new Date()
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
    if (allMeetings[i].lecturer === lecturerDropdown.value && dayDifference >= 0) {
      const row = table2.insertRow()
      const cell1 = row.insertCell()
      cell1.textContent = allMeetings[i].date
      const cell2 = row.insertCell()
      cell2.textContent = allMeetings[i].time
      const cell3 = row.insertCell()
      cell3.textContent = allMeetings[i].duration
      const cell4 = row.insertCell()
      cell4.textContent = `${allMeetings[i].members.length + 1} / ${allMeetings[i].groupSize}`
      const cell5 = row.insertCell()
      cell5.textContent = allMeetings[i].name
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

  while (table2.rows.length > 2) {
    table2.deleteRow(2)
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

dateSelect.setAttribute('min', new Date().toISOString().split('T')[0])

dateSelect.addEventListener('change', function () {
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
async function disableScheduleButton () {
  const response = await fetch(`/db/existingMeetings/${lecturer.username}/${dateSelect.value}/${timesDropdown.value}`)
  const submitSchedule = document.querySelector('#submitSchedule')
  if (await response.text() === 'true') {
    submitSchedule.disabled = true
  } else {
    submitSchedule.disabled = false
  }
}

timesDropdown.addEventListener('blur', disableScheduleButton)
dateSelect.addEventListener('blur', disableScheduleButton)

const deleteButton = document.querySelector('#deleteUser')
deleteButton.addEventListener('click', async function () {
  const dialog = document.createElement('dialog')
  dialog.classList.add('dialog')
  const form = document.createElement('form')
  form.setAttribute('method', 'post')
  form.setAttribute('action', '/db/deleteUser')
  dialog.innerHTML = 'Are you sure you want to delete your account?'

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('button-container')

  const yesButton = document.createElement('button')
  yesButton.classList.add('btn', 'btn-danger')
  yesButton.textContent = 'Yes'
  yesButton.type = 'submit'
  yesButton.addEventListener('click', function () {
    window.history.replaceState({}, '', '/login')
  })
  const noButton = document.createElement('button')
  noButton.classList.add('btn', 'btn-primary')
  noButton.textContent = 'No'
  noButton.addEventListener('click', function () {
    dialog.close()
  })
  form.appendChild (yesButton)
  buttonContainer.appendChild(form)
  buttonContainer.appendChild(noButton)

  dialog.appendChild(buttonContainer)

  document.body.appendChild(dialog)
  dialog.showModal()
})
