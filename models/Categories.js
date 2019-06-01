const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});
const myDb = mongoose.connection.useDb('SPCPortal');
const Category = myDb.model('Category', CategorySchema);

module.exports = Category;