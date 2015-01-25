ig.module('game.weapons.pistol')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config',
  'game.weapons.weapon',
  'game.projectiles.bullet'
)
.defines(function() {
  WeaponPistol = WeaponWeapon.extend({
    speed: 320,
    knockback: 10,
    reloadTime: 0.9,
    clipSize: 8,
    offset: {
      x: 10,
      y: 11
    },
    casingOffset: {
      x: 12,
      y: 11
    },
    name: 'Pistol',

    shellCasing: ProjectileShellCasingSmall,

    bullet: ProjectileBulletSmall,

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.anims = {
        idle: new ig.Animation(settings.player.animSheet, 3, [27], true ),
        walk: new ig.Animation(settings.player.animSheet, 0.1, [27,28,29,30,31,32,33,34])
      };
    }
  });
});
