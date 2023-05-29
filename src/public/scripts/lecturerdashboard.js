'use strict'

document.querySelector('#logout_button').addEventListener('click', function (event) {
  window.history.replaceState({}, '', '/login')
})
