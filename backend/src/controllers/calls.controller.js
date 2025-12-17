const { Family } = require('../models/Users.model.js');
const { Addict } = require('../models/Users.model.js');
const axios = require('axios');

const request_phone_call = async(req, res)=>{
	const user_id = req.user._id;
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

		const response = await axios.post('link_to_api(add later)', {addict_email}); // add headers later
		console.log(response.data);
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

const addict_portal_call = async(req, res)=>{
	const {addict_email} = req.body;
	try{
		const addict = await Addict.findOne({email:addict_email}); // already verified

		const socket_id = socket_array[addict._id.toString()];
		io.to(socket_id).emit("incoming_call", {
			audio: ""
		});
		res.json({
			message: "called"
		});
	}
	catch(error){
		console.log('screw me');
	}
} // to be connected with frontend through socket.on


module.exports = {
	request_phone_call
}
