'use strict'

const express = require('express')
const dbAPI = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.connect("mongodb+srv://consultation:Em73gnZ6CfElljU1@consultation-web.mp2vkpc.mongodb.net/consultation?retryWrites=true&w=majority")
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    type: String
})
const User = mongoose.model('User', userSchema)

dbAPI.post('/login', async function (req, res) {
    const user = await User.findOne({username: req.body.username})
    if (!user){
        res.status(401).send('Username or password is incorrect')
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
        res.status(401).send('Username or password is incorrect')
    }
})

module.exports = dbAPI