ig.module('game.entities.bat')
.requires(
  'impact.impact',
  'impact.entity',
  'game.entities.enemy',
  'game.entities.particle-spawner',
  'game.effects.bat-giblet'
)
.defines(function() {
  function yPosition() {
    return (Math.floor(Math.random() * 2) == 0) ? 3 : 7;
  }

  EntityBat = EntityEnemy.extend({
    // always draw a box around us
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',

    pointValue: 20,

    name: 'bat',

    animSheet: new ig.AnimationSheet( 'media/bat.png', 24, 24 ),

    hitParticle: EffectBatGibletSmall,

    // the size of our collider
    size: { x: 11, y: 29 },

    health: 1,
    maxHealth: 1,

    // the offset of collider
    offset: { x: 6, y: 7 },

    // movement variables
    maxVel: { x: 15, y: 100 },
    friction: { x: 2000, y: 0 },
    accel: { x: 0, y: 0 },


    speed: 10000,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      // setup animations
      // true means do not repeat
      // idle is a system animation, called by default
      this.addAnim( 'idle', 0.1, [0, 1, 2, 3, 4]);
    },

    explode: function() {
      var pos = {
        x: this.pos.x + this.size.x / 2,
        y: this.pos.y + this.size.y / 2
      };

      ig.game.spawnEntity( EntityParticleSpawner, pos.x, pos.y, {
        Particle: EffectBatGibletSmall,
        particles: 4
      });
      ig.game.spawnEntity( EntityParticleSpawner, pos.x, pos.y, {
        Particle: EffectBloodGibletSmall,
        particles: 2
      });
    }
  });
});
