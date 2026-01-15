const fs = require('fs');
const path = require('path');
const { convertToWav } = require('../utils/ffm.util.js');
const FormData = require('form-data');
import axios from 'axios';

const getOutputPath = (inputPath)=>{
	const parsed = path.parse(inputPath);
	return path.join(parsed.dir, parsed.name + '.wav');
}
const sendToSlurClient = async(req, res)=>{
	const audioFilePath = req.file.path;
	try{
		const outputPath = getOutputPath(audioFilePath);
	    await convertToWav(audioFilePath, outputPath);

		const form = new FormData();
		form.append('file', fs.createReadStream(outputPath));

		const response = await axios.post('http://localhost:5000/predict', form, {
			headers: {
				...form.getHeaders()
			}
		});

		if(!response.data || !response.data.success){
			return res.status(500).json({
				success: false,
				message: "Error processing audio"
			});
		}
		else{
			return res.status(200).json({
				success: true,
				prediction: response.data.prediction
			})
		}
	} catch(err){
		console.log(err);
	}
}

module.exports = {
	audioFile,
	sendToSlurClient
}
