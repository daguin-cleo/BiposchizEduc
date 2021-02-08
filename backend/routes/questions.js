const express = require('express');
const router = express.Router();
const Question = require('../models/question');

router.get('/', (req, res, next) => {
    res
        .status(200)
        .json({message: 'je suis au /'})
});


router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    let questions = await Question.find({"type": id}).exec();
    console.log("je suis ici");

    if (!questions)
        res
            .status(404)
            .json({message: 'Wrong id'})
    else {
        res.json(questions)
    }


});

module.exports = router;