ig.module(
  'game.directors.debug-director'
)
.requires(
  'impact.impact',
  'game.entities.wave-spawn-location',
  'game.entities.ammo-spawn-location',
  'game.entities.ammo-crate',
  'game.entities.particle-spawner',
  'game.effects.zombie-giblet'
)
.defines(function(){
  var __boundDebugInputs = false;
  ig.Game.inject({
    update: function() {
      this.parent();

      if(!__boundDebugInputs) {
        __boundDebugInputs = true;
        ig.input.bind( ig.KEY.P, 'particles' );
        ig.input.bind( ig.KEY.O, 'ammo');
        ig.input.bind( ig.KEY.I, 'wavespawners');
      }

      if(ig.input.pressed('particles')) {
        ig.game.spawnEntity(EntityParticleSpawner, ig.game.player.pos.x, ig.game.player.pos.y, {
          Particle: EffectZombieGibletSmall,
          particles: 1
        });
      }

      if(ig.input.pressed('ammo')) {
        var spawner = ig.game.getEntitiesByType(EntityAmmoSpawnLocation).random();
        spawner.spawnAmmo();
      }

      if(ig.input.pressed('wavespawners')) {
        var waves = ig.game.getEntitiesByType(EntityWaveSpawnLocation);
        for (var i = 0; i < waves.length; i++) {
          waves[i].enabled = !waves[i].enabled; // enable or disable
        }
      }
    }
  });
});
