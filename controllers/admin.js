const Account = require('../models/account');
const { validationResult } = require('express-validator');

const ITEMS_PER_PAGE = 20;

exports.getAddAccount = (req, res, next) => {
	res.render('admin/edit-account', {
		pageTitle: 'Add account',
		path: '/admin/add-account',
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: []
	});
};
 
exports.postAddAccount = (req, res, next) => {
	const title = req.body.title;
	const in_outcome = req.body.in_outcome;
	const price = req.body.price;
	const detail = req.body.detail;
	const time = req.body.time;
	const errors = validationResult(req);
	
	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-account', {
			pageTitle: 'Add Account',
			path: '/admin/add-account',
			editing: false,
			hasError: true,
			account: {
				title: title,
				in_outcome: in_outcome,
				price: price,
				time: time,
				detail: detail
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}
	
	const account = new Account({
		title: title,
		in_outcome: in_outcome,
		price: price,
		detail: detail,
		time: time,
		owner: req.user
	});
	account.save()
		.then(result => {
			console.log('Created Account');
			res.redirect('/admin/accounts');
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getEditAccount = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	
	const accouId = req.params.accountId;
	Account.findById(accouId)
		.then(account => {
			if (!account) {
				return res.redirect('/');
			}
			res.render('admin/edit-account', {
				pageTitle: 'Edit Account',
				path: '/admin/edit-account',
				editing: editMode,
				account: account,
				hasError: false,
				errorMessage: null,
				validationErrors: []
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postEditAccount = (req, res, next) => {
	const accouId = req.body.accountId;
	const updatedTitle = req.body.title;
	const updatedIn_outcome = req.body.in_outcome;
	const updatedPrice = req.body.price;
	const updatedDetail = req.body.detail;
	const updatedTime = req.body.time;

	const errors = validationResult(req);
	
	if (!errors.isEmpty()) {	
		return res.status(422).render('admin/edit-account', {
        pageTitle: 'Edit Account',
        path: '/admin/edit-account',
        editing: true,
		hasError: true,
        account: {
			title: updatedTitle,
			in_outcome: updatedIn_outcome,
			price: updatedPrice,
			time: updatedTime,
			detail: updatedDetail,
			_id: accouId
		},
		errorMessage: errors.array()[0].msg,
		validationErrors: errors.array()
      });
	}
	
	Account.findById(accouId)
		.then(account => {
			if (account.owner.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			account.title = updatedTitle;
			account.in_outcome = updatedIn_outcome;
			account.price = updatedPrice;
			account.detail = updatedDetail;
			account.time = updatedTime;
			return account.save();
		})
		.then(result => {
			console.log('Updated Account!');
			res.redirect('/admin/accounts');
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getAccounts = (req, res, next) => {
	
	const page = +req.query.page || 1;
	let totalItems;
	var dateSum = new Array();
	
	Account.find({owner: req.user._id})
	.sort({ time: -1 })
	.then(accounts => {
		accounts.forEach(a => {
			if (a.in_outcome == 'outcome') {
				a.price *= -1;
			} 
			if (typeof dateSum[a.time] == 'undefined') {
				dateSum[a.time] = a.price;
			}
			else {
				dateSum[a.time] += a.price;
			}
		})
	})
	
	Account.find({owner: req.user._id})
	.countDocuments()
	.then(numAccounts => {
		totalItems = numAccounts;
		return Account.find({owner: req.user._id}).sort({time:-1})
			.skip((page-1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE);
		})
	.then(accounts => {
		res.render('admin/accounts', {
			accous: accounts,
			pageTitle: 'Admin Accounts',
			path: '/admin/accounts',
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			dateSum: dateSum
		});
	})
	.catch(err => {
		const error = new Error(err);
		console.log(err);
		error.httpStatusCode = 500;
		return next(error);
	});
};

exports.deleteAccount = (req, res, next) => {
	
	const accouId = req.params.accountId;
	
	Account.deleteOne({_id: accouId, owner: req.user._id })
    .then(() => {
      console.log('Destroyed Account');
      res.status(200).json({message: 'Success!'});
    })
    .catch(err => {
		res.status(500).json({message: 'Deleting account failed.'});
	});
	
};

