import async from 'async';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import request from 'request';
import qs from 'querystring';
import User from './userModel';

function generateToken(user) {
  var payload = {
    iss: 'my.domain.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

/**
 * Login required middleware
 */
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};
/**
 * POST /login
 * Sign in with email and password
 */
export function loginPost(req, res, next) {
  req.assert('name', 'Username cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  // req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  User.findOne({ name: req.body.name }, function (err, user) {
    if (!user) {
      return res.status(401).send({
        msg: 'The Username ' + req.body.name + ' is not associated with any account. ' +
          'Double-check your Username and try again.'
      });
    }
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ msg: 'Invalid Username or password' });
      }
      const msg = { msg: 'Well Done! You successfully logged in to this website' }
      res.send({ token: generateToken(user), user: user.toJSON(), msg: msg });
    });
  });
};

/**
 * POST /signup
 */
export function signupPost(req, res, next) {
  req.assert('name', 'Username cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  User.findOne({ name: req.body.name }, function (err, user) {
    if (user) {
      return res.status(400).send({ msg: 'The Username you have entered is already associated with another account.' });
    }
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function (err) {
      const msg = { msg: 'Well Done! You successfully signup in to this website' }
      res.send({ token: generateToken(user), user: user, msg: msg });
    });
  });
};

/**
 * PUT /change-password
 *  change password.
 */
export function changePassword(req, res, next) {
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  }

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  User.findById(req.user.id, function (err, user) {
    user.comparePassword(req.body.old_pass, function (err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ msg: 'Invalid Old password' });
      }
      if ('password' in req.body) {
        user.password = req.body.password;
      }
      user.save(function (err) {
        if ('password' in req.body) {
          res.send({ msg: 'Your password has been changed.' });
        } else {
          res.send({ msg: 'Your password has not been changed.' });
        }
      });
    });
  });
};

/**
 * PUT /change-picture
 *  change picture.
 */
export function changePicture(req, res, next) {
  req.assert('picture', 'Picture Field cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }
  User.findById(req.user.id, function (err, user) {

    user.picture = req.body.picture;

    user.save(function (err) {
      res.send({ msg: 'Profile picture Successfully Saved' });
    });
  });
};


// /**
//  * PUT /account
//  * Update profile information OR change password.
//  */
// export function accountPut (req, res, next) {
//   if ('password' in req.body) {
//     req.assert('password', 'Password must be at least 4 characters long').len(4);
//     req.assert('confirm', 'Passwords must match').equals(req.body.password);
//   } else {
//     req.assert('email', 'Email is not valid').isEmail();
//     req.assert('email', 'Email cannot be blank').notEmpty();
//     req.sanitize('email').normalizeEmail({ remove_dots: false });
//   }

//   var errors = req.validationErrors();

//   if (errors) {
//     return res.status(400).send(errors);
//   }

//   User.findById(req.user.id, function(err, user) {
//     if ('password' in req.body) {
//       user.password = req.body.password;
//     } else {
//       user.email = req.body.email;
//       user.name = req.body.name;
//       user.gender = req.body.gender;
//       user.location = req.body.location;
//       user.website = req.body.website;
//     }
//     user.save(function(err) {
//       if ('password' in req.body) {
//         res.send({ msg: 'Your password has been changed.' });
//       } else if (err && err.code === 11000) {
//         res.status(409).send({ msg: 'The email address you have entered is already associated with another account.' });
//       } else {
//         res.send({ user: user, msg: 'Your profile information has been updated.' });
//       }
//     });
//   });
// };

/**
 * DELETE /account
 */
// export function accountDelete (req, res, next) {
//   User.remove({ _id: req.user.id }, function(err) {
//     res.send({ msg: 'Your account has been permanently deleted.' });
//   });
// };

// /**
//  * GET /unlink/:provider
//  */
// export function unlink (req, res, next) {
//   User.findById(req.user.id, function(err, user) {
//     switch (req.params.provider) {
//       case 'facebook':
//         user.facebook = undefined;
//         break;
//       case 'google':
//         user.google = undefined;
//         break;
//       case 'twitter':
//         user.twitter = undefined;
//         break;
//       case 'vk':
//         user.vk = undefined;
//         break;
//       case 'github':
//           user.github = undefined;
//         break;      
//       default:
//         return res.status(400).send({ msg: 'Invalid OAuth Provider' });
//     }
//     user.save(function(err) {
//       res.send({ msg: 'Your account has been unlinked.' });
//     });
//   });
// };

// /**
//  * POST /forgot
//  */
// export function forgotPost (req, res, next) {
//   req.assert('email', 'Email is not valid').isEmail();
//   req.assert('email', 'Email cannot be blank').notEmpty();
//   req.sanitize('email').normalizeEmail({ remove_dots: false });

//   var errors = req.validationErrors();

//   if (errors) {
//     return res.status(400).send(errors);
//   }

//   async.waterfall([
//     function(done) {
//       crypto.randomBytes(16, function(err, buf) {
//         var token = buf.toString('hex');
//         done(err, token);
//       });
//     },
//     function(token, done) {
//       User.findOne({ email: req.body.email }, function(err, user) {
//         if (!user) {
//           return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
//         }
//         user.passwordResetToken = token;
//         user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
//         user.save(function(err) {
//           done(err, token, user);
//         });
//       });
//     },
//     function(token, user, done) {
//       var transporter = nodemailer.createTransport({
//         service: 'Mailgun',
//         auth: {
//           user: process.env.MAILGUN_USERNAME,
//           pass: process.env.MAILGUN_PASSWORD
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: 'support@yourdomain.com',
//         subject: '✔ Reset your password on Mega Boilerplate',
//         text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
//         'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//         'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//         'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//       };
//       transporter.sendMail(mailOptions, function(err) {
//         res.send({ msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
//         done(err);
//       });
//     }
//   ]);
// };

// /**
//  * POST /reset
//  */
// export function resetPost (req, res, next) {
//   req.assert('password', 'Password must be at least 4 characters long').len(4);
//   req.assert('confirm', 'Passwords must match').equals(req.body.password);

//   var errors = req.validationErrors();

//   if (errors) {
//       return res.status(400).send(errors);
//   }

//   async.waterfall([
//     function(done) {
//       User.findOne({ passwordResetToken: req.params.token })
//         .where('passwordResetExpires').gt(Date.now())
//         .exec(function(err, user) {
//           if (!user) {
//             return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
//           }
//           user.password = req.body.password;
//           user.passwordResetToken = undefined;
//           user.passwordResetExpires = undefined;
//           user.save(function(err) {
//             done(err, user);
//           });
//         });
//     },
//     function(user, done) {
//       var transporter = nodemailer.createTransport({
//         service: 'Mailgun',
//         auth: {
//           user: process.env.MAILGUN_USERNAME,
//           pass: process.env.MAILGUN_PASSWORD
//         }
//       });
//       var mailOptions = {
//         from: 'support@yourdomain.com',
//         to: user.email,
//         subject: 'Your Mega Boilerplate password has been changed',
//         text: 'Hello,\n\n' +
//         'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
//       };
//       transporter.sendMail(mailOptions, function(err) {
//         res.send({ msg: 'Your password has been changed successfully.' });
//       });
//     }
//   ]);
// };


// /**
//  * POST /auth/facebook
//  * Sign in with Facebook
//  */
// export function authFacebook (req, res) {
//   var profileFields = ['id', 'name', 'email', 'gender', 'location'];
//   var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
//   var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + profileFields.join(',');

//   var params = {
//     code: req.body.code,
//     client_id: req.body.clientId,
//     client_secret: process.env.FACEBOOK_SECRET,
//     redirect_uri: req.body.redirectUri
//   };

//   // Step 1. Exchange authorization code for access token.
//   request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
//     if (accessToken.error) {
//       return res.status(500).send({ msg: accessToken.error.message });
//     }

//     // Step 2. Retrieve user's profile information.
//     request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
//       if (profile.error) {
//         return res.status(500).send({ msg: profile.error.message });
//       }

//       // Step 3a. Link accounts if user is authenticated.
//       if (req.isAuthenticated()) {
//         User.findOne({ facebook: profile.id }, function(err, user) {
//           if (user) {
//             return res.status(409).send({ msg: 'There is already an existing account linked with Facebook that belongs to you.' });
//           }
//           user = req.user;
//           user.name = user.name || profile.name;
//           user.gender = user.gender || profile.gender;
//           user.picture = user.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
//           user.facebook = profile.id;
//           user.save(function() {
//             res.send({ token: generateToken(user), user: user });
//           });
//         });
//       } else {
//         // Step 3b. Create a new user account or return an existing one.
//         User.findOne({ facebook: profile.id }, function(err, user) {
//           if (user) {
//             return res.send({ token: generateToken(user), user: user });
//           }
//           User.findOne({ email: profile.email }, function(err, user) {
//             if (user) {
//               return res.status(400).send({ msg: user.email + ' is already associated with another account.' })
//             }
//             user = new User({
//               name: profile.name,
//               email: profile.email,
//               gender: profile.gender,
//               location: profile.location && profile.location.name,
//               picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
//               facebook: profile.id
//             });
//             user.save(function(err) {
//               return res.send({ token: generateToken(user), user: user });
//             });
//           });
//         });
//       }
//     });
//   });
// };

// export function authFacebookCallback (req, res) {
//   res.render('loading', { layout: false });
// };
// /**
//  * POST /auth/google
//  * Sign in with Google
//  */
// export function authGoogle (req, res) {
//   var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
//   var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

//   var params = {
//     code: req.body.code,
//     client_id: req.body.clientId,
//     client_secret: process.env.GOOGLE_SECRET,
//     redirect_uri: req.body.redirectUri,
//     grant_type: 'authorization_code'
//   };

//   // Step 1. Exchange authorization code for access token.
//   request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
//     var accessToken = token.access_token;
//     var headers = { Authorization: 'Bearer ' + accessToken };

//     // Step 2. Retrieve user's profile information.
//     request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
//       if (profile.error) {
//         return res.status(500).send({ message: profile.error.message });
//       }
//       // Step 3a. Link accounts if user is authenticated.
//       if (req.isAuthenticated()) {
//         User.findOne({ google: profile.sub }, function(err, user) {
//           if (user) {
//             return res.status(409).send({ msg: 'There is already an existing account linked with Google that belongs to you.' });
//           }
//           user = req.user;
//           user.name = user.name || profile.name;
//           user.gender = profile.gender;
//           user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
//           user.location = user.location || profile.location;
//           user.google = profile.sub;
//           user.save(function() {
//             res.send({ token: generateToken(user), user: user });
//           });
//         });
//       } else {
//         // Step 3b. Create a new user account or return an existing one.
//         User.findOne({ google: profile.sub }, function(err, user) {
//           if (user) {
//             return res.send({ token: generateToken(user), user: user });
//           }
//           user = new User({
//             name: profile.name,
//             email: profile.email,
//             gender: profile.gender,
//             picture: profile.picture.replace('sz=50', 'sz=200'),
//             location: profile.location,
//             google: profile.sub
//           });
//           user.save(function(err) {
//             res.send({ token: generateToken(user), user: user });
//           });
//         });
//       }
//     });
//   });
// };

// export function authGoogleCallback (req, res) {
//   res.render('loading', { layout: false });
// };

// /**
//  * GET /login-per-user/:id
//  * login-per-user/:id
//  */

//  export function loginPerUser(req, res){
//   User.findOne({ email: req.params.id }, function(err, user) {
//     if(err){
//       console.log(err);
//     }else{
//       console.log(user);
//       res.send(user);
//     }
//   });
//  }