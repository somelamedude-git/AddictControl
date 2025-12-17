const {generate} = require('../utils/generateques.util')

const givetest = async(req, res) => {
    try {
        const test = await generate();
        if(!test.questions || test.questions.length !== 5)
            return res.status(401).json({status:false, message:"Gemini error"})
        return res.status(200).json({status: true, test});
    } catch (err) {
        console.log(err)
        return res.status(500).json({status:false, message: "Internal server error"})
    }
}

module.exports = {
    givetest
}