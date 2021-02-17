const express = require('express');
const router = express.Router();
const Question = require('../models/question');

router.get('/', async (req, res) => {

    console.log(req.query.type)
    let questions;
    if(req.query.type)
        questions = await Question.find({type: {$in: req.query.type}})
    else 
        questions = await Question.find({});
    
    if(!questions)
        res 
            .status(404)
            .json({message: 'not found'})
    else 
        res.json(questions)
});

module.exports = router;