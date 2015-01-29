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

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,

    queueTime: 1.5,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.queueTime = settings.queueTime || this.queueTime;
      this.queue = [];
      this.queueTimer = new ig.Timer(this.queueTime);

      this.enabled = settings.enabled === "false" ? false : true;
    },

    addToQueue: function(entity, settings) {
      this.queue.push({
        enemy: entity,
        settings: settings || {}
      });
    },

    update: function() {
      if(this.enabled && this.queue.length > 0) {
        if(this.queueTimer.delta() >= 0) {
          this.queueTimer.reset();
          var e = this.queue.shift();
          if(this.flip) {
            e.settings.flip = true;
          }
          ig.game.spawnEntity(e.enemy, this.pos.x, this.pos.y, e.settings);
        }
      }
    }
  });
});
