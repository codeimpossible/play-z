ig.module('game.entities.hero')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config',
  'game.projectiles.bullet',
  'game.weapons.pistol',
  'game.weapons.shotgun',
  'game.weapons.rifle',
  'game.entities.ladder'
)
.defines(function() {
  EntityHero = ig.Entity.extend({
    // always draw a box around us
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',

    // player always has this name
    name: 'hero',

    animSheet: new ig.AnimationSheet( 'media/hero.png', 32, 32 ),

    zIndex: 10,

    health: 10,

    // the size of our collider
    size: { x: 10, y: 32 },

    // the offset of collider
    offset: { x: 11, y: 0 },

    // movement variables
    maxVel: { x: 40, y: 100 },
    friction: { x: 2000, y: 50 },
    accel: { x: 0, y: 0 },

    gravityFactor: 20,

    zIndex: GameConfig.zIndexes.player, // draw the player on top

    // collision settings, collide against enemies
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      // only do the below if were _not_
      // in the editor
      if(!ig.global.wm) {
        // setup animations
        this.addAnim( 'dodge', 0.1, [51, 52, 53, 54, 55, 56]);
        this.addAnim( 'climb', 0.1, [59, 60, 61, 62, 63]);
        this.addAnim( 'climbIdle', 0.1, [59, 60, 61, 62, 63], true);

        this.dodgeTimer = new ig.Timer();

        this.weapons = [
          new WeaponShotgun(0,0, { player: this }),
          new WeaponRifle(0,0, { player: this }),
          new WeaponPistol(0,0, { player: this })
        ];
        this.currentWeapon = 0;

        this.weapons[0].equip();
      } else {
        this.addAnim('idle', 1, [0], true);
      }
    },

    receiveDamage: function(amt, other) {
      if(!this.isDodging) { // player cannot be hurt while dodging
        this.parent(amt, other);
      }
    },

    handleMovementTrace: function(res) {
      this.onLadder = false;
      if((this.climbingLadder() || this.standingAboveLadder()) && !this.standingAtEndOfLadder()) {
        this.standing = false;
        if(this.vel.y != 0 && Math.abs(this.vel.y) > 5) {
          this.pos.y += this.vel.y * ig.system.tick;
          this.onLadder = true;
          return;
        }
      }
      this.parent(res);
    },

    kill: function() {
      ig.game.hud.playerDead();
      this.parent();
    },

    getCurrentWeapon: function() {
      return this.weapons[this.currentWeapon];
    },

    flipMod: function() {
      return this.flip ? -1 : 1;
    },

    standingAboveLadder: function(ladder) {
      ladder = ladder || this.ladder;
      if(!ladder) return;
      if(ladder.pos.y >= (this.pos.y + this.size.y)) {
        var closeToLadder = this.distanceTo(ladder) <= (ladder.size.y/2 + this.size.y/2 + 1);
        if(closeToLadder) {
          return true;
        }
      }
    },

    climbingLadder: function(ladder) {
      ladder = ladder || this.ladder;
      if(!ladder) return;
      return !this.standing && this.touches(ladder);
    },

    standingAtEndOfLadder: function(ladder) {
      ladder = ladder || this.ladder;
      if(!ladder) return;
      return (this.pos.y + this.size.y) >= (ladder.pos.y + ladder.size.y);
    },

    update: function() {
      var left = ig.input.state('left'),
        right = ig.input.state('right'),
        shoot = ig.input.pressed('shoot'),
        dodge = ig.input.pressed('dodge'),
        up = ig.input.state('up'),
        down = ig.input.state('down'),
        nextWeapon = ig.input.pressed('switch'),
        flipMod = this.flipMod();

      if(dodge && !this.isDodging) {
        this.isDodging = true;
        this.dodgeTimer.reset();
      }

      this.canClimb = {
        down: false,
        up: false
      };

      this.ladder = ig._.nearestEntity(EntityLadder, this);
      if(this.ladder) {
        if(this.touches(this.ladder) || this.standingAboveLadder()) {
          this.canClimb.down = true;

          if(this.standingAtEndOfLadder()) {
            this.canClimb.down = false; // we're at the botton of the ladder
          }

          if(this.climbingLadder() || this.standingAtEndOfLadder()) {
            // we could go up this ladder
            this.canClimb.up = true;
          }

          if(this.pos.y < this.ladder.pos.y) {
            this.canClimb.up = false;
          }
        }
      }

      if(this.isDodging) {
        this.currentAnim = this.anims.dodge;
        this.accel.x = 3000 * flipMod;
        this.maxVel.x = 100;
        if(this.dodgeTimer.delta() > GameConfig.playerDodgeTime) {
          // TODO: maybe add a cooldown here to prevent spamming
          this.isDodging = false;
        }
      } else {
        this.maxVel.x = 40;
        // the player can't do anything else while dodging
        this.zIndex = 10;
        if(nextWeapon) {
          this.currentWeapon++;
          if(this.currentWeapon >= this.weapons.length)
            this.currentWeapon = 0;
          this.getCurrentWeapon().equip();
        }

        this.accel.x = 0;
        this.accel.y = 0;
        this.currentAnim = this.anims.idle;
        if(this.climbingLadder()) {
          this.gravityFactor = 0;
          if(up || down) {
            this.currentAnim = this.anims.climb;
          } else {
            var frame = this.currentAnim.frame;
            this.currentAnim = this.anims.climbIdle;
            this.currentAnim.gotoFrame(frame);
            this.vel.y = 0;
          }
        }

        if(this.canClimb.up || this.canClimb.down) {
          this.vel.y = up ? -70 : down ? 70 : 0;
          if(up || down) {
            this.ladderDir = up && 'up' || down && 'down';
          }
        }

        if((!this.canClimb.up || (this.canClimb.up && this.standing)) || (!this.canClimb.down || (this.canClimb.down && this.standing))) {
          this.gravityFactor = 20;

          if ( this.vel.x != 0 ) {
            this.currentAnim = this.anims.walk;
          }

          if(left || right) {
            this.accel.x = 1500 * flipMod;
            this.flip = !!left;
          }

          this.getCurrentWeapon().update();

          if(shoot) {
            this.getCurrentWeapon().shoot();
          }
        }
      }

      if(this.currentAnim) this.currentAnim.flip.x = this.flip;
      this.parent();
    }
  });
});
