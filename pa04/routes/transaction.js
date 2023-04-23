/*
  transaction.js -- Router for the Transaction
*/
const express = require('express');
const router = express.Router();
const transactionItem = require('../models/transactionItem')
const User = require('../models/User')

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
      
      const sortBy = req.query.sortBy || {itemId:1}; // Default to sorting by 'itemID'
      const sortOrder = req.query.sortOrder || 'asc'; // Default to sorting in ascending order
  
  res.locals.items = 
        await transactionItem.find(
           {userId:req.user._id}).sort({ [sortBy]: sortOrder })
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

router.get('/transaction/groupByCategory',
  isLoggedIn,
  async (req, res, next) => {
    console.log("inside /transaction/groupByCategory")
    const userId = req.user._id
      let results =
            await transactionItem.aggregate(
                [ 
                  {$match:{
                    userId: userId}},
                  {$group:{
                    _id:'$category',
                    total:{$sum:1}
                    }},
                  {$sort:{total:-1}},              
                ])
        res.render('groupByCategory', {results})
      });

module.exports = router;
