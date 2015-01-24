ig.module('game.directors.wave-director')
.requires(
  'game.config',
  'game.entities.bat',
  'game.entities.zombie',
  'game.entities.big-boy',
  'game.entities.wave-spawn-location'
)
.defines(function() {
  ig.WaveDirector = ig.Class.extend({
    name: 'waves',

    waveScores: [
      [EntityBat, 2],
      [EntityZombie, 3],
      [EntityBigBoy, 5]
    ],

    wave: 0,
    wavePoints: [ 5, 8, 13, 21, 34, 55, 89, 144 ],

    init: function( x, y, settings ) {
      this.points = (settings && settings.points) || 5;

      this.spawners = ig.game.getEntitiesByType(EntityWaveSpawnLocation);
      this.hud = ig.game.getEntityByName('hud');
    },

    update: function() {
      if(this.waveInterimTimer && this.waveInterimTimer.delta() > GameConfig.waveInterimTime) {
        this.waveInterimTimer = null;
        this.spawnWave();
      }

      if(this.remainingEnemies === 0) {
        this.remainingEnemies = null;
        this.nextWave();
      }
    },

    draw: function() {

    },

    nextWave: function() {
      this.wave++;

      this.fillWave();

      this.remainingEnemies = this.waveEnemies.length;

      ig.game.hud.waveCountdown(GameConfig.waveInterimTime);
      this.waveInterimTimer = new ig.Timer();
    },

    fillWave: function() {
      var score = 0;
      var tries = 0;
      this.waveEnemies = [];
      while(score < this.wavePoints[this.wave]) {
        var rnd = this.waveScores.random();
        var test = score + rnd[1];
        if(test <= this.wavePoints[this.wave]) {
          this.waveEnemies.push(rnd[0]);
          score = test;
        } else tries++;
        if(tries === 3) break;
      }
    },

    spawnWave: function() {
      var spacing = 6;
      var minX = ig.game.collisionMap.tilesize;
      for (var i = 0; i < this.waveEnemies.length; i++) {
        var spawner = this.spawners.random();
        if(spawner) {
          spawner.addToQueue(this.waveEnemies[i]);
        }
      }
    }
  });
});
