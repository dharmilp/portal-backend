const mongoose = require('mongoose');
//import mongoose, { Schema } from 'mongoose';

//const UserSchema = new mongoose.Schema({
const QuestionSchema = new mongoose.Schema({
    qtype: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    question: {
        type: Object,
        required: true
    }
});

const myDb = mongoose.connection.useDb('SPCLOGIN');
const Questions = myDb.model('Question', QuestionSchema);

//export default User;
module.exports = Questions;