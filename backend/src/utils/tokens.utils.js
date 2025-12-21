const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const generateAccessToken =  (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        process.env.ACCESS_TOKEN,
        {expiresIn: '15m'}
    )
}

const generateRefreshAccessToken = (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        process.env.REFRESH_ACCESS_TOKEN,
        {expiresIn: '15d'}
    )
}

const hashRefreshToken = async (token) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(token, salt);
};

module.exports = {
    generateAccessToken,
    generateRefreshAccessToken,
    hashRefreshToken
}
