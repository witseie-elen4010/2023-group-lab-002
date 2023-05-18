'use strict'

const express = require('express')
const dbAPI = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.connect("mongodb+srv://consultation:Em73gnZ6CfElljU1@consultation-web.mp2vkpc.mongodb.net/consultation?retryWrites=true&w=majority")
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    type: String,
    name: String,
    email: String
})
const User = mongoose.model('User', userSchema)

dbAPI.post('/login', async function (req, res) {
    const user = await User.findOne({username: req.body.username})
    if (!user){
        req.session.errorLogin = true
        res.redirect('/login')
    }
    else if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user
        if(user.type == 'lecturer'){
            res.redirect('/lecturerDashboard')
        }
        else{
            res.redirect('/studentdashboard')
        }
    }
    else {
        req.session.errorLogin = true
        res.redirect('/login')
    }
})

dbAPI.get('/incorrectLogin', function (req, res) {
    res.send(req.session.errorLogin)
})

dbAPI.get('/checkUsername/:username', async function(req, res){
    const user = await User.findOne({username: req.params.username})
    if (user){
        res.send('true')
    }
    else{
        res.send('false')       
    }
})

dbAPI.get('/checkEmail/:email', async function(req, res){
    const user = await User.findOne({email: req.params.email})
    if (user){
        res.send('true')
    }
    else{
        res.send('false')
    }
})

dbAPI.post('/signup', async function (req, res) {
    const hashPassword = await bcrypt.hash(req.body.password,12)
    const newUser = new User({ name: req.body.name, username: req.body.username, email: req.body.email, password: hashPassword, type: req.body.position})
    await newUser.save()
    req.session.user = newUser
    res.redirect('/dashboard')
})

//Use later for deleting existing accounts
dbAPI.post('/delete', async function(req, res){
    await User.deleteOne({username: req.body.username})
    res.redirect('/login')
})

module.exports = dbAPI
