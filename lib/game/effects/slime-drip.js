ig.module(
  'game.effects.slime-drip'
)
.requires(
  'impact.entity'
)
.defines(function(){
  EffectSlimeDrip = ig.Entity.extend({
    size: {x: 16, y: 16},
    offset: {x: 0, y: 0},

    animSheet: new ig.AnimationSheet('media/slime-drips1.png', 16, 16),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,

    gravityFactor: 0,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9], true);
    }
  });
});
