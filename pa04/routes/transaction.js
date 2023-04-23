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
      res.locals.show = req.query.show
      res.locals.items = 
        await transactionItem.find(
           {userId:req.user._id}).sort({occurredAt:1})
      res.render('transactions');
});

router.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
      const transaction = new transactionItem(
        {item:req.body.item,
          amount: parseFloat(req.body.amount),
          category: req.body.category,
          occurredAt: req.body.occurredAt,
         userId: req.user._id
        })
      await transaction.save();
      res.redirect('/transaction')
});

router.get('/transaction/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/remove/:itemId")
      await transactionItem.deleteOne({_id:req.params.itemId});
      res.redirect('/transaction')
});

router.get('/transaction/edit/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/edit/:itemId")
      const item = 
       await transactionItem.findById(req.params.itemId);
      res.locals.item = item
      res.render('transactionEdit', {id:item})
});

router.post('/transaction/updateTransactionItem',
  isLoggedIn,
  async (req, res, next) => {
      const {itemId,item,amount,category,occurredAt} = req.body;
      console.log("inside /transaction/updateTransactionItem/:itemId");
      await transactionItem.findOneAndUpdate(
        {_id:itemId},
        {$set: {item,amount,category,occurredAt}} );
      res.redirect('/transaction')
});

module.exports = router;
