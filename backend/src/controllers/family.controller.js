const { Doctor, Addict, Family} = require('../models/Users.model.js');

const registration_family = async(req, res)=>{
	const user_id = req.user._id;
	try{
		const is_doctor = await Doctor.findById(user_id);
		let { addict_email, member_phone_number, password, name, member_email } = req.body;

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

		addict_email = addict_email.toLowerCase().trim();

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

const addict_registration = async(req, res)=>{
	const user_id = req.user._id;

	try{
		const isDoctor = await Doctor.findById(user_id);
		if(!isDoctor){
			return res.status(401).json({
				success: false,
				message: "You are not authorized to perform this action"
			});
		}
		
		let { phone, email, password, name, age } = req.body;
		if(!phone || !email || !password || !name || !age){
			return res.status(400).json({
				success: false,
				message: "Kindly provide all the fields"
			});
		}

		const addict = new Addict({
			phone : phone,
			email: email,
			password: password,
			name: name,
			age: age
		});

		await addict.save();
		return res.status(200).json({
			success: true,
			message: "User registered successfully"
		});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({
			success: false,
			message: "Some internal server error"
		});
	}
}

module.exports = {
	registration_family,
	addict_registration
}

	
