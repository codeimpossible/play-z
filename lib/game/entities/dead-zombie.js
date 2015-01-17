ig.module('game.entities.dead-zombie')
.requires(
  'impact.impact',
  'impact.entity'
)
.defines(function() {
  EntityDeadZombie = ig.Entity.extend({
    _wmIgnore: true, // do not show this object in weltmeister

    animSheet: new ig.AnimationSheet( 'media/zombie.png', 32, 32 ),

    // the size of our collider
    size: { x: 8, y: 32 },

    // the offset of collider
    offset: { x: 12, y: 0 },

    // movement variables
    maxVel: { x: 6, y: 100 },
    friction: { x: 2000, y: 0 },
    accel: { x: 0, y: 0 },
    gravityFactor: 1,

    deathTime: 0.8,

    // collision settings, collide against player
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      // setup animations
      // true means do not repeat
      // idle is a system animation, called by default
      this.addAnim( 'idle', 0.3, [9], true);
      this.addAnim( 'dead', 0.1, [10, 11], true);
      this.flip = settings.flip || false;
      this.deathTimer = new ig.Timer();

      this.direction = ig.game.getEntityByName('hero').pos.x < x ? 1 : -1;

      this.zIndex = Math.floor(Math.random() * (20 - 0 + 1)) + 0;
    },

    update: function() {
      this.currentAnim.flip.x = this.flip;

      if(this.deathTimer.delta() <= this.deathTime) {
        this.maxVel.x = 100;
        this.vel.x = 100 * this.direction;
        this.vel.y = -3;
      }

      if(this.vel.y === 0 && this.deathTimer.delta() > this.deathTime &&
        this.currentAnim === this.anims.idle) {
        this.currentAnim = this.anims.dead.rewind();
      }

      this.parent();
    }
  });
});
