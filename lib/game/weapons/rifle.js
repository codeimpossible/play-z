ig.module('game.weapons.rifle')
.requires(
  'impact.impact',
  'impact.entity',
  'game.config',
  'game.weapons.weapon',
  'game.projectiles.bullet'
)
.defines(function() {
  WeaponRifle = WeaponWeapon.extend({
    speed: 600,
    knockback: 50,
    reloadTime: 2.5,
    clipSize: 3,
    offset: {
      x: 12,
      y: 12
    },
    name: 'Rifle',
    bullet: ProjectileBulletLong,

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.anims = {
        idle: new ig.Animation(settings.player.animSheet, 3, [19], true ),
        walk: new ig.Animation(settings.player.animSheet, 0.1, [19,20,21,22,23,24,25,26])
      };
    }
  });
});
