/*
Base entity class for particle entities. Subclass your own particles from
this class. See the EntityDebrisParticle in debris.js for an example.

Particle entities will kill themselfs after #lifetime# seconds. #fadetime#
seconds before the #lifetime# ends, they will start to fade out.

The velocity of a particle is randomly determined by its initial .vel
properties. Its Animation will start at a random frame.
*/

ig.module(
  'game.effects.particle'
)
.requires(
  'impact.entity'
)
.defines(function(){
  EffectParticle = ig.Entity.extend({
    size: {x: 4, y: 4},
    offset: {x: 0, y: 0},
    maxVel: {x: 160, y: 160},
    minBounceVelocity: 0,

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.LITE,

    lifetime: 10,
    fadetime: 1,
    bounciness: 0.6,
    friction: {x: 10, y: 0},

    gravityFactor: 8,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
      this.vel.y = (Math.random() * 2 - 1) * this.vel.y;

      this.currentAnim = this.pickRandomAnimation();
      this.idleTimer = new ig.Timer();
    },

    // choose an animation at random
    pickRandomAnimation: function() {
      var count = 0;
      for (var prop in this.anims) {
        if (Math.random() < 1/++count) {
          return this.anims[prop];
        }
      }
    },

    update: function() {
      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
        return;
      }
      this.currentAnim.alpha = this.idleTimer.delta().map(
        this.lifetime - this.fadetime, this.lifetime,
        1, 0
      );
      this.parent();
    }
  });
});
