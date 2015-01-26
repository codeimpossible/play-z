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

  EffectSlimeDripSmall = ig.Entity.extend({
    size: {x: 8, y: 4},
    offset: {x: 0, y: 0},

    animSheet: new ig.AnimationSheet('media/slime-drips2.png', 8, 4),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,

    gravityFactor: 0,

    lifetime: 30,
    fadetime: 1,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      if(ig._.coinFlip()) {
        this.addAnim('idle', 0.1, [0,1,2], true);
      } else {
        this.addAnim('idle', 0.1, [0,3,4,5,6], true);
      }

      this.idleTimer = new ig.Timer();

      this.flipY = settings.flipY;
      if(this.flipY) {
        this.pos.y -= this.size.y;
        if(ig._.coinFlip()) {
          this.dripTimer = new ig.Timer(ig._.rndRange(1, 4));
        }
      }
    },

    update: function() {
      this.parent();
      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
        return;
      }
      this.currentAnim.alpha = this.idleTimer.delta().map(
        this.lifetime - this.fadetime, this.lifetime,
        1, 0
      );

      this.currentAnim.flip.y = this.flipY;
      this.currentAnim.flip.x = this.flipX;

      if(this.dripTimer && this.dripTimer.delta() >= 0) {
        ig.game.spawnEntity(EffectZombieGibletSmall, this.pos.x, this.pos.y + this.size.y + 1, {
          vel: {
            x: 0,
            y: 0
          }
        });
        this.dripTimer.reset();
      }
    }
  });

  EffectSlimeWallDripSmall = ig.Entity.extend({
    size: {x: 4, y: 8},
    offset: {x: 0, y: 0},

    animSheet: new ig.AnimationSheet('media/slime-drips3.png', 4, 8),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,

    gravityFactor: 0,

    lifetime: 30,
    fadetime: 1,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      if(ig._.coinFlip()) {
        this.addAnim('idle', 0.1, [0,1,2], true);
      } else {
        this.addAnim('idle', 0.1, [0,3,4,5], true);
      }

      this.idleTimer = new ig.Timer();

      this.flipX = settings.flipX;
      if(this.flipX) {
        this.pos.x -= this.size.x;
      }
    },

    update: function() {
      this.parent();
      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
        return;
      }
      this.currentAnim.alpha = this.idleTimer.delta().map(
        this.lifetime - this.fadetime, this.lifetime,
        1, 0
      );

      this.currentAnim.flip.y = this.flipY;
      this.currentAnim.flip.x = this.flipX;
    }
  });
});
