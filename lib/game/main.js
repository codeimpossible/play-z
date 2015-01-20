ig.module('game.main')
.requires(
  'impact.game',
  'impact.font',
  'game.util',
  'game.entities.hero',
	'game.directors.hud',
  'game.levels.level1',
  'game.levels.test'
)
.defines(function(){
  MyGame = ig.Game.extend({
    gravity: 9.8,

		font: new ig.Font( 'media/04b03.font.png' ),

    init: function() {
      // bind our keys to friendly input names
      ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
      ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
      ig.input.bind( ig.KEY.C, 'shoot' );
      ig.input.bind( ig.KEY.SPACE, 'dodge' );
      ig.input.bind( ig.KEY.X, 'switch' );

      this.hud = new ig.Hud();

      this.loadLevel( ig.global[ig._.q.level || GameConfig.defaultLevel] );
    },

    update: function() {
      // Update all entities and backgroundMaps
      this.parent();

      // screen follows the player
      var player = this.getEntitiesByType( EntityHero )[0];
      if( player ) {
        this.screen.x = player.pos.x - ig.system.width/2;
        this.screen.y = player.pos.y - ig.system.height/2;
      }

			this.hud.update();
    },

    draw: function() {
      // Draw all entities and backgroundMaps
      this.parent();

			this.hud.draw();
    }
  });


  // Start the Game with 60fps, a resolution of 160x120, scaled
  // up by a factor of 4
  ig.main( '#canvas', MyGame, 60, 160, 120, 4 );

  // if debug is passed on the query string, then
  // include the impact debug libs.
  if( window.location.href.indexOf('debug=true') > -1 ) {
    var tag = document.createElement('script');
    tag.src = 'lib/impact/debug/debug.js';

    document.body.appendChild( tag );
  }
});
