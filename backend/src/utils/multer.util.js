const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, path.join(__dirname, '../../uploads/'));
	},
	filename: function(req, file, cb){
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	}
});

const upload = multer({
	storage,
	limits:{fileSize: 10 * 1024 * 1024},
	fileFilter: function(req, file, cb){
		if(!file.mimetype.startsWith('audio/')){
			return cb(new Error('Only audio files are allowed!'), false);
		}
		cb(null, true);
	}
});

module.exports = {
	upload
}