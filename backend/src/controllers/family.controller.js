const { Doctor, Addict, Family} = require('../model/Users.model.js');

const registration_family = async(req, res)=>{
	const user_id = req.user._id;
	try{
		const is_doctor = await Doctor.findById(user_id);
		const { addict_email, member_phone_number, password, name, member_email } = req.body;

		if(!addict_email || !member_phone_number || !password || !name || !member_email){
			return res.status(400).json({
				success: false,
				message: "Kindly fill all the fields"
			});
		}

		if(!is_doctor){
			return res.status(401).json({
				success: false,
				message: "You are not authorized to perform this action"
			});
		}

		const addict = await Addict.findOne({email: addict_email});
		if(!addict){
			return res.status(404).json({
				success: false,
				message: "The email of the person needing help doesn't exist"
			});
		}
		
		const member = new Family({
			phone: member_phone_number,
			email: member_email,
			password: password,
			name: name,
			addict_member_email: addict_email
		});

		await member.save();

		return res.status(200).json({
			success: true,
			message: "Member is registered now"
		});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({
			success: false,
			message: "Some internal server error, try again."
		});
	}
}

module.exports = {
	registration_family
}

	
