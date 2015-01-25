ig.module('game.projectiles.bullet')
.requires(
  'impact.entity'
)
.defines(function(){
  ProjectileBullet = ig.Entity.extend({
    lifetime: 0.6,
    size: { x: 4, y: 4 },
    offset: { x: 0, y: 0 },
    vel: { x: 160, y: 0 },
    maxVel: { x: 1000, y: 1000 },

    gravityFactor: 0,

    maxDamage: 10,

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    animSheet: new ig.AnimationSheet('media/gibs.png', 4, 4),

    init: function(x, y, settings) {
      this.addAnim('idle', 0.05, [10, 1], true);
      this.lifeTimer = new ig.Timer();
      this.parent(x, y, settings);
    },

    check: function(other) {
      other.receiveDamage(this.damage, this);
      this.kill();
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
      this.damage = this.maxDamage - (this.lifeTimer.delta() * this.maxDamage);
      this.parent();
    }
  });

  ProjectileBulletSmall = ProjectileBullet.extend({
    size: { x: 2, y: 2 },
    maxDamage: 3,
    animSheet: new ig.AnimationSheet('media/gibs.png', 2, 2),
    init: function(x, y, settings) {
      this.addAnim('idle', 0.05, [20, 2], true);
      this.parent(x, y, settings);
    }
  });

  ProjectileBulletLong = ProjectileBullet.extend({
    size: { x: 4, y: 2 },
    maxDamage: 12,
    animSheet: new ig.AnimationSheet('media/gibs.png', 4, 2),
    init: function(x, y, settings) {
      this.addAnim('idle', 0.05, [10, 1], true);
      this.parent(x, y, settings);
    }
  });
});
