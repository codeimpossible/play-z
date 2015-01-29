ig.module('game.main')
.requires(
  'impact.game',
  'impact.font',
  'game.util',
  'game.entities.hero',
	'game.directors.hud',
  'game.directors.wave-director',
  'game.levels.level1',
  'game.levels.test'
)
.defines(function() {
  MyGame = ig.Game.extend({
    gravity: 9.8,

		font: new ig.Font( 'media/04b03.font.png' ),

		moveSpeed: 5,
		screenOffset: {
			x: 30,
			y: 0
		},

    init: function() {
      // bind our keys to friendly input names
      ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
      ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
      ig.input.bind( ig.KEY.UP_ARROW, 'up' );
      ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
      ig.input.bind( ig.KEY.C, 'shoot' );
      ig.input.bind( ig.KEY.SPACE, 'dodge' );
      ig.input.bind( ig.KEY.X, 'switch' );

      this.hud = new ig.Hud();

      this.loadLevel( ig.global[ig._.q.level || GameConfig.defaultLevel] );

      // create the wave director after the level is loaded
      this.waveDirector = new ig.WaveDirector();
      this.waveDirector.nextWave();
    },

		screenPos: function() {
      var bufferY = 0;
			if(!this.player) return { x: 0, y: 0 };
      if(this.player.climbingLadder() && this.player.ladderDir === 'down') {
        bufferY = this.screenOffset.y * -3;
      }
			return {
				x: this.player.pos.x - ig.system.width/2 + (this.screenOffset.x * this.player.flipMod()),
				y: this.player.pos.y - ig.system.height/2 - (this.screenOffset.y + bufferY)
			};
		},

    update: function() {
      // Update all entities and backgroundMaps
      this.parent();

      // screen follows the player
      var player = this.player = this.getEntitiesByType( EntityHero )[0];
      if( player ) {
				var finalPos = this.screenPos();
				if(this.screen.x !== finalPos.x || this.screen.y !== finalPos.y) {
					var delta = {
						x: finalPos.x - this.screen.x,
						y: finalPos.y - this.screen.y
					};
					if(delta.x) {
						this.screen.x += delta.x * ig.system.tick * this.moveSpeed;
						if((delta.x < 0 && this.screen.x < finalPos.x) || (delta.x > 0 && this.screen.x > finalPos.x)) this.screen.x = finalPos.x;
					}
					if(delta.y) {
						this.screen.y += delta.y * ig.system.tick * this.moveSpeed;
						if((delta.y < 0 && this.screen.y < finalPos.y) || (delta.y > 0 && this.screen.y > finalPos.y)) this.screen.y = finalPos.y;
					}
				}
      }

			this.hud.update();
      this.waveDirector.update();
    },

    draw: function() {
      // Draw all entities and backgroundMaps
      this.parent();

			this.hud.draw();
      this.waveDirector.draw();
    }
  });


  // Start the Game with 60fps, a resolution of 160x120, scaled
  // up by a factor of 4
  ig.main( '#canvas', MyGame, 60, 160, 120, 4 );

  // if debug is passed on the query string, then
  // include the impact debug libs.
  if( window.location.href.indexOf('debug=true') > -1 ) {
    var debugScripts = [
      'lib/impact/debug/debug.js',
      'lib/game/directors/debug-director.js'
    ];
    for (var i = 0; i < debugScripts.length; i++) {
      var src = debugScripts[i];
      var tag = document.createElement('script');
      tag.src = src;

      document.body.appendChild( tag );
    }
  }
});
