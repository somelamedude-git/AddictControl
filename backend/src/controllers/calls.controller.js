const { Family } = require('../models/Users.model.js');
const { Addict } = require('../models/Users.model.js');
const axios = require('axios');
const { can_be_taken } = require('../utils/requests.util.js');
const { getSocketIO } = require('../utils/socket.util.js');

const request_phone_call = async(req, res)=>{
	const user_id = req.user_id;
	try{
		const family_member = await Family.findById(user_id.toString(), "addict_member_email").lean();
		const addict_email = family_member.addict_member_email;
		const alcoholic = await Addict.findOne({email:addict_email});

		if(!alcoholic){
			return res.status(404).json({
				success: false,
				message: "Requested user not found"
			});
		}

		const canTakeTest = await can_be_taken(addict_email);
		if(!canTakeTest){
			return res.status(429).json({
				success: false,
				message: "Test cannot be requested at this time. Please wait at least 3 hours between tests or ensure no more than 3 tests per day."
			});
		}

		const alc_id = alcoholic._id;

		const io = getSocketIO();
		io.to(`user:${alc_id}`).emit("incoming_call", {
			message: "Incoming call from family member",
			caller_id: user_id,
			test: true
		});

		return res.status(200).json({
			success:true,
			message: "Request for call sent"
		});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
}

const accept_call = async(req, res)=>{
	const user_id = req.user_id;
	const alcoholic = await Addict.findById(user_id.toString());
	const phone = alcoholic.phone;
	const response = await axios.post(`/requesttest/${user_id}`); // prompt test api
	console.log(response);

	return res.status(200).json({
		audio: process.env.AUDIO_LINK
	});
}



module.exports = {
	request_phone_call,
	accept_call
}
