const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quizName: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
    },
    passFail: {
        type: String
    }
});
const myDb = mongoose.connection.useDb('SPCPortal');
const Result = myDb.model('Results', ResultSchema);

module.exports = Result;