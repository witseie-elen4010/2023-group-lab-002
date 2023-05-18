/* eslint-env jest */

const jsdom = require('jsdom')
const fs = require('fs')
const { JSDOM } = jsdom
const fetchMock = require('fetch-mock').sandbox();

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

describe("Test signup page", () => {
    let dom
    let document
    let window

    beforeEach(() => {
        dom = new JSDOM(fs.readFileSync('./src/views/signup.html', 'utf-8'), {
            runScripts: "dangerously",
            resources: "usable"
        })

        document = dom.window.document
        window = dom.window
        window.eval(fs.readFileSync('./src/public/scripts/signup.js', 'utf-8'))

    })

    it('Check if username is available', async() =>{
        fetchMock.mock('/db/checkUsername/PKala', {
            status: 200,
            body: 'true'
        })
        window.fetch = fetchMock.sandbox()

        const usernameInput = document.getElementById('username');
        usernameInput.value = 'PKala'

        usernameInput.dispatchEvent(new window.Event('blur'))
        await sleep(100)
        
        const usernameDiv = document.querySelector('.username p');
        expect(usernameDiv).not.toBeNull();

    }) 

    it('Check if email is valid', async() =>{
        const emailInput = document.getElementById('email');
        emailInput.value = 'testexample.com'

        emailInput.dispatchEvent(new window.Event('input'))

        expect(emailInput.classList.contains('invalid')).toBe(true)
        expect(emailInput.classList.contains('valid')).toBe(false)

        emailInput.value = 'test@example.com'

        emailInput.dispatchEvent(new window.Event('input'))
        expect(emailInput.classList.contains('invalid')).toBe(false)
        expect(emailInput.classList.contains('valid')).toBe(true)
    })

    it('Check if email is available', async() =>{
        fetchMock.mock('/db/checkEmail/pj.kala97@gmail.com', {
            status: 200,
            body: 'true'
        })
        window.fetch = fetchMock.sandbox()

        const emailInput = document.getElementById('email');
        emailInput.value = 'pj.kala97@gmail.com'
    
        emailInput.dispatchEvent(new window.Event('blur'))
        await sleep(100)
        
        const emailDiv = document.querySelector('.email p');
        expect(emailDiv).not.toBeNull();

    }) 

    it('check if password is valid', async() =>{
    
        const passwordInput = document.getElementById('password');
        passwordInput.value = 'abcd'

        passwordInput.dispatchEvent(new window.Event('blur'))
        await sleep(100)
        
        const passwordDiv = document.querySelector('.password #error');
        expect(passwordDiv.classList.contains('password_error')).toBe(true)
    })


})