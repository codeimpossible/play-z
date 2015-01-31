ig.module('game.directors.perf-mon')
.requires(
  'game.config'
)
.defines(function() {
  ig.PerfMon = ig.Class.extend({
    name: 'perf-mon',

    debugTime: 0,
    debugTickAvg: 0.016,
    debugRealTime: Date.now(),

    init: function( x, y, settings ) {

    },

    beforeRun: function() {
      // should we collect stats this frame?
      this.shouldCollect = ig._.rndRange(1, 10000) > 9998;

      var timeBeforeRun = Date.now();
      this.debugTickAvg = this.debugTickAvg * 0.8 + (timeBeforeRun - this.debugRealTime) * 0.2;
      this.debugRealTime = timeBeforeRun;
    },

    afterRun: function() {
      if(this.shouldCollect) {
        var frameTime = Date.now() - this.debugRealTime;
        var nextFrameDue = (1000/ig.system.fps) - frameTime;

        this.debugTime = this.debugTime * 0.8 + frameTime * 0.2;

        if( this.activePanel ) {
          this.activePanel.afterRun();
        }

        ig._.log( 'performance', 'ms',  this.debugTime.toFixed(2) );
        ig._.log( 'performance', 'fps',  Math.round(1000/this.debugTickAvg) );
        ig._.log( 'performance', 'draws', ig.Image.drawCount );
        if( ig.game && ig.game.entities ) {
          ig._.log( 'performance', 'entities', ig.game.entities.length );
        }
      }
    }
  });

  ig.PerfMon.setup = function() {
    ig.game.perfMon = new ig.PerfMon();
    ig.System.inject({
      run: function() {
        ig.game.perfMon.beforeRun();
        this.parent();
        ig.game.perfMon.afterRun();
      }
    });
  }
});
