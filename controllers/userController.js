const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator')
const User = mongoose.model('User')
const { promisify } = require('es6-promisify')

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' })
}

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' })
}

exports.validateUser = (req, res, next) => {
  const error = validationResult(req)

  if (error && error.errors.length) {
    console.log('ERROR')
    req.flash(
      'error',
      error.errors.map(err => err.msg)
    )
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash(),
    })
    return
  }

  next()
}

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name })
  await User.register(user, req.body.password)
  next()
}

exports.account = (req, res) => {
  res.render('account', { title: 'Edit your account' })
}

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
  }

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    {
      new: true,
      runValidators: true,
      context: 'query',
      useFindAndModify: false,
    }
  )
  req.flash('success', 'Updated your account!')
  res.redirect('back')
}
