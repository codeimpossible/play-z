ig.module('game.effects.zombie-giblet')
.requires(
  'impact.entity',
  'game.effects.particle',
  'game.effects.slime-drip'
)
.defines(function(){

  function lightOrDark() {
    return (Math.floor(Math.random() * 2) == 0) ? 'light' : 'dark';
  }

  EffectZombieGiblet = EffectParticle.extend({
    vel: {
      x: 80,
      y: 90
    },
    maxVel: {
      x: 1000,
      y: 1000
    },
    animSheet: new ig.AnimationSheet('media/gibs.png', 4, 4),
    init: function(x, y, settings) {
      this.addAnim('light', 5, [8], true);
      this.addAnim('dark', 5, [9], true);
      this.parent(x, y, settings);

      this.currentAnim = this.anims[lightOrDark()];

      if(!ig.global.wm) {
        this.drips = {
          x: ig._.rndRange(1, 100) < 10,
          y: ig._.rndRange(1, 100) < 10
        };
      }
    },

    handleMovementTrace: function(res) {
      var flip = {
        x: this.vel.x < 0,
        y: this.vel.y < 0
      };
      if(res.collision.y && this.drips.y) {
        ig.game.spawnEntity(EffectSlimeDripSmall, res.pos.x, res.pos.y + this.size.y, {
          flipX: flip.x,
          flipY: flip.y
        });
        this.drips.y = false;
      }
      if(res.collision.x && !res.collision.x && this.vel.y > 0 && this.vel.x > 0 && this.drips.x) {
        ig.game.spawnEntity(EffectSlimeWallDripSmall, res.pos.x + this.size.x, res.pos.y, {
          flipX: flip.x,
          flipY: flip.y
        });
        this.drips.x = false;
      }
      this.parent(res);
    }
  });

  EffectZombieGibletSmall = EffectParticle.extend({
    size: {x: 1, y: 1},
    vel: {
      x: 80,
      y: 90
    },
    maxVel: {
      x: 1000,
      y: 1000
    },
    animSheet: new ig.AnimationSheet('media/gibs.png', 1, 1),
    init: function(x, y, settings) {
      this.addAnim('light', 5, [32], true);
      this.addAnim('dark', 5, [36], true);
      this.parent(x, y, settings);

      this.currentAnim = this.anims[lightOrDark()];

      if(!ig.global.wm) {
        this.drips = {
          x: ig._.rndRange(1, 100) < 20,
          y: ig._.rndRange(1, 100) < 20
        };
      }
    },

    handleMovementTrace: function(res) {
      var flip = {
        x: this.vel.x < 0,
        y: this.vel.y < 0
      };
      if(res.collision.y && this.drips.y) {
        ig.game.spawnEntity(EffectSlimeDripSmall, res.pos.x, res.pos.y + this.size.y, {
          flipX: flip.x,
          flipY: flip.y
        });
        this.drips.y = false;
      }
      if(res.collision.x && !res.collision.y && this.drips.x) {
        ig.game.spawnEntity(EffectSlimeWallDripSmall, res.pos.x + this.size.x, res.pos.y, {
          flipX: flip.x,
          flipY: flip.x
        });
        this.drips.x = false;
      }
      this.parent(res);
    }
  });
});
