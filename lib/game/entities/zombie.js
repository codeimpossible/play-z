ig.module('game.entities.zombie')
.requires(
  'impact.impact',
  'impact.entity',
  'game.entities.particle-spawner',
  'game.effects.zombie-giblet',
  'game.effects.blood-giblet',
  'game.entities.dead-zombie'
)
.defines(function() {
  EntityZombie = ig.Entity.extend({
    // don't allow the editor to scale our object
    _wmScalable: false,

    // always draw a box around us
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',

    pointValue: 100,

    animSheet: new ig.AnimationSheet( 'media/zombie.png', 32, 32 ),
    zIndex: 9,

    // the size of our collider
    size: { x: 8, y: 32 },

    health: 9,
    maxHealth: 9,

    deathEntity: EntityDeadZombie,

    // the offset of collider
    offset: { x: 12, y: 0 },

    // movement variables
    maxVel: { x: 6, y: 100 },
    friction: { x: 2000, y: 0 },
    accel: { x: 0, y: 0 },
    gravityFactor: 10,

    speed: 6000,

    // collision settings, collide against player
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      // setup animations
      // true means do not repeat
      // idle is a system animation, called by default
      this.addAnim( 'idle', 3, [0], true);
      this.addAnim( 'walk', 0.15, [1,2,3,4,5,6,7,8]);

      this.flip = settings.flip || false;

      this.stationary = settings.stationary;

      if(!ig.global.wm) {
        this.health = this.maxHealth = ig._.rndRange(4, 15);
      }
    },

    kill: function() {
      // when the zombie dies, spawn a bunch of "giblets"
      if(ig._.coinFlip()) {
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
      } else {
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

        ig.game.spawnEntity( this.deathEntity, this.pos.x, this.pos.y, {
          flip: this.flip
        });
      }

      // increase the players score
      if(this.lastDamageAmount < this.maxHealth) {
        // player shot too far away from the zombie
        // so they won't get as many points
        this.pointValue /= 2;
      }
      ig.game.hud.addPoints(this.pointValue);
      ig.game.waveDirector.remainingEnemies--;

      this.parent();
    },

    receiveDamage: function(amt, other) {
      this.parent(amt, other);
      this.lastDamageAmount = amt;

      ig.game.spawnEntity( EntityParticleSpawner, other.pos.x, other.pos.y, {
        Particle: EffectZombieGibletSmall,
        particles: ig._.rndRange(3, 7)
      });
    },

    check: function(other) {
      // when a zombie hits the player
      // the player should take damage
      other.receiveDamage(10, this);
    },

    update: function() {
      this.currentAnim = this.anims.idle;
      if ( this.vel.x != 0 ) {
        this.currentAnim = this.anims.walk;
      }

      if(!this.stationary) {
        this.accel.x = this.speed * (this.flip ? -1 : 1);
      }
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
