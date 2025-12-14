const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    phone: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
}, {timestamps: true})

const User = mongoose.model('User', userschema)