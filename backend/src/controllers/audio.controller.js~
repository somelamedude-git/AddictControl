const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { Test } = require('../models/Test.model.js');

const process_audio = async(req, res)=>{
	try{
		const form = new FormData();
		const user_id = req.user_id;
		form.append('file', fs.createReadStream(req.file.path));
		const response = await axios.post('/python_processing_api', form, {
			headers:{
				...form.getHeaders(),
			},
		});

		const test = await Test.find({alchoholic_id: user_id}).sort({createdAt: -1}).limit(1);
		if(test.length<1) return res.status(401).json({success: false, message: "Either test or the user doesnt exist"});
		test[0].voice_score = response.data.prediction;
		await test[0].save();
		return res.status(200).json({
			success: true,
			voice_score: response.data.prediction
		});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({
			success: false,
			message: "Some internal server error"
		});
	}
	finally{
		if (req.file?.path && fs.existsSync(req.file.path)) {
			    fs.unlinkSync(req.file.path);
			  }
	}
}

module.exports = {
	process_audio
}




