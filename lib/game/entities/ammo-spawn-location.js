ig.module('game.entities.ammo-spawn-location')
.requires(
  'impact.impact',
  'impact.entity',
  'game.entities.ammo-crate',
  'game.entities.arrow'
)
.defines(function() {
  EntityAmmoSpawnLocation = ig.Entity.extend({
    _wmBoxColor: 'rgba(0, 255, 0, 0.7)',

    // the size of our collider
    size: { x: 16, y: 16 },

    // the offset of collider
    offset: { x: 0, y: 0 },

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.NEVER,

    name: 'ammo-spawner',

    spawnAmmo: function(callback) {
      ig.game.hud.waitFor(2, 'An Ammo Crate Appears!');
      var player = ig.game.getEntityByName('hero');
      var crate = ig.game.spawnEntity(EntityAmmoCrate, this.pos.x, this.pos.y);
      var arrow = ig.game.spawnEntity(EntityArrow, this.pos.x, this.pos.y, {
        target: crate,
        anchor: player,
        anchorOffset: {
          x: player.size.x/2,
          y: -(16)
        }
      });
      crate.onErase = function() {
        arrow.target = null;
        if(callback) callback();
      };
    }
  });
});
