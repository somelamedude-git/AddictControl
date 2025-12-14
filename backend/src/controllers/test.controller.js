const Test = require('../models/Test.model');

const fetch_past_results = async(req, res)=>{
	let {limit} = req.body;
	limit = Math.min(Number(limit)||5, 10);
	const user_id = req.user._id;
	try{
		const test_results = await Test.find({alcohol_id:user_id}).sort({createdAt:-1}).limit(limit);
		return res.status(200).json({
			success: true,
			test_results: test_results,
		});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({
			success: false,
			message: "Couldn't fetch results, try again
		});
	}
}

module.exports = {
	fetch_past_results
}

