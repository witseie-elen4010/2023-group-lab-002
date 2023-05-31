'use strict'

console.log('hello')
let logs = []

const tableDiv = document.querySelector('#logTable')
const table = document.createElement('table')
table.classList.add('table', 'table-bordered')
const tableHeader = table.insertRow()
const cell1 = tableHeader.insertCell()
cell1.textContent = 'Date'
const cell2 = tableHeader.insertCell()
cell2.textContent = 'Time'
const cell3 = tableHeader.insertCell()
cell3.textContent = 'Username'
const cell4 = tableHeader.insertCell()
cell4.textContent = 'Nature'
table.appendChild(tableHeader)
fetch('/db/getLogs')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    logs = data
    for (let i = 0; i < logs.length; i++) {
      const row = table.insertRow()
      const cell1 = row.insertCell()
      cell1.textContent = logs[i].date
      const cell2 = row.insertCell()
      cell2.textContent = logs[i].time
      const cell3 = row.insertCell()
      cell3.textContent = logs[i].username
      const cell4 = row.insertCell()
      cell4.textContent = logs[i].nature
    }
  })

tableDiv.appendChild(table)
