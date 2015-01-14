ig.module('game.entities.hero')
.requires(
  'impact.impact',
  'impact.entity'
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
    zIndex: 10,

    // the size of our object in the world
    size: { x: 32, y: 32 },

    // the offset of collider
    offset: { x: 0, y: 0 },

    // movement variables
    maxVel: { x: 100, y: 800 },
    friction: { x: 2000, y: 0 },
    accel: { x: 0, y: 0 },

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      // setup animations
      // true means do not repeat
      // idle is a system animation, called by default
      this.addAnim( 'idle', 3, [0], true );
      this.addAnim( 'walk', 0.1, [11,12,13,14,15,16,17,18]);
    },

    update: function() {
      var left = ig.input.state('left'),
      right = ig.input.state('right');

      this.accel.x = 0;
      this.currentAnim = this.anims.idle;

      if ( this.vel.x != 0 ) {
        this.currentAnim = this.anims.walk;
      }

      if(left || right) {
        this.accel.x = 2000 * (left ? -1 : 1);
        this.currentAnim.flip.x = left;
      }

      this.parent();
    }
  });
});
