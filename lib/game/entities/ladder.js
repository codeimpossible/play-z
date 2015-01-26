ig.module('game.entities.ladder')
.requires(
  'impact.entity'
)
.defines(function(){
  EntityLadder = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/ladder.png', 10, 64),

    // the size of our collider
    size: { x: 10, y: 64 },

    // the offset of collider
    offset: { x: 0, y: 0 },

    // have our ladder check for collisions against the player
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim('idle', 5, [0], true);
    },

    receiveDamage: function() { return; }
  });
});
