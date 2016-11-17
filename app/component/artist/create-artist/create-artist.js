'use strict';

require('./_create-artist.scss');

module.exports = {
  template: require('./create-artist.html'),
  controller: ['$log', 'artistService', CreateArtistController],
  controllerAs: 'createArtistCtrl',
  bindings: {
    submission: '&',
  },
};

function CreateArtistController($log, artistService){
  $log.debug('init createArtistCtrl');

  this.artist = {};

  this.isVisible = false;
  this.showEditArtist = function() {
    this.isVisible = true;
  };

  this.createArtist = function(){
    artistService.createArtist(this.artist)
    .then( artist => {
      this.artist = artist;
      this.submission({
        artistData: this.artist,
      });
    });
  };

  this.fetchArtistData = function(){
    artistService.fetchArtist(this.artist._id);
  };

}