/*
  transaction.js -- Router for the Transaction
*/
const express = require('express');
const router = express.Router();
const transactionItem = require('../models/transactionItem')


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router.get('/transaction/',
  isLoggedIn,
  async (req, res, next) => {
      const completed = req.query.show=='completed'
      res.locals.show = req.query.show
      res.locals.items = 
        await transactionItem.find(
           {userId:req.user._id, createdAt}).sort({createdAt:1})
      res.render('transactions');
});

router.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
      const todo = new transactionItem(
        {item:req.body.item,
          amount: parseInt(req.body.amount),
          category: req.body.category,
          occurredAt: req.body.date,
         userId: req.user._id
        })
      await todo.save();
      res.redirect('/transaction')
});

router.get('/transaction/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/remove/:itemId")
      await transactionItem.deleteOne({_id:req.params.itemId});
      res.redirect('/transaction')
});

//create a transaction edit view
router.get('/transaction/edit/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/edit/:itemId")
      await transactionItem.findOneAndUpdate(
        {_id:req.params.itemId},
        {$set: {item:req.body.item,
        amount: parseInt(req.body.amount),
      category: req.body.category,
    occuredAt: req.body.date}} );
      res.redirect('/transaction')
});

module.exports = router;
