const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    }, 
    percentageToPass: {
        type: Number,
        required: true,
    },
    assignToGroups: [{
        type: String,
        required: true
    }],
    addQuestions: [{
        type: Object,
        require: true
    }]
});

const myDb = mongoose.connection.useDb('SPCPortal');
const Quiz = myDb.model('Quiz', QuizSchema);

module.exports = Quiz;