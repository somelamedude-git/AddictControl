const mongoose = require('mongoose')
const {hashPasswords} = require('../utils/password.util.js');
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
}, {timestamps: true, discriminatorKey: 'role'});

userschema.pre("save", async function(next){
	if(!this.isModified("password")) return next();
	else{
		try{
			this.password = await hashPasswords(this.password);
			next();
		}
		catch(err){
			console.log(err);
			next(err);
		}
	}
});

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
    addict_member_email: {
	    type: String,
	    required: true
    },
});

const doctorSchema = new mongoose.Schema({
	associated_organisation:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Organisation'
	},

	verification_docs:{
		type: String,
		required: true // url is required, memory consumption will be lesser
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
