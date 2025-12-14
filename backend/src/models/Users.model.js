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
    },
    refreshtoken: [{
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }]
}, {timestamps: true})

const familyschema = new mongoose.Schema({
    adict: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Addict",
        required: true
    },
})

const User = mongoose.model('User', userschema)
const Addict = User.discriminator('Addict', addictSchema)
const Family = User.discriminator('Family', familyschema); 