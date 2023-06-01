'use strict'

document.querySelector('#logout_button').addEventListener('click', function (event) {
  window.history.replaceState({}, '', '/login')
})

let availability = []

fetch('/db/availability')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
  })
  .then(data => {
    availability = data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const div = document.querySelector('#availability')
    const table = document.createElement('table')
    table.classList.add('table', 'table-bordered')
    const tableHeader = table.insertRow()
    const cell = tableHeader.insertCell()
    cell.textContent = 'Current Available times'
    cell.setAttribute('colspan', '5')
    cell.style.textAlign = 'center'
    cell.style.fontWeight = 'bold'
    const headings = table.insertRow()
    const cell1 = headings.insertCell()
    cell1.innerHTML = 'Day'
    const cell2 = headings.insertCell()
    cell2.innerHTML = 'Time'
    const cell3 = headings.insertCell()
    cell3.innerHTML = 'Duration (min)'
    const cell4 = headings.insertCell()
    cell4.innerHTML = 'Group Size'
    const emptycell = headings.insertCell()
    emptycell.innerHTML = ''

    const rows = []
    for (let i = 0; i < data.day.length; i++) {
      const row = table.insertRow()
      const cell2 = row.insertCell()
      const cell3 = row.insertCell()
      const cell4 = row.insertCell()
      const cell5 = row.insertCell()
      const cell6 = row.insertCell()
      cell2.innerHTML = days[data.day[i] - 1]
      cell3.innerHTML = data.time[i]
      cell4.innerHTML = data.duration[i]
      cell5.innerHTML = data.groupSize[i]
      const button = document.createElement('button')
      button.innerHTML = 'Delete'
      button.classList.add('btn', 'btn-danger')
      cell6.appendChild(button)
      button.addEventListener('click', async function () {
        await fetch(`/db/deleteAvailability/${i}`)
        window.location.reload()
      })
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
    div.appendChild(table)
  })

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
  form.appendChild(yesButton)
  buttonContainer.appendChild(form)
  buttonContainer.appendChild(noButton)

  dialog.appendChild(buttonContainer)
  document.body.appendChild(dialog)
  dialog.showModal()
})

const addAvailabilityButton = document.querySelector('#submitSchedule')
const dayDropdown = document.querySelector('#daysDropdown')
const timeDropdown = document.querySelector('#time')
const durationInput = document.querySelector('#duration')

function CheckAvailability () {
  addAvailabilityButton.disabled = false
  for (let i = 0; i < availability.time.length; i++) {
    if (availability.day[i] === Number(dayDropdown.value)) {
      const startTime = new Date()
      startTime.setHours(availability.time[i].split(':')[0], availability.time[i].split(':')[1], 0, 0)
      const endTime = new Date()
      endTime.setHours(availability.time[i].split(':')[0], availability.time[i].split(':')[1], 0, 0)
      endTime.setMinutes(endTime.getMinutes() + availability.duration[i])
      const startTimeNew = new Date()
      startTimeNew.setHours(timeDropdown.value.split(':')[0], timeDropdown.value.split(':')[1], 0, 0)
      const endTimeNew = new Date()
      endTimeNew.setHours(timeDropdown.value.split(':')[0], timeDropdown.value.split(':')[1], 0, 0)
      endTimeNew.setMinutes(endTimeNew.getMinutes() + Number(durationInput.value))
      if ((startTimeNew.getTime() >= startTime.getTime() && startTimeNew.getTime() < endTime.getTime()) | (endTimeNew.getTime() > startTime.getTime() && endTimeNew.getTime() <= endTime.getTime())) {
        addAvailabilityButton.disabled = true
        break
      }
    }
  }
}

timeDropdown.addEventListener('change', CheckAvailability)
dayDropdown.addEventListener('change', CheckAvailability)
durationInput.addEventListener('change', CheckAvailability)
