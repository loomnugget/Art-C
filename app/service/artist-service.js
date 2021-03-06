'use strict';

module.exports = ['$q', '$log', '$http', 'authService', artistService];

function artistService($q, $log, $http, authService){
  $log.debug('init artistService');
  let service = {};

  service.artists = [];

  service.createArtist = function(artist){
    $log.debug('artistService.createArtist()');


    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/artist`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.post(url, artist, config);
    })

    .then( res => {
      $log.debug('Succesfully created artist');
      let artist = res.data;
      service.artists.unshift(artist);
      return artist;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.checkArtist = function() {
    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/artist/me`;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.get(url, config);
    })
    .then( res => {
      $log.debug('found artist profile');
      return res.data;
    })
    .catch( err => {
      $log.debug('no artist profile');
      return $q.reject(err);
    });
  };

  service.deleteArtist = function(artist){
    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/artist/${artist._id}`;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.delete(url, config);
    })
    .then(() => {
      $log.debug('successful deletion');
      for(let i = 0; i < service.artists.length; i++){
        let current = service.artists[i];
        if(current._id === artist._id){
          service.artists.splice(i,1);
          break;
        }
      }
      return $q.resolve('Success!');
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchArtists = function(){
    $log.debug('artistService.fetchArtists()');
    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/artist/?sort=desc`;
      let config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.get(url, config);
    })
    .then( res => {
      $log.debug('Succesfully fetched artist profiles');
      service.artists = res.data;
      return service.artists;
    })
    .catch(err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.updateArtist = function(artist){
    $log.debug('artistService.updateArtist()');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/artist/${artist._id}`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.put(url, artist, config);
    })

    .then( res => {
      artist = res.data;

      $log.debug('Successfuly updated artist profile');
      return $q.resolve('Updated!');
    })
    .catch(err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  return service;
}
