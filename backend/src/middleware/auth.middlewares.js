const {User, Addict, Family} = require('../models/Users.model')
const {generateAccessToken, generateRefreshAccessToken} = require('../utils/tokens.utils')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const {phone, email, password} = req.body;
        const addict = await Addict.findOne({phone, email})

        if(!addict) 
            return res.status(404).json({status: false, message: "User not found"})
        const match =await bcrypt.compare(password, addict.password)
        if(!match)
            return res.status(401).json({status: false, message: "Invalid password"})

        const accesstoken = generateAccessToken(addict)
        const refreshaccesstoken = generateRefreshAccessToken(addict)

        addict.refreshtoken.push({ token: refreshaccesstoken });
        await addict.save()

        const userData = addict.toObject();

        return res.status(200).json({status: true, accesstoken, userData});
    } catch (err) {
        console.log(err)
        return res.status(500).json({status:false, message: "Internal server error"})
    }
}

module.exports = {
    login
}