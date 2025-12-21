const nodemailer = require('nodemailer');
require('dotenv').config({'../.env'});

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth:{
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS
	}
});

transporter.verify((err)=>{
	if(err){
		console.log(err);
	}
	else{
		console.log('smtp is ready');
	}
});

const send_mail = async(email)=>{
	try{
		const info = await transporter.sendMail({
			from: `"Santulan" <${process.env.GMAIL_USER}>`,
			to: email,
			subject: "Regarding your registration into Santulan",
			html:
			`
				<p> Dear User </p>
				<P> You have been registered into <b>Santulan</b>.</p>
				<p>
					Kindly login using your email account and password given by your doctor.
					You may change it later.
				</p>
				<p>
					Thanks for taking a huge step<br/>
					<b> You are loved </b>
				</p>
				`,
		});
		return info.messageId;
	}
	catch(error){
		console.log(error);
		throw error;
	}
}

module.exports = {
	send_mail
}



