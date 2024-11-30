const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Bill = require('../models/Bill');

// Validation middleware
const validateBill = [
  body('itemName').trim().notEmpty().withMessage('Item name is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

// Get all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.render('index', { bills, messages: req.flash() });
  } catch (error) {
    req.flash('error', 'Error fetching bills');
    res.redirect('/');
  }
});

// Create new bill
router.post('/', validateBill, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array().map(err => err.msg).join(', '));
      return res.redirect('/');
    }

    const { itemName, quantity, price } = req.body;
    const total = quantity * price;
    
    const bill = new Bill({
      itemName,
      quantity,
      price,
      total,
      status: 'Not Paid'
    });

    await bill.save();
    req.flash('success', 'Bill created successfully');
    res.redirect('/');
  } catch (error) {
    req.flash('error', 'Error creating bill');
    res.redirect('/');
  }
});

// Update bill status
router.post('/update-status/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      req.flash('error', 'Bill not found');
      return res.redirect('/');
    }

    if (bill.status === 'Not Paid') {
      bill.status = 'Paid';
      bill.paymentDate = new Date();
      await bill.save();
      req.flash('success', 'Payment status updated successfully');
    }

    res.redirect('/');
  } catch (error) {
    req.flash('error', 'Error updating payment status');
    res.redirect('/');
  }
});

// Delete bill
router.post('/delete/:id', async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    req.flash('success', 'Bill deleted successfully');
    res.redirect('/');
  } catch (error) {
    req.flash('error', 'Error deleting bill');
    res.redirect('/');
  }
});

module.exports = router;