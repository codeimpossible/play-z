ig.module('game.directors.wave-director')
.requires(
  'game.config',
  'game.entities.bat',
  'game.entities.zombie',
  'game.entities.big-boy'
)
.defines(function() {
  ig.WaveDirector = ig.Class.extend({
    name: 'waves',

    init: function( x, y, settings ) {

    },

    update: function() {

    },


  });
});
