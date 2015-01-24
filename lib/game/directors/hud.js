ig.module('game.directors.hud')
.requires(
  'game.config'
)
.defines(function() {
  ig.Hud = ig.Class.extend({
    name: 'hud',

    score: 0,

    timers: [],

    init: function( x, y, settings ) {
      this.font = ig.game.font;
    },

    update: function() {

    },

    waitFor: function(time, msg, callback) {
      this.timers.push({
        timer: new ig.Timer(time),
        msg: msg,
        done: function() {
          this.timer = null;
          if(callback) callback();
        }
      });
    },

    getNextMsgPosition: function() {

    },

    draw: function() {
      var x = ig.system.width/2, y = (ig.system.height/2 - 10);

      if(this.respawnTimer) {
        if(this.respawnTimer.delta() <= 0) {
          this.font.draw( 'YOU DIED', x, y, ig.Font.ALIGN.CENTER );
        } else {
          ig.game.loadLevel(ig.global[GameConfig.defaultLevel]);
          ig.game.waveDirector.wave = 0;
          ig.game.waveDirector.nextWave();
          this.respawnTimer = null;
        }
      } else {
        var nextMsgPos = { x: x, y: y + 10 };
        for (var i = 0; i < this.timers.length; i++) {
          var timer = this.timers[i];

          if(timer.timer) {
            if(timer.msg) {
              nextMsgPos = {
                x: nextMsgPos.x,
                y: nextMsgPos.y - 10
              };
            }
            if(timer.timer.delta() >= 0) {
              timer.done();
            } else {
              this.font.draw( timer.msg, nextMsgPos.x, nextMsgPos.y, ig.Font.ALIGN.CENTER );
            }
          }
        }

        this.font.draw( ig.game.waveDirector.remainingEnemies + ' Enemies Left', 5, 15, ig.Font.ALIGN.LEFT );

        if(this.waveTimer) {
          if(this.waveTimer.delta() <= 0) {
            this.font.draw( 'Next wave in ' + Math.abs(parseInt(this.waveTimer.delta())), x, y-20, ig.Font.ALIGN.CENTER );
          } else {
            this.waveTimer = null; // clean up
          }
        }
      }

      this.font.draw( 'Score: ' + this.score, 5, 5, ig.Font.ALIGN.LEFT );
    },

    playerDead: function() {
      this.respawnTimer = new ig.Timer(GameConfig.respawnTime);
    },

    waveCountdown: function(time) {
      this.waveTimer = new ig.Timer(time);
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
