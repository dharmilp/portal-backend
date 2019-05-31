const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});
const myDb = mongoose.connection.useDb('SPCPortal');
const Group = myDb.model('Group', GroupSchema);

module.exports = Group;