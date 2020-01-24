const express = require('express')
const router = express.Router()
const storeController = require('../controllers/storeController')
const userController = require('../controllers/userController')
const { catchErrors } = require('../handlers/errorHandlers')
const {
  check,
  validationResult,
  buildSanitizeFunction,
} = require('express-validator')
const sanitizeBodyAndQuery = buildSanitizeFunction(['body', 'query'])

// Do work here
router.get('/', storeController.getStores)
router.get('/stores', catchErrors(storeController.getStores))

router.get('/add', storeController.addStore)
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
)
router.post(
  '/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
)

router.get('/stores/:id/edit', catchErrors(storeController.editStore))
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug))

router.get('/tags/', catchErrors(storeController.getStoresByTag))
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag))

router.get('/login', userController.loginForm)
router.get('/register', userController.registerForm)
router.post(
  '/register',
  [
    check('name')
      .exists()
      .isLength({ min: 5 })
      .trim()
      .escape()
      .withMessage('You must supply a name'),
    check('email')
      .exists()
      .isLength({ min: 5 })
      .isEmail()
      .normalizeEmail({
        gmail_remove_dots: false,
        all_lowercase: true,
        gmail_remove_subaddress: false,
      })
      .withMessage('Email not valid'),
    check('password')
      .exists()
      .isLength({ min: 5 }),
    check('password-confirm', 'Passwords do not match').custom(
      (value, { req }) => value === req.body.value
    ),
  ],
  userController.validateUser
)

module.exports = router
