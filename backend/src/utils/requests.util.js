const { Test } = require('../models/Test.model.js');
const { Addict } = require('../models/Users.model.js');

const test_queue_map = new Map();

const can_be_taken = async(email)=>{
	try{
		const alcoholic = await Addict.findOne({email: email});
	        if(!alcoholic){
			const err = new Error('Requested user not found', {statusCode: 404});
			throw err;
		}

		const alc_id = alcoholic._id;
		const tests = await Test.find({alcoholic_id: alc_id}).sort({createdAt: -1}).limit(3).lean();
		const latest_test_taken = tests[0].createdAt;
		const milliseconds_since_epoch_now = Date.now();
		const milliseconds_since_epoch_test = new Date(latest_test_taken).getTime();

		const time_diff = milliseconds_since_epoch_now-milliseconds_since_epoch_latest;
		const hours_passed = time_diff/3600000;

		if(hours_passed<=3){
			return false;
		}

		const date_ = new Date(tests[2].createdAt).toISOString().slice(1,10);
		const date_today = new Date().toISOString().slice(1,10);

		if(date == date_today){
			return false;
		}
		return true;
	}
	catch(err){
		// handle later
		}
}

const request_test = async(email)=>{
	try{
		if(limit_reached(email)){
			const limit_error = new Error('Test limit for this user has already reached', { statusCode: 400});
			throw limit_error;
		}

		const new_queue;

		if(test_queue_map.has(email)){
			new_queue = test_queue_map.get(email);
		}

		new_queue.push(
		


module.exports = {
	limit_reached
}


