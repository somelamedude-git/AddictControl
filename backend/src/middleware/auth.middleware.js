const jwt = require('jsonwebtoken');
const { User } = require('../models/users.model.js');
const {getUserFromToken} = require('../utils/tokens.utils.js');

const verifyJWT = async(req, res, next)=>{
	const token = req.header("Authorization")?.replace("Bearer ", "");
	if(!token){
		return res.status(401).json({
			success: false,
			message: "Token expired"
		});
	}

	try{
		const {id, role} = await getUserFromToken(token);
		if(!id && !role){
			return res.status(401).json({
				success: false,
				message: "Token error"
			});
		}
		req.user_id = id;
		req.user_role = role;
		next();
	}
	catch(err){
		console.log(err);
		if(err.name==='TokenExpiredError'){
			return res.status(401).json({
				success: false,
				message: "Token Expired"
			});
		}
		return res.status(401).json({
			success: false,
			message: "Unauthorized access"
		});
		
	}
}

module.exports = {
	verifyJWT
}
