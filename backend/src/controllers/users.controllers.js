const { User, Addict, Family } = require('../models/Users.model.js');

const make_object = (user)=>{
	return {
		name: user.name,
		email: user.email,
		phone: user.phone
	};
}

const profile_addict = async(req, res)=>{
	const user_id = req.user_id;
	try{
		const user = await Addict.findById(user_id);
		const basic_info = make_object(user);
		return res.status(200).json({
			basic_info,
			sobriety: user.sobriety
		});
	}
	catch(err){
		return res.status(500).json({
			success: false,
			message: "Some internal server error"
		});
	}
}

const profile_member = async(req, res)=>{
	const user_id = req.user_id;
	try{
		const user = await Family.findById(user_id);
		const basic_info = make_object(user);
		return res.status(200).json({
			basic_info,
			addict_member: user.addict_member_email
		});
	}
	catch(err){
		return res.status(500).json({
			success: false,
			message: "Some internal server error"
		});
	}
}

module.exports = {
	profile_addict,
	profile_member
}
