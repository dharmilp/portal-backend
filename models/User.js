const mongoose = require('mongoose');
//import mongoose, { Schema } from 'mongoose';

//const UserSchema = new mongoose.Schema({
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const myDb = mongoose.connection.useDb('SPCPortal');
const User = myDb.model('User', UserSchema);

//export default User;
module.exports = User;