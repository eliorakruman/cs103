'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var transactionItemSchema = Schema( {
  item: String,
  amount: Number,
  category: String,
  occurredAt: String,
  userId: ObjectId
} );

module.exports = mongoose.model( 'transactionItem', transactionItemSchema );
