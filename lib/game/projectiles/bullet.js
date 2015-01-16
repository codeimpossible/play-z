ig.module('game.projectiles.bullet')
.requires(
  'impact.entity'
)
.defines(function(){
  ProjectileBullet = ig.Entity.extend({
    lifetime: 3,
    size: { x: 4, y: 4 },
    offset: { x: 0, y: 0 },
    vel: { x: 160, y: 0 },
    maxVel: { x: 1000, y: 1000 },

    gravityFactor: 0,

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    animSheet: new ig.AnimationSheet('media/gibs.png', 4, 4),

    init: function(x, y, settings) {
      this.addAnim('idle', 5, [1], true);
      this.lifeTimer = new ig.Timer();
      this.parent(x, y, settings);
    },

    check: function(other) {
      if(!other.dead) {
        other.receiveDamage(10, this);
        this.kill();
      }
    },

    handleMovementTrace: function(res) {
      if(res.collision.x)
        this.kill();
      this.parent(res);
    },

    update: function() {
      if( this.lifeTimer.delta() > this.lifetime ) {
        this.kill();
        return;
      }
      this.parent();
    }
  });
});
