'use strict'
let lecturer
const lecturerDropdown = document.getElementById('lecturerDropdown')
const dropdownDiv = document.querySelector('.dropdown')
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
  dropdownDiv.appendChild(table)
})
const dateSelect = document.querySelector('#selectDate')
const timesDropdown = document.querySelector('#timesDropdown')

dateSelect.addEventListener('change', function (event) {
  console.log(dateSelect.value)
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
