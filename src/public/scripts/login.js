fetch('db/incorrectLogin')
  .then(response => {
    if (response.ok) {
      return response.text()
    }
  })
  .then(data => {
    if (data === 'true') {
      const loginButtonDiv = document.getElementById('login_button_div')
      const p = document.createElement('p')
      p.classList.add('login_error')
      const text = document.createTextNode('Incorrect username or password')
      p.appendChild(text)
      loginButtonDiv.parentNode.insertBefore(p, loginButtonDiv.nextSibling)
    }
  })
  .catch(error => {
    console.error('Error:', error)
  })
