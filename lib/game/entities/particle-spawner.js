ig.module('game.entities.particle-spawner')
.requires(
  'impact.entity'
)
.defines(function() {
  EntityParticleSpawner = ig.Entity.extend({
    lifetime: 1,
    callback: null,
    particles: 20,

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      for( var i = 0; i < this.particles; i++ ) {
        ig.game.spawnEntity(settings.Particle, x, y);
      }
      this.idleTimer = new ig.Timer();
    },

    update: function() {
      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
      }
    }
  });
});
