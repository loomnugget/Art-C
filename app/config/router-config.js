'use strict';

module.exports = ['$stateProvider', '$urlRouterProvider', routerConfig];

function routerConfig($stateProvider, $urlRouterProvider){
  $urlRouterProvider.when('' , '/landing');
  $urlRouterProvider.when('/' , '/landing');

  let states = [
    {
      name: 'home',
      url: '/home',
      controllerAs: 'homeCtrl',
      controller: 'HomeController',
      template: require('../view/home/home.html'),
    },

    {
      name: 'welcome',
      url: '/landing',
      controllerAs: 'landingCtrl',
      controller: 'LandingController',
      template: require('../view/landing/landing.html'),
    },
    {
      name: 'artist profile',
      url: '/artist',
      controllerAs: 'artistCtrl',
      controller: 'ArtistController',
      template: require('../view/artist/artist.html'),
    },
  ];

  states.forEach(state => {
    $stateProvider.state(state);
  });
}
