ig.module('game.entities.arrow')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config'
)
.defines(function() {
  EntityArrow = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/arrow.png', 7, 7 ),

    // the size of our collider
    size: { x: 7, y: 7 },

    // the offset of collider
    offset: { x: 0, y: 0 },

    // movement variables
    maxVel: { x: 0, y: 0 },
    friction: { x: 0, y: 0 },
    accel: { x: 0, y: 0 },

    gravityFactor: 0,

    // collision settings, collide against enemies
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,

    init: function(x, y, settings) {
      this.target = settings.target;
      this.anchor = settings.anchor;
      this.anchorOffset = settings.anchorOffset || { x: 0, y: 0 };

      this.addAnim( 'idle', 0.1, [0], true);
    },

    update: function() {
      this.pos.x = this.anchor.pos.x + this.anchorOffset.x;
      this.pos.y = this.anchor.pos.y + this.anchorOffset.y;

      if(this.target) {
        this.currentAnim.angle = this.angleTo(this.target);
      } else {
        this.kill();
      }
    },

    draw: function() {
      if(this.target && !this.target.isVisible()) {
        this.parent();
      }
    }
  });
});
