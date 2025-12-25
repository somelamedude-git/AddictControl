const {User, Addict, Family} = require('../models/Users.model')
const {generateAccessToken, generateRefreshAccessToken} = require('../utils/tokens.utils')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const multi_purpose_login = async(req, res)=>{
	let {phone, email, password} = req.body;
	try{
		if(email){email = email.toLowerCase().trim()};
		let query = {};

		if(email && phone){
			query = {$or: [{phone: phone}, {email:email}]};
		}
		else if(email){
			query = {email:email}
		}
		else{
			query = {phone:phone}
		}

		const user = await User.findOne(query).lean();
		if(!user) return res.status(401).json({success: false, message: "Invalid credentials"});
		password = password.trim();
		const is_correct = await bcrypt.compare(password, user.password);

		if(!is_correct) return res.status(401).json({success: false, message: "Invalid credentials"});
		const role = user.role;

		return res.status(200).json({
			success: true,
			message: "logged in",
			role: role
		});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({success: false, message: "Internal error"});
	}
}

module.exports = {
    multi_purpose_login
}
