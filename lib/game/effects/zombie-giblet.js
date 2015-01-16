ig.module('game.effects.zombie-giblet')
.requires(
  'impact.entity',
  'game.effects.particle'
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
    }
  });
});
