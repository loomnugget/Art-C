'use strict';

const request = require('superagent');
const debug = require('debug')('art-c:google-oauth-middleware');

module.exports = function(req, res, next){
  debug('getting google user info');
  if (req.query.error){
    req.googleError = new Error(req.query.error);
    return next();
  }

  let data = {
    code: req.query.code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${process.env.API_URL}/api/auth/oauth_callback`,
    grant_type: 'authorization_code',
  };

  let accessToken, refreshToken, tokenTTL;
  return request.post('https://www.googleapis.com/oauth2/v4/token')
  .type('form')
  .send(data)
  .then( response => {
    accessToken = response.body.access_token;
    refreshToken = response.body.refresh_token;
    tokenTTL = response.body.expires_in; 


    return request.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
    .set('Authorization', `Bearer ${accessToken}`);
  })
  .then( response => {
    req.googleOAUTH = {
      googleID: response.body.sub,
      email: response.body.email,
      accessToken,
      refreshToken,
      tokenTTL,
    };
    next();
  })
  .catch((err) => {
    req.googleError = err;
    next();
  });
};
