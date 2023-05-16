'use strict'

const email = document.getElementById('email')

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
