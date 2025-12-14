const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true
    },
}, {timestamps: true, discriminatorKey: 'role'})

const addictSchema = new mongoose.Schema({
    sobrierity: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        enum: ['Hindi', 'English'],
        default: 'Hindi'
    }
}, {timestamps: true})

const User = mongoose.model('User', userschema)
const Addict = User.discriminator('Addict', addictSchema)