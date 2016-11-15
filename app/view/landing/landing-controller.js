'use strict';

require('./_landing.scss');

module.exports = ['$log', '$location', '$window', '$rootScope', 'authService', LandingController];

function LandingController($log, $location, $window, $rootScope, authService){
  $log.debug('init landingCtrl');

  let url = $location.url();
  this.showSignup = url === '/landing#signup' || url === '/landing';

  let query = $location.search();

  if(query.token){
    authService.setToken(query.token)
    .then(() => {
      $location.path('/#/home');
    });
  }
  $rootScope.$on('locationChangeSuccess', () => {
    let query = $location.search();
    if(query.token){
      authService.setToken(query.token)
      .then(() => {
        $location.path('/#/home');
      });
    }
  });

  function pageLoadHandler() {
    authService.getToken()
    .then( token => {
      console.log('token', token);
      $location.url('/home');
    })
    .catch( () => {
      let query = $location.search();
      if (query.token) {
        console.log('Got token', query.token);
        authService.setToken(query.token)
        .then( () => {
          $location.url('/home');
        });
      }
    });
  }

  $window.onload = pageLoadHandler;

  $rootScope.$on('locationChangeSuccess', pageLoadHandler);

  let googleAuthBase = 'https://accounts.google.com/o/oauth2/v2/auth';
  let googleAuthResponseType = 'response_type=code';
  let googleAuthClientID = `client_id=${__GOOGLE_CLIENT_ID__}`;
  let googleAuthScope = 'scope=profile%20email%20openid';
  let googleAuthRedirectURI = `redirect_uri=${__API_URL__}/api/auth/oauth_callback`;
  let googleAuthAccessType = 'access_type=offline';

  this.googleAuthURL = `${googleAuthBase}?${googleAuthResponseType}&${googleAuthClientID}&${googleAuthScope}&${googleAuthRedirectURI}&${googleAuthAccessType}`;

  if(!__DEBUG__) this.googleAuthURL += '&prompt=consent';

  let facebookAuthBase = 'https://www.facebook.com/v2.8/dialog/oauth';
  let facebookClientID = `client_id=${__FACEBOOK_CLIENT_ID__}`;
  let facebookRedirectURI = `redirect_uri=${__API_URL__}/api/auth/facebook_oauth_callback`;
  let facebookResponseType = 'response_type=code';
  let facebookAuthScope = 'scope=public_profile%20email';

  this.facebookAuthURL = `${facebookAuthBase}?${facebookClientID}&${facebookRedirectURI}&${facebookResponseType}&${facebookAuthScope}`;

}
