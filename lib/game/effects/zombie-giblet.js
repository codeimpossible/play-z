ig.module('game.effects.zombie-giblet')
.requires(
  'impact.entity',
  'game.effects.particle'
)
.defines(function(){
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
    }
  });
});
