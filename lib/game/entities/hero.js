ig.module('game.entities.hero')
.requires(
  'impact.impact',
  'impact.entity',
  'game.projectiles.bullet'
)
.defines(function() {
  EntityHero = ig.Entity.extend({
    // don't allow the editor to scale our object
    _wmScalable: false,

    // always draw a box around us
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',

    // player always has this name
    name: 'Hero',

    animSheet: new ig.AnimationSheet( 'media/hero.png', 32, 32 ),
    shootSound: new ig.Sound('media/shoot.*'),
    zIndex: 10,

    // the size of our collider
    size: { x: 8, y: 32 },

    // the offset of collider
    offset: { x: 12, y: 0 },

    // movement variables
    maxVel: { x: 100, y: 800 },
    friction: { x: 2000, y: 0 },
    accel: { x: 0, y: 0 },

    shotTime: 1,

    // collision settings, collide against enemies
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      // setup animations
      // true means do not repeat
      // idle is a system animation, called by default
      this.addAnim( 'idle', 3, [11], true );
      this.addAnim( 'walk', 0.1, [11,12,13,14,15,16,17,18]);

      this.shotTimer = new ig.Timer();
    },

    update: function() {
      var left = ig.input.state('left'),
        right = ig.input.state('right'),
        shoot = ig.input.state('shoot'),
        flipMod = (this.currentAnim.flip.x || left ? -1 : 1),
        canShoot = this.shotTimer.delta() > this.shotTime;

      this.accel.x = 0;
      this.currentAnim = this.anims.idle;

      if ( this.vel.x != 0 ) {
        this.currentAnim = this.anims.walk;
      }

      if(left || right) {
        this.accel.x = 2000 * flipMod;
        this.flip = left;
      }

      if(shoot && canShoot) {
        this.shotTimer.reset();
        this.shootSound.play();
        var pos = {
          x: this.pos.x + 16 * flipMod,
          y: this.pos.y + 10
        };
        ig.game.spawnEntity( ProjectileBullet, pos.x, pos.y, {
          flip: this.currentAnim.flip.x,
          vel: {
            x: this.vel.x + 60 * flipMod
          }
        });
      }

      this.currentAnim.flip.x = this.flip;
      this.parent();
    }
  });
});
