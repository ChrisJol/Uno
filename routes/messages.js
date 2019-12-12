const {
    GAME_MESSAGE_SEND,
    MESSAGE_SEND
} = require('../src/events')
const express = require('express');
const router = express.Router();
const db = require('../db/index')
const {User, Message, Game}  = require('../models');


router.post('/sendMessage', (req, res, next) => {
    User.findOne({ where: {username: req.user.username} }).then( user => {
        Message.create({messageBody: req.body.messageBody, userId: user.dataValues.id}).then( response => {
            req.app.io.emit(MESSAGE_SEND, {messageBody: req.body.messageBody, userId: user.dataValues.id})
            res.send({Message: "Message Sent :)"})
        })
    })
})

router.post('/sendMessage/:id', (req, res, next) => {
    Game.findOne({ where: { id: req.params.id }
    }).then( game => {
        console.log(game.dataValues.chatId)
        Message.create({messageBody: req.body.messageBody, userId: req.user.id, chatId: game.dataValues.chatId}).then( _ => {
            req.app.io.emit(`${GAME_MESSAGE_SEND}/${req.params.id}`, {username: req.user.username, messageBody: req.body.messageBody })
        })
    })
})

router.get('/globalMessages', function(req, res, next) {
    Message.findAll({ attributes: ['messageBody', 'userId'] })
        .then(response => {
            res.send(response)
        })
        .catch( e => console.log(e))
});

router.get("/sessionMessages/:id", (req, res, next) => {
    Game.findOne({where: { id: req.params.id }}).then( game => {
        Message.findAll({ 
            include: [{model: User}],
            attributes: ['messageBody', 'username'],
            where: {chatId: game.dataValues.chatId}
        }).then( messages => {
            res.send(messages)
        })
    })
    .catch(e => console.log(e))
})

module.exports = router;