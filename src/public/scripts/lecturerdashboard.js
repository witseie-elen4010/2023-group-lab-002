'use strict'

document.querySelector('#logout_button').addEventListener('click', function (event) {
  window.history.replaceState({}, '', '/login')
})

fetch('/db/availability')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
  })
  .then(data => {
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
