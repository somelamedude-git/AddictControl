const {generate} = require('../utils/generateques.util')
const {Test} = require('../models/Test.model')
const {scoreanswer} = require('../utils/testcheck.utils');
const { Addict } = require('../models/Users.model');

const givetest = async(req, res) => {
    try {
        const {id} = req.body

        const user = await Addict.findById(id);
        if(!user || !id)
            return res.status(404).json({status: false, message: "User not found"})

        const testd = await Test.findOne({alcoholic_id: id}).sort({createdAt: -1})
        const createdAt = new Date(testd.createdAt)
        const now = new Date()
        const THIRTY_MINUTES = 30 * 60 * 1000;
        const is30MinPassed = (now - createdAt) >= THIRTY_MINUTES;

        if(is30MinPassed)
            return res.status(401).json({status: false, message: "Time to give the test exceeded"})

        const test = await generate();
        if(!test.questions || test.questions.length !== 5)
            return res.status(401).json({status:false, message:"Gemini error"})
        return res.status(200).json({status: true, test});
    } catch (err) {
        console.log(err)
        return res.status(500).json({status:false, message: "Internal server error"})
    }
}

const submitanswer = async(req, res) => {
    try {
        const {answer, question, id} = req.body;
        const user = await Addict.findById(id)
        if(!id || !user || !answer || !question)
            return res.status(404).json({status: false, message: "User not found"})

        const test = await Test.findOne({alcoholic_id: id}).sort({createdAt:-1})
        if(!test || test.attempted) 
            return res.status(404).json({status: false, message: "No test requested"})

        const nanswer = await scoreanswer(question, answer)
        test.logical_reasoning_score += nanswer.score
        await test.save()
        return res.status(200).json({status: true, nanswer})

    } catch (err) {
        console.log(err)
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

const storetest = async(req, res) => {
    try {
        const {id} = req.body
        const user = await Addict.findById(id)
        
        if(!user || !id)
            return res.status(404).json({status: false, message: "User not found"})

        const test = await Test.findOne({alcoholic_id: id}).sort({createdAt:-1})
        if(!test || test.attempted)
            return res.status(401).json({status: false, message: "Test not available"})

        test.attempted = true
        await test.save()

        return res.status(200).json({status: true, test})
    } catch(err) {
        console.log(err)
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

const requesttest = async(req, res) => {
    try {
        const {phone} = req.body;
        const user = await Addict.findOne({phone})
        if(!user || !phone)
            return res.status(404).json({status: false, message: "User not found"})

        const test = new Test({alcoholic_id: user._id});
        await test.save()

        return res.status(200).json({status: true, test});
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

module.exports = {
    givetest,
    submitanswer,
    requesttest, 
    storetest
}