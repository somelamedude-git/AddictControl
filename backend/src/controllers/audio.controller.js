const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { Test } = require('../models/Test.model.js');
const s3 = require('../s3.js');

const process_audio = async(req, res)=>{
	try{
		const form = new FormData();
		const user_id = req.user_id;

		const s3FileURL = req.file.location;
		const s3Key = req.file.key;
		const bucketName = req.file.bucket;

		const s3Object = s3.getObject({
			Bucket: bucketName,
			Key: s3Key
		});

		const s3Stream = s3Object.createReadStream();

		const form = new FormData();
		        form.append('file', s3Stream, {
				            filename: req.file.originalname,
				            contentType: req.file.contentType
				        });

		const response = await axios.post('/python_processing_api', form, {
			headers:{
				...form.getHeaders(),
			},
		});

		const test = await Test.find({alcoholic_id: user_id}).sort({createdAt: -1}).limit(1);
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
}

module.exports = {
	process_audio
}




