ig.module('game.directors.logger')
.requires(
  'impact.impact',
  'game.directors.wave-director',
  'game.entities.ammo-spawn-location',
  'game.entities.ammo-crate',
  'game.entities.hero'
)
.defines(function() {

  ig.WaveDirector.inject({
    reset: function() {
      this.lastWaveSpawnTime = null;
      this.parent();
    },

    nextWave: function() {
      if(this.lastWaveSpawnTime) {
        var time = (new Date()).getTime();

        // log how long that wave lasted
        ig._.log('wave', 'duration', ((new Date()).getTime() - time)/1000);
      } else {
        this.lastWaveSpawnTime = (new Date()).getTime();
      }

      this.parent();

      ig._.log('wave', 'filled', this.waveEnemies.length);
      ig._.log('wave', 'started', this.wave);
    }
  });

  EntityAmmoSpawnLocation.inject({
    spawnAmmo: function() {
      ig._.log('ammo', 'spawned');
      this.parent();
    }
  });

  EntityAmmoCrate.inject({
    check: function(other) {
      ig._.log('ammo', 'pickup');
      this.parent(other);
    }
  });

  EntityHero.inject({
    receiveDamage: function(amt, other) {
      this.parent(amt, other);
      this.attacker = other.name;
    },
    kill: function() {
      ig._.log('player', 'killed', this.attacker);
      this.parent();
    }
  });
});
