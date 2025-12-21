const { Test } = require('../models/Test.model.js');
const { Addict } = require('../models/Users.model.js');

const limit_reached = async(email)=>{
	try{
		const alcoholic = await Addict.findOne({email:email});
		if(!alcoholic){
			const err = new Error('Requested user not found', { statusCode: 404});
			throw err;
		}

		const alc_id = alcoholic._id;
		const tests = await Test.find({alcoholic_id: alc_id}).sort({createdAt:-1}).limit(3).lean();

		if(tests.length < 3){
			return false;
		}
		
		const createdAt = tests[2].createdAt;
		const date = new Date(createdAt).toISOString().slice(0, 10);

		const iso_date_today = new Date().toISOString();
		const date_today = iso_date_today.slice(0,10);

		if(date==date_today){
			return true;
		}
		else{
			return false;
		}
	}
	catch(err){
		console.log(err);
		const system_error = new Error('Some internal server error', {statusCode: 500});
		throw system_error;
	}
}

module.exports = {
	limit_reached
}


