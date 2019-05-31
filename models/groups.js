const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});
const myDB = mongoose.connection.useDb('SPCPortal');
const Group = myDB.model('Group', GroupSchema);

module.exports = Group;