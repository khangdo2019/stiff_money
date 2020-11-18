const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
var session = require('express-session');
const clientId = 'fc617d2c-6b2a-4a18-9e77-c2d25db45143';
const clientSecret = '5HnPixFfL24Ok2533F5dL0YhIHr8ep2JIQWz7TAakow';
const { FusionAuthClient } = require('@fusionauth/typescript-client');
const client = new FusionAuthClient(
    'Y_U8gxK1zmw0E0EUq5zvuv87JPIu-CdVdUNHKVUK0DYzVQu1e3v7HLid',
    'http://localhost:9011'
);
const pkceChallenge = require('pkce-challenge');

var app = express();
app.use(bodyParser.json());


const applicationId = 'fc617d2c-6b2a-4a18-9e77-c2d25db45143';

const data = {
    user: null,
    token: null
};

app.use(session({
    secret: 'fusionauth',
    resave: false,
    saveUninitialized: true
}));

router.get('/', function(req, res, next) {
    const stateValue = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //generate the pkce challenge/verifier dict
    pkce_pair = pkceChallenge();
    // Store the PKCE verifier in session
    req.session.verifier = pkce_pair['code_verifier']
    const challenge = pkce_pair['code_challenge']

    req.session.stateValue = stateValue
    res.render('index', { user: req.session.user, stateValue: stateValue, title: 'Stiff Money', clientId: clientId, challenge: challenge });
});

router.get('/oauth-redirect', function(req, res, next) {
    // This code stores the user in a server-side session
    const stateFromServer = req.query.state;
    if (stateFromServer !== req.session.stateValue) {
        console.log("State doesn't match.");
        console.log("Saw: " + stateFromServer + ", but expected: " + req.session.stateValue);
        res.redirect(302, '/');
        return;
    }
    client.exchangeOAuthCodeForAccessToken(req.query.code,
            clientId,
            clientSecret,
            'http://localhost:5000/oauth-redirect')
        .then((response) => {
            console.log(response.response.access_token);
            return client.retrieveUserUsingJWT(response.response.access_token);
        })
        .then((response) => {
            req.session.user = response.response.user;
        })
        .then((response) => {
            res.redirect(302, '/');
        }).catch((err) => {
            console.log("in error");
            console.error(JSON.stringify(err));
        });
    // // This code pushes the access and refresh tokens back to the browser as secure, HTTP-only cookies
    // client.exchangeOAuthCodeForAccessToken(req.query.code,
    //         clientId,
    //         clientSecret,
    //         'http://localhost:5000/oauth-redirect')
    //     .then((response) => {
    //         res.cookie('access_token', response.response.access_token, { httpOnly: true });
    //         res.cookie('refresh_token', response.response.refresh_token, { httpOnly: true });
    //         res.redirect(302, '/');
    //     }).catch((err) => {
    //         console.log("in error");
    //         console.error(JSON.stringify(err));
    //     });
});
app.get('/logout', function(req, res) {
    req.session.destroy()
    res.send("Successfully logged out");
});

app.get('/login', function(req, res) {
    if (req.session.user) {
        console.log('user: ', req.session.user);
        res.send("We already have a user");
    } else {
        const obj = {
            'loginId': req.query.user,
            'password': req.query.password,
            'applicationId': applicationId
        };
        client.login(obj)
            .then(function(clientResponse) {
                req.session.user = clientResponse.successResponse.user;
                req.session.token = clientResponse.successResponse.token;
                console.log(JSON.stringify(clientResponse.successResponse, null, 8))
                res.redirect('/profile');
            })
            .catch(function(error) {
                console.log("ERROR: ", JSON.stringify(error, null, 8))
                res.send("Login failure");
            });

    }
});

app.get('/profile', function(req, res) {
    if (!req.session.user) {
        res.send("Login required");
    } else {
        res.send("Profile");
    }
});

app.post('/register', function(req, res) {
    client.register(null, req.body)
        .then(function(clientResponse) {
            res.send(clientResponse);
        })
        .catch(function(error) {
            console.log("ERROR: ", JSON.stringify(error, null, 8))
            res.send(error);
        });

});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// app.use(function(req, res, next) {
//     next(createError(404));
// });

app.listen(5000, function() {
    console.log('FusionAuth example app listening on port 5000!');
});

module.exports = router;