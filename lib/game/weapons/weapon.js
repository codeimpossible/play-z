ig.module('game.weapons.weapon')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config',
  'game.projectiles.bullet',
  'game.projectiles.shell-casing'
)
.defines(function() {
  WeaponWeapon = ig.Class.extend({
    shootSound: new ig.Sound('media/shoot.*'),

    shellCasing: ProjectileShellCasing,

    init: function(x, y, settings) {
      this.player = settings.player;
      this.currentClip = this.clipSize;
      this.ammo = this.clipSize * 4;
      this.pos = {x: 0, y: 0};
    },

    equip: function() {
      this.player.anims.idle = this.anims.idle;
      this.player.anims.walk = this.anims.walk;
    },

    update: function() {
      this.pos = ig._.applyOffset(this.player, this.offset);
    },

    reload: function() {
      if(!this.isReloading) {
        this.isReloading = true;
        var weapon = this;
        ig.game.hud.waitFor(this.reloadTime, 'reloading ' + this.name, function() {
          weapon.currentClip = weapon.clipSize;
          weapon.isReloading = false;
        });
      }
    },

    canShoot: function() {
      return !this.isReloading && this.ammo > 0;
    },

    ejectShell: function() {
      var pos = ig._.applyOffset(this.player, this.casingOffset);
      ig.game.spawnEntity(this.shellCasing, pos.x, pos.y, {
        flipMod: this.player.flipMod()
      });
    },

    shoot: function() {
      if(this.canShoot()) {
        this.ejectShell();
        this.currentClip--;

        this.shootSound.play();
        ig.game.spawnEntity( this.bullet, this.pos.x, this.pos.y, {
          flip: this.player.currentAnim.flip.x,
          vel: {
            x: this.player.vel.x + this.speed * this.player.flipMod()
          }
        });
        this.player.vel.x += this.knockback * this.player.flipMod() * -1;

        if(!(this instanceof WeaponPistol)) {
          this.ammo--;
          if(this.ammo == 0) {
            ig.game.hud.waitFor(2, this.name + ' is empty!');
          }
        }

        if(this.currentClip === 0 && this.ammo > 0) {
          this.reload();
        }
      } else {
        if(!this.isReloading) ig.game.hud.waitFor(2, '*click* Damn...');
      }
    }
  });
});
