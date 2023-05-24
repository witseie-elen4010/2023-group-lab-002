'use strict'

const lecturerDropdown = document.getElementById('lecturerDropdown')
const scheduleDiv = document.getElementById('scheduleDiv')
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

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

lecturerDropdown.addEventListener('change', function (Event) {
  let lecturer = null
  let i = 0
  while (lecturer === null) {
    if (allLecturers[i].username === lecturerDropdown.value) {
      lecturer = allLecturers[i]
    }
    i++
  }
  if (scheduleDiv.hasChildNodes('table')) {
    scheduleDiv.removeChild(scheduleDiv.lastChild)
  }
  const table = document.createElement('table')
  table.classList.add('table', 'table-bordered')
  const tableHeader = table.insertRow()
  const cell = tableHeader.insertCell()
  cell.textContent = 'Available times'

  const columnNames = table.insertRow()
  const cell1 = columnNames.insertCell()
  const cell2 = columnNames.insertCell()
  const cell3 = columnNames.insertCell()
  const cell4 = columnNames.insertCell()

  cell1.textContent = 'Day'
  cell2.textContent = 'Time'
  cell3.textContent = 'Duration (min)'
  cell4.textContent = 'Group Size'

  table.appendChild(tableHeader)
  table.appendChild(columnNames)

  // Collect table rows into an array
  const rows = []
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
  scheduleDiv.appendChild(table)
})
