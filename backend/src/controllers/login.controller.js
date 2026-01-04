const {User, Addict, Family} = require('../models/Users.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshAccessToken, hashRefreshToken } = require('../utils/tokens.utils');

const multi_purpose_login = async(req, res)=>{
	let {phone, email, password} = req.body;
	try{
		if(email){email = email.toLowerCase().trim()};
		let query = {};

		if(email && phone){
			query = {$or: [{phone: phone}, {email:email}]};
		}
		else if(email){
			query = {email: email};
		}
		else{
			query = {phone:phone};
		}

		const user = await User.findOne(query);
		if(!user) return res.status(401).json({success: false, message: "Invalid credentials"});
		password = password.trim();
		const is_correct = await bcrypt.compare(password, user.password);

		if(!is_correct) return res.status(401).json({success: false, message: "Invalid credentials"});
		const role = user.role;

		const access_token = generateAccessToken(user);
		const refresh_token = generateRefreshAccessToken(user);
		const hashed_refresh_token = await hashRefreshToken(refresh_token);

		user.refreshtoken = hashed_refresh_token;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Logged in",
			role: role,
			refreshToken : refresh_token,
			accessToken: access_token
		});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({success: false, message: "Internal server error"});
	}
}

const checklogin = async(req, res)=>{
	try {
		const {refreshToken} = req.body;
		if(!refreshToken) return res.status(401).json({success: false, message: "No token provided"});
		const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const user = await User.findById(payload.user_id);
		if(!user) return res.status(401).json({success: false, message: "User doesnt exist"});
		const access_token = generateAccessToken(user);
		return res.status(200).json({success: true, accessToken: access_token});
	} catch (err) {
		console.log(err) 
		return res.status(500).json({success: false, message: "Internal server error"});
	}
}

module.exports = {
	multi_purpose_login,
	checklogin
}



