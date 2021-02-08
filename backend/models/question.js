let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    type: Number,
    color: Number,
    question: String,
    explanation: String,
    answers: [{text: String, correct: Boolean}]
}, {collection: 'questions'});

module.exports = mongoose.model('Question',schema);