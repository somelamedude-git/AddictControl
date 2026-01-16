const mongoose = require('mongoose');
const { Test } = require('./models/Test.model');
require('dotenv').config();

const seed_test = async() =>{
    try{
        await mongoose.connect('mongodb+srv://agarwalsamiksha88_db_user:adcon123@cluster0.iepfwcr.mongodb.net/?appName=Cluster0');

        const test = new Test({
            alcoholic_id:'6968e7653cc44388a1db40d7',
        });

        await test.save();
    }
    catch(err){
        console.log(err);
    }
}

seed_test();