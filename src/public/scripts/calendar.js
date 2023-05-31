'use strict'

let meetings = []

const date = new Date()
let year = date.getFullYear()
let month = date.getMonth()

fetch('/db/getMeetings')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
  })
  .then(meetingsDB => {
    meetings = meetingsDB
    createCalendar(year, month)
  })

function createCalendar (year, month) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()

  const calendar = document.getElementById('calendar')
  calendar.innerHTML = ''

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const monthYear = document.createElement('h3')
  monthYear.innerHTML = months[month] + ' ' + year
  calendar.appendChild(monthYear)

  const table = document.createElement('table')
  table.classList.add('table', 'table-bordered')

  const thead = document.createElement('thead')
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const tr = document.createElement('tr')

  for (let i = 0; i < daysOfWeek.length; i++) {
    const th = document.createElement('th')
    th.innerHTML = daysOfWeek[i]
    tr.appendChild(th)
  }

  thead.appendChild(tr)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  let day = 1
  let currentRow = document.createElement('tr')

  for (let i = 0; i < firstDay.getDay(); i++) {
    const td = document.createElement('td')
    currentRow.appendChild(td)
  }

  for (let i = 0; i < daysInMonth; i++) {
    const td = document.createElement('td')
    td.innerHTML = day

    if (year === currentYear && month === currentMonth && day === currentDay) {
      td.classList.add('current-day')
    }

    for (let j = 0; j < meetings.length; j++) {
      const meetingDate = new Date(meetings[j].date)
      const meetingYear = meetingDate.getFullYear()
      const meetingMonth = meetingDate.getMonth()
      const meetingDay = meetingDate.getDate()
      const timeDifference = meetingDate.getTime() - currentDate.getTime()
      const TotalDays = Math.ceil(timeDifference / (1000 * 3600 * 24))
      if (year === meetingYear && month === meetingMonth && day === meetingDay && TotalDays >= 0) {
        if (td.classList.contains('current-day')) {
          td.classList.remove('current-day')
          td.classList.add('current-meeting-day')
        } else {
          td.classList.add('meeting-day')
        }
        td.style.cursor = 'pointer'
        td.addEventListener('click', async function () {
          const orgName = await fetch('/db/getName/' + meetings[j].organiser)
          const lectName = await fetch('/db/getName/' + meetings[j].lecturer)
          const members = []
          for (let k = 0; k < meetings[j].members.length; k++) {
            const memeber = await fetch('/db/getName/' + meetings[j].members[k])
            members.push(await memeber.text())
          }
          const dialog = document.createElement('dialog')
          const btn = document.createElement('span')
          btn.classList.add('close')
          btn.innerHTML = '&times;'
          btn.addEventListener('click', function () {
            dialog.close()
          })
          dialog.appendChild(btn)
          let p
          p = document.createElement('p')
          p.innerHTML = 'Name: ' + meetings[j].name
          dialog.appendChild(p)
          p = document.createElement('p')
          p.innerHTML = 'Lecturer: ' + await lectName.text()
          dialog.appendChild(p)
          p = document.createElement('p')
          p.innerHTML = 'Organiser: ' + await orgName.text()
          dialog.appendChild(p)
          p = document.createElement('p')
          p.innerHTML = 'Time: ' + meetings[j].time
          dialog.appendChild(p)
          p = document.createElement('p')
          p.innerHTML = 'duration:' + meetings[j].duration
          dialog.appendChild(p)
          p = document.createElement('p')
          p.innerHTML = 'Members: ' + members
          dialog.appendChild(p)
          const response = await fetch('/db/getUsername')
          const username = await response.text()
          console.log(username)
          if (meetings[j].members.includes(username)) {
            const button = document.createElement('button')
            button.textContent = 'Leave'
            button.classList.add('btn', 'btn-danger')
            button.addEventListener('click', async function () {
              const response = await fetch(`/db/leaveMeeting/${meetings[j]._id}`)
              if (response.ok) {
                window.location.reload()
              }
            })

            dialog.appendChild(button)
          } else if (meetings[j].lecturer === username | meetings[j].organiser === username) {
            const button = document.createElement('button')
            button.textContent = 'Cancel'
            button.classList.add('btn', 'btn-danger')
            button.addEventListener('click', async function () {
              const response = await fetch(`/db/deleteMeeting/${meetings[j]._id}`)
              if (response.ok) {
                window.location.reload()
              }
            })

            dialog.appendChild(button)
          }
          document.body.appendChild(dialog)
          dialog.showModal()
        })
      }
    }

    currentRow.appendChild(td)

    if ((firstDay.getDay() + i + 1) % 7 === 0) {
      tbody.appendChild(currentRow)
      currentRow = document.createElement('tr')
    }

    day++
  }

  if (currentRow.children.length > 0) {
    tbody.appendChild(currentRow)
  }

  table.appendChild(tbody)
  calendar.appendChild(table)
}

function changeMonth (offset) {
  month += offset

  if (month < 0) {
    month = 11
    year--
  } else if (month > 11) {
    month = 0
    year++
  }

  createCalendar(year, month)
}

// Attach event listeners to previous and next buttons
document.getElementById('previous-btn').addEventListener('click', function () {
  changeMonth(-1)
})

document.getElementById('next-btn').addEventListener('click', function () {
  changeMonth(1)
})
