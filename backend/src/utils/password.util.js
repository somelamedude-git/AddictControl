const bcrypt = require('bcrypt');

const hashPasswords = async(password)=>{
	const saltRounds = 10;
	try{
		const hash = bcrypt.hash(password, saltRounds);
		return hash;
	}
	catch(err){
		console.log(err);
		throw err;
	}
}

module.exports = {
	hashPasswords
}
