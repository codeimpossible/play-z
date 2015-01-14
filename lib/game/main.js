ig.module('game.main')
.requires(
	'impact.game',
	'impact.font',
	'game.entities.hero',
	'game.levels.level1'
)
.defines(function(){
	MyGame = ig.Game.extend({
		init: function() {
			// bind our keys to friendly input names
			ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
			ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
			ig.input.bind( ig.KEY.C, 'shoot' );

			this.loadLevel(LevelLevel1);
		},

		update: function() {
			// Update all entities and backgroundMaps
			this.parent();
		},

		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
		}
	});


	// Start the Game with 60fps, a resolution of 160x120, scaled
	// up by a factor of 4
	ig.main( '#canvas', MyGame, 60, 160, 120, 4 );
});
