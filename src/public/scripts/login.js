fetch('db/incorrectLogin')
.then(response => {
    if (response.ok) {
        return response.text()
    }
})
.then(data => {
    if (data === 'true') {
        document.getElementById('login_button_div')
        const p = document.createElement('p')
        const text = document.createTextNode('Incorrect username or password')
        p.appendChild(text)
        login_button_div.appendChild(p)
    }
})
.catch(error => {    
    console.error('Error:', error)
})