const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {User} = require('../models/Users.model.js');

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
		decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
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

const refresh = async(req, res)=>{
	const { token } = req.body;
	if(!token) return res.status(401).json({message: "Refresh token expired"});
	let decoded;
	try{
		decoded = jwt.verify(token, process.env.REFRESH_ACCESS_TOKEN);
		const user = await User.findById(decoded.id.toString());
		if(!user || !user.refreshtoken){
			return res.status(403).json({success: false, message: "Invalid session"});
		}
		const isMatch = await bcrypt.compare(user.refreshtoken, token);
		if(!isMatch){
			return res.status(403).json({success: false, message: "Invalid token"});
		}
		const id = decoded.id;
		const role = decoded.role;

		const newAccessToken = jwt.sign({id: id, role: role}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '15m'});
		res.json({newAccessToken});
	}
	catch(err){
		return res.status(403).json({success: false, message: "Login again, token expired"});
	}
}


module.exports = {
    generateAccessToken,
    generateRefreshAccessToken,
    hashRefreshToken,
	getUserFromToken,
	refresh
}
