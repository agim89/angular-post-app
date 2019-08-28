const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
let users = {
  createUser: (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save().then(result => {
        res.status(200).json(result);
      }).catch(error => {
        res.status(500).json({message: 'Invalid credentials!'})
      })
    })
  },

  login: (req, res, next) => {scasccascascasccsacascsac
    let fetchedUser;
    User.findOne({email: req.body.email}).then(user => {
      if (!user) {
        return res.status(401).json('Authenticaton faild');
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
      if (!result) {
        return res.status(401).json({error: {message: 'Authenticaton faild'}});
      }

      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, config.JWT_KEY, {expiresIn: "1h"});
      res.status(200).json({token: token, expiresIn: 3600, userId: fetchedUser._id});

    }).catch(error => {
      res.status(401).json({message: 'Creating post failed!'});
    })
  }


}

// ose ne kete menyre mundet
// exports.login = function ketu ne vazhdim

module.exports = users;
