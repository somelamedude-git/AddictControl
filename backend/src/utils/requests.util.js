const { Test } = require('../models/Test.model.js');
const { Addict } = require('../models/Users.model.js');


const can_be_taken = async(email)=>{
	try{
		const alcoholic = await Addict.findOne({email: email});
	        if(!alcoholic){
			const err = new Error('Requested user not found', {statusCode: 404});
			throw err;
		}

		const alc_id = alcoholic._id;
		const tests = await Test.find({alcoholic_id: alc_id}).sort({createdAt: -1}).limit(3).lean();
		if(tests.length == 0) return true;
		const latest_test_taken = tests[0].createdAt;
		const milliseconds_since_epoch_now = Date.now();
		const milliseconds_since_epoch_test = new Date(latest_test_taken).getTime();

		const time_diff = milliseconds_since_epoch_now-milliseconds_since_epoch_test;
		const hours_passed = time_diff/3600000;

		if(hours_passed<=3){
			return false;
		}

		if(tests.length<3) return true;

		const date_ = new Date(tests[2].createdAt).toISOString().slice(0,10);
		const date_today = new Date().toISOString().slice(0,10);

		if(date_ == date_today){
			return false;
		}
		return true;
	}
	catch(err){
		console.log(err);
		return false;
		}
}	


module.exports = {
	can_be_taken
}


