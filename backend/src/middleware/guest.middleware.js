const guest = async(req, res){
	if(req.logged_in){
		return res.status(403).json({
			success: false,
			message: "You are already logged in"
		});
	}
}
