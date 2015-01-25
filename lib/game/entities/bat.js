ig.module('game.entities.bat')
.requires(
  'impact.impact',
  'impact.entity',
  'game.entities.particle-spawner',
  'game.effects.bat-giblet'
)
.defines(function() {
  function yPosition() {
    return (Math.floor(Math.random() * 2) == 0) ? 3 : 7;
  }

  EntityBat = ig.Entity.extend({
    // always draw a box around us
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',

    pointValue: 20,

    animSheet: new ig.AnimationSheet( 'media/bat.png', 24, 24 ),
    zIndex: 11,

    // the size of our collider
    size: { x: 11, y: 10 },

    health: 1,
    maxHealth: 1,

    // the offset of collider
    offset: { x: 6, y: 7 },

    // movement variables
    maxVel: { x: 10, y: 100 },
    friction: { x: 2000, y: 2000 },
    accel: { x: 0, y: 0 },
    gravityFactor: 0,

    speed: 8000,

    // collision settings, collide against player
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      // setup animations
      // true means do not repeat
      // idle is a system animation, called by default
      this.addAnim( 'idle', 0.1, [0, 1, 2, 3, 4]);

      this.flip = settings.flip || false;

      // only adjust the y pos
      // if we're _not_ in the editor
      if(!ig.global.wm) {
        var player = ig.game.getEntityByName('hero');
        this.pos.y = player.pos.y + (yPosition() ? 3 : 7);

        this.health = this.maxHealth = ig._.rndRange(1, 5);
      }
    },

    kill: function() {
      var pos = {
        x: this.pos.x + this.size.x / 2,
        y: this.pos.y + this.size.y / 2
      };

      // increase the players score
      if(this.lastDamageAmount < this.maxHealth) {
        // player shot too far away from the zombie
        // so they won't get as many points
        this.pointValue /= 2;
      }

      ig.game.spawnEntity( EntityParticleSpawner, pos.x, pos.y, {
        Particle: EffectBatGibletSmall,
        particles: 4
      });
      ig.game.spawnEntity( EntityParticleSpawner, pos.x, pos.y, {
        Particle: EffectBloodGibletSmall,
        particles: 2
      });

      ig.game.hud.addPoints(this.pointValue);
      ig.game.waveDirector.remainingEnemies--;

      this.parent();
    },

    receiveDamage: function(amt, other) {
      this.parent(amt, other);
      this.lastDamageAmount = amt;

      ig.game.spawnEntity( EntityParticleSpawner, other.pos.x, other.pos.y, {
        Particle: EffectBatGibletSmall,
        particles: ig._.rndRange(3, 7)
      });
    },

    check: function(other) {
      // when a zombie hits the player
      // the player should take damage
      other.receiveDamage(1, this);
    },

    update: function() {
      this.accel.x = this.speed * (this.flip ? -1 : 1);
      this.currentAnim.flip.x = this.flip;

      this.parent();
    },

    handleMovementTrace: function( res ) {
      this.parent(res);

      // check the collision map, see if we're colliding with
      // a collision tile, if so then we need to turn around
      if( res.collision.x ) {
        this.flip = !this.flip;
      }
    }
  });
});
