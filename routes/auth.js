const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',
  [
    body('name')
	  .isLength({ min: 5 })
      .withMessage('Please enter a valid name.')
      .custom((value, { req }) => {
        return User.findOne({ name: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'Name exists already, please pick a different one.'
            );
          }
        });
      }),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 4 characters.'
    )
      .isLength({ min: 4 })
      .isAlphanumeric()
	  .trim(),
    body('confirmPassword')
	.trim()
	.custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

module.exports = router;