ig.module('game.entities.zombie')
.requires(
  'impact.impact',
  'impact.entity',
  'game.entities.enemy',
  'game.entities.particle-spawner',
  'game.effects.zombie-giblet',
  'game.effects.blood-giblet',
  'game.entities.dead-zombie'
)
.defines(function() {
  EntityZombie = EntityEnemy.extend({
    // don't allow the editor to scale our object
    _wmScalable: false,

    name: 'zombie',

    // always draw a box around us
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',

    pointValue: 100,

    animSheet: new ig.AnimationSheet( 'media/zombie.png', 32, 32 ),

    // the size of our collider
    size: { x: 8, y: 32 },

    health: 9,
    maxHealth: 9,

    deathEntity: EntityDeadZombie,

    // the offset of collider
    offset: { x: 12, y: 0 },

    // movement variables
    maxVel: { x: 12, y: 100 },
    friction: { x: 2000, y: 0 },
    accel: { x: 0, y: 0 },
    gravityFactor: 10,

    speed: 8000,

    hitParticle: EffectZombieGibletSmall,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      // setup animations
      // true means do not repeat
      // idle is a system animation, called by default
      this.addAnim( 'idle', 3, [0], true);
      this.addAnim( 'walk', 0.15, [1,2,3,4,5,6,7,8]);

      this.stationary = settings.stationary;
    },

    explode: function() {
      var start = this.pos;
      for (var x = 0; x < this.size.x; x++) {
        for (var y = 0; y < this.size.y; y++) {
          var odds = ig._.rndRange(1, 100);
          if( odds > 10) {
            ig.game.spawnEntity(EffectZombieGibletSmall, start.x + x, start.y + y);
          } else {
            ig.game.spawnEntity(EffectBloodGibletSmall, start.x + x, start.y + y);
          }
        }
      }
    },

    corpse: function() {
      var pos = {
        x: this.pos.x + this.size.x / 2,
        y: this.pos.y + this.size.y / 2
      };
      ig.game.spawnEntity( EntityParticleSpawner, pos.x, pos.y, {
        Particle: EffectZombieGiblet,
        particles: 5
      });
      ig.game.spawnEntity( EntityParticleSpawner, pos.x, pos.y, {
        Particle: EffectBloodGiblet,
        particles: 3
      });
      ig.game.spawnEntity( EntityParticleSpawner, pos.x, pos.y, {
        Particle: EffectZombieGibletSmall,
        particles: 30
      });
      ig.game.spawnEntity( EntityParticleSpawner, pos.x, pos.y, {
        Particle: EffectBloodGibletSmall,
        particles: 10
      });
    }
  });
});
