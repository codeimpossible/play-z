ig.module('game.entities.ammo-crate')
.requires(
  'impact.entity',
  'game.config',
  'game.weapons.shotgun',
  'game.weapons.rifle'
)
.defines(function(){
  EntityAmmoCrate = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/ammo-crate.png', 16, 16),

    // the size of our collider
    size: { x: 16, y: 16 },

    // the offset of collider
    offset: { x: 0, y: 0 },

    // have our ladder check for collisions against the player
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.LITE,

    friction: { x: 2000, y: 0 },
    maxVel: { x: 0, y: 100 },

    gravityFactor: 20,

    lifeTime: 60,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim('idle', 5, [0], true);

      this.ammoCount = [1,2,2,2,2,2,3,3,3,3,4,4,5,5,6,7,8,9].random();
      this.weapon = [WeaponShotgun, WeaponRifle].random();

      this.lifeTimer = new ig.Timer(this.lifeTime);
    },

    message: function() {
      return 'Got ' + this.ammoCount + ' bullets for ' + this.weapon.prototype.name + '!';
    },

    erase: function() {
      if(this.onErase) this.onErase();
    },

    check: function(other) {
      // give the player some ammo!
      ig.game.hud.waitFor(2, this.message());
      for (var i = 0; i < ig.game.player.weapons.length; i++) {
        var weapon = ig.game.player.weapons[i];
        if(weapon instanceof this.weapon) {
          weapon.ammo += this.ammoCount;
          if(weapon.ammo === this.ammoCount) {
            weapon.reload();
          }
          break;
        }
      }
      this.kill();
    },

    update: function() {
      this.parent();
      if(this.lifeTimer.delta() === 0) {
        this.kill();
      }
    }
  });
});
