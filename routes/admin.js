const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-account', isAuth, adminController.getAddAccount);

router.post('/add-account',[
		body('title')
			.isString()
			.isAlphanumeric()
			.trim(),
		body('in_outcome')
			.isLength({ min:6 }),
		body('price')
			.isNumeric()
			.isInt({min: 5}),
		body('time')
			.isLength(10)	
	], isAuth, adminController.postAddAccount);

router.get('/edit-account/:accountId', isAuth, adminController.getEditAccount);

router.post('/edit-account',[
		body('title')
			.isString()
			.isAlphanumeric()
			.trim(),
		body('in_outcome')
			.isLength({ min:6 }),
		body('price')
			.isNumeric()
			.isInt({min: 5}),
		body('time')
			.isLength(10)
	], isAuth, adminController.postEditAccount);

router.delete('/account/:accountId', isAuth, adminController.deleteAccount);

router.get('/accounts', isAuth, adminController.getAccounts);

module.exports = router;


