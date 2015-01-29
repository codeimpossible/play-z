ig.module('game.entities.enemy')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config'
)
.defines(function(){
  EntityEnemy = ig.Entity.extend({
    _wmIgnore: true,

    zIndex: GameConfig.zIndexes.enemies,

    damage: 10,

    gravityFactor: 10,

    // collision settings, collide against player
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      if(!ig.global.wm) {
        this.health = this.maxHealth = ig._.rndRange(this.maxHealth, this.maxHealth * 1.5);
      }

      this.flip = settings.flip || false;
    },

    check: function(other) {
      other.receiveDamage(this.damage, this);
    },

    handleMovementTrace: function( res ) {
      this.parent(res);

      // check the collision map, see if we're colliding with
      // a collision tile, if so then we need to turn around
      if( res.collision.x ) {
        this.flip = !this.flip;
      }
    },

    receiveDamage: function(amt, other) {
      ig.game.spawnEntity( EntityParticleSpawner, other.pos.x, other.pos.y, {
        Particle: this.hitParticle,
        particles: ig._.rndRange(3, 7)
      });

      this.player = this.player || ig.game.getEntityByName('hero');
      var shouldTurn = (this.player.pos.x < this.pos.x && !this.flip && ig._.coinFlip()) ||
                       (this.player.pos.x > this.pos.x && this.flip && ig._.coinFlip());
      if(shouldTurn) {
        this.flip = !this.flip;
        this.speed *= 2;
        this.maxVel.x *= 2;
        this.health *= 1.3;
        amt *= 1.3;
      }

      this.parent(amt, other);
      this.lastDamageAmount = amt;
    },

    kill: function(explode) {
      if(this.explode) {
        if(ig._.coinFlip() || !this.corpse) {
            this.explode();
        } else {
          this.corpse();
          ig.game.spawnEntity( this.deathEntity, this.pos.x, this.pos.y, {
            flip: this.flip
          });
        }
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

    update: function() {
      this.currentAnim = this.anims.idle;
      if ( this.vel.x != 0 && this.anims.walk ) {
        this.currentAnim = this.anims.walk;
      }

      if(!this.stationary) {
        this.accel.x = this.speed * (this.flip ? -1 : 1);
      }
      this.currentAnim.flip.x = this.flip;
      this.parent();
    }
  });
});
