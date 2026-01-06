const jwt = require('jsonwebtoken');
const { User } = require('../models/Users.model.js');
const {getUserFromToken} = require('../utils/tokens.utils.js');

const verifyJWT = async(req, res, next)=>{ // protected auth
	if(req.logged_in === false){
		return res.status(401).json({
			success: false,
			message: "User token expired"
		});
	}
	return next();
}

const authGlobal = async(req, res, next)=>{
	const token = req.header("Authorization")?.replace("Bearer ", "");
	req.logged_in = false;
	if(!token){
		return next();
	}

	try{
		const {id, role} = await getUserFromToken(token);
		if(!id || !role){
			return next();
		}

		req.user_id = id;
		req.user_role = role;
		req.logged_in = true;

		return next();
	} catch(err){
		console.log(err);

		return next();
	}
}


module.exports = {
	verifyJWT,
	authGlobal
}
