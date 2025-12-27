const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {User} = require('../models/users.model.js');

const generateAccessToken =  (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        process.env.ACCESS_TOKEN,
        {expiresIn: '15m'}
    )
}

const generateRefreshAccessToken = (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        process.env.REFRESH_ACCESS_TOKEN,
        {expiresIn: '15d'}
    )
}

const hashRefreshToken = async (token) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(token, salt);
};

const getUserFromToken = async(token)=>{
	if(!token) {console.log('Token not found'); return {id: null, role: null};}
	let decoded;

	try{
		decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		console.log('inside guft', decoded);
		return {
			id: decoded.id,
			role: decoded.role
		};
	}
	catch(err){
		console.log('inside get user from token', err);
		throw err;
	}
}


module.exports = {
    generateAccessToken,
    generateRefreshAccessToken,
    hashRefreshToken,
	getUserFromToken
}
