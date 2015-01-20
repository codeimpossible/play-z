ig.module('game.entities.wave-spawn-location')
.requires(
  'impact.impact',
  'impact.entity'
)
.defines(function() {
  EntityWaveSpawnLocation = ig.Entity.extend({
    _wmBoxColor: 'rgba(0, 255, 0, 0.7)',

    // the size of our collider
    size: { x: 48, y: 48 },

    // the offset of collider
    offset: { x: 0, y: 0 },

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER
  });
});
