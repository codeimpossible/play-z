ig.module('game.weapons.shotgun')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config',
  'game.weapons.weapon',
  'game.projectiles.bullet'
)
.defines(function() {
  WeaponShotgun = WeaponWeapon.extend({
    speed: 400,
    knockback: 400,
    reloadTime: 4,
    clipSize: 6,
    offset: {
      x: 12,
      y: 12
    },
    name: 'Shotgun',
    bullet: ProjectileBullet,

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.anims = {
        idle: new ig.Animation(settings.player.animSheet, 3, [11], true ),
        walk: new ig.Animation(settings.player.animSheet, 0.1, [11,12,13,14,15,16,17,18])
      };
    }
  });
});
