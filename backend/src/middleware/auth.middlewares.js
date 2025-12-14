const {User, Addict, Family} = require('../models/Users.model')
const {generateAccessToken, generateRefreshAccessToken, hashRefreshToken} = require('../utils/tokens.utils')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {hashPasswords} = require('../utils/password.util');

const register = async (req, res) => {
    try {
        const body = req.body
        const phone = body.phone, email = body.email, password = body.password;
        const sobrierity = body.sobrierity, doctor = body.doctor, name = body.name;
        const age =  body.age, language = body.language, role = body.role;
        const addictid = body.id;

        let user;
        const hashedpass = hashPasswords(password)

        if(role === 'Addict')
            user = new Addict({phone, email, password: hashedpass, sobrierity, doctor, name, age, language})
        else 
            user = new Family({phone, email, password: hashedpass, addict: addictid})
        await user.save()
        const accesstoken = generateAccessToken(user)
        const refreshaccesstoken = generateRefreshAccessToken(user)
        const hashedtoken = hashRefreshToken(refreshaccesstoken)

        user.refreshtoken.push({ token: hashedtoken });
        await user.save();

        return res.status(200).json({status: true, accesstoken, refreshaccesstoken})

    } catch (err) {
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

const login = async (req, res) => {
    try {
        const {refreshaccesstoken} = req.body
        if(!refreshaccesstoken)
            return res.status(401).json({status: false, message: "Invalid token"})

        let payload;
        payload = jwt.verify(
            refreshaccesstoken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(payload.id);
        if(!user)
            return res.status(403).json({status: false, message: "Invalid token"})

        const matches = await Promise.all(
            user.refreshtoken.map(rt =>
                bcrypt.compare(refreshaccesstoken, rt.token)
            )
        ).catch(() => false);

        const tokenMatch = matches.some(Boolean)

        if(!tokenMatch)
            return res.status(403).json({status: false, message: "Invalid token"})

        const accesstoken = generateAccessToken(user);
        return res.status(200).json({status: true, accesstoken, user})
    } catch (err) {
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

module.exports = {
    register,
    login
}