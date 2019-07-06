const mongoose = require('mongoose');

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
    },
    option1: {
        type: Object,
        required: true
    },
    option2: {
        type: Object,
        required: true
    },
    option3: {
        type: Object,
        required: true
    },
    option4: {
        type: Object,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

const myDb = mongoose.connection.useDb('SPCPortal');
const Questions = myDb.model('QuestionWithAnswer', QuestionSchema);

module.exports = Questions;