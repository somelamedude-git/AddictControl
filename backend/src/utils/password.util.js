const bcrypt = require('bcrypt');

const hashPasswords = async(password)=>{
	const saltRounds = 10;
	try{
		const hash = await bcrypt.hash(password, saltRounds);
		return hash;
	}
	catch(err){
		console.log(err);
	}
}

module.exports = {
	hashPasswords
}
