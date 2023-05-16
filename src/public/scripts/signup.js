'use strict'

const email = document.getElementById('email')
const submitButton = document.querySelector('#signup_button')

function ValidateEmail(input) {
    const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (input.value.match(validRegex)) {
        return true;
    } else {
        return false;
    }

}

document.querySelector('#email').addEventListener('input', function (event) {
    if (event.target.matches('#email')) {
        if (!ValidateEmail(email)) {
            email.classList.add('invalid')
            email.classList.remove('valid')
        } else {
            email.classList.add('valid')
            email.classList.remove('invalid')
        }
        if (email.value == '') {
            email.classList.remove('invalid')
            email.classList.remove('valid')
        }
    }
})

function togglePassword() {
    let passwordInput = document.getElementById("password");
    let showPasswordCheckbox = document.getElementById("show_password");

    if (showPasswordCheckbox.checked) {
        passwordInput.setAttribute("type", "text");
    } else {
        passwordInput.setAttribute("type", "password");
    }
}

document.addEventListener('click', function (event) {
    togglePassword()
})

const username_element = document.getElementById('username')
const email_element = document.getElementById('email')

let usernameErrorMessage;
document.querySelector('#username').addEventListener('blur', function(){
 
    
    fetch(`/db/checkUsername/${username_element.value}`)
    .then(response =>{
        if(response.ok){
            return response.text()
        }
    })
    .then(data =>{
        const usernameDiv = document.querySelector('.username')
        if (usernameErrorMessage) {
            usernameDiv.removeChild(usernameErrorMessage);
            submitButton.disabled = false;
        }

        if(data==='true'){
            const p = document.createElement('p')
            p.classList.add('username_error')
            const text = document.createTextNode('Username is taken')
            p.appendChild(text)
            usernameDiv.appendChild(p)

            usernameErrorMessage = p;  
            submitButton.disabled = true;
        }

        else{
            // Remove the error message if it exists
            usernameErrorMessage = null;
            const p = document.querySelector('p');
            if (p) {
                usernameDiv.removeChild(p);
            }
            submitButton.disabled = false;
        }
    })
    .catch(error=>{
        console.error('Error:', error)
    })
})

let emailErrorMessage;

document.querySelector('#email').addEventListener('blur', function(){
    
    fetch(`/db/checkEmail/${email_element.value}`)
    .then(response =>{
        if(response.ok){
            return response.text()
        }
    })
    .then(data =>{
        const emailDiv = document.querySelector('.email');
        if (emailErrorMessage) {
            emailDiv.removeChild(emailErrorMessage);
            submitButton.disabled = false;
        }

        if(data==='true'){
            const p = document.createElement('p')
            p.classList.add('email_error')
            const text = document.createTextNode('This email is already registered')
            p.appendChild(text)
            emailDiv.appendChild(p)

            // Assign the error message element to the variable
            emailErrorMessage = p;
            submitButton.disabled = true;
        }
        else {
            // Remove the error message if it exists
            emailErrorMessage = null;
            const p = document.querySelector('p');
            if (p) {
                emailDiv.removeChild(p);
            }
            submitButton.disabled = false;
        }
    })
    .catch(error=>{
        console.error('Error:', error)
    })
})


let passwordErrorMessage;

document.querySelector('#password').addEventListener('blur', function(){
    const password = document.querySelector('#password')
    const passwordDiv = document.querySelector('.password')

    if (passwordErrorMessage) {
        passwordDiv.removeChild(passwordErrorMessage);
        submitButton.disabled = false;
    }

    if(password.value.length <8 && password.value.length>0){
        const p = document.createElement('p')
        p.classList.add('password_error')
        const text = document.createTextNode('Password too short')
        p.appendChild(text)
        passwordDiv.appendChild(p)

        passwordErrorMessage = p;
        submitButton.disabled = true;
    }
    else {
        // Remove the error message if it exists
        passwordErrorMessage = null;
        const p = document.querySelector('p');
        if (p) {
            passwordDiv.removeChild(p);
        }
        submitButton.disabled = false;
    }
})