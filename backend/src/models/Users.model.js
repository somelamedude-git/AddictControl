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
    password: {
        type: String,
        required: true
    },
	name:{
		type:String,
		required: true
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
}, {timestamps: true, discriminatorKey: 'role'})

const addictSchema = new mongoose.Schema({
    sobrierity: {
        type: Number,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
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
}, {timestamps: true})

const familyschema = new mongoose.Schema({
    addict: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Addict",
        required: true
    },
});

const doctorSchema = new mongoose.Schema({
	associated_organisation:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Organisation'
	}
}

const User = mongoose.model('User', userschema)
const Addict = User.discriminator('Addict', addictSchema)
const Family = User.discriminator('Family', familyschema); 
const Doctor = User.discriminator('Doctor', doctorSchema);

module.exports = {
    User,
    Addict,
    Family
}
