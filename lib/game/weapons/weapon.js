ig.module('game.weapons.weapon')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config',
  'game.projectiles.bullet'
)
.defines(function() {
  WeaponWeapon = ig.Class.extend({
    shootSound: new ig.Sound('media/shoot.*'),

    init: function(x, y, settings) {
      this.player = settings.player;
      this.currentClip = this.clipSize;
      this.pos = {x: 0, y: 0};
    },

    equip: function() {
      this.player.anims.idle = this.anims.idle;
      this.player.anims.walk = this.anims.walk;
    },

    update: function() {
      this.pos.x = this.player.pos.x + this.offset.x * this.player.flipMod();
      this.pos.y = this.player.pos.y + this.offset.y;
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
      return !this.isReloading;
    },

    shoot: function() {
      if(this.canShoot()) {
        this.currentClip--;

        this.shootSound.play();
        ig.game.spawnEntity( this.bullet, this.pos.x, this.pos.y, {
          flip: this.player.currentAnim.flip.x,
          vel: {
            x: this.player.vel.x + this.speed * this.player.flipMod()
          }
        });
        this.player.vel.x += this.knockback * this.player.flipMod() * -1;

        if(this.currentClip === 0) {
          this.reload();
        }
      }
    }
  });
});
