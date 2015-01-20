ig.module('game.entities.hero')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config',
  'game.projectiles.bullet'
)
.defines(function() {
  EntityHero = ig.Entity.extend({
    // always draw a box around us
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',

    // player always has this name
    name: 'hero',

    animSheet: new ig.AnimationSheet( 'media/hero.png', 32, 32 ),
    shootSound: new ig.Sound('media/shoot.*'),
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

    weapons: ['Pistol', 'Shotgun','Rifle'],
    currentWeapon: 0,

    // collision settings, collide against enemies
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      // setup animations
      // true as last argument means do not repeat
      this.addAnim( 'idleShotgun', 3, [11], true );
      this.addAnim( 'walkShotgun', 0.1, [11,12,13,14,15,16,17,18]);
      this.addAnim( 'idleRifle', 3, [19], true );
      this.addAnim( 'walkRifle', 0.1, [19,20,21,22,23,24,25,26]);
      this.addAnim( 'idlePistol', 3, [27], true );
      this.addAnim( 'walkPistol', 0.1, [27,28,29,30,31,32,33,34]);

      this.addAnim( 'dodge', 0.1, [51, 52, 53, 54, 55, 56]);

      // only do the below if were _not_
      // in the editor
      if(!ig.global.wm) {
        for (var i = 0; i < this.weapons.length; i++) {
          var weaponName = this.weapons[i];
          this['reloadTimer' + weaponName] = new ig.Timer();
        }

        this.dodgeTimer = new ig.Timer();

        this.reloadCurrentWeapon();
      }
    },

    receiveDamage: function(amt, other) {
      if(this.isDodging) { // player cannot be hurt while dodging
        return;
      }
      this.parent(amt, other);
    },

    kill: function() {
      ig.game.hud.playerDead();
      this.parent();
    },

    currentWeaponName: function() {
      return this.weapons[this.currentWeapon];
    },

    canShoot: function() {
      var name = this.currentWeaponName();
      var timer = this['reloadTimer' + name];
      return timer.delta() > GameConfig['reloadTime' + name];
    },

    reloadCurrentWeapon: function() {
      var name = this.currentWeaponName();
      var timer = this['reloadTimer' + name];
      timer.reset();

      // tell the hud that we're reloading
      ig.game.hud.reloading(name);
    },

    shootCurrentWeapon: function() {
      var name = this.currentWeaponName();
      this['shoot' + name]();
    },

    flipMod: function() {
      return (this.currentAnim.flip.x || ig.input.state('left') ? -1 : 1);
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
        }

        this.accel.x = 0;
        this.currentAnim = this.anims['idle' + this.weapons[this.currentWeapon]];

        if ( this.vel.x != 0 ) {
          this.currentAnim = this.anims['walk' + this.weapons[this.currentWeapon]];
        }

        if(left || right) {
          this.accel.x = 2000 * flipMod;
          this.flip = left;
        }

        if(shoot && this.canShoot()) {
          this.shootCurrentWeapon();
          this.reloadCurrentWeapon();
        }
      }

      this.currentAnim.flip.x = this.flip;
      this.parent();
    },

    shootShotgun: function() {
      this.shootSound.play();
      var flipMod = this.flipMod();
      var pos = {
        x: this.pos.x + 16 * flipMod,
        y: this.pos.y + 10
      };
      ig.game.spawnEntity( ProjectileBullet, pos.x, pos.y, {
        flip: this.currentAnim.flip.x,
        vel: {
          x: this.vel.x + 100 * flipMod
        }
      });
      this.vel.x += 250 * flipMod * -1;
    },

    shootRifle: function() {
      var flipMod = this.flipMod();
      var pos = {
        x: this.pos.x + 12 * flipMod,
        y: this.pos.y + 12
      };
      this.shootSound.play();
      ig.game.spawnEntity( ProjectileBulletLong, pos.x, pos.y, {
        flip: this.currentAnim.flip.x,
        vel: {
          x: this.vel.x + 200 * flipMod
        }
      });
      this.vel.x += 50 * flipMod * -1;
    },

    shootPistol: function() {
      this.shootSound.play();
      var flipMod = this.flipMod();
      var pos = {
        x: this.pos.x + 10 * flipMod,
        y: this.pos.y + 11
      };
      ig.game.spawnEntity( ProjectileBulletSmall, pos.x, pos.y, {
        flip: this.currentAnim.flip.x,
        vel: {
          x: this.vel.x + 160 * flipMod
        }
      });
      this.vel.x += 10 * flipMod * -1;
    }
  });
});
