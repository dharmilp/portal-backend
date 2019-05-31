const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;