const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator')

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' })
}

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' })
}

exports.validateUser = (req, res, next) => {
  const error = validationResult(req)

  console.log(error)

  if (error) {
    req.flash('error', error.errors.map(err => err.msg))
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash(),
    })
    return
  }

  next()
}
