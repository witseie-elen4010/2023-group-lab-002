'use strict'

let logs = []

const tableDiv = document.querySelector('#logTable')
const table = document.createElement('table')
table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover', 'table-sm')
const tableHeader = table.createTHead().insertRow()
tableHeader.align = 'center'
const cell1 = tableHeader.insertCell()
cell1.innerHTML = '<b>Date</b>'
const cell2 = tableHeader.insertCell()
cell2.innerHTML = '<b>Time (UTC)</b>'
const cell3 = tableHeader.insertCell()
cell3.innerHTML = '<b>Username</b>'
const cell4 = tableHeader.insertCell()
cell4.innerHTML = '<b>Nature</b>'
const cell5 = tableHeader.insertCell()
cell5.innerHTML = '<b>Role</b>'
table.appendChild(tableHeader)
fetch('/db/getLogs')
  .then(response => response.json())
  .then(data => {
    logs = data
    const tbody = table.createTBody()
    tbody.align = 'center'
    for (let i = 0; i < logs.length; i++) {
      const row = tbody.insertRow()
      const cell1 = row.insertCell()
      cell1.textContent = logs[i].date
      const cell2 = row.insertCell()
      cell2.textContent = logs[i].time
      const cell3 = row.insertCell()
      cell3.textContent = logs[i].username
      const cell4 = row.insertCell()
      cell4.textContent = logs[i].nature
      const cell5 = row.insertCell()
      cell5.textContent = logs[i].role
    }
  })

tableDiv.appendChild(table)
