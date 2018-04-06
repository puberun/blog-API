var express = require('express');
const bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require('../../config');
var bcrypt = require('bcryptjs');
var User = require('../../models/user');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/', function(req, res) {




    var email = req.body.email;
    console.log(email);

    User.loginCreche(email, function(err, user) {

    if (err) return res.status(500).send('Error on the server.');

    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token, message: "successfully logged in!" });
  });
});

module.exports = router;