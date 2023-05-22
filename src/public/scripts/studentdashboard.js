'use strict'

const lecturer = document.getElementById('lecturerDropdown')
const scheduleDiv = document.getElementById("scheduleDiv")
lecturer.addEventListener('change', function(Event){
    if (scheduleDiv.hasChildNodes('table')){
        scheduleDiv.removeChild(scheduleDiv.lastChild)
    }
    const table = document.createElement('table')
    table.classList.add('table','table-bordered') 
    const row = table.insertRow()
    const row2 = table.insertRow()
    const cell = row.insertCell()
    const cell2 = row2.insertCell()

    cell.textContent = 'Available times'
    cell2.textContent = 'Monday 3-4 pm'
    
    scheduleDiv.appendChild(table)
})
