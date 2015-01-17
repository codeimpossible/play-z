ig.module('game.directors.hud')
.requires(
  'game.config'
)
.defines(function() {
  ig.Hud = ig.Class.extend({
    name: 'hud',

    init: function( x, y, settings ) {
      this.font = ig.game.font;
    },

    update: function() {

    },

    draw: function() {
      var x = ig.system.width/2, y = (ig.system.height/2 - 10);

      if(this.reloadTimer) {
        if(this.reloadTimer.delta() <= GameConfig.reloadTime) {
          this.font.draw( 'Reloading...', x, y, ig.Font.ALIGN.CENTER );
        } else {
          this.reloadTimer = null; // clean up
        }
      }
    },

    reloading: function() {
      this.reloadTimer = new ig.Timer();
    }
  });
});
