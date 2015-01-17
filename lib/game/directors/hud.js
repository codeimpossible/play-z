ig.module('game.directors.hud')
.requires(
  'game.config'
)
.defines(function() {
  ig.Hud = ig.Class.extend({
    name: 'hud',

    score: 0,

    init: function( x, y, settings ) {
      this.font = ig.game.font;
    },

    update: function() {

    },

    draw: function() {
      var x = ig.system.width/2, y = (ig.system.height/2 - 10);

      if(this.reloadTimer) {
        if(this.reloadTimer.delta() <= 0) {
          this.font.draw( 'Reloading...', x, y, ig.Font.ALIGN.CENTER );
        } else {
          this.reloadTimer = null; // clean up
        }
      }

      this.font.draw( 'Score: ' + this.score, 5, 5, ig.Font.ALIGN.LEFT );
    },

    reloading: function(weapon) {
      var time = GameConfig['reloadTime' + weapon];
      if(time > 1)
        this.reloadTimer = new ig.Timer(time);
    },

    addPoints: function(points) {
      this.score += points;
    }
  });
});
