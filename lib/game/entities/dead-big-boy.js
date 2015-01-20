ig.module('game.entities.dead-big-boy')
.requires(
  'impact.impact',
  'impact.entity',
  'game.effects.slime-drip'
)
.defines(function() {
  EntityDeadBigBoy = ig.Entity.extend({
    _wmIgnore: true, // do not show this object in weltmeister

    animSheet: new ig.AnimationSheet( 'media/big-boy.png', 48, 48 ),

    // the size of our collider
    size: { x: 20, y: 48 },

    // the offset of collider
    offset: { x: 12, y: 0 },

    deathTime: 1,

    name: 'dead-bigboy',

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,

    init: function( x, y, settings ) {
      // setup animations
      // true means do not repeat
      // idle is a system animation, called by default
      this.addAnim( 'idle', 5, [9], true);
      this.addAnim( 'dead', 0.1, [10, 11, 12], true);

      this.parent( x, y, settings );

      this.flip = settings.flip;

      this.deathTimer = new ig.Timer();

      this.accel = { x: 0, y: 0 };
    },

    update: function() {
      if(this.slimeTimer && this.slimeTimer.delta() > 0) {
        this.slimeTimer = null;
        ig.game.spawnEntity(EffectSlimeDrip, this.pos.x, this.pos.y + this.size.y);
      }

      if(this.deathTimer.delta() > this.deathTime && this.currentAnim === this.anims.idle) {
        this.currentAnim = this.anims.dead.rewind();
        if(ig._.coinFlip()) {
          this.slimeTimer = new ig.Timer(2);
        }
      }

      this.currentAnim.flip.x = this.flip;

      this.parent();
    }
  });
});
