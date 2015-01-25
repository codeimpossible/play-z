ig.module('game.projectiles.shell-casing')
.requires(
  'impact.entity'
)
.defines(function(){
  ProjectileShellCasing = ig.Entity.extend({
    lifetime: 10,
    size: { x: 3, y: 2 },
    offset: { x: 0, y: 0 },
    vel: { x: -10, y: -10 },
    maxVel: { x: 10, y: 1000 },

    friction: {x: 10, y: 0},

    gravityFactor: 8,

    bounciness: 0.6,

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,

    animSheet: new ig.AnimationSheet('media/gibs.png', 3, 2),

    init: function(x, y, settings) {
      this.addAnim('idle', 0.05, [2], true);
      this.lifeTimer = new ig.Timer();
      this.parent(x, y, settings);

      if(!ig.global.wm) {
        this.bounciness = ig._.rndRange(1, 6) / 10;
        this.vel.x = ig._.rndRange(8, 20) * -1;
      }

      if(settings.flipMod) {
        this.vel.x *= settings.flipMod;
      }
    },

    update: function() {
      if( this.lifeTimer.delta() > this.lifetime ) {
        this.kill();
        return;
      }
      this.parent();
    }
  });

  ProjectileShellCasingSmall = ProjectileShellCasing.extend({
    size: { x: 2, y: 1 },
    animSheet: new ig.AnimationSheet('media/gibs.png', 2, 1),
    init: function(x, y, settings) {
      this.addAnim('idle', 0.05, [4], true);
      this.parent(x, y, settings);
    }
  });
});
