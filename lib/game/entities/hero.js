ig.module('game.entities.hero')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config',
  'game.projectiles.bullet',
  'game.weapons.pistol',
  'game.weapons.shotgun',
  'game.weapons.rifle'
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
    size: { x: 8, y: 32 },

    // the offset of collider
    offset: { x: 12, y: 0 },

    // movement variables
    maxVel: { x: 100, y: 800 },
    friction: { x: 2000, y: 0 },
    accel: { x: 0, y: 0 },

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

        this.dodgeTimer = new ig.Timer();

        this.weapons = [
          new WeaponPistol(0,0, { player: this }),
          new WeaponShotgun(0,0, { player: this }),
          new WeaponRifle(0,0, { player: this })
        ];
        this.currentWeapon = 0;

        this.weapons[0].equip();
        console.log(this.anims);
      } else {
        this.addAnim('idle', 1, [0], true);
      }
    },

    receiveDamage: function(amt, other) {
      if(!this.isDodging) { // player cannot be hurt while dodging
        this.parent(amt, other);
      }
    },

    kill: function() {
      ig.game.hud.playerDead();
      this.parent();
    },

    getCurrentWeapon: function() {
      return this.weapons[this.currentWeapon];
    },

    flipMod: function() {
      var flipped = false;
      if(this.currentAnim) flipped = this.currentAnim.flip.x;
      flipped = flipped || ig.input.state('left');

      return flipped ? -1 : 1;
    },

    update: function() {
      var left = ig.input.state('left'),
        right = ig.input.state('right'),
        shoot = ig.input.pressed('shoot'),
        dodge = ig.input.pressed('dodge'),
        nextWeapon = ig.input.pressed('switch'),
        flipMod = this.flipMod();

      if(dodge && !this.isDodging) {
        this.isDodging = true;
        this.dodgeTimer.reset();
        this.zIndex = -1;

        // entities are drawn by their zIndex value.
        // entities with higher zIndex values are
        // drawn later (e.g. on top of lower zIndexs).
        // tell impact to resort the entities since
        // we changed our zIndex (to dodge "behind")
        // the zombies.
        ig.game.sortEntitiesDeferred();
      }

      if(this.isDodging) {
        this.currentAnim = this.anims.dodge;
        this.accel.x = 3000 * flipMod;
        if(this.dodgeTimer.delta() > GameConfig.playerDodgeTime) {
          // TODO: maybe add a cooldown here to prevent spamming
          this.isDodging = false;
        }
      } else {
        // the player can't do anything else while dodging
        this.zIndex = 10;
        if(nextWeapon) {
          this.currentWeapon++;
          if(this.currentWeapon >= this.weapons.length)
            this.currentWeapon = 0;
          this.getCurrentWeapon().equip();
        }

        this.accel.x = 0;
        this.currentAnim = this.anims.idle;

        if ( this.vel.x != 0 ) {
          this.currentAnim = this.anims.walk;
        }

        if(left || right) {
          this.accel.x = 2000 * flipMod;
          this.flip = left;
        }

        this.getCurrentWeapon().update();

        if(shoot) {
          this.getCurrentWeapon().shoot();
        }
      }

      if(this.currentAnim) this.currentAnim.flip.x = this.flip;
      this.parent();
    }
  });
});
